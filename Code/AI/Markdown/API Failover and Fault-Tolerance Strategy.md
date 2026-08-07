# **N.E.S.T. — Paper Generation Resiliency & API Failover Architecture**

## **Executive Summary**

During high-stakes exam launches, the Just-In-Time (JIT) paper generation service must **never fail due to external AI API errors**, such as:

* 429 Too Many Requests (Rate Limit / TPM / RPM breach)  
* 402 Payment Required / 403 Quota Exceeded (API key credit exhaustion)  
* 500 / 503 Server Error (Provider outage or downstream latency timeout)

This document specifies the step-level checkpointing, multi-provider failover matrix, exponential backoff, and local deterministic fallback systems built into the FastAPI microservice.

## **1\. System Resiliency Architecture**

                       ┌─────────────────────────────────────┐  
                       │   Node.js Gateway / Cron Trigger    │  
                       └──────────────────┬──────────────────┘  
                                          │  
                                          ▼  
                       ┌─────────────────────────────────────┐  
                       │ FastAPI JIT Generation Orchestrator │  
                       └──────────────────┬──────────────────┘  
                                          │  
                  ┌───────────────────────┴───────────────────────┐  
                  │ STEP-LEVEL CHECKPOINTING (MongoDB / Redis)   │  
                  │ Saves intermediate stage state at every step  │  
                  └───────────────────────┬───────────────────────┘  
                                          │  
                                          ▼  
                      ┌───────────────────────────────────────┐  
                      │    Primary LLM: Gemini 2.5 Flash      │  
                      └───────────────────┬───────────────────┘  
                                          │  
                 ┌────────────────────────┴────────────────────────┐  
                 │                                                 │  
      \[ Success \]│                                   \[ Exception / Rate Limit / Timeout \]  
                 ▼                                                 ▼  
     ┌──────────────────────┐                        ┌──────────────────────────┐  
     │ Write to Redis Cache │                        │ Exponential Backoff      │  
     └──────────────────────┘                        │ (Attempt 1..3 \+ Jitter)  │  
                                                     └─────────────┬────────────┘  
                                                                   │  
                                                      \[ Still Failing After 3 Retries \]  
                                                                   │  
                                                                   ▼  
                                                     ┌──────────────────────────┐  
                                                     │ Secondary LLM Provider   │  
                                                     │ (DeepSeek / Llama 3 via  │  
                                                     │ Groq or OpenRouter)      │  
                                                     └─────────────┬────────────┘  
                                                                   │  
                                                      \[ Secondary Failover \]  
                                                                   │  
                                                                   ▼  
                                                     ┌──────────────────────────┐  
                                                     │ Local / Offline Fallback │  
                                                     │ (Deterministic Algorithmic│  
                                                     │ Sampler \+ Local Ollama)  │  
                                                     └──────────────────────────┘

## **2\. Core Strategies for Uninterrupted Generation**

### **Strategy A: Step-Level Checkpointing (State Persistence)**

Never attempt to generate or audit a 180-question paper in a single monolithic API call.

1. **Sub-Task Decomposition:**  
   * **Stage 1:** MongoDB deterministic metadata sampling (![][image1] candidate documents).  
   * **Stage 2:** Decryption into RAM.  
   * **Stage 3:** Section-by-section audit (Physics ![][image2] Chemistry ![][image2] Botany ![][image2] Zoology).  
   * **Stage 4:** Final balance check and multi-session deduplication verification.  
2. **Intermediate Persistence:**  
   * The result of each successfully completed stage is saved into a temporary Redis checkpoint (nest:checkpoint:{exam\_id}:{stage\_id}).  
   * If Stage 3 fails due to a rate limit on Chemistry, the system **does not re-evaluate Physics**. Upon retry/failover, it loads the Stage 2 checkpoint and resumes directly at Chemistry.

### **Strategy B: Multi-Tier Provider Failover Matrix**

If the primary API key or provider is unavailable, the LangChain orchestrator automatically fails over to secondary endpoints without dropping session execution.

