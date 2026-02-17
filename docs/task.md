# Task Checklist

- [x] Check current project status
- [x] **Phase 2: Error Recording & UI Feedback**
  - [x] Create `supabase/create_submission_errors_table.sql`
  - [x] Modify `posts.ts` — log errors to `submission_errors` table
  - [x] Modify `blog-submit.astro` — error toast UI + localStorage draft save
  - [x] Build verification ✅
- [x] **Phase 3: Error Report Modal**
  - [x] Create `src/pages/api/blog/errors.ts` (GET/DELETE/PATCH)
  - [x] Add error report modal UI to `blog-submit.astro`
  - [x] Build verification ✅
- [x] **Phase 4: Retry Mechanism** (integrated into Phase 3 modal)
  - [x] Retry button pre-fills form from error record
- [ ] **Manual Step: Supabase에서 SQL 실행 필요**
