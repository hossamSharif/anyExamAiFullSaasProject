# Parallel Development Guide - SIMULTANEOUSLY Approach

This guide shows which stories can be developed **SIMULTANEOUSLY** in parallel Claude Code sessions using the `/dev-story` slash command.

---

## ✅ **PHASE 0 REMAINING** (Complete First - Sequential)

Before starting Phase 1, complete these in order:

```bash
/dev-story 0.6
/dev-story 0.7
```

---

## **PHASE 1: Core UI + Auth + RTL**

### 🔄 First Wave (After 0.6 & 0.7 complete)

Run these 3 stories **SIMULTANEOUSLY** in 3 different Claude Code sessions:

```bash
/dev-story 1.1
```
```bash
/dev-story 1.3
```
```bash
/dev-story 1.9
```

**Why parallel?**
- **1.1** (Tamagui Config) - Track A: UI foundation
- **1.3** (Supabase Auth) - Track B: Backend auth, independent from UI
- **1.9** (TanStack Query) - Track D: Data layer, independent from both

---

### 🔄 Second Wave (After 1.1 complete)

Run these 3 stories **SIMULTANEOUSLY**:

```bash
/dev-story 1.2
```
```bash
/dev-story 1.4
```
```bash
/dev-story 1.6
```

**Why parallel?**
- **1.2** (Base UI Components) - Track A: Needs 1.1 Tamagui
- **1.4** (Auth Screens) - Track B: Needs 1.3 Auth backend
- **1.6** (Bottom Tab Nav) - Track C: Needs 1.1 Tamagui theme

---

### 🔄 Third Wave (After 1.2 complete)

Run these 2 stories **SIMULTANEOUSLY**:

```bash
/dev-story 1.5
```
```bash
/dev-story 1.8
```

**Why parallel?**
- **1.5** (Protected Routes) - Track B: Auth complete
- **1.8** (Language Switcher) - Track D: Needs 1.2 UI components

---

### 🔄 Fourth Wave (After 1.6 complete)

Run this story alone:

```bash
/dev-story 1.7
```

**Why sequential?**
- **1.7** (Web Layout) - Track C: Needs 1.6 navigation patterns

---

## **PHASE 1.5: Monetization & Subscription**

### 🔄 First Wave

Run this story **ALONE** first:

```bash
/dev-story 1.5.1
```

**Why alone?**
- Stripe setup provides pricing info needed by other tracks

---

### 🔄 Second Wave (After 1.5.1 complete)

Run these 2 stories **SIMULTANEOUSLY**:

```bash
/dev-story 1.5.2
```
```bash
/dev-story 1.5.4
```

**Why parallel?**
- **1.5.2** (Stripe Checkout) - Track A: Backend
- **1.5.4** (Usage Tracking) - Track B: Independent UI logic

---

### 🔄 Third Wave (After 1.5.2 complete)

Run these 2 stories **SIMULTANEOUSLY**:

```bash
/dev-story 1.5.3
```
```bash
/dev-story 1.5.5
```

**Why parallel?**
- **1.5.3** (Stripe Webhooks) - Track A: Backend
- **1.5.5** (Pricing Page) - Track B: UI, needs 1.5.1 pricing

---

### 🔄 Fourth Wave (After 1.5.3 + 1.5.4 complete)

Run these 3 stories **SIMULTANEOUSLY**:

```bash
/dev-story 1.5.6
```
```bash
/dev-story 1.5.7
```
```bash
/dev-story 1.5.9
```

**Why parallel?**
- **1.5.6** (Paywall Modal) - Track C: Needs usage tracking + checkout
- **1.5.7** (Web Checkout) - Track C: Independent web flow
- **1.5.9** (Usage Widget) - Track C: Independent UI component

---

### 🔄 Fifth Wave (After 1.5.6 complete)

Run these 2 stories **SIMULTANEOUSLY**:

```bash
/dev-story 1.5.8
```
```bash
/dev-story 1.5.10
```

**Why parallel?**
- **1.5.8** (Deep Link Handler) - Track C: After paywall exists
- **1.5.10** (Subscription Screen) - Track C: Independent management UI

---

## **PHASE 2: Arabic Curated Content Pathway**

### 🔄 First Wave

Run this story **ALONE** first:

```bash
/dev-story 2.1
```

**Why alone?**
- Content ingestion must complete Day 1 before UI can start

---