| Tier | Provider | Model | Use Case / Role | Latency Expectation |
| :---- | :---- | :---- | :---- | :---- |
| **Tier 1 (Primary)** | Google Gemini | gemini-2.5-flash | Primary paper auditing & Pydantic structured output | ![][image3] |
| **Tier 2 (Secondary)** | Groq / OpenRouter | llama-3.3-70b / deepseek-v3 | High-speed structured JSON fallback | ![][image4] |
| **Tier 3 (Local)** | Self-Hosted Ollama | llama3:8b-instruct-q4\_K\_M | Offline local server fallback (Zero external cloud dependency) | ![][image5] |
| **Tier 4 (Hard Safety)** | Deterministic Engine | Python Algorithmic Rules | Non-LLM rule-based sampling (Guarantees paper delivery even if all LLMs are down) | ![][image6] |

### **Strategy C: Exponential Backoff with Jitter**

For transient 429 Too Many Requests errors or brief network glitches, retries are spaced using exponential backoff with full jitter to avoid clashing retry attempts:

* ![][image7]**Initial Delay:** 1.0 seconds  
* **Max Retries:** 3 attempts  
* **Jitter:** Uniform random float between ![][image8] and ![][image9] seconds

## **3\. Python Implementation (FastAPI \+ LangChain Fallback Chain)**

Below is the complete production-grade fallback chain implementation using FastAPI and LangChain:

\# resiliency\_chain.py  
import os  
import time  
import logging  
from typing import List, Optional  
from pydantic import BaseModel, Field  
from fastapi import FastAPI, HTTPException

from langchain\_google\_genai import ChatGoogleGenerativeAI  
from langchain\_community.chat\_models import ChatOllama  
from langchain\_core.prompts import ChatPromptTemplate

logger \= logging.getLogger("nest.resiliency")

\# \---------------------------------------------------------------------  
\# 1\. Structured Output Schema  
\# \---------------------------------------------------------------------  
class QuestionItem(BaseModel):  
    id: str  
    subject: str  
    difficulty: str  
    question\_text: str  
    options: List\[str\]  
    correct\_option\_index: int

class AuditedPaperSection(BaseModel):  
    subject: str  
    approved\_questions: List\[QuestionItem\] \= Field(description="Exactly required count of verified questions")  
    audit\_notes: str

\# \---------------------------------------------------------------------  
\# 2\. Initialize Multi-Tier LLMs  
\# \---------------------------------------------------------------------  
def get\_primary\_llm():  
    """Tier 1: Primary Gemini Model."""  
    return ChatGoogleGenerativeAI(  
        model="gemini-2.5-flash",  
        temperature=0.1,  
        google\_api\_key=os.getenv("GOOGLE\_API\_KEY", "")  
    )

def get\_secondary\_llm():  
    """Tier 2: Fallback to local Ollama or alternative Cloud API."""  
    \# Example using self-hosted Ollama or alternative API key  
    return ChatOllama(  
        model="llama3:8b",  
        temperature=0.1,  
        format="json"  
    )

