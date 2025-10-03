---
description: Start development on a specific story with dependency validation and progress tracking
argument-hint: <story_id> (e.g., 1.3, 2.8, 0.1)
---

# Development Story Command

You are about to start development on **Story $1** from the anyExamAi development plan.

## Your Task:

### 1. **Read and Validate Dependencies**
   - Read the file `@anyexamai_dev_plan.md`
   - Locate Story $1 in the plan
   - Extract the story details, requirements, and checkpoints

### 2. **Dependency Validation (CRITICAL - MUST CHECK BEFORE PROCEEDING)**

   **Phase Dependencies:**
   - If Story $1 is in Phase 1, verify ALL Phase 0 stories are checked: `- [x]`
   - If Story $1 is in Phase 1.5, verify ALL Phase 1 stories are checked: `- [x]`
   - If Story $1 is in Phase 2, verify ALL Phase 1.5 stories are checked: `- [x]`
   - If Story $1 is in Phase 3, verify ALL Phase 2 stories are checked: `- [x]`
   - If Story $1 is in Phase 4, verify ALL Phase 3 stories are checked: `- [x]`
   - If Story $1 is in Phase 5, verify ALL Phase 4 stories are checked: `- [x]`

   **Track Dependencies:**
   - Check the "Dependencies:" line for the track containing Story $1
   - Verify all dependency stories are marked complete: `- [x]`
   - Example: If Track C says "Dependencies: 2.3", verify Story 2.3 shows `- [x]`

   **Sequential Story Dependencies:**
   - Check all previous stories in the same track are complete
   - Example: Story 1.3 requires Story 1.1 and 1.2 in the same track to be `- [x]`

   **🚫 IF ANY DEPENDENCY FAILS:**
   - **DO NOT PROCEED** with development
   - Display a clear error message listing:
     - Which dependencies are missing
     - Which stories need to be completed first
     - The correct order to complete stories
   - Stop execution immediately

### 3. **Create Structured Todo List**

   If all dependencies pass, use the TodoWrite tool to create a comprehensive todo list:

   - [ ] Story $1: [Extract story title from plan] (in_progress)
   - [ ] Implement [requirement 1 from story description]
   - [ ] Implement [requirement 2 from story description]
   - [ ] Implement [requirement 3 from story description]
   - [ ] [Add all bullet points from the story as separate todos]
   - [ ] Verify all checkpoints met
   - [ ] Mark story complete in plan
   - [ ] Commit changes with professional message
   - [ ] Push changes to GitHub

   **Important:**
   - Set the first todo as "in_progress"
   - Use clear, actionable descriptions
   - Include both "content" and "activeForm" for each todo
   - Extract all requirements from the story's bullet points
   - Always include Git commit and push as final todos

