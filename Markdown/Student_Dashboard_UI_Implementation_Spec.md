# Student Dashboard UI & Implementation Specification

## Purpose

This document defines the student-facing dashboard for the current CBT system. It covers the React UI structure, client-side state flow, exam rendering behavior, answer persistence, session recovery, and the API/data dependencies required to support secure exam delivery.

The dashboard must feel simple to the student while remaining strict, fast, and resilient under real exam conditions.

## Scope

The student dashboard is responsible for:

1. Student authentication and session bootstrapping.
2. Secure delivery of the exam paper from the server cache.
3. Deterministic question and option ordering per terminal.
4. Answer capture with instant local persistence.
5. Background sync to the server.
6. Proctoring and browser lockdown signals.
7. Review, mark-for-review, navigation, and final submission.
8. Crash recovery when the browser or terminal is restarted.

## Design Principles

1. Fast first paint with minimal blocking work.
2. Clear exam-only layout with no distracting chrome.
3. Obvious status indicators for timer, sync, and violation state.
4. Deterministic behavior across refresh, reconnect, and terminal reassignment.
5. Mobile-responsive structure for admin review, but locked desktop-first exam delivery for students.

## Reference System Behavior

The dashboard must align with the current architecture described in:

1. [System Architecture Document.md](../System%20Architecture%20Document.md)
2. [CBT AI Exam Generation & Multi-Session Security Directives.md](../CBT%20AI%20Exam%20Generation%20%26%20Multi-Session%20Security%20Directives.md)
3. [Students Management — UI & Backend Spec](Students_Management.md)

The key runtime assumptions are:

1. The master paper is generated before launch and cached in Redis.
2. The React client receives a seeded exam manifest.
3. The browser stores live answer state in IndexedDB.
4. The server receives answer deltas asynchronously through a sync endpoint.

## User Journey

### 1. Login and Verification

The student signs in using the generated account credentials. The system then checks:

1. Registration status.
2. Pre-exam verification.
3. Session assignment.
4. Terminal assignment.
5. Account lock or policy violations.

If the student is not eligible, the dashboard should show a blocked or waiting state rather than loading the exam UI.

### 2. Exam Bootstrap

Once the exam window opens, the dashboard:

1. Fetches the seeded exam manifest.
2. Loads the encrypted or pre-authorized paper payload.
3. Restores any local draft state from IndexedDB.
4. Derives question and option order from the terminal seed.
5. Starts the visible countdown timer.

### 3. Active Exam

The student answers questions, marks items for review, navigates sections, and monitors the timer and sync state.

### 4. Recovery or Reopen

If the browser crashes, the dashboard restores the latest answer state and resumes the same session from local storage and server sync data.

### 5. Final Submission

The dashboard validates completeness, prompts the student, and submits the response payload to the server.

## UI Structure

### Layout Overview

The dashboard should use a three-zone layout:

1. Top status bar.
2. Left navigation rail with JEE-style question numbers.
3. Main question workspace.

The left rail should behave like the familiar JEE exam UI: a compact fixed sidebar that shows the candidate summary at the top, a subject/section switcher in the middle, and a numbered question palette below it.

### 1. Top Status Bar

This bar remains fixed at the top and contains:

1. Exam name and session label.
2. Countdown timer.
3. Sync status.
4. Network status.
5. Violation/lock state.
6. Submission action.

Suggested content:

1. `EXAM 2026 | PHYSICS-CHEM-BIO`
2. `Remaining Time: 02:14:38`
3. `Synced 8 sec ago`
4. `Offline Draft محفوظ` or `Offline Draft Saved`
5. `Fullscreen Locked`

### 2. Question Palette

The palette provides quick navigation and status color coding. It should visually match the JEE-style numbered navigation panel rather than a generic list.

The left navigation rail should be divided into these sections:

1. Candidate info block with roll number, name, and section.
2. Subject or paper tabs for Physics, Chemistry, Botany, and Zoology.
3. Question number grid for the active section.
4. Legend explaining tile colors and symbols.
5. Compact countdown and submit shortcut at the bottom.

The question number grid should follow these rules:

1. Use small square or rounded-square tiles.
2. Keep the numbering visible at all times.
3. Show the current question with a stronger outline or accent ring.
4. Use color states consistent with exam dashboards: unvisited, unanswered, answered, marked for review, answered plus review, and locked.
5. Allow direct click navigation to any question in the active section.
6. Preserve scroll position and the active section when the user switches between subjects.
7. Show counts for answered, unanswered, and marked questions near the top of the rail.

Each question tile should support these states:

1. Unvisited.
2. Unanswered.
3. Answered.
4. Marked for review.
5. Answered + review.
6. Disabled or locked during submission.

The palette should also show subject grouping when the paper is sectioned.

Recommended JEE-style behavior:

1. The active subject tab stays highlighted while the other subject tabs remain collapsed or muted.
2. The number grid updates instantly when the subject tab changes.
3. A small legend explains the tile meanings without taking much vertical space.
4. The rail should remain fixed while the question canvas scrolls independently.
5. On narrower screens, the rail may collapse into a slide-out drawer, but the same numbered grid and legend should remain available.

### 3. Main Question Workspace

This area renders:

1. Question number and subject.
2. Question text.
3. Images or diagrams when present.
4. Option list with keyboard and mouse selection.
5. Previous, Next, Mark for Review, Clear Answer controls.
6. A small explanation or status line only if allowed by policy.

### 4. Section Header

If the exam uses subject sections, show a section badge and progress summary:

1. Subject name.
2. Answered count.
3. Remaining count.
4. Required count.

## Core Screens

### A. Login Screen

Required elements:

1. Roll number / username input.
2. Password input.
3. OTP or activation flow if enabled.
4. Error message area.
5. Policy notice for first login or lockout.

States:

1. Ready.
2. Invalid credentials.
3. Account locked.
4. Activation required.
5. Session not open yet.

### B. Waiting Room / Pre-Exam Screen

Required elements:

1. Center and session information.
2. Exam start countdown.
3. Device readiness checklist.
4. Fullscreen lock prompt.
5. Verification result summary.

This screen should not load the question renderer until the exam is available.

### C. Active Exam Screen

This is the primary production screen.

It should include:

1. Sticky top bar.
2. Question palette.
3. Current question canvas.
4. Subject navigation if multi-section.
5. Minimal footer with controls and status.

### D. Submission Confirmation Screen

Show:

1. Total answered.
2. Marked for review.
3. Unanswered.
4. Final warning.
5. Submit button.

### E. Recovery Screen

If the terminal restarts or state cannot be immediately restored, show a recovery message that confirms:

1. Session identity.
2. Latest synced answer timestamp.
3. Whether local draft was restored.
4. Whether server sync was used.

## Component Breakdown

### Suggested React Components

1. `StudentExamShell`
2. `StudentTopBar`
3. `TimerBadge`
4. `SyncStatusPill`
5. `QuestionPalette`
6. `QuestionCard`
7. `OptionSelector`
8. `SectionTabs`
9. `NavigationControls`
10. `SubmissionDialog`
11. `RecoveryBanner`
12. `LockdownOverlay`

### Component Responsibilities

#### `StudentExamShell`

Owns exam bootstrapping, routing between states, and top-level session loading.

#### `QuestionPalette`

Renders the JEE-style left rail, including candidate summary, subject tabs, question number grid, legend, and quick status counters.

The component should support:

1. Instant jump to any question in the active section.
2. Highlighting of the current question number.
3. Distinct tile styles for answered, unanswered, marked for review, and review-after-answer states.
4. Section switching without losing the current question selection context.

If the paper is long, the grid should paginate or virtualize while preserving the current numbering semantics.

#### `QuestionCard`

Renders the current question, media, and options.

#### `NavigationControls`

Handles next, previous, clear, review, and section move actions.

#### `RecoveryBanner`

Displays restore status when rehydrating from IndexedDB or server sync.

## State Management Model

Use a single exam store with clear separation between server snapshot, local draft, and UI state.

### State Buckets

1. `sessionMeta`
2. `paperManifest`
3. `questionOrder`
4. `optionOrder`
5. `answers`
6. `markedForReview`
7. `currentQuestionIndex`
8. `syncStatus`
9. `networkStatus`
10. `proctorStatus`
11. `recoveryStatus`

### Recommended Storage Strategy

1. React state for live rendering.
2. IndexedDB for durable client-side draft storage.
3. Server sync for canonical answer deltas.
4. Redis or MongoDB on the backend for session restoration.

### Local State Rules

1. Every answer change must be persisted locally immediately.
2. UI should never wait for the network before updating the selected option.
3. Sync should be eventual, not blocking.
4. Restore should prefer the latest local draft only if it is newer than the last confirmed server sync.

## Exam Rendering Flow

### Boot Sequence

1. Load `sessionMeta` from auth/session endpoint.
2. Fetch or hydrate `paperManifest`.
3. Load `questionOrder` and `optionOrder` based on exam seed.
4. Restore answers from IndexedDB.
5. Fetch last sync checkpoint from the server.
6. Merge state by timestamp.
7. Render the active exam screen.

### Merge Rule

If local and server states differ:

1. Use the latest timestamped answer per question.
2. Prefer server-confirmed submission only when it is newer.
3. Keep a conflict log for audit purposes.

## Deterministic Ordering

The student dashboard must preserve the seeded order rule.

### Required Seed Inputs

1. Exam ID.
2. Student roll number.
3. Session salt.

### Ordering Behavior

1. Questions are shuffled with seeded Fisher-Yates.
2. Options are also shuffled deterministically.
3. The same terminal seed must reproduce the same order after reload.
4. The terminal seed must not be shared with another candidate.

## Answer Persistence and Sync

### Local Persistence

Persist each answer mutation into IndexedDB immediately.

Store:

1. `questionId`
2. `selectedOption`
3. `timestamp`
4. `markedForReview`
5. `subject`

### Sync API Behavior

Send answer deltas in the background on a short interval or on meaningful events such as:

1. Answer selected.
2. Answer cleared.
3. Question changed.
4. Mark for review toggled.
5. Periodic heartbeat.

Suggested payload:

```json
{
  "studentId": "STU-101",
  "examId": "EXAM-2026-01",
  "questionId": "q_phy_12",
  "selectedOption": "C",
  "timestamp": "2026-08-07T10:15:00Z",
  "markedForReview": true
}
```

## Crash Recovery Behavior

The dashboard must recover from these cases:

1. Browser refresh.
2. Browser crash.
3. Terminal reboot.
4. Network drop.
5. Temporary backend disconnect.

### Recovery Order

1. Restore from IndexedDB.
2. Validate with the latest server sync checkpoint.
3. Reconcile any missing deltas.
4. Resume the exact question index and remaining timer.

### UX Requirement

Recovery must be explicit but calm. The student should see a clear banner, not a blocking error page.

## Timer and Submission Rules

### Timer Behavior

1. Timer starts from server-authoritative exam start time.
2. Client timer should continuously correct drift using server time checks.
3. When the timer reaches zero, auto-submit if policy requires it.

### Submission Rules

1. Show a confirmation dialog before manual submit.
2. Block submission only if mandatory checks fail.
3. On forced timeout, submit the latest saved state.

## Proctoring and Lockdown UI

The student dashboard should expose only lightweight proctoring feedback.

### Required Indicators

1. Fullscreen status.
2. Tab-switch warning count.
3. Audio/vision status if enabled.
4. Connection health.

### Required Behavior

1. Do not show raw proctoring internals unless necessary.
2. Present violations as concise banners.
3. Lock the interface progressively if repeated violations occur.

## API Dependencies

The student dashboard depends on these backend capabilities:

1. `POST /api/v1/exam/sync-state`
2. `GET /api/v1/exam/session/{examId}`
3. `GET /api/v1/exam/manifest/{examId}`
4. `POST /api/v1/exam/submit`
5. `GET /api/v1/exam/recover/{studentId}`

If the existing implementation uses different endpoint names, keep the same request/response shape but update the routing layer accordingly.

## Suggested Data Contracts

### Student Exam Manifest

```json
{
  "examId": "EXAM-2026-01",
  "studentId": "STU-101",
  "sessionId": "SES-22",
  "questionCount": 180,
  "subjectOrder": ["Physics", "Chemistry", "Botany", "Zoology"],
  "seed": "sha256-hash",
  "startTime": "2026-08-08T09:00:00Z",
  "durationMinutes": 180
}
```

### Answer Snapshot

```json
{
  "studentId": "STU-101",
  "examId": "EXAM-2026-01",
  "answers": {
    "q_phy_1": "B",
    "q_phy_2": "D"
  },
  "markedForReview": ["q_phy_2"],
  "lastSyncedAt": "2026-08-07T10:18:11Z"
}
```

## Error States

### 1. Session Not Started

Show a waiting screen with countdown and a disabled question renderer.

### 2. Invalid Session

Show a hard stop message and direct the student back to the login flow.

### 3. Sync Failure

Show a non-blocking warning and continue storing locally.

### 4. Paper Missing

Trigger a recovery call. If the backend cannot recover, present a support-only error.

### 5. Submission Failure

Keep the last local state and retry the submission request with an idempotency key.

## Security Requirements

1. Do not expose answer keys or exam source data in the client bundle.
2. Do not store plaintext credentials in logs.
3. Do not rely on the browser alone for canonical state.
4. Use HTTPS/TLS for all traffic.
5. Keep sensitive exam payloads in memory only as needed.
6. Clear local transient state after final submission.

## Implementation Plan

### Phase 1. Dashboard Shell

Implement the shell, login, waiting room, and active exam layout.

### Phase 2. Exam Store

Create the client store for manifest, order, answers, review flags, and sync metadata.

### Phase 3. Local Persistence

Add IndexedDB save and restore for every answer mutation.

### Phase 4. Server Sync

Implement answer delta posting and periodic heartbeats.

### Phase 5. Recovery

Add crash recovery, merge logic, and rehydration banners.

### Phase 6. Lockdown and Proctoring

Add fullscreen, tab-switch, and warning state integration.

### Phase 7. Submission Hardening

Add final confirmation, idempotent submit, and completion lockout.

## Acceptance Criteria

The student dashboard is complete when:

1. Students can log in and enter the exam without delay.
2. Question and option order are deterministic per terminal.
3. Every answer is saved locally immediately.
4. Server sync occurs without blocking the UI.
5. Browser crashes can be recovered without losing recent answers.
6. Submission is reliable and auditable.
7. The layout is usable under exam pressure and shows only essential information.

## Notes

This specification should be kept aligned with the student management and architecture documents whenever the exam flow, persistence rules, or security policy changes.