# **Database & System Schema Specification**

## **Overview**

This specification defines all data schemas across the entire **CogniVault CBT Platform**. The data architecture spans four storage tiers:

1. **MongoDB Primary Storage:** Cryptographic persistence for question banks, user accounts, exam blueprints, candidate attempts, and audit logs.  
2. **Redis In-Memory Cache:** High-speed cache for encrypted JIT master papers, live candidate answer buffers, and strike counters.  
3. **Python RAM (Volatile Memory):** Decrypted transient state during JIT generation & Gemini AI auditing.  
4. **Client-Side IndexedDB (Browser RAM/Storage):** Candidate-side local state persistence for zero-latency UI rendering and crash recovery.

## **1\. MongoDB Document Schemas**

### **1.1 questions Collection**

Stores raw question bank items with **AES-256-GCM** envelope encryption and **SHA-256** hash chaining for tamper detection.

{  
  "\_id": { "$oid": "66a01b2f8c9d1a2b3c4d5e6f" },  
  "sequence\_id": 1042,  
  "subject": "Physics",  
  "topic": "Thermodynamics",  
  "difficulty": "Hard",  
  "status": "APPROVED",  
  "is\_encrypted": true,  
  "encrypted\_content": {  
    "ciphertext": "k9A2xL+Q5NmB8vPz...\[Base64 AES-256-GCM\]",  
    "iv": "a1B2c3D4e5F6"  
  },  
  "previous\_hash": "a4f8e...\[64-char Hex SHA-256\]",  
  "current\_hash": "c8b1d...\[64-char Hex SHA-256\]",  
  "created\_at": { "$date": "2026-07-20T10:00:00.000Z" },  
  "updated\_at": { "$date": "2026-07-20T10:00:00.000Z" }  
}

* **Indexes:**  
  * { "sequence\_id": 1 } (Unique)  
  * { "subject": 1, "status": 1, "difficulty": 1 } (Compound index for JIT query buffering)  
  * { "current\_hash": 1 } (Unique)

#### **Decrypted In-RAM Structure (AES-256-GCM Plaintext Payload)**

{  
  "question\_text": "A Carnot engine operates between two reservoirs at temperatures $T\_1 \= 600\\\\text{ K}$ and $T\_2 \= 300\\\\text{ K}$. If it absorbs $1200\\\\text{ J}$ of heat, calculate the work done.",  
  "options": \[  
    "600 J",  
    "300 J",  
    "900 J",  
    "1200 J"  
  \],  
  "correct\_option\_index": 0,  
  "media\_url": "https://cdn.cbt-system.org/diagrams/phy\_1042.png"  
}

### **1.2 users Collection**

Contains candidate, invigilator, and administrator identity profiles.

{  
  "\_id": { "$oid": "66a01c3f8c9d1a2b3c4d5e70" },  
  "roll\_number": "2026-NEET-08492",  
  "full\_name": "Aarav Sharma",  
  "email": "aarav.sharma@example.com",  
  "password\_hash": "$2b$12$e8Yx2...\[Bcrypt/Argon2 Hash\]",  
  "role": "STUDENT",  
  "assigned\_center\_id": "CENTER\_BLR\_04",  
  "assigned\_terminal\_id": "TERM\_102",  
  "is\_active": true,  
  "created\_at": { "$date": "2026-06-01T09:00:00.000Z" }  
}

* **Indexes:**  
  * { "roll\_number": 1 } (Unique index)  
  * { "email": 1 } (Unique index)  
  * { "assigned\_center\_id": 1 }

### **1.3 exams Collection**

Defines exam specifications, time schedules, subject blueprints, and target difficulty distributions.

{  
  "\_id": { "$oid": "66a01d4f8c9d1a2b3c4d5e71" },  
  "exam\_code": "NEET\_UG\_2026",  
  "title": "National Eligibility cum Entrance Test (UG) 2026",  
  "total\_duration\_minutes": 180,  
  "total\_marks": 720,  
  "marking\_scheme": {  
    "correct\_marks": 4,  
    "incorrect\_marks": \-1,  
    "unattempted\_marks": 0  
  },  
  "blueprint": {  
    "Physics": { "required\_count": 45, "section\_weightage": 0.25 },  
    "Chemistry": { "required\_count": 45, "section\_weightage": 0.25 },  
    "Biology\_Botany": { "required\_count": 45, "section\_weightage": 0.25 },  
    "Biology\_Zoology": { "required\_count": 45, "section\_weightage": 0.25 }  
  },  
  "target\_difficulty\_distribution": {  
    "Easy": 0.35,  
    "Medium": 0.45,  
    "Hard": 0.20  
  },  
  "status": "UPCOMING",  
  "start\_time": { "$date": "2026-07-25T09:00:00.000Z" },  
  "end\_time": { "$date": "2026-07-25T12:00:00.000Z" }  
}

