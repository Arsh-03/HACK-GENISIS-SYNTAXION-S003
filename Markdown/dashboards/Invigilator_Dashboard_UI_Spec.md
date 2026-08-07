# Invigilator Dashboard UI Specification

## Overview
Provides an invigilator-centric workspace to monitor an assigned session/batch, view the assigned roster with desk and system mapping, and a live grid view for real-time anomaly detection and intervention.

## Key Panels

- Roster (Assigned Students):
  - Purpose: show all students assigned to the current batch with quick actions.
  - Columns/Fields: `student_name`, `student_id`, `photo_thumb`, `desk_no`, `system_id`, `seat_status` (connected/idle/disconnected), `pre_exam_verified` / `on_site_verified`, `last_activity`, `flag_count`, `notes`
  - Actions per row: `View profile`, `Open live feed`, `Send message`, `Flag`, `Reassign desk`, `Mark assisted`.
  - Filtering & Sorting: by `desk_no`, `seat_status`, `verification_status`, `flag_count`, `last_activity`.

- Desk & System Mapping:
  - Visual mini-map showing room layout with desk numbers mapped to `system_id`.
  - Hover desk → highlight student row; click desk → open student live pane.
  - Import/Export mapping for CSV uploads (`desk_no,system_id,assigned_student_id`).

- Grid Monitor (Live):
  - Purpose: single-screen tiled grid of all student video thumbnails/streams for rapid scanning.
  - Layout: configurable columns (e.g., 3×4, 4×6), responsive to screen size.
  - Tile overlays: `desk_no`, `system_id`, `student_name` (small), `attention_score`, `audio_level` icon, `connectivity` indicator.
  - Color-coding: green (OK), amber (idle/low activity), red (anomaly detected or disconnected).
  - Quick tile actions: `Pin` (large view), `Mute/Unmute audio`, `Take snapshot`, `Raise flag`, `Open chat`, `Request attention` (popup on candidate client).
  - Bulk controls: pause all, focus on flagged only, auto-cycle pinned tiles.

## Monitoring & Alerts

- Real-time alerts strip with clickable items linking to the student and log entry: e.g., `Camera Off`, `Multiple Faces`, `Screen Share Detected`, `High Noise`, `Disconnected`.
- Alert details pane: timestamp, evidence snapshot, automated detection confidence, recommended action, `Acknowledge` and `Create Incident` buttons.

## Data Model (roster assignment snippet)

- Each assigned-student object includes:
  - `student_id`, `student_name`, `desk_no`, `system_id`, `seat_coordinates` (optional), `video_stream_id`, `pre_exam_verified`, `on_site_verified`, `flag_count`, `last_activity`, `notes`.

## APIs (suggested)

- `GET /sessions/{session_id}/roster` — returns assigned students with desk/system mapping.
- `GET /sessions/{session_id}/grid?layout=4x6` — returns current tile metadata and live stream endpoints.
- `POST /sessions/{session_id}/students/{student_id}/flag` — add a flag with reason.
- `POST /sessions/{session_id}/students/{student_id}/message` — send an on-screen message.
- `POST /sessions/{session_id}/students/{student_id}/reassign-desk` — move student to another `desk_no` (validates capacity).

## Permissions & Roles

- `invigilator`: view roster, grid, raise flags, send messages, request assistance.
- `senior_invigilator`: same as invigilator + reassign desks, force-logouts, override flags, close incidents.

## Authentication Notes (students & staff)

- Login model: Admins and Invigilators use role-based accounts with standard username/password + 2FA. Student accounts are auto-generated on registration.
- Student credential generation: `username = reg_no`. `temporary_password = first4letters(full_name)+YYYY(dob)`. Example: `Mary Johnson`, `dob=2004-06-02` → `mary2004`.
- First-login flow: Candidate is forced to change the temporary password and validate with an OTP (email/SMS) or in-person activation during check-in.
- Security: The client and server must never display or persist temporary passwords in logs; show activation-only links or one-time codes. All auth events are audited.

## UX Notes

- Provide a compact and an expanded mode for each tile so invigilators can focus on a single student while keeping the grid visible.
- Allow keyboard shortcuts for common actions (flag, pin, next flagged).
- Ensure low-latency telemetry (heartbeat every 5s) to detect disconnects quickly.

## Accessibility

- Support high-contrast mode and scalable grid for different monitor sizes.

## Audit & Logging

- Every flag, override, desk reassign, and message must create an audit record with actor id, timestamp, and evidence (snapshot or stream id).
