# Implementation Plan - Error Handling System

## Goal
Implement error recording, UI feedback, error report viewing, and retry for blog submission failures.

## Current State
- **Backend** (`src/pages/api/blog/posts.ts`): POST handler returns error JSON responses but does **not** log failures anywhere persistent.
- **Frontend** (`src/pages/blog-submit.astro`): Catch block (line 1038) only shows `alert()` and `console.error`. No structured error storage.
- **DB Schema** (`supabase/create_blog_tables.sql`): No `submission_errors` table exists.
- **No `error.json`** file or localStorage error log exists anywhere.

---

## Phase 2: Error Recording & Real-time UI Feedback

### Approach Decision

> [!IMPORTANT]
> **Storage choice**: Use **Supabase DB** (`submission_errors` table) instead of a static `error.json` file.
> - Rationale: R2 is object storage (no append), and a flat JSON file doesn't scale. Supabase allows querying, filtering by user, and real-time updates.
> - The original plan mentions `error.json` — we'll treat this as the conceptual error log, implemented as a DB table.

### Proposed Changes

#### [NEW] `supabase/create_submission_errors_table.sql`
- Create `submission_errors` table: `id`, `user_id`, `title`, `description`, `author`, `tags`, `content_preview` (first 200 chars), `json_file_name`, `error_message`, `error_code`, `created_at`
- RLS: Users can only read/delete their own errors

#### [MODIFY] [posts.ts](file:///Users/bosong2/dev/securityreports/src/pages/api/blog/posts.ts)
- On POST failure (R2 upload fail, DB insert fail, or unhandled exception), log error details to `submission_errors` table
- Return structured error response with `errorId` for client-side tracking

#### [MODIFY] [blog-submit.astro](file:///Users/bosong2/dev/securityreports/src/pages/blog-submit.astro)
- Replace `alert()` error handling with an inline **error toast/banner** UI
- Show specific error type (auth, validation, upload, server) with different icons
- Save failed form data to `localStorage` so user doesn't lose input on refresh
- Add "이전 작성 내용 복원" (restore previous draft) prompt on page load

---

## Phase 3: Error Report Modal

#### [NEW] Error report section in `blog-submit.astro` or new page
- Fetch user's `submission_errors` from API
- Display as a list with: timestamp, title attempted, error message
- "Delete" button per entry (calls API to remove from DB)

#### [NEW] [errors.ts](file:///Users/bosong2/dev/securityreports/src/pages/api/blog/errors.ts)
- `GET /api/blog/errors` — list current user's submission errors
- `DELETE /api/blog/errors/:id` — delete a specific error entry

---

## Phase 4: Retry Mechanism

#### [MODIFY] Error report modal
- Add "Retry" button per error entry
- Pre-fill the submission form with the saved payload from the error record
- On successful retry, auto-delete the error entry

---

## Verification Plan

### Automated
- `npm run dev` → submit with invalid data → verify error appears in DB
- Submit with R2 unavailable → verify error logged and UI shows banner

### Manual
- Verify localStorage draft restore works after page refresh
- Verify error list loads in report modal
- Verify retry pre-fills form and clears error on success
