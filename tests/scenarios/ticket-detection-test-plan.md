# Feature Test Plan: Ticket Detection

**Feature Name:** JIRA/Ticket Detection  
**Version Added:** v1.2.0  
**Date Created:** 2026-02-11  
**Created By:** lazypr_demo_content_creator agent

---

## 📋 Overview

### Purpose
Automatically detect and link JIRA, GitHub, and Linear tickets from PR titles, bodies, and commit messages.

### Problem Solved
Reviewers waste time hunting for ticket context in PRs. Tickets are buried in commit messages or scattered across tools, forcing context switching.

### Key Benefits
1. Zero context switching - tickets linked automatically
2. Multi-source detection - scans title, body, and commits
3. Deduplication - shows each ticket only once
4. Flexible patterns - works with any project management tool

---

## ⚙️ Configuration

### Inputs
| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `ticket_pattern` | No | `[A-Z]+-\d+` | Regex for ticket detection |
| `ticket_url_template` | No | - | URL template with {{id}} placeholder |

### Outputs
| Output | Description |
|--------|-------------|
| `related_tickets` | Markdown list of detected tickets |

### Configuration Example
```yaml
- uses: elvis-ndubuisi/lazypr@v1.2.1
  with:
    api_key: ${{ secrets.GEMINI_API_KEY }}
    provider: gemini
    ticket_pattern: "[A-Z]+-\\d+"
    ticket_url_template: "https://github.com/${{ github.repository }}/issues/{{id}}"
```

---

## 🧪 Test Scenarios

### Scenario 1: Basic Ticket Detection (Happy Path)

**Objective:** Test detection of tickets in PR title

**Setup:**
- [ ] Create PR with title: `Fix authentication bug AUTH-123`
- [ ] Include some code changes
- [ ] Enable ticket detection in workflow

**Test Code:**
Create file: `src/features/ticket-detection/basic.js`
```javascript
/**
 * Ticket Detection - Basic Test
 * Expected: AUTH-123 detected and linked
 */

class AuthManager {
  // Authentication logic that would be in AUTH-123
  authenticate(credentials) {
    // Implementation here
    return { success: true };
  }
}

module.exports = { AuthManager };
```

**Expected Results:**
- [ ] Ticket AUTH-123 detected from title
- [ ] Linked to: `https://github.com/[repo]/issues/AUTH-123`
- [ ] Displayed in related_tickets output

**Verification:**
```bash
echo "${{ steps.lazypr.outputs.related_tickets }}"
# Should show: - [AUTH-123](https://...)
```

**Status:** ⏳ Not Tested

---

### Scenario 2: Multi-Source Detection

**Objective:** Test detection from multiple sources (title, body, commits)

**Setup:**
- [ ] PR Title: `Update user management PROJ-100`
- [ ] PR Body: `This addresses #456 and fixes TICKET-789`
- [ ] Commit message: `git commit -m "ENG-555: Refactor validation"`

**Test Code:**
Create file: `src/features/ticket-detection/multi-source.js`
```javascript
/**
 * Ticket Detection - Multi-Source Test
 * Expected: PROJ-100, #456, TICKET-789, ENG-555 all detected
 */

// PROJ-100: Update user management
class UserManager {
  createUser(data) {
    // Validation (#456)
    if (!data.email) throw new Error('Email required');
    
    // Refactored validation (ENG-555)
    return this.validateAndSave(data);
  }
  
  // TICKET-789: Fix validation bug
  validateAndSave(data) {
    // Fixed validation logic
    return { id: 1, ...data };
  }
}

module.exports = { UserManager };
```

**Expected Results:**
- [ ] PROJ-100 detected from title
- [ ] #456 detected from body
- [ ] TICKET-789 detected from body
- [ ] ENG-555 detected from commits
- [ ] All shown in markdown list
- [ ] No duplicates

**Status:** ⏳ Not Tested

---

### Scenario 3: Custom Pattern

**Objective:** Test custom regex pattern for different ticket formats

