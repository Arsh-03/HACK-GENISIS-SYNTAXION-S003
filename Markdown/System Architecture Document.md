# **Cryptographically Secure, AI-Driven Computer-Based Testing (CBT) System**

## **System Architecture Specification**

## **Executive Summary**

This architecture defines a high-security, scalable, and resilient platform for national-level or enterprise-grade Computer-Based Testing (CBT). By combining a high-throughput MERN base with a Python FastAPI microservice powered by **LangChain** and **Google Gemini AI**, the system enables Just-In-Time (JIT) paper generation, cryptographic tamper detection, and multi-modal client-side proctoring.

## **1\. High-Level System Architecture Diagram**

                                  \[ Subject Matter Experts / Admins \]  
                                                  │  
                                                  ▼ (Bulk JSON/Excel \+ Media Uploads)  
                                 ┌─────────────────────────────────┐  
                                 │      Node.js / Express API      │  
                                 │        (Admin & Gateway)        │  
                                 └────────────────┬────────────────┘  
                                                  │  
                                   ┌──────────────┴──────────────┐  
                                   ▼                             ▼  
                      ┌────────────────────────┐    ┌────────────────────────┐  
                      │    AWS S3 / R2 CDN     │    │   MongoDB (Encrypted   │  
                      │  (Diagrams & Images)   │    │  Bank \+ SHA-256 Hash)  │  
                      └────────────────────────┘    └────────────┬───────────┘  
                                                                 │  
                                                                 │ Encrypted Queries  
                                                                 ▼  
┌────────────────────────────────────────────────────────────────────────────────────────┐  
│                          FASTAPI AI MICROSERVICE (Python RAM)                          │  
│                                                                                        │  
│   1\. Decrypt MongoDB Payload in RAM (AES-256-GCM)                                      │  
│   2\. Execute LangChain Pipeline \+ Gemini 2.5 Engine (Audit & Balance)                  │  
│   3\. Encrypt Final Master Paper Payload                                                │  
└──────────────────────────────────────────┬─────────────────────────────────────────────┘  
                                           │  
                                           ▼ (Cached 15 mins prior to exam launch)  
                                 ┌───────────────────┐  
                                 │    Redis Cache    │  
                                 │ (Encrypted Master)│  
                                 └─────────┬─────────┘  
                                           │  
                                           ▼ (Delivered at t \= 00:00)  
 ┌───────────────────────────────────────────────────────────────────────────────────────┐  
 │                            STUDENT CLIENT TERMINAL (React)                            │  
 │                                                                                       │  
 │  \- Native Browser Lockdown (Fullscreen, Event Listeners)                              │  
 │  \- Local Vision/Audio Proctoring (MediaPipe, WebGazer.js, Web Audio API)             │  
 │  \- Deterministic Seeded Shuffling (Unique Q-order per candidate)                     │  
 │  \- Dual-Storage Sync Engine (IndexedDB local cache \+ Redis/MongoDB background sync)  │  
 └───────────────────────────────────────────────────────────────────────────────────────┘

### **2.4 Authentication, Account Generation & Activation Flow**

* **Technology:** Node.js / FastAPI auth microservice (optional dedicated service), JWT, Argon2 password hashing, Redis for short-lived tokens, external SMS/Email provider for OTP and activation links.
* **Responsibilities:**
  * Automatic account generation during student import with the following policy: `username = reg_no`; `temporary_password = first4letters(lowercase(name))+YYYY(dob)` (temporary only).
  * Generation of secure activation delivery: presigned one-time activation links (expires, default 24h) and OTP delivery via SMS/email for first-login activation.
  * Enforce `must_change_password` flag on first login and require strong password on reset.
  * Store only salted password hashes (Argon2 recommended) and do not log plaintext temporary passwords. Provide `POST /admin/students/{id}/generate-account` and `POST /auth/activate` endpoints.
  * Rate-limiting, account lockout policies, and 2FA for admin overrides and password resets.
  * Emit structured `auth_logs` for all authentication events (attempts, resets, activations) and `audit_logs` for admin actions.