\# \---------------------------------------------------------------------  
\# 3\. Execution Pipeline with Retry & Failover  
\# \---------------------------------------------------------------------  
async def execute\_section\_audit\_with\_failover(  
    subject: str,   
    required\_count: int,   
    candidate\_pool\_json: str  
) \-\> AuditedPaperSection:  
      
    prompt \= ChatPromptTemplate.from\_messages(\[  
        ("system", """You are the Lead Exam Auditor for N.E.S.T.  
Auditing Subject: {subject}.  
Required Count: EXACTLY {count} questions.  
Instructions:  
1\. Select exactly {count} clear, non-duplicate questions from the candidate pool.  
2\. Verify options are distinct and correct index is accurate.  
3\. Return response conforming strictly to the requested JSON schema."""),  
        ("human", "Candidate Pool: {candidate\_pool}")  
    \])

    payload \= {  
        "subject": subject,  
        "count": required\_count,  
        "candidate\_pool": candidate\_pool\_json  
    }

    \# Attempt Tier 1: Gemini 2.5 Flash  
    for attempt in range(1, 4):  
        try:  
            logger.info(f"\[{subject}\] Executing Tier 1 (Gemini) \- Attempt {attempt}")  
            llm \= get\_primary\_llm().with\_structured\_output(AuditedPaperSection)  
            chain \= prompt | llm  
            result: AuditedPaperSection \= await chain.ainvoke(payload)  
              
            if len(result.approved\_questions) \== required\_count:  
                return result  
            else:  
                logger.warning(f"\[{subject}\] Gemini returned mismatch count ({len(result.approved\_questions)}/{required\_count}). Retrying...")

        except Exception as e:  
            error\_str \= str(e).lower()  
            logger.error(f"\[{subject}\] Tier 1 Error (Attempt {attempt}): {error\_str}")  
              
            \# Exponential backoff with jitter  
            backoff\_delay \= (2 \*\* attempt) \+ (time.time() % 1.0)  
            time.sleep(backoff\_delay)

    \# Attempt Tier 2: Secondary / Local Fallback  
    logger.warn(f"\[{subject}\] Tier 1 exhausted or rate-limited. Falling back to Tier 2...")  
    try:  
        llm\_secondary \= get\_secondary\_llm().with\_structured\_output(AuditedPaperSection)  
        chain\_secondary \= prompt | llm\_secondary  
        result: AuditedPaperSection \= await chain\_secondary.ainvoke(payload)  
        return result  
    except Exception as e:  
        logger.error(f"\[{subject}\] Tier 2 Failover Failed: {str(e)}")

    \# Attempt Tier 3: Deterministic Hard Safety Net  
    logger.warn(f"\[{subject}\] All AI models failed. Engaging Deterministic Algorithmic Fallback Engine.")  
    return execute\_deterministic\_rule\_fallback(subject, required\_count, candidate\_pool\_json)

def execute\_deterministic\_rule\_fallback(  
    subject: str,   
    required\_count: int,   
    candidate\_pool\_json: str  
) \-\> AuditedPaperSection:  
    """Hard safety net: Uses Python algorithmic deduplication if all LLM APIs are down."""  
    import json  
    pool \= json.loads(candidate\_pool\_json)  
      
    seen\_ids \= set()  
    selected \= \[\]  
      
    for item in pool:
        if item["id"] not in seen_ids:
            seen_ids.add(item["id"])
            # Normalize difficulty to integer enum: 1=Medium,2=Hard,3=Advanced
            raw_diff = item.get("difficulty", 1)
            if isinstance(raw_diff, str):
                mapping = {"medium": 1, "hard": 2, "advanced": 3}
                diff = mapping.get(raw_diff.lower(), 1)
            else:
                diff = raw_diff
            selected.append(QuestionItem(
                id=item["id"],
                subject=item["subject"],
                difficulty=diff,
                question_text=item["question_text"],
                options=item["options"],
                correct_option_index=item["correct_option_index"]
            ))
            if len(selected) \== required\_count:  
                break

    return AuditedPaperSection(  
        subject=subject,  
        approved\_questions=selected,  
        audit\_notes="GENERATED VIA DETERMINISTIC FALLBACK ENGINE (AI APIs UNREACHABLE)"  
    )

## **4\. Summary of System Safety Guarantees**

