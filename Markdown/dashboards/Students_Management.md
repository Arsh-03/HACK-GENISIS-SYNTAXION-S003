# Students Management — UI & Backend Spec

## Purpose
- Dedicated spec outlining student lifecycle, verification, assignment, and data fields used by Admin and Invigilator dashboards.

## Data Model (MongoDB)
- Collection: `students`
```
{
  _id: ObjectId,
  roll_number: string,
  full_name: string,
  dob: date,
  email: string,
  phone: string,
  address: string,
  exam_preferences: { city: string, centers: [center_id] },
  pre_exam_verified: boolean,
  on_site_verified: boolean,
  id_document_hash: string, // SHA-256 of uploaded ID file
  photo_hash: string,
  photo_match_score: float, // 0-100
  session_id: ObjectId | null,
  terminal_id: string | null,
  status: enum('registered','assigned','checked_in','blocked'),
  created_at: date,
  updated_at: date
}
```

## Verification Workflow
1. Pre-exam remote verification (ID upload + selfie) — system runs face-match; sets `pre_exam_verified`.
2. On-site verification at center — invigilator captures live liveness snapshot; sets `on_site_verified`.
3. Both events recorded with time, operator, device metadata in `verification_logs`.

## UI Features
- Student table with filters (verified status, session, center, name).
- Verification modal showing side-by-side ID and live capture, match score, buttons: Accept / Reject / Flag for manual review.
- Assignment modal shows available sessions; enforces capacity and "one session per student" constraint.

## APIs
- `POST /students/{id}/verify/pre` — upload evidence, returns match score.
- `POST /students/{id}/verify/site` — invigilator marks on-site verification.
- `POST /students/{id}/assign-session` — assigns after checks.

## Account Creation & Login Policy

- Automatic account generation: when a student is registered or imported, the system creates a login account using:
  - `username`: student's registration number (`roll_number` / `reg_no`).
  - `temporary_password`: first 4 letters of `full_name` (lowercased, non-alphanumeric removed) concatenated with the 4-digit birth year from `dob`. Example: `John Smith`, DOB `2003-05-10` → password `john2003`.
- Security controls and flow:
  - The generated password is marked `must_change_password = true` and must be changed at first successful login.
  - The system must never store plaintext passwords. Store only a salted hash (`argon2`/`bcrypt`/`scrypt`) and a `password_set_at` timestamp.
  - When creating accounts in bulk, the system returns temporary credentials via secure channels: emailed using a presigned one-time link (expires 24h) or printed on sealed letters — never log plaintext to centralized logs.
  - Provide a `POST /admin/students/{id}/generate-account` endpoint for manual (re)generation which invalidates previous temporary tokens and records an audit entry.
  - Rate-limit login attempts, lock accounts after configurable failed attempts, and require 2FA for password resets and admin overrides.
  - The UI must force a password-reset flow on first login and disallow reuse of the temporary password.

## Data Model additions
- Add to `students` collection:
```
  username: string, // reg_no
  password_hash: string,
  must_change_password: boolean,
  password_set_at: date | null,
  last_failed_login_at: date | null,
  failed_login_count: integer,
  account_locked_until: date | null
```

## Audit & Notifications
- Every account generation, reset, and administrative override must create an `audit_logs` entry with actor, reason, and evidence.
- Notify students of account creation using secure delivery and optionally SMS OTP for initial activation.

## Edge Cases & Business Rules
- If a student's `pre_exam_verified` is false, Admin can still assign but the student is flagged for mandatory on-site verification.
- If assigned to a session and the session is cancelled, student becomes `assigned=null` and notified.

---
*File: `Markdown/dashboards/Students_Management.md` created.*
