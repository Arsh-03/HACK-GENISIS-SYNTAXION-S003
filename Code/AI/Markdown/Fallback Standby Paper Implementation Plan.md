# Fallback Standby Paper Implementation Plan

## Purpose

This document defines a practical recovery strategy for the current N.E.S.T. exam-generation system: pre-generate a sealed fallback question paper approximately 24 hours before the exam, store it safely, and serve it immediately if the T-15 minute live generation path fails.

The goal is to reduce operational risk during the final 15-minute window before launch, while still preserving the live generation path and the deterministic emergency fallback already present in the Python service.

## Problem Statement

The current system can fail in the last few minutes before exam start because of:

1. FastAPI process crash or restart during generation.
2. Redis or MongoDB connectivity issues.
3. LLM timeout, quota, or rate-limit failures.
4. Long generation latency that leaves too little time to recover.

If the only generation attempt happens at T-15 minutes, any failure in that window becomes an exam launch risk. A pre-built standby paper reduces that risk by giving the system a known-good answer path.

## Recommendation

Use a three-layer safety model:

1. Live paper generation at T-15 minutes.
2. Pre-generated standby paper at T-24 hours.
3. Deterministic algorithmic fallback if both above fail or become invalid.

The standby paper should not replace live generation. It should be a sealed emergency artifact that can be promoted only when the live path fails.

## Proposed Operational Flow

### 1. T-24 Hours: Generate Standby Paper

Run the same generation pipeline used for the live paper, but with a distinct mode flag such as `standby_mode=true`.

The output should be:

1. Fully generated and audited question set.
2. Encrypted before persistence.
3. Stored under a standby-specific Redis key.
4. Tagged with the exam version, syllabus version, and question-bank snapshot hash.

### 2. T-15 Minutes: Generate Live Paper

At the normal launch window, run the live generation flow.

If it succeeds, prefer the fresh live paper.

If it fails, immediately serve the pre-generated standby paper.

### 3. Final Safety Net

If both live and standby artifacts are unavailable or invalid, use the deterministic fallback generator already implemented in the Python service.

## Suggested Priority Order

At runtime, the paper-selection order should be:

1. Live paper cached for the current exam cycle.
2. Standby paper generated the day before.
3. Deterministic fallback paper built from the approved candidate pool.

This order keeps the freshest valid artifact first, while still guaranteeing delivery.

## Data Model Changes

Add a clear status model for paper artifacts.

### PaperArtifact Record

Suggested fields:

1. `exam_id`
2. `artifact_type` with values like `live` or `standby`
3. `status` with values like `pending`, `ready`, `invalid`, `served`
4. `question_hash`
5. `syllabus_version`
6. `question_bank_snapshot`
7. `generated_at`
8. `expires_at`
9. `encryption_version`
10. `audit_report`

### Redis Keys

Use distinct keys so standby and live artifacts do not collide.

1. `exam:{exam_id}:master` for the live paper.
2. `exam:{exam_id}:standby` for the pre-generated fallback paper.
3. `nest:checkpoint:{exam_id}:request` for recovery input data.
4. `nest:artifact:{exam_id}:meta` for artifact metadata and versioning.

## Implementation Plan

### Step 1. Add Standby Generation Mode

Extend the generation endpoint so it can run in two modes:

1. `mode=live`
2. `mode=standby`

The same internal pipeline can be reused, but the output should be written to the correct key and tagged as standby.

### Step 2. Create a Standby Scheduler

Add a scheduled job in the Node.js gateway, cron, or an external scheduler to trigger standby generation at least 24 hours before exam launch.

This job should:

1. Resolve the exam configuration.
2. Pull the latest approved question set.
3. Run the same audit and encryption flow.
4. Store the encrypted standby paper.
5. Record the artifact metadata and checksum.

### Step 3. Add Version and Invalidation Checks

The standby paper must be invalidated if any of the following change after it was created:

1. Question bank snapshot changes.
2. Syllabus or blueprint changes.
3. Subject quota changes.
4. Difficulty distribution changes.
5. Exam start time moves.
6. Security policy or encryption version changes.

If any invalidation event occurs, the standby paper must be rebuilt.