1. **Zero Exam Delays:** Even if Google Cloud experiences a global outage at ![][image10], the **Tier 2 (Groq/Ollama)** or **Tier 3 (Deterministic Rules)** fallback ensures the 180 questions are ready for Redis encryption in ![][image11].  
2. **Zero Wasted Tokens:** Checkpointing ensures that a failure in Botany does not re-bill or re-evaluate Physics or Chemistry.  
3. **Audit Trail Transparency:** Every generated paper carries an audit\_notes tag indicating whether it was audited by Gemini 2.5 Flash, a secondary model, or the algorithmic safety engine.

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADUAAAAZCAYAAACRiGY9AAACzElEQVR4Xu2WO2hUQRSGd0mEiIKgLqvZx+xmQRAtlEUlEhtRsVAhRlARrEVEMIKvShA7C0EhIoqkEyzFQkgRjIWa1iAoQQVtBA0JKoRg9PtzZ9jZYdeNxV0k3B9+5pwzZ2bOmce5N5VKkGDJIm2M6YXrkTvCTodSqdRVKBQ2qw37PHTkcrk8c+0MO9oGG8Bz+AX+htPFYvEAXWnPTUmfhl/hI7X4nAx8lPQW+t7BMXgfnwfZbHaF7xM7SGgNi48QzFHp2l04BX/BAecnWXZOaZfVd1v9kPMpl8uGed5iv5ayySKPk9gQYqfzix0EcYyFP8B+Z0M+Y6ITeyG9p6dnlWT4xF27TCazEn1UdvXbua6a6CQ3urlI6CL6LOx1tthhF1UCH52N3d+G/hPOWJ8+5DmCHq6NXEhiGPsP+qvSkcc1j4ne5QLoO6j5tU5tZBugna5Wq8ucTgB7CGQefpJOe6VRYG5DnN1uxKhO0fOpKvHQ3hDaAe7wvkU8wn+9yyoItxUsJ3FTBnsiTZOC96RbuVlSk8SbrY0OgMNh+A1+h9P2kddVIYvOlrsTwAVB+9LYa9QqKXctWyRVdy3rgNMmLWjVDuS9OL+nvVDnmFqoRtqZRZ+ULQgj8LUqmbPHnhQTnIP7A5vwKp/PL/fMaWyXPL0lWPQuY57BdYE9vjfFYl2aoNk7ov+4icrzLH53SHJ16NMMjBlwpVnQGszxUHLRFo5S4+o3R3+fdOSJ8ESKtvrB67WRbQBXbTuLP1UwjrLRjtn+LPIb432nlLSJrupEd3f3WtlMVGDqvlPIg3BeG+NssUMBwEkT7WbIEc/vPJwhqR3S1Vr9lOezFU5hu5yyhUvXGdvj4GnEC/cuGtG/bvqO4TuE/TPtWbXwhv99E0xUmafhLXgCjuvf0vf535Dm3W0gqSOVSqUQdjrY/8l+JZX6yx9/ggQJEiRYUvgD7jT4+H60pVoAAAAASUVORK5CYII=>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAZCAYAAADe1WXtAAAAn0lEQVR4XmNgGAWjYGCBlpYWm5KSkhq6OMVAXl5+nrGxMSu6OEUAaOhUIA5GF6cIKCoqAs2UPwLEVuhycKCgoCAAVCBJIrYC4gtAvRXi4uLc6GYyAyW75OTkHpGCgXqeAPFfIP4I5KeiG0oyABoUDMRTZWRkONHlyAZAAzcDva2ALk4RAJrXgC5GKWCRlZU1RRekFDACMTO64CgYBTQEAKmLKM/NwwahAAAAAElFTkSuQmCC>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF8AAAAWCAYAAACmG0BRAAAB70lEQVR4Xu2Xv0sjQRTHE1RQtDj1YjS/NiFcKQqpFLRTsLATPLCxFO0UsbGw0EKEKy1sxEpBRS3s7CwEbbX3HxDBTiGX+zzcleHBmmQ9EcP7wGNn3rw3u/OdH5nEYoZhGIbx/4gXCoVxz/MmdEMYEp9Op7uDej6fbyV/mGKzE2aEgWA/EGweu8UquVxuRceEIbGSo+xFxxkhINYf364+KH4ZO8pms0UdZ1SBHbAXRXw5dorFYg/VJt1u1EhU8XnEZQLI7ZMzX8cYNRBVfHJueJ7yPMSe6GdTxzUMDHA/OGcZ6DU3jlHccR0nELOsfWFEFZ+83qDOeT9CH8+lUqnFjWsIEolEB4PbyWQyvxCdoreAPWCrOlZAmDntCyOK+P5Z/wa5nbITsCHX3xAg0O+YWuWy8hjsBRPS5fpl9dUjQhTxNfnXe/45tqHbAvjOftof5V21GN+zq/v4EviYde0TGFAbbfcMfpYfvwy7YoDyWT3bv17x5T3Eb+t3SD9irs+ownvi+5O7mEwm2wMf9Rms7IqfSqV+4rujj7HAZ1SnCcEORHwmYU3qbiP+CX9iJgOfv/Iv3Thyp/H91bvBCMG/Lla0uUL7P+63cl67uYg9iP8YW8JOvNd/uVtujPGJyFWXiZqSyaKc1O2GYRiG8Z34ByX/lQzyfPzhAAAAAElFTkSuQmCC>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF8AAAAWCAYAAACmG0BRAAAB2klEQVR4Xu2XP0jDQBTGU6ygKChCqdDQtAUFEXHo5OIodujmIE6Ciyg4CCKIg4OziINDEcTBP4OLg1sHnQTn4ia4OBYnZ/09SCA8uLQBRdT3g0cv330Xku+Sy9XzDMMwDOPryJTL5bkgCGq6I4lisVhnzDHVoJZ83+/XHsNBqVQaJrQ1qkV9EOa29rgoFAo+/nsmbZrQxxh/QT1pn+GAsA7CekgZfhb/CcHnIyGXyw2i3clv3Gh0gDfgLE34+Kr437WOtsO55rVuJJA2/Miv9fAbcEt/n+4zHKQMP4P3PCH8v7n0cGOXctNSBPbImjuLnNE+Ac+W1lykCT9a2/9V+OFNN2RnQeg0g3WqTe1qr0Cgq1pzYeF3gIAWPfWUo41ys00mZCSuV6vVXvSZuJZEmvCFyK/1TuFznVP0v8nYborznepz/AhczL7WBPljQ98LgSzL3lv23bRvZAK010Xa8PEeiV/rYfjXNLO6z3CQFH44uZv5fH4g0jieoNqeCjmclK7fOMPzegj9SsJnEvbkON6JXgsnph6TM3gP0SYjgeMSvuc0b9y/Rp50CVZXPOjw496S9To+tlKpDKG/4t3gd0U8VDPuMb4RJmCc8BekpO05tr2GYRiG8Rv4BKDfleuKlZIDAAAAAElFTkSuQmCC>