**Setup:**
- [ ] Custom pattern: `MYPROJECT-[0-9]{4}`
- [ ] PR Title: `Fix login MYPROJECT-1234`

**Test Code:**
Create file: `src/features/ticket-detection/custom-pattern.js`
```javascript
/**
 * Ticket Detection - Custom Pattern Test
 * Expected: MYPROJECT-1234 detected with custom pattern
 */

// MYPROJECT-1234: Fix login functionality
function fixLogin() {
  // Login fix implementation
  return true;
}

module.exports = { fixLogin };
```

**Expected Results:**
- [ ] MYPROJECT-1234 detected
- [ ] Custom pattern worked correctly
- [ ] Standard patterns still work

**Status:** ⏳ Not Tested

---

### Scenario 4: No Tickets Found

**Objective:** Test behavior when no tickets are present

**Setup:**
- [ ] PR Title: `Update documentation` (no ticket reference)
- [ ] No ticket references in body or commits

**Expected Results:**
- [ ] related_tickets output is empty
- [ ] No errors generated
- [ ] Summary still generated normally

**Status:** ⏳ Not Tested

---

## 📁 Test Artifacts

### Files Created
- [ ] `src/features/ticket-detection/basic.js` - Basic detection test
- [ ] `src/features/ticket-detection/multi-source.js` - Multi-source test
- [ ] `src/features/ticket-detection/custom-pattern.js` - Custom pattern test
- [ ] `src/features/ticket-detection/README.md` - Usage instructions

### PRs Created for Testing
1. **PR #1:** [To be created] - Basic detection
2. **PR #2:** [To be created] - Multi-source detection
3. **PR #3:** [To be created] - Custom pattern

---

## 📊 Test Results Summary

| Scenario | Status | Notes |
|----------|--------|-------|
| Basic Detection | ⏳ | Awaiting PR creation |
| Multi-Source | ⏳ | Awaiting PR creation |
| Custom Pattern | ⏳ | Awaiting PR creation |
| No Tickets | ⏳ | Awaiting PR creation |

**Overall Status:** ⏳ In Progress

---

## 🎬 Demo Content

### Screenshots to Capture
- [ ] PR with ticket in title showing detected ticket
- [ ] PR with multiple tickets showing full list
- [ ] Template output showing {{relatedTickets}} placeholder

### Video Script
**Title:** "Stop Hunting for Ticket Context"

**Script:**
```
0:00-0:30: "Ever opened a PR and wondered what ticket it's for?"
0:30-1:00: Show PR with ticket reference, lazyPR config
1:00-1:30: Show detected tickets in PR summary
1:30-2:00: "No more hunting, tickets linked automatically"
```

### Marketing Copy

**Hook:**
Ever opened a PR and wondered "what ticket is this even for?" Then spent 10 minutes hunting through JIRA?

**Solution:**
lazyPR automatically detects tickets from PR titles, commits, and descriptions - no more detective work.

**Benefit:**
Context without the context switching. Tickets linked automatically.

**Call to Action:**
Try it: `uses: elvis-ndubuisi/lazypr@v1.2.1`

---

## 🐛 Known Issues

None currently identified.

---

## 📝 Notes and Observations

- Pattern matching is case-sensitive for JIRA style (PROJ-123 works, proj-123 doesn't)
- URL template must include {{id}} placeholder
- Works best with consistent ticket naming conventions

---

## ✅ Sign-off

- [ ] All test scenarios documented
- [ ] Test code written and working
- [ ] Demo content created
- [ ] Marketing copy approved
- [ ] Documentation updated
- [ ] Feature added to FEATURES.md catalog
- [ ] Changes committed to demo repo

**Tested By:** [Pending]  
**Date Completed:** [Pending]  
**Approved For Release:** Pending

---

## 🔗 Related Links

- Feature Documentation: `/projects/lazypr/docs/ticket-detection`
- Demo Video: [To be recorded]
- Example PR: [To be created]
- Marketing Post: [To be created]