### Step 4. Add Cache-First Recovery Logic

Update the generation service so that, on startup or on failure:

1. It checks for a valid live master paper.
2. If missing, it checks for a valid standby paper.
3. If standby exists and passes metadata validation, it serves that immediately.
4. If not, it falls back to deterministic generation.

### Step 5. Surface Status in Admin UI

Expose the artifact status in the admin or invigilator dashboard:

1. Standby paper ready.
2. Standby paper stale.
3. Live generation in progress.
4. Recovery mode active.

This gives operations a quick visual confirmation before exam time.

## Suggested Endpoint Changes

### Generation Endpoint

Update the generation API so it accepts a generation mode.

Example behavior:

1. `POST /api/v1/generate-paper` for live generation.
2. `POST /api/v1/generate-paper?mode=standby` for standby generation.

### Recovery Endpoint

Add a recovery endpoint that selects the best valid artifact.

Suggested behavior:

1. Return live master paper if available.
2. Else return standby paper if valid.
3. Else regenerate deterministically.

## Suggested Service Logic

### Selection Algorithm

At request time:

1. Look up the live paper artifact.
2. Validate its hash and metadata.
3. If invalid or missing, look up the standby paper artifact.
4. Validate standby hash, version, and expiry.
5. If valid, serve standby immediately.
6. Otherwise generate deterministically.

### Pseudocode

```python
def select_paper(exam_id):
    live = load_artifact(exam_id, "live")
    if is_valid(live):
        return live

    standby = load_artifact(exam_id, "standby")
    if is_valid(standby):
        return standby

    return build_deterministic_fallback(exam_id)
```

## Security Requirements

The standby paper should be handled with the same security level as the live paper.

1. Encrypt before writing to Redis.
2. Store only ciphertext in cache.
3. Use a signed hash or checksum for integrity.
4. Keep plaintext only in RAM during generation.
5. Purge plaintext immediately after encryption.
6. Restrict access to standby artifact keys.

## Audit and Integrity Checks

Every standby paper should be auditable.

The audit record should include:

1. The generation timestamp.
2. The candidate question bank snapshot.
3. The exact paper hash.
4. The question counts per subject.
5. The balance score.
6. The validation result.
7. The reason it was promoted or not promoted.

## Operational Runbook

### Daily Standby Build

1. Scheduler triggers standby generation.
2. FastAPI loads the approved buffer.
3. LLM audit runs.
4. Final paper is encrypted.
5. Standby artifact is saved to Redis and metadata store.
6. Admin dashboard marks standby as ready.

### Pre-Exam Health Check

1. Verify live and standby artifacts exist.
2. Verify hashes and version compatibility.
3. Verify Redis availability.
4. Verify fallback generator still works.
5. Notify admin if standby is missing or stale.

### Failure Handling at T-15 Minutes

1. Attempt live generation.
2. If live generation fails, promote standby.
3. If standby is invalid, invoke deterministic fallback.
4. Log which path was used.
5. Persist the chosen path in audit records.

## Acceptance Criteria

The implementation should be considered complete when:

1. A standby paper can be generated 24 hours before exam time.
2. The standby paper can be validated and served instantly.
3. The service falls back to standby when live generation fails.
4. Stale standby papers are invalidated automatically.
5. The deterministic fallback still works if standby is unusable.
6. The admin dashboard shows the artifact state clearly.

## Risks

1. Serving stale content if invalidation is incomplete.
2. Confusion between live and standby keys if naming is not strict.
3. Extra storage and operational overhead.
4. False confidence if standby is not rebuilt after syllabus changes.

## Recommended Next Build Steps

1. Add standby artifact support in the Python FastAPI service.
2. Add scheduler support in the gateway or a background job.
3. Add Redis metadata keys and version checks.
4. Add a recovery endpoint that promotes standby automatically.
5. Add dashboard indicators for ready, stale, and promoted states.

## Conclusion

Pre-generating a fallback paper a day before the exam is a strong operational safeguard for your current system.

Used correctly, it gives you a fast, reliable recovery path without replacing the live T-15 minute generation flow or the deterministic emergency fallback.