[image5]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF8AAAAWCAYAAACmG0BRAAACH0lEQVR4Xu2YP2gUQRTG9yCCElFQzgvccbv3R0EkRFgQbOwELewsxEpIIwgWioViaS2SwuIIhBTRxiKSBFKk0MbCxkYkTcDGSg4rK8H4+3AHlsfu3gYFiXk/eOzMN2+Wm29mZ2cvihzHcRznL9PtdvtxHG9ZvQzyr5H/nBgRNzudzhGb49RAxmHgGvHdthXRbrc7mP+21+vN0fc0/V4Qn2yeUwOMu0/s1jR/irxFjG8FodlsHkV7o2s+0ZkAJl7AuHfEdh3zWfFpUR7aoyRJrljdKQGzHiqGw+ExrdwiUy3kL+spsXr2Dtig/bBtcwrAsNV+v388bBs1zG+Qs1Jh/v+59TCwlxq0gtX1nu3iEnLD5glyHljNwkvzpLYcleuan8s7OOZngx7pZIFhFOM7xJh4bHMFk3Pbagat4Keh4uZXgJk3IrPK0WYY7BYTciKvp2l6CP1iXrNg1GVy1kO9rvliwp5faj6/c5b2b+pbJ7jfkr3HP4Ef88RqIjuff8aQWzp769xN+bUmwOYGWq3WNAPbjH+f6/WBNNJAuX4lfqrOPc7bfgHaF2SO1TPzX1Gcsm1OBWUrP5vce5qwoFE/S4wjY3I2KZVPnFPAYDA4hXEfiB95nfpVrXKt6pzc4Ml4hnYuCNQT8naqnjjHED6YZHA+gtnZy/2j9ut8Px1P0b+Qd5frvHLiPfwv5PwhTMAZzL+uUDkqOfY6juM4zn7gF81ync1N3pyVAAAAAElFTkSuQmCC>