**Operational Notes:**
  - Temporary credentials are exchanged via secure channels only: presigned activation links, encrypted emails, or printed sealed letters. The system must not log or store plain temporary passwords.
  - Admin bulk account generation runs as a server-side job and writes only password hashes; activation links are stored transiently in Redis until used or expired.

### **2.5 Verification, Seat-Mapping & Monitoring Services**

To support the expanded Invigilator workflow (roster, desk mapping, grid monitor, and on-site verification), the architecture adds several focused services:

- **Verification Microservice** (FastAPI / Python):
  - Performs face-match scoring, liveness checks, and ID document hash verification.
  - API endpoints: `POST /verify/pre` (accepts ID+selfie), `POST /verify/site` (on-site snapshot), returns `photo_match_score`, `id_document_hash`, and evidence links.
  - Integrates with a face-match model (on-prem or external) and writes `verification_logs` to MongoDB and audit storage.

- **Seat Mapping Service** (Node.js / lightweight microservice):
  - Maintains `desk_no <-> system_id` mappings, supports CSV import, validates capacity, and exposes `GET /sessions/{id}/seating-map` and `POST /sessions/{id}/reassign-desk`.
  - Provides quick lookup for the Invigilator UI to highlight desk positions and connected terminal telemetry.

- **Grid Monitor & Stream Aggregator** (Edge or Server-side component):
  - Aggregates low-latency WebRTC or HLS thumbnails for multiple student streams and exposes tiled endpoints to the Invigilator Dashboard (`/sessions/{id}/grid`), with per-tile metadata (attention_score, audio_level, connectivity).
  - Performs optional server-side anomaly detection (multiple faces) and forwards alerts to the Alerting subsystem.

- **Alerting & Incident Service:**
  - Centralizes real-time alerts (camera off, audio spikes, multiple faces, disconnected) and allows invigilators to acknowledge or escalate incidents.

**Data Flow Changes:**
  - Student registration → Auth Service (account creation) → Activation link/OTP dispatched via Email/SMS provider.
  - Verification Microservice writes `verification_logs` and updates `students.pre_exam_verified` and `students.on_site_verified` fields.
  - Seat Mapping Service updates `session_assignments` with `desk_no` and `system_id` and notifies Invigilator Dashboard via websocket/pubsub for live updates.


## **2\. Component Specifications**

### **2.1 Primary API Gateway & Database Layer**

* **Technology:** Node.js, Express.js, MongoDB, Redis.  
* **Responsibilities:**  
  * User authentication, session management via JWT, role-based access control (RBAC).  
  * Ingestion management of question banks.  
  * Real-time answer synchronization buffering via Redis before batch writes to MongoDB.  
  * Serving static exam manifests to validated student terminals at launch time.

### **2.2 Just-In-Time (JIT) AI Microservice**

* **Technology:** Python 3.11+, FastAPI, LangChain, langchain-google-genai (Gemini 2.5 Flash/Pro).  
* **Responsibilities:**  
  * Activated 15 minutes prior to scheduled exam launch.  
  * Fetches candidate encrypted questions from MongoDB, decrypts them in RAM.  
  * Executes a deterministic LangChain auditor pipeline using Gemini to balance cognitive difficulty, remove duplicate/ambiguous questions, and enforce subject distribution (e.g., 45 Physics, 45 Chemistry, 90 Biology).  
  * Re-encrypts the audited Master Exam JSON and stores it in Redis with a strict Time-To-Live (TTL).

### **2.3 Student Frontend Terminal**

* **Technology:** React.js, Tailwind CSS, IndexedDB API.  
* **Responsibilities:**  
  * Secure UI rendering: Subject tabs, color-coded Question Palette grid (Unvisited, Unanswered, Answered, Marked for Review).  
  * Instant, zero-latency question rendering from local React state.  
  * Event-driven hardware lockdown and behavior analysis.

