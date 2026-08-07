# **AI Orchestration Flow Specification**

## **Overview**

This document specifies the exact sequence, data contracts, and fault-handling strategies for the **LangChain \+ Google Gemini AI Pipeline**. This flow is executed inside the Python FastAPI microservice ![][image1] prior to an exam launch to dynamically compile, audit, and verify exam papers in RAM before encryption and delivery.

## **High-Level Orchestration Sequence Diagram**

\[ Node.js Gateway \]  
        │  
        │ 1\. POST /api/v1/generate-paper (exam\_id, subject\_rules)  
        ▼  
┌────────────────────────────────────────────────────────────────────────┐  
│                        FASTAPI MICROSERVICE                            │  
│                                                                        │  
│  \[ Step 1: Database Extraction \]                                       │  
│    └─ Query MongoDB for 1.5x \- 2.0x buffer of APPROVED questions      │  
│                                                                        │  
│  \[ Step 2: In-Memory Decryption \]                                      │  
│    └─ Decrypt AES-256-GCM payloads strictly in volatile RAM           │  
│                                                                        │  
│  \[ Step 3: Deterministic Pre-Filtering \]                              │  
│    └─ Remove exact ID duplicates & partition by topic/difficulty       │  
│                                                                        │  
│  \[ Step 4: LangChain \+ Gemini Audit Chain \]                           │  
│    ├─ Semantic Duplicate Detection (LLM)                              │  
│    ├─ Ambiguity & Option Validity Check                               │  
│    └─ Cognitive Balance & Subject Ratio Enforcement                    │  
│                                                                        │  
│  \[ Step 5: Pydantic Validation & Fallback Loop \]                      │  
│    ├─ Pass ──► Proceed to Step 6                                      │  
│    └─ Fail ──► Automated Retry (Max 2\) / Deterministic Backfill       │  
│                                                                        │  
│  \[ Step 6: Encryption & Redis Caching \]                               │  
│    ├─ Re-encrypt final Master Paper (AES-256-GCM)                     │  
│    └─ Cache in Redis key \`exam:{exam\_id}:master\` with TTL             │  
│                                                                        │  
│  \[ Step 7: RAM Memory Flush & GC \]                                    │  
│    └─ Explicitly purge plaintexts from volatile RAM                   │  
└──────────────────────────────────┬─────────────────────────────────────┘  
                                   │  
                                   │ 2\. Return HTTP 200 (Success \+ Audit Report)  
                                   ▼  
                           \[ Node.js Gateway \]

## **Detailed Step-by-Step Flow Execution**

### **Step 1: Trigger & Parameter Ingestion**

* **Trigger:** Express API Gateway sends a secure internal HTTP request to FastAPI.  
* **Payload Request Contract:**  
  {  
    "exam\_id": "EXAM\_2026\_NEET\_01",  
    "required\_counts": {  
      "Physics": 45,  
      "Chemistry": 45,  
      "Biology": 90  
    },  
    "target\_difficulty\_distribution": {  
      "Easy": 0.30,  
      "Medium": 0.50,  
      "Hard": 0.20  
    }  
  }

### **Step 2: MongoDB Extraction & Buffer Query**

* FastAPI queries MongoDB for APPROVED questions matching the subject criteria.  
* **Over-fetching Strategy:** To allow the AI agent flexibility to discard poor or duplicate questions, FastAPI pulls a ![][image2] **to ![][image3] buffer** of questions per subject.

### **Step 3: In-Memory RAM Decryption**

* Iterates through the encrypted MongoDB documents.  
* Invokes crypto\_utils.decrypt\_payload() using the MASTER\_ENCRYPTION\_KEY.  
* Reconstructs temporary in-memory JSON objects containing plaintext question\_text, options, correct\_option\_index, and media\_url.

### **Step 4: Deterministic Pre-Filtering**

* Before invoking the LLM (saving API tokens and latency), a fast Python script performs:  
  1. ID deduplication.  
  2. Formatting sanitization (stripping illegal HTML or trailing whitespace).  
  3. Categorization into sub-pools based on subject and difficulty metadata.

### **Step 5: LangChain \+ Gemini Auditor Agent Pipeline**

* **LLM Model:** gemini-2.5-flash (via ChatGoogleGenerativeAI).  
* **Output Enforcement:** Structured output via .with\_structured\_output(ExamAuditReport) powered by Pydantic.  
* **Auditor Directives:**  
  1. **Semantic Duplication Removal:** Identifies questions that test the exact same concept or use identical phrasing with slightly modified numbers.  
  2. **Ambiguity Check:** Ensures only one option is unambiguously correct and options are logically distinct.  
  3. **Cognitive Balancing:** Adjusts selection so the overall paper matches target difficulty ratios (![][image4] Easy, ![][image5] Medium, ![][image6] Hard).  
  4. **Strict Count Compliance:** Selects exactly the required number of questions per subject (![][image7]).

### **Step 6: Pydantic Schema Validation & Retry Mechanism**

* **Validation Layer:** The returned object is validated against the ExamAuditReport Pydantic model.  
* **Self-Correction / Fallback Logic:**  
  * **Condition A (Valid Count & High Balance Score ![][image8]):** Process directly to output.  
  * **Condition B (Count Mismatch or Low Balance Score):** Trigger a second fast retry prompt supplying the remaining candidate pool and explicit feedback on what was missing.  
  * **Condition C (Emergency Failure):** Fall back to a deterministic algorithm (Fisher-Yates random selection from the pre-approved pool) to guarantee exam generation without halting system launch.

### **Step 7: Re-Encryption & Redis Caching**

1. The finalized array of questions is serialized into a single JSON string.  
2. Encrypted via crypto\_utils.encrypt\_payload() into AES-256-GCM ciphertext.  
3. Written to Redis under key exam:{exam\_id}:master with a TTL set to:  
   ![][image9]

### **Step 8: Memory Purge & Garbage Collection**

* Plaintext question structures are explicitly deleted using del decrypted\_pool.  
* Python gc.collect() is invoked to wipe sensitive references from process memory instantly.  
* Response containing status, balance\_score, and flagged\_issues is returned to Node.js.

## **Data Structures & State Management**

from pydantic import BaseModel, Field  
from typing import List, Dict

class QuestionItem(BaseModel):  
    id: str  
    subject: str  
    topic: str  
    difficulty: str  
    question\_text: str  
    options: List\[str\]  
    correct\_option\_index: int  
    media\_url: str \= ""

class ExamAuditReport(BaseModel):  
    is\_approved: bool \= Field(description="True if questions are unique and balanced")  
    balance\_score: float \= Field(description="Quality rating score from 0.0 to 1.0")  
    flagged\_issues: List\[str\] \= Field(description="Audit log of rejected duplicate/flawed questions")  
    final\_questions: List\[QuestionItem\] \= Field(description="Final ordered verified exam question set")

## **Error Handling & Resiliency Rules**

| Failure Mode | Detection Point | Automatic Recovery Action |
| :---- | :---- | :---- |
| **Decryption Error** | crypto\_utils.decrypt\_payload() | Log corrupt question ID, skip document, notify admin audit log. |
| **Gemini API Timeout** | LangChain Invocation | Retries with exponential backoff (![][image10]). |
| **Schema Misalignment** | Pydantic Validation | Trigger 1 auto-retry with error feedback prompt; if failed again, revert to deterministic fallback selection. |
| **Redis Write Failure** | Redis Connection | Fall back to writing encrypted payload directly to temporary high-priority MongoDB collection. |

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGEAAAAZCAYAAAAhd0APAAAEHElEQVR4Xu1YTWgTQRROqEJFRVBraJpk0kYp9QcLOXjypqKgIl4UqT83oXhRqIoXr6J4EUHoSYXiL1QPapUeqr2IJxHFIgqttEgVFQ8VWmnj92Xfi+OwTTaSxlD2g8fufPPmzb73ZmbfbiQSIkSIEDWLaCKRWI1rndvR1NS0IhaLLXboumQyGXe4SqIulUplm5ubN7od8xJwdm06nb5vjBmGNPr0nwI/DekW6YdMgb/i6lYKsL8DkuO8bt9cAP7Xu1xVgJW/AU6+hvwUh0eKJIH9tlzA+EWubqWAObdgjhlTpSRgvl0uVxVks9mF2O4xbns4O1EiCQ8h3VgxRzOZTNLVmQNEeRRV6ziiXy5XVQRJAsXl5wu4GOF3r8tXFUGTgL7z3A247/B5URcAnTbIVyNHF1bZaVyHMO4jrlOQ9+DaIc9wPwr5Jnwnx/No0LGUcmxSl6vaZ3yj8fwrcDyOofvO1hUZaGhoWCI6y9G+DfkO3Wu4DmLOneiKsh9FS0L8OAH+Kq6fIB+MTxyLIkgSaFyPB7SfykRtri5hHXNnjRewV+TYh4pqM7hJOi/VGB1dBN0+Oso2+uqhl6HDHB/UJuQB2wygOx6owzG6Ssc7Ng+RM16iGlkNRiTIaPfzWaFndAy4CcYMzQW4vwHpkTn47JvQfkk7ygVCwCR0axtBW4P2Z0z4wtZzYa3ot8qJo5xnxtZF+xJ1bU5W3l9cCZsjtm6x8aU4BXn673C/+LxMNq4DxjrKWltbl6Ldw2eyx5REqSS4sCb3fXCFOsdgKEf7Ms+oo5uvwGyuWBBnsVnRJIifTAJ3Sn6XiIxBBuLx+Epce0XnJGSd7s6yUW4SIt42vOv34DbKCVgtJkHsskxmoPUbSaUL9ush7SnvvZQT+QFuX0SOs8AolgQNDuSLchXaCTWZBPqG9j3GhEEmD9lr6ytYnEDnHN81QkWZAON92J6xdUuiWBJgdD+4Yeh0KCfb8A1k0tZ1UU7AqpUEtI/5cPmvc97bSZC+HORyxFrZeOmvp23GAdcnkO3aJ+8EVlDllfQ0YryXDV+2LPMKEzLLNIrqYJtQzPYRPlyq+G8L6jGBDNgtJaVq4Zk6ppxUHBclEPl/V+Q4zglYYJtEWkpVbbPCMd7iydn/vdBmx2hLS8syVku4v8MASx+Pnum0dcQwARi/2zoRBtWWFC0jiM1W5YrC/FlBOVe0TiaYGHBDxnsgTsrtNutvC2tnFexxZfDhbU5sHXC4Cegdd/WkDA1kU5+dQYXOTSZMEvoI1z1qx1qtUbQ7jfcL57mxjh/6iHaX8X7tjGNMH+Qgx8iueQz+ujXHOG2xX21UDLIyD/M44Gpx+2sZCEqh9tdvg4jP32Lq2YvPho5zfI/qR6v2/XN1FCJEiBAhQoQIESLE/8dvQvEE+dGEBUcAAAAASUVORK5CYII=>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAZCAYAAAC2JufVAAACEUlEQVR4Xu2UvWsUURTFd1ELURCiw+J+zX6hWASRBYvgR5MmRaoUaYIoAQtFBBv/AP8BC7FIl1oQQdEuECOIFtpoUlkYSAJKsFLCht31d9x57t0Hs7KTrWQOHN7MuXfunLn3vclkUvxPKBaLRxuNRuDrcSgUCidzudwxq6kGnLBaYoRhOFWpVN7DZT8Wh3K5fJ/n2qzvWJeitUWNG37uSOCrJim0Dn/BbgJTXcMW2jVCWT93JDSbzSPVajVHsdmEpl7Cx3BR4/RzDoSkpkRfHxsOYopOn1W3VEOdN/FncNORnLesdzztia05gKSmeGYHPuW6yfoRvqrVaicU1zhLpVIdbUW14W14Dn7ToSJ2eejIk5gi/x5cct2hxiXu96nxMGM2O4epgb6N/lpG1EFnfCiSmPLB86fhV7irjtgYdefROvANvGBjsRiHqXw+f4oan1UHztiYuqmu8p67Vh+KUU25fPidUZyRFvY71SE+bfM5DBfR12Bb5uyBiMU/TGWj9q85QS/lfgv9uuLSwt4m1ug29O9zudrMaCvaT9pveg/PL7h4LEi6qWT43N+EdixOC4LgOPcv4FwkZbl+EPY68UeLfsznqb2K9kHm6vV6iesv8AcGr5J2yNX8i7DfchkaoEk7zP0juGc015lPYc+cRrMHb2X6nRuoq2loElaDP23NsSDqxhW9cOg/J0WKFClGx2+wwrwuKZaDEgAAAABJRU5ErkJggg==>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAZCAYAAAC2JufVAAACWElEQVR4Xu2UPWhUQRSFd9kEFAWVuCzZv/d2VwVBELNgmogQbCy0UbARsdSIWgiKVraChYgQEBsrizRpRAsJ5odELewkELBQ1ELQgBgQQozfgZlwd3jr7qqVvAOHeffMmTt378xOJpPif0G5XN4dRdFQHMfbw7lOYM2mSqWyT2M498egmKPwA/wO1+E8G8ShLwFZvGPwC5zQWK1Wz0gPjT2BJCPwpQtz1HJdhTEutRgTgO8EXKZLh1w86uLjobcX9JHkEXziBY5xM0U+VWHWGKJer2/D8wI+9seWz+e3Ej+XrvlwTVcwSVoKIL4hrVAobLG6hTqMZ5WCHlpdMfoK802r94ocCXZYgaR3XaF9VrfwhbP2mtUVex1Owvee6AuMFwNtwq5PRK1WK2BchGvhnIXrSNui4INSqTTA/WrwPeW0C3Av/Mz6V7qL8tj1ifBJWXQrnLPoVJQ9Vu7pLrRPaDMqRB3s+s7RpYMs/sqi8Waz2R/OW/RSlEB8Cv0nnIMH7FxbUBDeaJHFNzsVJERd3CmrKyf6ffTLVm8LLcB8NWMePYrcH//mhcZ/RL88oSPq4CrzI1Z3pzAL11Rcpx+eVUGcdRHzoCfJz1uPa/+sF8wfYuOd0hNC/Ay+KRaLO71XlxltSvcJ7x3XydN+PoQ2O+uqXw/pTdpAG1lNIL4Cv5FjWLFGF59TrG6o4xQwjf5axTUajQrfb+EyvsPYcjZny+OZRGPVy38P/jCaP/Zx9I+MlzTC2/5o+H5n8+E55o53Q4MrNue/Qpa/9x42PKkuhJMpUqRI8Rf4BSJO0imSyeu0AAAAAElFTkSuQmCC>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAZCAYAAABdEVzWAAAC9klEQVR4Xu2WO2hUQRSGb8gKik+QuC77uPvS4KORRQRBBdHCIoIPiBALwSIWYhFRsdAmWFgYQRBFtBARURADmhhEgliJdSSNgooxWMRgkWBs9PtzZ3bHcdfdxcZif/iZOWfOmfnvPM5uELTwf6AtmUyuzGazK/wBB+2dnZ1LfWdVFAqFVWEYJupMGHR0dCxJpVJrSqXSAm+ojfz+TCYzwvgiEXsIe73GbFCxWFyGfwzxKSe3OhCzg+BR2vu0s7Sv8/n8WjdGQvBfZHwKPoGTcKcdR0gS+z1Czlgf/UGJgxP0P9J+gm+Zp9vG1AQJG/QF1k6n09uw5+C4E9ZG3GlNjICibCY/gv0VbjJ5m81H9dok7Fs0MWsb34Equ/0nCOyDP3O5XNzYCfhBPicmJ1HwivXZHYL3MGMI71KOWifvjo7e2jo+hD+z9l9B4CFNqIVk1xDWYxYtH5MWxPdC4pTLWIn+jBsT/r5jMeyrrHfMjjcDHdFZiYCXrI/+XSOsvBsCsbddP/2TcJzdD0VdE/n1SvEPh+bYmwJJR+EjOAtP2Xvg7ExNYbBPtnKMuC9wwoTNv1Z9sPqV7AbBogfhCSZ5Bx/Y59yIMPf4fBCzhZjHvPLlsuPx+GLsafwvYdYLrw0FS5yet+x/ESYxjA3qpRuXHsk1U+O2wofu46iH8p0Koovb8B3zEUbHOhCYI0TgRuwpM6wSdBnuqmQYqERod4yIMrAvyAcTshHQawRUe5WT+POV7AjaFYTsdX3KJ37Gsbuq7rYWDr3SEDg7hKCFcpgvnQ6dOuZ81JCNc8GCh/1CGkY1s76wIKotN+GodaiyY3+Gc26c7oaE2AtL0439Hf9uJ24eisE/4vt1bOT8sDb9fn9Xy2CO1QQ8hwPwXBjt4De4x43TRcb3FI6xwPkw+s08HnglwJSMGxLu+gUzx6sgqpd6ZMP8eUj7cS4UqF+AHo5ou38EDtozUYXfp6LpDwraQXi91hzkrstEP+5v4H5/vIUWWmihCfwCpNTpsCOhZ4kAAAAASUVORK5CYII=>

[image5]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAZCAYAAABdEVzWAAAC80lEQVR4Xu2VO2hUQRiFb0gExSdoWM0+7u5mZfHRyCKCYCNaRvABAWMhWMTCKoJBUJtUWigERAmkEBERVAJqDJJCLERJGxFEQcUYRGKwiIhN/E7uTPJnNi+1sdgDh5n/MfOfO68bRTX8H6hLp9Pr8/n8ujBgUF8ul1eHzlmoVCrLCoVCKvQ3NTVtCH1CY2Pjqkwms1njglBdHMdduVxugPgKEfsR9lbFfFKpVFqDfxjxGTO2GiRtgh/4wju0Pa79AodsnoQQu4h/DD6Eo3CvjyMkjf0eIZ3eR79P4uAI/Y+0n+Bb5mn1OfPCC4OThoMM3mjS6pj4jCZGQEk28ePY3+AOJWSz2Z30f+Bv94Owe2kavO18h+dY7Wo4YUOwB15i4l2464OcgkTBbu/zKwRvYzYgvIX+pFoz7qa23tvaPuZ/4u0F4YQ9Df0WxNtc0eltUkGNkziJJFahP2Fz4tkr1oB9FWEnfXxBeGHwaJys2vnm5uasSdGhvuWETa+GQJEb1k//NHzNZYpF/Nvk1y3F3x+7bV8SJIwCb2hPaDL6Z+l/h4cUNyszrzDYIVtnx4nT5RlxaVO3VfOqPzN6EeipoOBL49KS34VfZSxFmN2+EDqz5DwoFotrZadSqZXY4/ifwXyQvjBUSAXV/xdhEkOsjxu7x7l0Sa65N243vGcvx6KgYLsK6uuiPzhjIeJkWy9HbgsRuB17zIX1BF2B+2ZGONjVsH6/YhReLtsLtStjxo7iL86MTqBVQcgB63PzThi7Zc7VVuE4eZnvWz92txXrvnRcfu/T2cR+p/H+AywoeCx8SMntWJIwQV+lyb2tlx37Mxw0aVNnQ0L8gaVpxf6Jf7/Jm4Jy8A+Efm0bY355m35XuKrTcFf8HOx1Z0ZPxfPwJ6uDjP8xHKbAhTj5Z56KgifAzad/btX/0M3xIkp+aXn6/cGbWQ2KHSGxjbYSBb8kg3rFyTuoRzMMClpBeD3cRg/GbsklP/dXsXsra6ihhhr+Er8BXVPm15eqGwsAAAAASUVORK5CYII=>

[image6]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAZCAYAAABdEVzWAAAC10lEQVR4Xu2VO2iTURiG/5AIinckBM3lz02CFxANKoguooNDBXXooINbFZwqVHQQoZOLgiAVwUFEnISC9oKTOIjulYIoFLEUh7aLFRGKPm9yjv08JvTi4pAXXv7z3c55851LoqiD/wOJbDa7pVgsbgoDBslarbY+dLZELpfbHsfxvkUmjNLp9Drl1uv1VUEoQX1/oVAYJb5GxB7C3qmYT6pWqxvwjyE+Z2pbg8QT8DP8Cn/C1wgs2hwJwXWT2DR8DqfgUR9HSBZ7AiFXvI/xoMTBScaf3BofmKfb57QFBYfhW2cmKboqcXzfm7QEOX2aGAFV2cTPY8/AvUrI5/P7GX/D3+OLsB/wSXnb+c606PZfSJH4BI54h7ZA2yFx3se45H7tHZPX6JDqMVPUdKlGX1P3SFvvbW0fwl94uy1URPFLK0LAviZfJpNZ6+yzbtHf22RqJySSWJ3xnM2J/+yYmnAXYRd8fDEkmWyzdagzTqwm1aF+HHZDYJGH1s/4MhwvlUqxiH+X/Lql+Idjt+0rAhNmNDmcl2272k4Y7JWts+PEfYGTLq1xW3V2NV6oXia0FVpMN1D2UoTZ7QtBzkFynpXL5Y2ydTywZ/G/gsUgvTXo1gGKZlhowN+cfxEmMcQGubFHnEuXZMC9cYfgU3s5WkJnAoyz2I3gOi/5jIWIm9t6K3JbiMDd2NMurCfoNjy2UBFAQkjoi8wZQOgeFl6tMd+esDOmk1P4y97voa4g5KT1uWMyZ+yudt0WGo8nk2yjaKsnYi76BPdLZ2PzjrlL8hEO+R9gwZznwoeU3N6lCvMv+Lw6EtLkNc6GhPgDy6cb+zv+4yavAeXgHw392jZqfnibcX/Y1QbswW5Fm6uDjG8EjrHA9bj5n3kpCp4A92Tcl3DrF9wcb6JmQ4qMhyuVSj7MWwn0GOuFP6VHMwwK6iC8F26jB7U7Cs0/93fwdBjvoIMOOlgGfgE5luYS9J/sAgAAAABJRU5ErkJggg==>

[image7]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFIAAAAZCAYAAACis3k0AAAEZ0lEQVR4Xu1XTYiNYRS+N6OI/I/J/Nzvzp1BE0UmC5KNSSwoLChCWbCYpSgrGxtSItTkJzYWJGKkyG8Re2VhChtFNoqiGM8z95zr3ON7v+/junfjPnV6v/ec857n/X/Pl8s10cR/ia6urvXFYvGY19cLjeYLolAorIqiaJfVdXR0zGxra5tkdcA4dLrd6TxaMKgLiDngDYq/4Ms7fRUCfPmenp7Z4FnCEvVxzj4GtJ0Gn+WlUqnQ398/3tszA4GKCDTCzlg9OrYf+u+QIZG7kG/Qn7Z+HrCXEOs6yuneRqTxoXxmOJWvxfp6xPGh7RPIG/KgfIXyubUTnZ2dM2B7DTkLuQn5CFnr/VLBFUAHzqPxaGBgo06OgHyi9fOAzyBiHfR6xb/mIzxfd3c3mkZ3scumsq7jxK7vVB/Ghc+N3t7eVlHlEWcndJ/UJzPQcDMafkgY2C3IEGy7cTy6rD0O0rkrkGXepsjAd0o5rT0E4bR8Lahfgmw0OsYfsBOO7zXw+WFccu3t7bOge5Fl8SrQVYPsDQ2MYnVpgH8/5Fpra+tkbyOE85/xEeS0fKiXEP8dyhXeD/oH4puXk1E1kbTRB9Jn9YmA80XZ8uuSBgbbYcgQvrfFPAYVwD4dchuPw0JvIxBjEznT+DDZ85UziY9QTqfjhH1mGaP/gv4tRTkH8oZ+1odgv9gPr48F7wo4L+B30sCgf4eBLaKg/hD1kSiwWnJULuViHgbywXafnGl8kKvKmcRHGM4KCr92ZNUrLhM4Kvx9UflhqWkieYec1ErKwIa0jntjLurvizGvHwHbCdi2eH1O+GDbw0oan01BlI+pkfUV5AOc5DsTuTsS9UHykr8gu7amiWTyigCXtR4amIe5P0a9jZAd2+31yqcXeFY+QvliJosL2xHi9K826/C9Dd0P7lTZ7Z/+eiIlQb1TkGNN/MHAuNJ8kWMnEvpzOZc418jHmGN8kOPexsmN41TA/oiTBb63KJ9CtrIuk1jbHQmnCRKkImi0XTp7WY4QXzTN6T5o26QdCV0fUwevT+NjnZyWD7tonrZXPsghG5d8kPtxnARywymMbXWobyz+Sn9iN4WOseAeqkyI2yGy2q9h26Y6zbEgX1WngG7Q60LIwFfZYcoXubyUfJGbXAvaIMNcSFGN5Zb2ZAhn1UTqGPVKyAxe7Ai4hwEhN1QvR/IxjsFqUeWL5ayfl3XVL6Im4VaXBMun6U0MH8HHRPkqmUDGpP8A5GhOFiUqp15Vx5gnAX15bietWP5B+Wb9UsEdIQOyogkr7YtRfxmV/3l5xPjf/dsvG3TLIMNWF0KIU2zKx39e5QzyhZJ+Qh4bjcPyC68U7xeVr4h7Ufn+5C6m3z7vVzNkx+7gcUTn2rydgP1g9AdHOwnkA89K5fR2IisfdzfjsExK7MknE7khkGbVHxjsQBRIwuuFRvM1AqGEuJ7gXd1IvvqDRx0TOczE2NvqBXI2kq8hYL4nF3NsQlwPSI7ZML4mmmjiv8JPCXrA9FaRvmIAAAAASUVORK5CYII=>

[image8]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAAZCAYAAABggz2wAAADX0lEQVR4Xu2WXWjOURzH/+uhJkIxD3te/s+bJC7wxMVStLiQkJdSdqPtYjculOJGUnKB3GhrtdJCy0taKfLSLlZqpbmxIq2tbC1LQi4UF8zn53/O/Hb2ePz3PCj1/9a38z+/t/P7nZf/OZ4XIUKEUvB9f0MymVxZLBbnurrfIJZIJJKZTGaxq5BY2Ww2zmeNltfX1y8tOw7JrIDNrrwayIAkeQ5eIfZdOAEbXbtSwGcdti9hH99D6XT6Ie1yqzf5jsI3yG/Sdso3HGByluhY02CSOozhhbKG4VFDcseJN277Jv57uF4bupBVxOYxbJC+5CaF4P+orq5ugchUoZOKvXoyygLjZhIco22XYK4+LPDNwnF4ycrYvgn6r+B1beuCZFux6fbUtqS/Go6S22bTl0IHYJsfrOZ5xDFrHwpmBpvgawJ3uPowMP6T+J+wMlkNZH1SrDKdAdnq+D1gYuZZmVnlEeTbpG8KlVgVL8YMqKK7ZEBXXwI12HebQndphTmvk1rmAp8iNp/EDr6lv4b2BdxvbWyh6HK0h2BnPp9P6TgVQa8ybHf1GmrlKirU+3mev5piv8Cd2kAKlZ+UkO8W/sA0/ke4T9tVghhBGuFT2OMqNf5AoV6hUFiI3TX4TezhcCqV2mj1crUQ+wntJivD5rZvdoCVzQo4bifAc5K8Q+BVrt5FtYWa1XmG7WlTsBQqLFuE/A+M3dQPMCxiDLYHx54wBSpUfEbNEbkltBe/rCT9YVNEm+c8Eiwywd9abHrj8fh8Vz8NUhgcNINlXX1Y2EFllq1MrfSEttWQHxEck9bV4XdW/PWOgRetXq3oPcav1b4aMdmisKuaAi1YhbXE+eCrbSTniv6IJGJlJLTFDx4HO6SfDv6i8oJqsjYG8gCR3H6sqMSAPfoWkLH8oNAjym86SCyPwRlXXgXmkFiHFGYFFHWQ/meZUNOvNQlLcn3aD90Q92jB+qJvEJlvXlXku1t8c7ncImUjN0Kvlv0TyIAMfB+2kPwp2ndmtqfOGMkf9YNr5Jj2w/6GTAq86pd4J5uzfNIPdsjlTHD2+0Pe838Fci3J/bt3lm9ouUszFHyAZuuvzpw8EsRGxvDCPAHN1u03P4KyZNBB1/9/QozZWeYHT6uyFDvXOUKECBEihMR3RaIbyeLy0wAAAAAASUVORK5CYII=>

[image9]: <data:image/png;base64,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>

[image10]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAWCAYAAABdTLWOAAACz0lEQVR4Xu2VO2jTURTGUxKlouADY2gevUnqA+ugEETU1aFFXJpBtKODHYpLQbRzF0sXBVHq1IqgOAmKVksRddJBKnapi0KnOjhVsGDr78v/3vR6TWrADAH7wcf/nnPPOfe7j5PEYhvYQOuizRgzCsf1zefzx/DFw6BmgnVOwBehvyZKpdImgsdgP7wA38PVzs7OqTC2Wejq6trDGh/hl3CuJji1AfjA2cVicTvJ0xKqDfixTUKCA7il+g2JRFw7gU+UgJnw/D34VihW8sKbAuqWqf+K72JDIgVObj/Bo74vl8sdxfcdkaesK459GvsZ3zk4Au/q2vy8v4GccQSe5dshgaFI6x8h5gPfx3DMn/8NTA7CVSeC8ZB2n81md9k3PAw/q2iYux7Y5G2b/4fITCaTxZ5lnXOyC4XCAcbza9keEJYj+BNclp1MJrcxfknChItJp9O7TfRMGhbJBveysNG4lkg2cAZ7yX9irHnRjauwu9TP0DLsky+VSm01USMtkXQlFv00JRgfabSxELiF/IfOriWSca+JmmlGB2PzMm7eIc7CV030oI/7E9hl+NMWEZ/qLfsx64G6A+TcdLapIdL/VbGUjkE3XwHHfBnnrK7F+Sje7sb2jVz3inwl55CbrwfyUmoEYu+b6JbEe/CHqJowr1h74udNdJOVdaqFMMraSdURq3R4msJFHT01nsMeN4d/Jznv4LC1TzK+oe9ahfowNU5Sb1K/HhLqxfW7QZ+v3KfEuMaB024jFNqHveCEa87mzKmp3CL1QNxBE13novPZxtGTKltXG/WvVTvXiQqp61YMBaawJ7Hn4QTjBXyXYvb/HXsIrsBvfneGsELCdSodrTlqv8WeMdGTeA3fhDXqoU0droG6WW+sTlcnKHqH+cPhRCPo7u7e7OpSpwPBO8KYf4bEU3xSTyScawkgrpedPwqbr6Wga9J1hf7/Br8AOZbkpP0hsH0AAAAASUVORK5CYII=>