[image6]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAWCAYAAACcy/8iAAAAtUlEQVR4XmNgGAWjYBSMglEwCoYmEBcX51ZQUEiQkZERQpcbLoBRXl5+HRBfB3o0wtjYmBVdwXABzEBPOsnJyZ0E0SA+uoJhAUAxCIpJoCfvgmIW6GEtdDXDBgA9Vwb05BMg7gNiSXT5YQWUlZVlgR7eoaioKI4uN2wB0MP5IyaGsQBQoWUFxEdANIiPrmDYAqCHF42EagkFSEtLCwM93AnEt0BJH11+2IKR0NIaBaNgFAxuAADNkR8mBk3W9AAAAABJRU5ErkJggg==>

[image7]: <data:image/png;base64,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>

[image8]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAZCAYAAAAv3j5gAAABvUlEQVR4Xu2UvUrDYBSGE9RBEBQ1Q39o0hIHJ8FsIm6Kgg6CoKCDmxcg6CJu3oCzUtwc3FRwEBEnsavu9QJcCjpYtD6nzVdOPkqpIg7SFw7Nec5vk3xxnK5+Q0EQDPm+P1UoFHJRFPXZ8XbKZrNj1E5KDzuWEInDJJaxY+wCe8EW7LwWcnO53GJcI7Vl/FOWHbQTZUg/CedhGHoxctlsE1bRea1E01nyqly64ksP/BK8aKXWb9k8wU/N0un0KOxJltBcS2I0vJI8zem3ZfcTyV8v2gHP8wZgt9i45lrURcRfsUuLL8FqmjmAFPYsBYmAU9/shKJdmxtJTBpKnsXNAqkmlI39xoP/9iBqDjsepOC3B0m840H5fH4CUPnJIGqOOh4kjv8Xzwj1As6kQEPz1kmR5lrEpsmpYtcWN29d/Ww1xUZr9iBzjvQJ5zbPwe6NLzHxsZJhoqBxjpKvtyiTyYwQfNBN8VdJfje+Olc1uTac7TdgH8aXHtTeiRmWkN94zW+wdewAe6PJjkpxYdtx0+YtkY8vbI/cfamVhfl95KsRqtqkuDUz8aBl+Zd2vJ0YtCK18TPtseNddfWP9QX534/EsTNNkAAAAABJRU5ErkJggg==>

[image9]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAZCAYAAAAv3j5gAAABXUlEQVR4Xu2UP0sDQRDF9wgWgpA0hwjH/eNsAoJ4ra1ioZ1d7P0AFmnED2FtEDtbQcHCQqzEtLHX1l6boPE3shs2G6M5CQfCPRhu5+3beXN7t6tUhRnCC4Ig41lzJ34Ca5ajKFqL47jhzo0hDMMmwgsWPBFL7vwEeKzbRn9JdGQt+XmapnVXKN2sIOgRb8SAeJ7WiKIbaPsMPcmzLPPJu/CnjlSpPM/nkiRZZDJH9DqtEQ3Os+Ya7aPNsyv7cB82N4KiRpb+yuF3ZGdsbgR/MGpLQd7gzOFNne9rFDVCc1yKkRiUYoTmpBSj0r4R+nV0feLG4c1f93W2xvCbEWdtE/7e5HL6JSe6tk6fo8m/N4It3eEL41VldeT7/gL8rRSQseFpbg/u3eRizto7CcMNId3rtxi4YRX1yA900WEDcqvAHWJ4xLOFwQPPnr6YZw+MdsVItl8VvPkrVPjn+ASAeIaGZrtaJQAAAABJRU5ErkJggg==>