### 4. **Supabase Integration Detection & Tool Enforcement**

   **CRITICAL: Analyze story requirements for database/backend needs**

   Before implementation, check if Story $1 involves ANY of:
   - Database schema changes (tables, columns, indexes, constraints)
   - Database migrations or DDL operations
   - Authentication/user management
   - Row Level Security (RLS) policies
   - Database queries or data operations
   - Edge Functions deployment
   - Storage configuration
   - Real-time subscriptions
   - Branch/environment management

   **🔧 IF SUPABASE WORK IS REQUIRED:**

   **PREFERRED: Use Supabase MCP Tools (if available)**

   **Schema & Migration Tools:**
   - `mcp__supabase__list_tables` - List tables before making changes
   - `mcp__supabase__apply_migration` - Apply DDL migrations (CREATE, ALTER, DROP)
   - `mcp__supabase__execute_sql` - Execute DML queries (INSERT, UPDATE, DELETE, SELECT)
   - `mcp__supabase__list_migrations` - View migration history
   - `mcp__supabase__list_extensions` - Check installed extensions (pgvector, etc.)

   **Development & Testing Tools:**
   - `mcp__supabase__create_branch` - Create dev branch for testing
   - `mcp__supabase__list_branches` - Check branch status
   - `mcp__supabase__reset_branch` - Reset branch to test migrations
   - `mcp__supabase__merge_branch` - Merge tested changes to production
   - `mcp__supabase__delete_branch` - Clean up dev branches
   - `mcp__supabase__rebase_branch` - Handle migration drift

   **Edge Functions Tools:**
   - `mcp__supabase__list_edge_functions` - List existing functions
   - `mcp__supabase__get_edge_function` - Read function code
   - `mcp__supabase__deploy_edge_function` - Deploy new/updated functions

   **TypeScript & Config Tools:**
   - `mcp__supabase__generate_typescript_types` - Generate types after schema changes
   - `mcp__supabase__get_project_url` - Get API endpoint
   - `mcp__supabase__get_anon_key` - Get public API key

   **Monitoring & Security Tools:**
   - `mcp__supabase__get_logs` - Debug issues (api/postgres/auth/storage/realtime)
   - `mcp__supabase__get_advisors` - Check security/performance issues (RLS, indexes)
   - `mcp__supabase__search_docs` - Search Supabase documentation

   **⚠️ MANDATORY WORKFLOW (When MCP Tools Available):**

   1. **ALWAYS use `create_branch`** before schema changes (unless in Phase 0 initial setup)
   2. **Test migrations on branch** using `apply_migration` and `execute_sql`
   3. **Run `get_advisors`** to check for security issues (missing RLS policies!)
   4. **Generate TypeScript types** with `generate_typescript_types`
   5. **Verify with `get_logs`** if issues occur
   6. **Merge to production** with `merge_branch` when validated
   7. **NEVER hardcode** project URLs or keys - use `get_project_url` and `get_anon_key`

   **FALLBACK: If MCP Tools Not Available**

   Use Supabase CLI commands via Bash tool:
   - `npx supabase db diff -f [migration_name]` - Generate migration from changes
   - `npx supabase db push` - Push migrations to remote
   - `npx supabase db reset` - Reset local database
   - `npx supabase gen types typescript` - Generate TypeScript types
   - `npx supabase functions deploy [function_name]` - Deploy edge function
   - Create SQL migration files in `supabase/migrations/` directory
   - Always test locally before pushing to production

   **🚫 DO NOT:**
   - Make schema changes directly in production without testing
   - Skip security checks after RLS/policy changes
   - Forget to regenerate TypeScript types after schema changes
   - Commit migration files without testing them first

### 5. **Development Guidance**

   After creating todos and checking Supabase requirements, begin implementation:

   - Reference the story's specific requirements
   - Follow Arabic-first approach (if story involves UI/UX)
   - Use RTL layout principles (if story involves layout)
   - **Use Supabase MCP tools** (never manual SQL) if database work is needed
   - Implement all features listed in the story description
   - Mark each todo as "in_progress" before starting
   - Mark each todo as "completed" immediately after finishing

### 6. **Story Completion & Plan Update**

   When ALL todos are completed:

   - Verify all story requirements are met
   - Verify all checkpoints from the story are satisfied
   - **Update the plan file** using the Edit tool:
     - Find the line: `- [ ] Story $1: [story title]`
     - Replace with: `- [x] Story $1: [story title]`
   - Confirm completion to the user

