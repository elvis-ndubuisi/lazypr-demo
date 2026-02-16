# Feature Test Plan: Title Enhancement with Ghost Commit Detection

**Feature Name:** PR Title Enhancement + Ghost Commit Detection  
**Version:** v1.2.1  
**Date Created:** 2026-02-11  
**Created By:** lazypr_demo_maintainer

---

## 📋 Overview

### Purpose
This test demonstrates two features:
1. **Title Enhancement**: Automatically improves vague PR titles
2. **Ghost Commit Detection**: Flags commits where messages don't match code changes

### The Setup
- **Vague Commit Message**: "Fix stuff" (doesn't describe actual changes)
- **Actual Changes**: Complete refactoring of database connection management
- **Vague PR Title**: "Update code" (intentionally vague to test enhancement)
- **Expected Result**: Title enhanced to describe database refactoring

### Problem Demonstrated
Developers often write vague commit messages like "fix bug" or "update stuff" that don't accurately describe what was changed. This makes code review harder and git history less useful.

---

## ⚙️ Configuration

### Inputs
```yaml
- uses: elvis-ndubuisi/lazypr@v1.2.1
  with:
    api_key: ${{ secrets.GEMINI_API_KEY }}
    provider: gemini
    auto_update_title: "true"  # Enable title enhancement
```

### What Will Happen
1. lazyPR analyzes the commit message "Fix stuff"
2. lazyPR analyzes the actual code changes (database refactoring)
3. lazyPR detects mismatch (ghost commit)
4. lazyPR analyzes PR title "Update code" and finds it vague
5. lazyPR suggests enhanced title: "Refactor database connection handling"
6. If auto_update_title is true, PR title is automatically updated

---

## 🧪 Test Scenarios

### Scenario 1: Vague Title Gets Enhanced

**Objective:** Show title enhancement working

**Setup:**
1. Create branch: `git checkout -b test/title-enhancement`
2. Add code: Copy `src/features/title-enhancement/database-manager.js`
3. Commit with vague message: `git commit -m "Fix stuff"`
4. Push: `git push origin test/title-enhancement`
5. Create PR with title: **"Update code"** (intentionally vague)

**Expected Results:**
- [ ] PR title analyzed as vague
- [ ] Vagueness score calculated (e.g., 80% vague)
- [ ] Enhanced title suggested: "Refactor database connection management"
- [ ] PR title automatically updated (if auto_update_title: true)
- [ ] Original title preserved in enhanced_title output

**Verification:**
```bash
# Check the output
echo "${{ steps.lazypr.outputs.enhanced_title }}"
# Should show: "Refactor database connection management..."
```

**Status:** Ready to test

---

### Scenario 2: Ghost Commit Detection

**Objective:** Show ghost commit detection working

**Setup:**
Same as Scenario 1 - the "Fix stuff" commit with database refactoring code

**Expected Results:**
- [ ] Ghost commit detected
- [ ] has_ghost_commits output: "true"
- [ ] Reason flagged: "Commit message 'Fix stuff' doesn't mention database changes"
- [ ] Warning shown in PR summary

**Verification:**
```bash
# Check output
echo "${{ steps.lazypr.outputs.has_ghost_commits }}"
# Should show: "true"
```

**Status:** Ready to test

---

### Scenario 3: Descriptive Title (Control Test)

**Objective:** Verify descriptive titles are NOT changed

**Setup:**
1. Create branch: `git checkout -b test/descriptive-title`
2. Add code: Same database-manager.js
3. Commit with good message: `git commit -m "Refactor: Add connection pooling to database manager"`
4. Create PR with title: **"Implement database connection pooling and retry logic"**

**Expected Results:**
- [ ] Title analyzed as descriptive
- [ ] Vagueness score low (e.g., < 30%)
- [ ] enhanced_title output: "" (empty, no change needed)
- [ ] PR title NOT modified

**Status:** Ready to test

---

## 📝 PR Creation Instructions

### PR #1: Title Enhancement Demo

**Branch:** `test/title-enhancement`  
**Title:** `Update code` (Keep it vague!)  
**Description:**
```markdown
This PR updates the codebase.

Changes:
- Modified some files
- Fixed issues

Ticket: #123
```

**Commit Message:**
```
Fix stuff

Some changes to make things work better.
```

**Expected lazyPR Output:**
```
⚠️ Ghost Commit Detected:
  - abc1234: Commit message doesn't match code changes

✏️ Title Enhanced:
  Original: "Update code"
  Enhanced: "Refactor database connection management with pooling and retry logic"
```

---

### PR #2: Descriptive Title (Control)

**Branch:** `test/descriptive-title`  
**Title:** `Implement database connection pooling and retry logic`  
**Description:**
```markdown
## Changes
- Add connection pooling to DatabaseManager
- Implement retry logic with exponential backoff
- Add graceful shutdown handling
- Include health checks and monitoring

## Testing
- Connection pool tests passing
- Retry mechanism verified
- Shutdown sequence tested

Fixes: #123
```

**Commit Message:**
```
feat: Implement database connection pooling and retry logic

- Add connection pool with configurable size
- Implement automatic retry with exponential backoff
- Add connection queue for high-load scenarios
- Include graceful shutdown handling
- Add comprehensive health checks

This improves database reliability under load and prevents
connection exhaustion during traffic spikes.
```

**Expected lazyPR Output:**
```
✓ Title is descriptive (vagueness score: 15%)
No enhancement needed.
```

---

## 🎬 Demo Content

### Screenshot Opportunities
- [ ] Before: Vague PR title "Update code"
- [ ] After: Enhanced title "Refactor database connection management..."
- [ ] Ghost commit warning in PR summary
- [ ] GitHub Actions logs showing enhancement process
- [ ] Comparison side-by-side

### Video Script (2 minutes)

**Title:** "From 'Fix Stuff' to Clear Communication"

**0:00-0:30 - The Problem**
"We've all seen PRs with vague titles like 'Update code' or 'Fix bug'. As a reviewer, you have to read the entire diff just to understand what changed."

**0:30-1:00 - The Demo**
1. Show creating PR with vague title
2. Show vague commit message
3. Push and watch lazyPR run
4. Show ghost commit detection

**1:00-1:30 - The Solution**
1. Show enhanced title appearing
2. Show clear description of changes
3. Explain time saved

**1:30-2:00 - The Value**
"No more guessing. lazyPR analyzes the actual code and gives you clear, descriptive titles automatically. Your reviewers will thank you."

### Marketing Copy

**Hook:**
"Update code" - The worst PR title ever? We see it all the time.

**Solution:**
lazyPR reads your actual code changes and suggests clear, descriptive PR titles. Vague titles like "fix bug" become "Fix null pointer in authentication flow."

**Benefit:**
Reviewers know what to expect before opening a single file. Save 5-10 minutes per PR review.

**Call to Action:**
Enable it: `auto_update_title: true`

---

## 📁 Files Created

- ✅ `src/features/title-enhancement/database-manager.js` - Test code (600+ lines)
- ✅ This test plan

### Files Needed
- [ ] PR #1 created on GitHub
- [ ] PR #2 created on GitHub
- [ ] Screenshots captured
- [ ] Video recorded

---

## 🔍 Code Details

### What's in database-manager.js?

**Features:**
- Connection pooling
- Retry logic with exponential backoff
- Connection queuing
- Graceful shutdown
- Health checks
- Event-driven architecture

**Why this code:**
- Complex enough for meaningful analysis
- Demonstrates multiple patterns
- Real-world use case
- Shows refactoring benefits

**lazyPR Analysis Points:**
- Risk: HIGH (database changes)
- Patterns: Connection pooling, retry logic
- Security: Error handling, input validation
- Quality: JSDoc comments, error classes

---

## ✅ Sign-off

- [x] Test code written (database-manager.js)
- [x] Test scenarios documented
- [x] PR instructions created
- [x] Marketing content prepared
- [ ] PRs created on GitHub
- [ ] Results verified
- [ ] Screenshots captured

---

## 🔗 Related

- Main repo: /Users/elvisike/Documents/projects/open-source/lazypr/
- Test code: src/features/title-enhancement/
- Workflow: .github/workflows/lazypr.yml

**Ready to test!** Create the PRs using the instructions above.