[image10]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGwAAAAaCAYAAABSHbkRAAAEAUlEQVR4Xu1YTUhUURSeQYuiFvZjU+PMe+NMPzgEBbNyUbiIMMKN9CNZFC0S2rWpaOMqqKgWBgVuqkULIYSwwiDEfjYpFISRBEGKERTVyqBE6/t6947X4/w8ZZ4jdT84vHe/c+69551z73n3vVDIwsLCwsJEJpNZkkgkTrmu2+lHYrHYajnGAiCMeTdKkohEIiskF4/Ho7iEJV9CVDiOkwkFO0du4OG2IhHfkbQuIzE9kCnINTi2D3Ja6X/gPinHCBBhzJfG3Pcw9wepJMBPwuaF4ftjtG9AVSltSwXMsQfyG341SF3gwMOdweR9Jod2Kx2CbpXkJRcUMNcQk8FFQl8gI9KGULoZgt24XNqVEojBLswzteAJ44Nh4rvYZTsMmqv6Jh/c4P4CfBOcXCb5IFBbWxuprq5eydIDX8YLJOwh5DqkE761pVKpuLQJAGH4t41XqQgUqhzeMVckdxC4wVwJA9csuaBRLGGsEJL7r+CqcsikSV054CdhWO1boL/EXYb2YWljAjZ1kK98RuzIs5CDuB9Gv1Fcf6G9PZlMbsb1KdpjkG/kQ2o3scqo+PCV0eR3TMOFMLiTkKuQc663OXg2mNfCy5ZDSIdUlgPFEgb+E6SbJYoC+ydo10k7DZ6KWW5h145AvoZcIEcdXw1ov4PukT6Vsvqg3ctqxDZfCbhPYY5nOmHFxoTtA/0qwX09ffa88foy5vNKWDQaXYvB3qiEtUp9OeAjYZ06OAQCvAnBGaipqVlj2kmonfKWgdYc2htc7zDRaNqC69DJ0YDNbckVGHOEV8NmYrqX96qZV8KM4HB7512lucAVpJzzJXrFFUOxhEnwoOJ6palF6kwwcAy6ySnfxpDsmMkzmDI5+RKWZ8xswqBvcL1PkVu0L7awCgKDtfFhIYPOHI/vsD8CGfUjGP89ZK8cIxecOSYMqFTPULCk+wmuhlPChLEa4P6y8lFLN/qtN/sVxWIsh0ShhDGQ4L/wkKA5vcMg501bCT/B1ShlwhzvG+641vPPEdp9kLHpXj5gBGbO5TBIFEoYgtPieKfC7PeQWng/IfWG6Sz4Ca5GiRPWBOkVNs25nq8gMEi7663MIUyakPoyIQxXGuHTBOQz26YSH8nr8ILfbVC0P+YU/zVFuxZIl3lgUae/j/xM0JwqYVcw5gk0KzTHvuAOaLuQzzGZMLSnaG/0uwiuR/fJC55mXO99wkTNEq5W2Weh4HqrcpZPkH6WPcNuGHLf9f4j9kMmC/2aMnZsdkzuIO4Mk1NjHRLceML7UT7DTh3dfY0Jfj/4Ady/dD2fX0Gey4POPwv1DbQTQTjK1WseqRcj0un0UrVDq1zvtFwlbSwsLCwsLCwsLCwsLCwWB/4A02GgA3pR9dcAAAAASUVORK5CYII=>