* **Indexes:**  
  * { "exam\_code": 1 } (Unique index)

### **1.4 generated\_papers Collection**

Archival registry for AI-generated and audited master papers per session shift.

{  
  "\_id": { "$oid": "66a01e5f8c9d1a2b3c4d5e72" },  
  "exam\_id": { "$oid": "66a01d4f8c9d1a2b3c4d5e71" },  
  "session\_id": "DAY\_01\_SHIFT\_01\_MORNING",  
  "ai\_audit\_report": {  
    "balance\_score": 0.94,  
    "flagged\_issues": \[  
      "Removed duplicate question ID q\_phy\_402 testing Ohms Law formula",  
      "Adjusted Hard difficulty ratio from 22% to target 20%"  
    \],  
    "gemini\_model\_used": "gemini-2.5-flash",  
    "generation\_latency\_ms": 3420  
  },  
  "encrypted\_master\_payload": {  
    "ciphertext": "m7B1zK+...\[Base64 AES-256-GCM\]",  
    "iv": "f6E5d4C3b2A1"  
  },  
  "master\_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",  
  "created\_at": { "$date": "2026-07-25T08:45:00.000Z" }  
}

* **Indexes:**  
  * { "session\_id": 1 } (Unique index)  
  * { "exam\_id": 1, "session\_id": 1 }

### **1.5 used\_questions\_registry Collection**

Enforces the ![][image1] multi-session uniqueness rule by tracking historically served question IDs across exam shifts.

{  
  "\_id": { "$oid": "66a01f6f8c9d1a2b3c4d5e73" },  
  "exam\_year": 2026,  
  "session\_id": "DAY\_01\_SHIFT\_01\_MORNING",  
  "generated\_at": { "$date": "2026-07-25T08:45:00.000Z" },  
  "question\_ids": \[  
    "66a01b2f8c9d1a2b3c4d5e6f",  
    "66a01b2f8c9d1a2b3c4d5e72",  
    "66a01b2f8c9d1a2b3c4d5e99"  
  \]  
}

* **Indexes:**  
  * { "exam\_year": 1, "session\_id": 1 } (Unique index)

### **1.6 candidate\_attempts Collection**

Maintains real-time candidate examination state, answers, status, and calculated raw/percentile scores.

{  
  "\_id": { "$oid": "66a0207f8c9d1a2b3c4d5e74" },  
  "candidate\_id": { "$oid": "66a01c3f8c9d1a2b3c4d5e70" },  
  "exam\_id": { "$oid": "66a01d4f8c9d1a2b3c4d5e71" },  
  "session\_id": "DAY\_01\_SHIFT\_01\_MORNING",  
  "terminal\_id": "TERM\_102",  
  "seed": "b4c2d3e4f5a6...\[SHA-256 Terminal Seed\]",  
  "status": "IN\_PROGRESS",  
  "responses": \[  
    {  
      "question\_id": "66a01b2f8c9d1a2b3c4d5e6f",  
      "selected\_option\_index": 1,  
      "state": "ANSWERED",  
      "time\_spent\_seconds": 45,  
      "updated\_at": { "$date": "2026-07-25T09:12:30.000Z" }  
    },  
    {  
      "question\_id": "66a01b2f8c9d1a2b3c4d5e72",  
      "selected\_option\_index": null,  
      "state": "MARKED\_FOR\_REVIEW",  
      "time\_spent\_seconds": 20,  
      "updated\_at": { "$date": "2026-07-25T09:15:00.000Z" }  
    }  
  \],  
  "score\_summary": {  
    "raw\_score": 580,  
    "percentile\_score": 99.1204851,  
    "correct\_count": 150,  
    "incorrect\_count": 20,  
    "unattempted\_count": 10  
  },  
  "started\_at": { "$date": "2026-07-25T09:00:00.000Z" },  
  "submitted\_at": null  
}

* **Indexes:**  
  * { "candidate\_id": 1, "exam\_id": 1 } (Unique index)  
  * { "session\_id": 1, "status": 1 }

### **1.7 proctoring\_logs Collection**

Audit log storing browser-native MediaPipe ML and audio detection events transmitted from student terminals.