## **3\. Security, Encryption & Integrity Model**

### **3.1 Encryption at Rest (Envelope Encryption)**

Questions in MongoDB are encrypted using **AES-256-GCM** (![][image1] Galois/Counter Mode). Plaintext question text, options, correct answers, and image URLs are never stored unencrypted on disk.

\+-------------------------------------------------------------------------------+  
| MongoDB Question Document                                                     |  
|                                                                               |  
|  \_id: "q\_phy\_104"                                                             |  
|  subject: "Physics"           \<-- Plaintext (Indexed for fast DB filtering)   |  
|  topic: "Thermodynamics"      \<-- Plaintext                                   |  
|  difficulty: "Hard"           \<-- Plaintext                                   |  
|  status: "APPROVED"           \<-- Plaintext                                   |  
|  is\_encrypted: true                                                           |  
|  encrypted\_content: {                                                         |  
|     ciphertext: "k9A2xL+Q5NmB8vPz...\[AES-256 Scrambled Ciphertext\]",           |  
|     iv: "a1B2c3D4e5F6"        \<-- Unique 12-byte Initialization Vector          |  
|  }                                                                            |  
\+-------------------------------------------------------------------------------+

* **Master Encryption Key:** Stored strictly in environment variables or an enterprise Key Management System (KMS). Never written to MongoDB or exposed to the client.  
* **Decryption Window:** Occurs exclusively in the volatile RAM of the Python FastAPI microservice during the 15-minute pre-exam generation window.

### **3.2 Database Tamper-Proofing (SHA-256 Cryptographic Hash Chaining)**

To simulate blockchain immutability without the latency and transaction costs, each question document contains a cryptographic hash signature linked to the hash of the preceding document:

![][image2]If a database administrator or attacker manually alters an answer key or question text in MongoDB, the hash chain breaks instantly across all subsequent records, flagging the breach during validation audits.

## **4\. Question Bank Ingestion & Asset Pipeline**

  \[ Admin CSV / JSON Upload \] ──► \[ Express Upload Route \]  
                                         │  
                                         ├──► Images ──► \[ AWS S3 / Cloudflare R2 \]  
                                         │                    │  
                                         │                    ▼ Returns CDN Public URL  
                                         └──► JSON Payload ───┴──► \[ AES-256 Encryption \]  
                                                                        │  
                                                                        ▼  
                                                             \[ MongoDB Hash Chain \]

1. **Upload Format:** Admins submit questions via standardized JSON/Excel files with optional attached diagrams/images.  
2. **Media Storage:** Media files are uploaded to object storage (AWS S3 or Cloudflare R2). Raw database entries store only the secure asset URL. Access is restricted using short-lived Presigned URLs generated at exam launch.  
3. **Ingestion Processing:** The Express server validates schema formats, calculates the ![][image3] chain link, applies AES-256 encryption to sensitive fields, and appends the entry to MongoDB under an UNAPPROVED or DRAFT state until human/LLM moderation approves it.

## **5\. Candidate Navigation, Shuffling & Crash Resilience**

### **5.1 Deterministic Seeded Shuffling**

To prevent cheating between adjacent candidate terminals in an exam center without maintaining separate database copies, the React client applies a **Seeded Fisher-Yates Algorithm**:

![][image4]All candidates receive the exact same master question pool, but every terminal renders a completely unique, deterministic sequence of questions and option order.

### **5.2 Dual-Storage Sync & Fault Tolerance**

To survive power losses, browser crashes, or network interruptions:

1. **Immediate Local Persistence:** Every answer selection immediately updates React state and writes to the browser's local **IndexedDB**.  
2. **Asynchronous Server Synchronization:** A background heartbeat sends answer payloads to Express/Redis:  
   POST /api/v1/exam/sync-state ![][image5] { studentId, questionId, selectedOption, timestamp }  
3. **Crash Recovery Flow:** If Terminal 1 fails completely, the invigilator moves the student to Terminal 2\. Upon re-authentication, the Express server pulls the latest session state from Redis/MongoDB, restoring the exam state instantly.