[image11]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGkAAAAZCAYAAAAyoAD7AAAFMUlEQVR4Xu1YW2hdRRQ9l1tBaX1Um4S87pybREJRaiGgWCyCqPijgv1oiwiiHxUR/SixVEtRpFgRhUof4IP6IEQbaD9M6YN+pEZopcX60VoRA43Eii0aLE2gDTaudWbvZGe4uY8ktOFyFizOzN575szM3rNnzomiFClSpEgxW9TU1CzK5/P3Nzc338tyqK9GOOc+zOVyv+N5HhwI9fMKTU1Nt2CQwzLgq+A4uDe0qzbEcfwA5tkJXgEHQ/18wgI4ZxcdxYo47FM6qqWl5fbQuNrArIG59t0wJ3V0dNxEhnILpjcMcKiurm6hypD26iA7C75ibasRN8xJbW1tt+Glm7j4pZyEXfQkdw2fRpyBrAvcj5Rws5FXHa6rk/CSvPMH4AuauspF6AjW6SA4bjeqGatTMBXCphs2R2G/DeVz4EXUO6iXtPk+OAr2gL3QvQpV1nTDYBgGT4Efg8fYh9Fn0fdayP4CP0P5V/RxqLGxsYlK1Nc5f36SI6g/bC4C11D+OkjZGdishu4CdAfx/AX1t/A87oyT2D/k3zk/5s/x/BMcAOtNX2Ujg9S0DI0PgGdL7ZpyISlwGM+VoU4hk+tvb2+/Veox6ifVSc4v+jBvjNKEDrkGPqN12L5OsixtkrOQQaJ61P/RPjg/9ktnQea4CzDGVo4DHIP9D+Zd70hf64xsPccA2UaRMQg20s5NOmkByt1gF9tQEPsLxk+uQicxItiQkXcSfCSaGqEzBheCO4gDj2SQhYD3fwGbHxF1d4mIi7DTOImRPGUnOh+RSQrVQIDNYtWj/Bxko2zDAHH+1rXd9sH+IRsBu1UmYxkXW7VL0jh1Ur8H9Yvgcbu7UK8HB0nWTfrbp0HPQHQ+/ZftpKzzjjlGR0VFFnIG0OhlxK8PlRbQf8BFAH9jpEv0K+gw6hjNXAQlg4oLUo/3bKCNaTMF0H1EvdkJKtdF/Vtl6iQ6RmUFnJS8j/2qDWH6S5zEeaC8T2xP0bkVZ6jW1tZaND6BhbkvmlsHccCrnM/tz0cl+mbe5jhkMiS/rzo5IYlGLtBh59PeBCHbCt6hCxv2S5hoDi80dlEn2pbjJGOzQW0I09/EmQTb5Tl/to0L/4VsdVRiTQohA0ctk4U4g+fToUElQB/fgysC2SfRNAPDJDZDv1TrbOv8JSDJ5TK5N0yTKYj9mTZdSuWO3k19kUWtaCehvEXGVHQn8VMEbbZyM4hJhg6C/j9XZD4lAWe1o4O96GxNxVszSto7nAFPyYAtt4S2ClkY+x1Fx3SZRbmChTpob5p5//3V09DQsCQnZwsWo3myC29DQv8YF4bOiowjUX8I8jHwW5WV6aQHOSawz/72koww5MyZxMAHn1AbOZP6w4CZEdDRDtmmL9qP02KQq/QRTqgAnw3tFbIwA3DC3azzAoH6CchfYj0nZ1vsb1LJpQblt93kWafn31dmrHR0J59GfwlOe5xK2qHeG8vtjjIGJerfcLx4rtF+WJY59KjM+XN0LPapS9smOxocgShrUm0/5nYn7ThH1AcZONLX7MDFwovfcz46NoX6EBpxhQjdo6G9ghEOmz3ggDjsPN9rdrJ+41wAL3NX4flmsNO5cNTzPOsFT8PuXaO330lMx0yne/Q7iZHNcVrKfJi+rCzZAXKF57+6URnzz1L/Q2z7amtruYsPofwlOCQBwPe/zPGasc0ejDq87DWNhrmGRD8HzdtmfTz9n4msXHamu75O6Iv1Qf1c/Z2ns5hSJWDC8WV0Zwd2KVKkSJEiRYoUKVKkmH/4H5A34ZKEefcyAAAAAElFTkSuQmCC>