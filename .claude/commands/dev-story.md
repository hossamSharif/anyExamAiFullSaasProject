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

   **Important:**
   - Set the first todo as "in_progress"
   - Use clear, actionable descriptions
   - Include both "content" and "activeForm" for each todo
   - Extract all requirements from the story's bullet points

### 4. **Development Guidance**

   After creating todos, begin implementation:

   - Reference the story's specific requirements
   - Follow Arabic-first approach (if story involves UI/UX)
   - Use RTL layout principles (if story involves layout)
   - Implement all features listed in the story description
   - Mark each todo as "in_progress" before starting
   - Mark each todo as "completed" immediately after finishing

### 5. **Story Completion**

   When ALL todos are completed:

   - Verify all story requirements are met
   - Verify all checkpoints from the story are satisfied
   - **Update the plan file** using the Edit tool:
     - Find the line: `- [ ] Story $1: [story title]`
     - Replace with: `- [x] Story $1: [story title]`
   - Confirm completion to the user

### 6. **Parallel Work Awareness**

   After marking the story complete:

   - Check if other parallel tracks are now unblocked
   - Inform the user which stories can now be started
   - Example: "Story 1.3 complete! You can now start Story 1.6 (Track C)"

## Important Reminders:

- **NEVER skip dependency validation** - This prevents broken implementations
- **ALWAYS create todos** before starting implementation - This tracks progress
- **ALWAYS update the checkbox** in the plan when complete - This maintains progress tracking
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