### 🔄 Second Wave (After 2.1 Day 1 complete - ~2.5 days in)

Run these 2 stories **SIMULTANEOUSLY**:

```bash
/dev-story 2.2
```
```bash
/dev-story 2.4
```

**Why parallel?**
- **2.2** (Embedding Generation) - Track A: Backend processing
- **2.4** (Category Browser) - Track B: UI needs content exists from 2.1

---

### 🔄 Third Wave (After 2.2 + 2.4 complete)

Run these 3 stories **SIMULTANEOUSLY**:

```bash
/dev-story 2.3
```
```bash
/dev-story 2.5
```
```bash
/dev-story 2.6
```

**Why parallel?**
- **2.3** (Vector Search) - Track A: Backend search
- **2.5** (Subject Detail) - Track B: UI screen
- **2.6** (Topic Refinement) - Track B: UI component

---

### 🔄 Fourth Wave (After 2.3 complete)

Run these 2 stories **SIMULTANEOUSLY**:

```bash
/dev-story 2.7
```
```bash
/dev-story 2.8
```

**Why parallel?**
- **2.7** (Search & Filter) - Track B: UI
- **2.8** (Exam Configuration) - Track C: Independent UI

---

### 🔄 Fifth Wave (After 2.8 complete)

Run these 2 stories **SIMULTANEOUSLY**:

```bash
/dev-story 2.9
```
```bash
/dev-story 2.10
```

**Why parallel?**
- **2.9** (Exam Generation Function) - Track C: Backend
- **2.10** (Real-Time Progress) - Track C: UI (can develop alongside)

---

## **PHASE 3: Document Upload Pathway**

### 🔄 First Wave

Run these 2 stories **SIMULTANEOUSLY**:

```bash
/dev-story 3.1
```
```bash
/dev-story 3.4
```

**Why parallel?**
- **3.1** (Mobile File Picker) - Track A: Upload UI
- **3.4** (Document Parser) - Track B: Backend processing

---

### 🔄 Second Wave (After 3.1 complete)

Run these 2 stories **SIMULTANEOUSLY**:

```bash
/dev-story 3.2
```
```bash
/dev-story 3.5
```

**Why parallel?**
- **3.2** (Web Drag-Drop) - Track A: Web upload UI
- **3.5** (Document Embedding) - Track B: Backend

---

### 🔄 Third Wave (After 3.2 + 3.4 complete)

Run these 2 stories **SIMULTANEOUSLY**:

```bash
/dev-story 3.3
```
```bash
/dev-story 3.6
```

**Why parallel?**
- **3.3** (Upload to Storage) - Track A: Upload logic
- **3.6** (Processing Status) - Track B: Status UI

---

### 🔄 Fourth Wave (After 3.5 complete)

Run this story **ALONE**:

```bash
/dev-story 3.7
```

**Why alone?**
- **3.7** (Web Link Scraper) - Track B: Can go solo or wait

---

### 🔄 Fifth Wave (After 3.3 + 3.6 complete)

Run these 2 stories **SIMULTANEOUSLY**:

```bash
/dev-story 3.8
```
```bash
/dev-story 3.9
```

**Why parallel?**
- **3.8** (Document Library) - Track C: List UI
- **3.9** (Document Preview) - Track C: Detail UI

---

### 🔄 Sixth Wave (After 3.8 + 3.9 complete)

Run this story **ALONE**:

```bash
/dev-story 3.10
```

**Why alone?**
- **3.10** (Upload-Based Exam) - Reuses existing logic

---

## **PHASE 4: Interactive Exam Experience**

### 🔄 First Wave

Run this story **ALONE** first:

```bash
/dev-story 4.1
```

**Why alone?**
- Quick 0.5d story, provides foundation for parallel work

---

### 🔄 Second Wave (After 4.1 complete)

Run these 3 stories **SIMULTANEOUSLY**:

```bash
/dev-story 4.2
```
```bash
/dev-story 4.6
```
```bash
/dev-story 4.13
```

**Why parallel?**
- **4.2** (Question Display) - Track A: Core exam UI
- **4.6** (Exam Submission) - Track B: Independent submission logic
- **4.13** (Exam History) - Track D: Independent history UI

---

### 🔄 Third Wave (After 4.2 complete)

Run these 2 stories **SIMULTANEOUSLY**:

```bash
/dev-story 4.3
```
```bash
/dev-story 4.4
```