{  
  "\_id": { "$oid": "66a0218f8c9d1a2b3c4d5e75" },  
  "attempt\_id": { "$oid": "66a0207f8c9d1a2b3c4d5e74" },  
  "candidate\_id": { "$oid": "66a01c3f8c9d1a2b3c4d5e70" },  
  "event\_type": "MULTIPLE\_FACES\_DETECTED",  
  "severity": "WARNING",  
  "strike\_number": 1,  
  "details": {  
    "detected\_face\_count": 2,  
    "gaze\_pitch": 12.4,  
    "gaze\_yaw": \-45.2,  
    "duration\_ms": 3200  
  },  
  "timestamp": { "$date": "2026-07-25T09:42:15.000Z" }  
}

* **Indexes:**  
  * { "attempt\_id": 1, "event\_type": 1 }  
  * { "candidate\_id": 1 }

## **2\. Redis Key Structure & TTL Specifications**

| Key Pattern | Data Type | Payload Description | Expiration / TTL |
| :---- | :---- | :---- | :---- |
| exam:{exam\_id}:{session\_id}:master | String | Encrypted JSON Master Paper Payload | ![][image2] |
| sync:attempt:{attempt\_id} | Hash | Real-time candidate response delta (question\_id ![][image3] selected\_option\_index) | ![][image4] |
| strikes:{attempt\_id} | Integer | Atomic strike counter for candidate proctoring violations | ![][image4] |
| session:active\_terminals:{session\_id} | Set | List of active terminal IDs connected to exam lab | ![][image5] |

## **3\. Client-Side Browser IndexedDB Schema (CBTLocalDatabase)**

Used by the React web application for zero-latency UI interaction and instant recovery in the event of hardware or power failure.

### **Store 1: exam\_manifest**

* **Primary Key:** exam\_id  
* **Schema:**  
  {  
    "exam\_id": "NEET\_UG\_2026",  
    "seed": "b4c2d3e4f5a6...",  
    "decrypted\_questions": \[ /\* Seeded Fisher-Yates shuffled list \*/ \],  
    "total\_questions": 180,  
    "expiry\_timestamp": 1784980800000  
  }

### **Store 2: candidate\_responses**

* **Primary Key:** question\_id  
* **Schema:**  
  {  
    "question\_id": "66a01b2f8c9d1a2b3c4d5e6f",  
    "selected\_option\_index": 1,  
    "state": "ANSWERED",  
    "time\_spent\_seconds": 45,  
    "synced\_to\_server": true,  
    "updated\_at": 1784970750000  
  }

* **Indexes:** { "synced\_to\_server": false } (Used by background web worker to sync pending deltas).

### **Store 3: proctoring\_queue**

* **Primary Key:** id (Auto-increment integer)  
* **Schema:**  
  {  
    "id": 1,  
    "event\_type": "TAB\_SWITCH",  
    "timestamp": 1784972535000,  
    "synced": false  
  }  


