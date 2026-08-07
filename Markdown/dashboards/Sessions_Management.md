# Sessions Management — UI & Backend Spec

## Purpose
- Detailed spec for creating/managing sessions, center mapping, capacity, student roster, and invigilator roster rules.

## Data Model (MongoDB)
- Collection: `sessions`
```
{
  _id: ObjectId,
  exam_id: ObjectId,
  session_code: string,
  center_id: ObjectId,
  room_id: string,
  start_time: datetime,
  end_time: datetime,
  capacity: int,
  assigned_count: int,
  senior_invigilator_id: ObjectId,
  status: enum('scheduled','active','completed','cancelled'),
  created_at: date,
  updated_at: date
}
```

## Business Rules
- Students: one session per exam cycle — enforced during `assign-session` API.
- Sessions per city/center: unlimited but constrained by room capacity and resource availability.
- Invigilator consecutive-session rule:
  - Define "consecutive" as sessions at the same center where end_time of session A <= start_time of session B and no gap > policy threshold (e.g., 1 hour).
  - When assigning a Senior Invigilator, check neighbor sessions for conflicts: previous and next.
  - Provide automated suggestions: nearest available invigilators with no conflict.

## UI Features
- Session list with calendar and table views; color-code by status.
- Session detail: seat map (terminal IDs), roster, quick-assign students, export roster, assign invigilator panel with conflict detection.
- Bulk operations: split/merge sessions, bulk reassign, capacity rebalance across centers.

## Assignment Algorithm (invigilator)
1. Candidate pool for assignment: invigilators available at center (or nearby) who are not assigned to overlapping sessions.
2. Filter out invigilators assigned to previous immediate session (consecutive rule). If none available, surface overrides with 2FA requirement.
3. Once assigned, create a `invigilator_roster` entry with timestamps and expected duty window.

## APIs
- `GET /sessions?center=...&date=...`
- `POST /sessions` — create session
- `POST /sessions/{id}/assign-invigilator` — assign with validation
- `POST /sessions/{id}/assign-students` — batch assign list of student IDs

---
*File: `Markdown/dashboards/Sessions_Management.md` created.*