Student Clicks Option C ──► Writes to Local IndexedDB (Instant)  
                          └──► Background Sync ──► Express API ──► Redis Session Cache ──► MongoDB

## **6\. Proctored Surveillance & Environment Lockdown**

### **6.1 Native Browser Lockdown**

The React app enforces strict browser sandboxing through standard HTML5/JS APIs:

* **Fullscreen Enforcement:** Triggers fullscreenchange. Leaving fullscreen triggers an immediate warning.  
* **Tab-Switch Detection:** Uses document.visibilityState via visibilitychange.  
* **Input Blocking:** Intercepts contextmenu, copy, paste, keydown (blocking Alt+Tab, Ctrl+C, Ctrl+V, PrintScreen).  
* **3-Strike Penalty Policy:**  
  * *Strike 1:* Fullscreen warning modal; resume prompt.  
  * *Strike 2:* Admin terminal alerted; candidate flagged.  
  * *Strike 3:* Auto-submission of exam paper.

### **6.2 Client-Side Machine Learning Monitoring**

To minimize server-side streaming bandwidth, ML inference runs locally on the candidate terminal using browser-native libraries:

* **WebGazer.js:** Performs eye-gaze tracking to flag continuous gaze distraction away from the screen boundaries.  
* **MediaPipe Face Mesh:**  
  * Detects head pitch, yaw, and roll to flag turning away from the monitor.  
  * Counts visible faces in frame to detect unauthorized individuals standing near the terminal.  
* **Web Audio API:** Monitors microphone input levels for ambient decibel spikes or persistent audio frequencies matching human speech/whispering.

## **7\. Data Flow Matrix**

| Event Phase | Data Format | Origin | Destination | Encryption / Security State |
| :---- | :---- | :---- | :---- | :---- |
| **Ingestion** | Raw JSON / Media | Admin Client | Node.js Gateway | HTTPS / TLS 1.3 |
| **At Rest** | Cryptographic BSON | Node.js Gateway | MongoDB | AES-256-GCM \+ SHA-256 Hash Chain |
| **AI Audit (JIT)** | Plaintext in RAM | MongoDB | FastAPI / Gemini | Decrypted in RAM only (![][image6] pre-test) |
| **Pre-Launch Cache** | Encrypted Master Payload | FastAPI | Redis Cache | AES-256 Session Key (![][image7]) |
| **Exam Launch** | Seeded Exam Manifest | Express API | React Local State | Delivered over TLS 1.3; cached in RAM |
| **Active Exam Sync** | Answer Delta Object | React Terminal | Express / Redis | WebSocket / HTTPS REST Async Ping |

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD8AAAAZCAYAAACGqvb0AAAD5ElEQVR4Xu1XTUhUURidQYOiP4tsaP7um3FKhCJooEiMyH5IoggrDFrUzoJ2kZG0CFq5KMKiQoqIFlG0K0iihTRgRYEUihCFJraosCEpIUPrHN+9w+ebec4baVXvwOHO993v3ved+z+BgA8f/zei0ehKpdQ6y7IqnHUE6lak0+k50hcKheanUqlF0mfAWN3fXGedE/j2GsS9icfjQ2gzjnK3M0YC8fMQt4U5OetKBjppAIfB7+BvsBvJWDIG5i0mBnaAN8BecAz+zTIOCMLXhLoRlHdRfgIbHTHTADFLdZs+fr+YeMSc13k+TyaTi0VVEG2XoCwTPncguA58oc0yJHGaHaN8K+O0eH7Q8AtYL2OAIHwndF1tJBKJouwukGRBII9T7Hu24ikcvvvK44ooR+Ad8JFxcEmhk052LgMpXg/AFdQf4JKX9UQsFtuE+p/gcdoUoZN8n0gkQs54J7yKd1v2aJdU9mAXF19ZWbkAgV1OobBb6ZMCKXympHRCD8ARsIY+tudKAvfCDDqa5MGreDfgOwfRftCTeI0yvU9yQON2PSDlxkfxmNk9uo6sDYi9BbuRbcAn4C7wJdhj5Z8JrhDiWb5S9rkyjj7aOLgyRrNLT+AFxgk/+UGVMAhT4PJEo35wQvr1kh/mrYDfO/F7EIlcNTeASIptL5lZx+9f4D7ZlxtMH2j31Phg14JZsIPfoljE1WnflHjEVyCvFOxn4EdoWFtVVbU84PXgMxAJtEk/P466FmEf0nFHaQvxWayQ1drHA4groFcnMyNclj0P0cvgJAedjurq6oWwM0Y8fWILlz7jBEZsPRp+lTPqBsSkEfsD7NO2EZ9hcvTJM4VbZnoP+XARz1XXrPu+Tlv0+3fEQzjaqH586Gwx4QRia5R9uI3SFuILJTS1jzn7KIckUZcxfbqJp236pv1XxVNs3F7SuROZ+8bSrzMh7LWpFzM/YuLxe9QlIW6PZtPWDW7ild5iYDttL+LZl7OfQuCrqAXLMsxGhkj2mAnQy24AcVuND7+3wTeJspO2eB/0hcPhZfSJvZk7B2aCGGT5IjR7fgL12+nwIh5sLSaeT9Ej7Fh/dBpNkH6pZXgm0Nbv9ntg1vgIZV93vJqaaKPcoOzVcS5Qwj2Pdo+NTzlOe/ow0BHYPaQ4SDmJN5X9yNoI3lb6vVEQclkWooyFXQ8OKPttz/v3G9ggY/SgnAHHdFwWCV0zd3QxUDyEX+SgWfb/gofKcc9b+c/sXJ78gwT7HfgZPBnwMOCeoe/uw5jtHYWetwaYjRiE7Me7e1VglglwRpW9/Yr+K5TgBCQ8PKV9+PDhw4ePfxx/AEOjiEk3f3aYAAAAAElFTkSuQmCC>