**Why parallel?**
- **4.3** (RTL Swipe Nav) - Track A: Navigation
- **4.4** (Question List) - Track A: Navigation UI

---

### 🔄 Fourth Wave (After 4.3 + 4.4 complete)

Run these 2 stories **SIMULTANEOUSLY**:

```bash
/dev-story 4.5
```
```bash
/dev-story 4.7
```

**Why parallel?**
- **4.5** (Answer Auto-Save) - Track A: Quick feature
- **4.7** (Scoring Function) - Track B: Backend scoring

---

### 🔄 Fifth Wave (After 4.7 complete)

Run these 2 stories **SIMULTANEOUSLY**:

```bash
/dev-story 4.8
```
```bash
/dev-story 4.9
```

**Why parallel?**
- **4.8** (Immediate Feedback) - Track B: Quick UI
- **4.9** (Score Reveal) - Track C: Animation UI

---

### 🔄 Sixth Wave (After 4.9 complete)

Run these 2 stories **SIMULTANEOUSLY**:

```bash
/dev-story 4.10
```
```bash
/dev-story 4.14
```

**Why parallel?**
- **4.10** (Performance Breakdown) - Track C: Results UI
- **4.14** (Progress Tracking) - Track D: Charts UI

---

### 🔄 Seventh Wave (After 4.10 complete)

Run these 2 stories **SIMULTANEOUSLY**:

```bash
/dev-story 4.11
```
```bash
/dev-story 4.15
```

**Why parallel?**
- **4.11** (Question Review) - Track C: Review UI
- **4.15** (Exam Retry) - Track D: Retry logic

---

### 🔄 Eighth Wave (After 4.11 complete)

Run this story **ALONE**:

```bash
/dev-story 4.12
```

**Why alone?**
- **4.12** (Results Export) - Final piece

---

### 🔄 Ninth Wave (After ALL Track A-D complete)

Run this story **ALONE** - **MUST complete before deployment**:

```bash
/dev-story 4.16
```

**Why alone?**
- **4.16** (Responsive & Accessible) - Final QA across all features

---

## **PHASE 5: Deployment** (Mostly Sequential)

Phase 5 stories are mostly sequential. Follow the order in the plan:

```bash
/dev-story 5.1
/dev-story 5.2
/dev-story 5.3
/dev-story 5.4
/dev-story 5.5
/dev-story 5.6
/dev-story 5.7
/dev-story 5.8
/dev-story 5.9
```

Only minor parallelization possible in Phase 5.

---

## 🎯 Quick Start Commands by Phase

### Phase 1 - Session 1:
```bash
/dev-story 1.1, /dev-story 1.3, /dev-story 1.9
```

### Phase 1 - Session 2 (after 1.1 done):
```bash
/dev-story 1.2, /dev-story 1.4, /dev-story 1.6
```

### Phase 1.5 - Session 1:
```bash
/dev-story 1.5.1
```

### Phase 1.5 - Session 2 (after 1.5.1 done):
```bash
/dev-story 1.5.2, /dev-story 1.5.4
```

### Phase 2 - Session 1:
```bash
/dev-story 2.1
```

### Phase 2 - Session 2 (after 2.1 Day 1):
```bash
/dev-story 2.2, /dev-story 2.4
```

### Phase 3 - Session 1:
```bash
/dev-story 3.1, /dev-story 3.4
```

### Phase 4 - Session 1:
```bash
/dev-story 4.1
```

### Phase 4 - Session 2 (after 4.1 done):
```bash
/dev-story 4.2, /dev-story 4.6, /dev-story 4.13
```

---

## 📋 Rules for SIMULTANEOUSLY Development

1. **Check dependencies first** - A story can only start if its dependencies are complete
2. **Maximum parallelization** - Run as many independent stories as possible
3. **Track independence** - Different tracks (A, B, C, D) can usually run in parallel
4. **Git branches** - Use separate branches for each parallel story
5. **Context switching** - Morning = thinking-heavy, Afternoon = implementation-heavy

---

## 🚀 Current Status Checkpoint

**Phase 0:**
- ✅ 0.1-0.5 Complete
- ⏳ 0.6, 0.7 Remaining

**Next Action:**
```bash
/dev-story 0.6
```
Then:
```bash
/dev-story 0.7
```

**After Phase 0 Complete, Launch 3 Parallel Sessions:**
```bash
/dev-story 1.1, /dev-story 1.3, /dev-story 1.9
```