[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADsAAAAZCAYAAACPQVaOAAADtElEQVR4Xu2XX2jNYRjHdzpThOTPzM52zu/sDOdmESfckBI15U+ZWhrSriS52YW4IrnQJKmhtVquFMISERf+FMLVaqnValOsFKJcKXy++73v6d3rd7bjbEidbz297/P3vM/7PL/3fU9FRRll/CvEgiA4mE6nB1Kp1E3G3rq6unm+kYD+UTKZTPjyvwYWupLFLcnlctN8nQUJTGeRjRp9HfJ1xBiW3tjuhx/y4sWR78JmmyOLBs41UJsvnwy0GBZwCrqkahD/Azu/B1XMMVPVDkgHXTU2e10b+B7kD6uqqmaJZ+Nqkd2D3vg03obmYRa2j6AdtbW18319KSBWO9Rl+fr6+tXwI+7uwzdDn1Q9w28wvGvzBLptq66k4S9bvUDsQDaubELg0KYdYuyEanx9sUgkEgvwf8aiV7lyZOega0wrM5nMHObPIxJ5KLn0xmdY3eGEUTecd/hKrZd173ZkxUFVxrkVekeAC76+GOCXw/8ji2xy5ciO2uSwWcv8m5eIvslLyL8qhvFR8vk29iurLoC/SnvPsLKS4STeQ4vX+foC0G53Qz+0eFWa8Rj8fadiSvwHcQ+7juJdOfMV0AjUrEIgv6hDClWM8Tjydtd/0nCrDXX6+iiwkEXQYy3cLP5mNpud7ehVwYLJQt2O7XqoLwi75ZTWY07pO3bzphLxIDw8XkHXfWUBaOebbLKGOmy7TZSs9K7cBza3sFljWP1WSxB24BbxjmnxwHkTQfoJ1supl/X1BaBDpB2fAXyWMX9tE0Z2VvpJJjvawhrFmO92UI8Nxuv2e/8d6KLeLuffSHIUpsXe2ytF1YTvMAnramkMivxmo4B+RUNDw0LNFRvbu4Fpe9NNp8d6REDJpcNv4wpU7+uLhaoSVRkWlSHuCONWaCPz776dqfg39GtduUU6fEHlzw1VMQhPb3ug1SiGPb2jEFe7psLXSslJWhDjJPSSeHNduVnYoCpLt1QHYXvn79nq6uqZ8A+gfp3grq9AFRdLr0eElTFfjuxL0cny4w0YnfDlpSIIrwudnEeszLRydyq8uyuNnV5ZX9LmoNFoeF0tY2BuhC50La7cPGD6oXPi1RFB+Ogo7ZAqBfzgZuhzEH6bZ6AhdY6qZ23MvXkB3VvGQxqh01FvXCWpZAvojkEv7IZAO3ybPw61Jz/cSiI7macronc7xl25VHYcOklfKegwQn/DxPgF2kBtJPQIu86oDcnDtPHTVMQ/CZ/4vT7f/39D3Oye/uqNS/bIL6OMMsooYwrxE6lLMirr2yODAAAAAElFTkSuQmCC>

[image2]: <data:image/png;base64,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>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAWCAYAAADNX8xBAAAAeklEQVR4XmNgGAWjgCTAKCcnJwikmdElSAYKCgoRQMPq0MVJBtLS0sLy8vLr0MXJAoqKimYyMjJC6OJkAaCrTgAN1IPxWYD+nQ8U/E8uBurvR7aAZCCP5iKSgbKyshjQkO3o4iQDakU/I9A1s4EG2aBLkAqol7JHGAAAvrgjRYZ/qcoAAAAASUVORK5CYII=>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAAWCAYAAAB9oOpzAAADgElEQVR4Xu1XTWhTQRB+IRUqin9QQ22STZOo1GtQUTx48NAieGgFQb2JtAdvBcVDDwW9CIKUFvHvoFIs6MWDSLWIKEjBgygVRCnoSayIKFSwovH78mbrZJKUElor8j74eLvf7M7OztudlwRBhAgRIvwFpNPpLc65M+BFPjOZzHbIcTtOA+N2gvdzudx6ayPgswD7NFg0fAc2z2W3vpYEhUJhGYIZBw+BR8BnDBCBj9qxHkwGxkxwE2CztRvE4WuEPtm2RuiPJSHD6MasfcmA09HD5Ph+NptdjSDHGKzWFRqw0fOymfkkhmtclcRUAPpD2jjG2pYMCKYRQd3hRtFtUHo79F887mp4CdC7YH+E59R/mxgCJ2QTa4zWUqnUVgT7DfoerfMEYQMHmAxJyqImpqWlJQnbEDjJ62jjdGFNJC95G9pnRbsCHhTtFDWuAe5Guwvsy+fzq8RVHP29LiwjL2cXsIDxGFi0hRWLH5aaVFdiMH+/JfRXtNnEQOsEv2DMUVmzA/wI9gZSi9C+Bf4Ep/3pRnsQfC/rnVAaYy2CT7FWv7Qvi72Xt4DtGuWjVFhTGPgGnNF6MpnMQxtj29WZGPfnDWtys2WJaW1t3QbtMzgYqILswhfGRHSx39TUtNKFJ242MQQTQp8+MVoDx6WOfsCa3d6HfTFlkDfDYGfATq8jKcvRv4krto99V2dirE4wKNp0YOjfoAZ26LHcvAs/8aXN1ZmY014jEonEChd+bKZ5dYMqX844gjvpwqK6Qxug90AbCqRAu8VPzCQD1ZslVGI+gW31JEZrHi6sOTyJRRtnDBOOQ3zOK+NFBNuIY53A80U6/C3ij/8w+F04DHtG+apAHYlhwudKTMm2UIkhsM/NsL8ti5Ob49FU4/hl2gAnWa15uEU+MbU2wassY8+hG6uVGPQH7PxaPukD/u6B7VqnE1b/YjXCydqywQLY2lx45aZwwjZauwbrExa9TX9BlfsL/YmsNeLtUhzvYt5rf4LxXAftATiBt+vUfCbhB+bvYl8KN2NjAi/IVyaGfh81Ptn381VySx8WK3JCBXmVZgcL7BhSvy0Paq7GfyE3j/9KktB+9L+6MCF8DqjfHiXIbx0ml3752+U65nUbnxXr+PnMAWIZhXaNp1af3H8afONS5ypekgbsa5xca45lm5odVwUxfpnY4DqkHRAhQoQIC4nfcLyp8HY0nSgAAAAASUVORK5CYII=>

[image5]: <data:image/png;base64,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>