[image2]: <data:image/png;base64,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>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFYAAAAaCAYAAAAtzKvgAAAFK0lEQVR4Xu1YXWhcVRC+IREqKiIaY/Ozc5MNhPiDYlSIVAStPy+KaKBgFRQFBfuk2ELxoSJ5UF+kD4q1pSoUq4ggIoiEGq0PFQNFaCiUFmsJFAQbFBLU0MTv2zNndzI99+6qb+V+8HHvmZnzN2fO3NnNsgoVKlRIY2BgYFBEPgH/Bs+BJ/M8vxvPx8AD1nZoaKgO2YfgHseXwXHw7YTuBXTtseOkUKvVnoDtGp4PeV0Zent7Lx8eHr4Da7uR714/MTFxCfR9Xj4yMnKllxHY+waORfLd6zsCOt+GzfyKAd7q6+u7DKIuvD9AGbgKvmjt+/v7r4H+EchXVP8mHDE1ODh4U9ShvSPqo86OkUK9Xr8W9sfoWD9nGTD2pbBfxDxnJAQG+39mbdDeCP6CtX2M5x48P8DzNHjO2hH0AceBzeck3hfoI29XCo3U43Qqml1WB9ku6Faw4E1WHiHBqaexsYGE7lHd4LzXFQG2r2kfRuwOry9AD2zfoXPZUCfv5Rg2GkUdG8dXnoTDbm8NFSIY8hn6hW344BbaUWbt2kKdt4TFTXgdr6MUOI7QxX2aJa445LtVvy6NlAHz/UCyHyPK61PgVYX9gt60BnjlITsObosyCY79UUJaegO8h+kh6hWNQ4JuKQr05nEfHQdIA+hwmAuLJ2Shjk06DhvfwAlTkcUcB90s9bB7zutT4CZrIb/u1H4dOVbX6HNyF2QHwC+5TgokOHbW2FwABhdsltgvytD/OrSnobvX2rYFB+HClEfBlyDu9nYemGizFEQzouhhHW+eOdfrPXCoV8P2EN+llUJmUx+hFKLzbJv7whr3Z5reRB0LPi4atdBfH/WaV2c4N/o/jefP4DJsvlW7fwd1wnndTOTvGHxL5nKuhYTIYr9DcmEFMKfjMA0UjhHBqM9Djm9GoIR8uNHbdgJND4t43hVlHAtznMDzGaQKPGQb+Cdku6Je5+Tc30DUbfL1IiuOOFbH4ImAB6X1RSXPQ3aftyVMRLwPTjk+KSHZd5QGsPhR2M7CNmebHxO0l6UgPbWDppT9nD8zhyrBcXPGlJXP62q3zrHo/1U0wvsIZGfBI82e/wGcLJeQZ9bAvd6A0EpioZaoFiTUsb+By/6Lm0CPhNLn+SiotfJc8oPaBl3os11CtcKUVoqa3g6tBGzE7ow2Rr5q+5aiKIdJuCaFH5BayK+r/ze/8qrC7i+192wcDHMf5jsInnHc7MeT8GNmCet+KussBW2SUGuPayVxinPbm2Y/xLZvIcbGxq6A8WEvJyDfCq5igge9LqaBooniItqlAUYp7Pb5kgebvUpCWbTGdVhdGWD7PXink72XhQqhGY1WHyOW113tp7XdrHQYHJDN+76FEL2yXk5g09+BX6cimouQkHNWvI7gmNJBGoDNHMa6wctthNgNloEfI70pdKDlNPV61VlWfmT78fA5T6blJN4nJdyg3dEmpj2y2bEM0ipr1p0yrx4mPMHFWjnB6IL9s9rvbIGeOv7PkHs9oTa3gkdTqSQPdSMrDUb9u17vEX8p6byezYjXG9J07OjoaK+Em7EYZVoFfAGeijL02yLhQ749ykoh4ZcRSwl+gRu/SPLw+5n/GeQJ+yO6WEtG57i9Lo7r6lwc1s2Q/WH0jI5JM8dPrj/ZjJ4U4nVO0eZhHmgeqoB9cZ+S+EmrBzuD56sS/miif17xKasI3TCepDEjFBu+H+2tWMhUyqkXE7hH7pV/qpQ4i/5p+KNerw95ZYUKFSpUqFChQoUKFxP+AaoO+E9fGQ9iAAAAAElFTkSuQmCC>