### 7. **Professional Git Commit & Push Workflow**

   **MANDATORY: After completing the story, commit and push changes professionally**

   **Step 1: Review Changes**
   - Run `git status` and `git diff` to see all changes
   - Run `git log --oneline -5` to review commit message style

   **Step 2: Stage & Commit**
   - Add relevant files with `git add`
   - Create a professional commit message following this format:

   ```
   feat(story-$1): [Brief description of what was implemented]

   - [Key change 1]
   - [Key change 2]
   - [Key change 3]

   Implements Story $1: [Story Title]
   Phase [X]: [Phase Name]

   🤖 Generated with Claude Code
   Co-Authored-By: Claude <noreply@anthropic.com>
   ```

   **Commit Message Guidelines:**
   - Use conventional commit prefixes:
     - `feat(story-X.X):` for new features
     - `fix(story-X.X):` for bug fixes
     - `refactor(story-X.X):` for code refactoring
     - `chore(story-X.X):` for maintenance tasks
     - `db(story-X.X):` for database/schema changes
   - Keep first line under 72 characters
   - Include story reference and phase info
   - List key implementation points in bullet format
   - Always include Claude Code attribution

   **Step 3: Push to GitHub**
   - Push changes to the current branch: `git push origin [current-branch]`
   - If pushing to main, ensure all tests pass first
   - Verify push succeeded with git status

   **Example Commit Messages:**

   ```bash
   # For database schema story
   git commit -m "$(cat <<'EOF'
   db(story-0.3): Implement PostgreSQL schema with Arabic support

   - Created users, exams, questions, and attempts tables
   - Added pgvector extension for embeddings
   - Configured text columns for Arabic (UTF-8)
   - Set up RLS policies for data security
   - Added indexes for performance optimization

   Implements Story 0.3: PostgreSQL Schema + pgvector
   Phase 0: Foundation + i18n Infrastructure

   🤖 Generated with Claude Code
   Co-Authored-By: Claude <noreply@anthropic.com>
   EOF
   )"

   # For UI component story
   git commit -m "$(cat <<'EOF'
   feat(story-1.2): Build RTL-aware base UI components library

   - Implemented Button with Arabic variants
   - Created Input with RTL text support
   - Added Card and Text components
   - Configured XStack/YStack with RTL spacing
   - Tested all components with Arabic content

   Implements Story 1.2: Base UI Components Library
   Phase 1: Core UI + Auth + RTL

   🤖 Generated with Claude Code
   Co-Authored-By: Claude <noreply@anthropic.com>
   EOF
   )"

   # For authentication story
   git commit -m "$(cat <<'EOF'
   feat(story-1.3): Integrate Supabase authentication with Arabic support

   - Initialized Supabase client in packages/api
   - Implemented auth methods (signUp, signIn, signOut)
   - Added session management with secure storage
   - Configured OAuth providers (Google, Apple)
   - Set preferredLanguage storage on signup

   Implements Story 1.3: Supabase Auth Integration
   Phase 1: Core UI + Auth + RTL

   🤖 Generated with Claude Code
   Co-Authored-By: Claude <noreply@anthropic.com>
   EOF
   )"
   ```

   **Step 4: Verify & Report**
   - Confirm push with: `git log origin/[branch] -1`
   - Report commit SHA and branch to user
   - Provide GitHub commit URL if available

   **🚫 DO NOT:**
   - Commit without a meaningful message
   - Skip the story reference in commit message
   - Push without verifying changes first
   - Use `--no-verify` flag unless explicitly requested
   - Force push to main/master branches

### 8. **Parallel Work Awareness**

   After completing the Git workflow:

   - Check if other parallel tracks are now unblocked
   - Inform the user which stories can now be started
   - Example: "Story 1.3 complete and pushed! You can now start Story 1.6 (Track C)"

## Important Reminders:

- **NEVER skip dependency validation** - This prevents broken implementations
- **ALWAYS create todos** before starting implementation - This tracks progress
- **PREFER Supabase MCP tools** for database/backend work - Fall back to CLI if unavailable
- **ALWAYS run security checks** after RLS/schema changes - Prevents vulnerabilities
- **ALWAYS commit and push** after story completion - Maintains version control
- **ALWAYS update the checkbox** in the plan when complete - Tracks progress
- **FAIL FAST** if dependencies are missing - Don't attempt to work around them

## Example Error Message (if dependencies fail):

```
❌ Cannot start Story 2.8 - Missing dependencies:

Required Phase:
- Phase 1.5 must be complete (currently 3/10 stories done)

Required Stories:
- [ ] Story 2.3: Vector Similarity Search (Track A Day 4)
- [ ] Story 1.5.4: Usage Tracking System

Please complete these stories first:
1. /dev-story 1.5.4
2. /dev-story 2.3
3. /dev-story 2.8 (this story)
```

## Example Success Flow:

```
✅ All dependencies validated!

Story 2.8: Exam Configuration Arabic (1.5d)
Phase: 2 - Arabic Curated Content Pathway
Track: C - Arabic Exam Generation
Dependencies: ✅ Story 2.3 complete, ✅ Story 1.5.4 complete

Creating implementation todos...
[Agent creates structured todo list and begins development]
```

---

**Now execute the above instructions for Story $1**