[image4]: <data:image/png;base64,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>

[image5]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAZCAYAAADe1WXtAAAAn0lEQVR4XmNgGAWjYGCBlpYWm5KSkhq6OMVAXl5+nrGxMSu6OEUAaOhUIA5GF6cIKCoqAs2UPwLEVuhycKCgoCAAVCBJIrYC4gtAvRXi4uLc6GYyAyW75OTkHpGCgXqeAPFfIP4I5KeiG0oyABoUDMRTZWRkONHlyAZAAzcDva2ALk4RAJrXgC5GKWCRlZU1RRekFDACMTO64CgYBTQEAKmLKM/NwwahAAAAAElFTkSuQmCC>

[image6]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAWCAYAAACcy/8iAAAC60lEQVR4Xu2WP2hTURTGE4qgKNiqNdgmeUkjiIMgZJGC4OIfEAf/QxQHNxdFOigUwU3FQQRRCDgoKIpFuwgqHURBBQcXC4KLHdTBTahQpcbf99697c2hJrEWaiUffLx3vnvuuefcd/+8VKqNNtr4r5DNZlcUCoWTsNO2FYvFbfl8fr+38VkcRVE/2pHQb46RZoyjcMg2zBrlcnkRAXfDKvwOx+Aa60dhp9BrhvLfY33nCsrD5VOzbbMGX3UDxQzDSwT+0WLBk3Aol8uVrN9cwn2MK/CTbftrUFCZwOONCmYZny6VSqsxO2z7gkMrBYu9vb0r1a49bH1C9PX1LcfnbJRsleuwQv8TbjUNy2Z1LeG5E96Cz+EZP7baNMG+vzR9cZ0xTqu6/hW0u8R8BI/XZ5HqcPHfwNG6llYKRr/vkr0HvzLQBQ1qfYVCgsv4vYuSbVDF3qLYcFAasa6pKCYxy3OTG/ut698Jz8uWr9Feupi3iXFAMXke5jkZ5oM9gP8zvWuyvB6jxYJfeZv9uxl7AlZDPwv67XLJffGa4rtx6g4jkrthNd/faHGuPLd6rbu7exnaU7g+tBVzumeAZgVr77r9GwP/Lvxew4nQzyIoeOpqUXw3zmfjGx+MRmtUcJfXfIFqk53JZJZij8hPKyhlz51mBVsUknv4oU3GwiccznRQ8Jjx/aOCVaTXbMEC9t4ouVFqNkbDgjVDaFdJ+lioz7QELeazYIEfpnXoH2yMhgVjH4KT+JzzWk9Pzyq0Uemhr8V8FSybMZ/AHdM9A+DcD7/Bj/aHwn1hXRv9XiPQQeyfUfNDS6eoTuQ7XuPKymscMXBNR8m1ZIuL+6vdaz7XfLCH9Y72wucYHGIj3idGlMx2bSaGM0iBG9HewwH4IEr2xsXfXUvBipmKpy/ot0FAJVUx2jiTvj1yJ3kDLV45fmUEHCOvteiPeb8pn3CFtQzdZQTZp2XG3sjY9n8MaZ3UelGuCyDfNtpoowl+AcsGSY2D0QWVAAAAAElFTkSuQmCC>

[image7]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALYAAAAXCAYAAACmsLVPAAACfklEQVR4Xu2ZMWgUURCGL3CFoCCCx5m7293bBYWAYKFYpbSw0UIsAiktom2agI2F2AmCWApiYSGmMwELC0tBiBamEQQJQiqRBFIl5PL/ubc4TPbpmrvY+H8w3O0/8942/7zMvTQaQgghhBBCiLFTFMXJLMtep2m6VidQu+61WPT7/dv2XXh+ifWDinjbbreP21ohRgJmuwpj7SRJch6fkwxoM/jczfP8cqn1er2z+FxCfAxr9vWwbgDtTql1u90e18Pc1/z7wARyL7gGseiTQowDmuwJ4r4VYciFYNZjTr/X6XRSp11E7Q/ElNXx/Ik5qxFop5D7EIw96/NCjAxO5DaM9gYGy0uNZsbzMo1naxvDJlhyGuvnoL9rtVonrE4NMWk1gndegL5Z1QxCjAWOFDD2I3ydKDU8FzDcOmLblO43AbQVq4EmtEXEA6fT2K+82YM+y6apagYhjgyaNBjvj/MvmmCaDcBm8LkqMMacRv0q98dsft3nhTgSeILyJKXxOGL4vCc2i8cI8/hWNrxZqdUMJUVRnMO6Fd621A3Uv+cPWb+X+M+AEaay4ezLU3ja5y2/mcWjhHl8kOl6T/xLYLgbwXirHBt83hKu9L4jdn0uRjacx7n/gZmchGvEh14XYiRgqsc0Hk7rZw3zg7IK1FyhqRHffC4Ga7mGa30ONGHs55GcEIcj/TX/bvG7z1vsLI7aBZ+PEU7rZT+T53meQfvyN3sJUQsYbj4Y7zNMdsbnLUmSXELdT8QOxwefryI0A/e/a2Tejd9CbHA//hfT5IQ4HOFu+msw3IHwcza0p74mRGy84F+CmxX1VcHrxaZfL4QQQgghhBBCCCGEqMMesRzjoKoxPa4AAAAASUVORK5CYII=>