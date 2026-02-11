# LazyPR Feature Catalog

**Current Version:** v1.2.1

This document catalogs all lazyPR features and how to test them in the demo repository.

---

## 🎯 Core Features (Always Active)

### AI-Powered Summaries
- **Description:** Generates intelligent PR summaries from code diffs
- **Test:** Any PR with code changes
- **Outputs:** `summary`, `risk_level`, `impact_score`

### Ghost Commit Detection
- **Description:** Flags commits where messages don't match code changes
- **Test:** Create commit with misleading message
- **Outputs:** `has_ghost_commits`

### Impact Scoring
- **Description:** Assigns risk scores (0-100) based on file sensitivity
- **Test:** Modify auth/database files
- **Outputs:** `risk_level`, `impact_score`

---

## ✨ Batch 1 Features (v1.2.0+)

### 1. Ticket Detection
**Input:** `ticket_pattern`, `ticket_url_template`  
**Output:** `related_tickets`  
**Test Location:** `src/features/ticket-detection/`  

**How to Test:**
1. Create PR with title: `Fix bug PROJ-123`
2. Include ticket in commit: `git commit -m "PROJ-456: Update logic"`
3. Reference in PR body: `This fixes #789`

**Expected Output:**
```markdown
### 🎫 Related Tickets
- [PROJ-123](https://...) (Jira)
- [#789](https://...) (GitHub)
```

---

### 2. Title Enhancement
**Input:** `auto_update_title: true`  
**Output:** `enhanced_title`  
**Test Location:** `src/features/title-enhancement/`  

**How to Test:**
1. Create PR with vague title: `Fix bug` or `Update stuff`
2. Make meaningful code changes
3. Enable `auto_update_title`

**Expected Output:**
```
Original: "Fix bug"
Enhanced: "Fix null pointer exception in user authentication"
```

---

### 3. PR Size Detection
**Input:** `pr_size_warning`, `pr_size_block`  
**Outputs:** `pr_size_lines`, `pr_size_warning_triggered`, `pr_size_blocked`  
**Test Location:** `src/features/pr-size-detection/`  

**How to Test:**
1. Small PR: < 500 lines (no warning)
2. Medium PR: 500-1999 lines (warning)
3. Large PR: > 2000 lines (blocked)

**Expected Output:**
```
⚠️ PR Size Warning: 850 lines changed (exceeds 500 line threshold by 70%)
```

---

### 4. Custom Placeholders
**Input:** `custom_placeholders`  
**Output:** `custom_placeholders_applied`  
**Test Location:** `src/features/custom-placeholders/`  

**How to Test:**
```yaml
custom_placeholders: |
  {
    "{{securityReview}}": "Auth changes reviewed",
    "{{testCoverage}}": "Unit tests added"
  }
```

**Expected Output:**
Template placeholders substituted with your values

---

## 🧪 Feature Testing Quick Reference

### Testing a New Feature

1. **Read the feature guide:** `FEATURE_TESTING_GUIDE.md`
2. **Create test plan:** `tests/scenarios/[feature]-test-plan.md`
3. **Write test code:** `src/features/[feature]/`
4. **Update workflow:** `.github/workflows/lazypr.yml`
5. **Test in PR:** Create PR with specific scenario
6. **Document results:** Update this file

### Feature Test Template

```markdown
## Feature: [Name]

**Status:** [Implemented/Testing/Released]
**Version:** [vX.Y.Z]
**Last Tested:** [Date]

### Quick Test
\`\`\`bash
# Test command or scenario
\`\`\`

### Expected Results
- [ ] Output 1
- [ ] Output 2
- [ ] Output 3

### Demo Video
[Link to video]

### Known Issues
- Issue 1: [Description]
- Issue 2: [Description]
```

---

## 📝 Template Placeholders Reference

### Core Placeholders
- `{{diff}}` - PR diff content
- `{{filesChanged}}` - List of modified files
- `{{prTitle}}` - PR title
- `{{prAuthor}}` - PR author
- `{{prBody}}` - PR description

### Risk Placeholders
- `{{riskLevel}}` - LOW/MEDIUM/HIGH
- `{{riskScore}}` - 0-100
- `{{highRiskFiles}}` - High-risk file list
- `{{fileBreakdown}}` - File analysis

### Batch 1 Placeholders
- `{{relatedTickets}}` - Detected tickets markdown
- `{{prSizeLines}}` - Total lines changed
- `{{prSizeFiles}}` - Files changed count
- `{{prSizeAdditions}}` - Lines added
- `{{prSizeDeletions}}` - Lines deleted
- `{{prSizeMetrics}}` - Full metrics
- `{{enhancedTitle}}` - Improved title (if changed)
- `{{customPlaceholdersApplied}}` - Count of substitutions

---

## 🎬 Demo Scenarios

### Scenario 1: The Vague PR
**Purpose:** Test title enhancement  
**Setup:**
- Title: `Fix stuff`
- Changes: Meaningful auth fixes
- Expected: Title updated to something descriptive

### Scenario 2: The Ticket Hunt
**Purpose:** Test ticket detection  
**Setup:**
- Title: `Implement feature TICKET-123`
- Commit: `TICKET-456: Update logic`
- Expected: Both tickets linked automatically

### Scenario 3: The Monster PR
**Purpose:** Test size detection  
**Setup:**
- Changes: 600+ lines
- Expected: Warning displayed

### Scenario 4: The Security Fix
**Purpose:** Test risk scoring  
**Setup:**
- Changes: Authentication logic
- Expected: HIGH risk label

### Scenario 5: The Team Workflow
**Purpose:** Test custom placeholders  
**Setup:**
- Placeholders: Security review notes
- Expected: Custom sections in summary

---

## 🔧 Configuration Examples

### Basic Setup
```yaml
- uses: elvis-ndubuisi/lazypr@v1.2.1
  with:
    api_key: ${{ secrets.GEMINI_API_KEY }}
    provider: gemini
```

### Full Feature Set
```yaml
- uses: elvis-ndubuisi/lazypr@v1.2.1
  with:
    api_key: ${{ secrets.GEMINI_API_KEY }}
    provider: gemini
    # Ticket Detection
    ticket_pattern: "[A-Z]+-\\d+"
    ticket_url_template: "https://github.com/${{ github.repository }}/issues/{{id}}"
    # Title Enhancement
    auto_update_title: true
    # PR Size Detection
    pr_size_warning: "500"
    pr_size_block: "2000"
    # Custom Placeholders
    custom_placeholders: |
      {
        "{{securityReview}}": "Auth changes reviewed",
        "{{testCoverage}}": "Unit tests added"
      }
```

---

## 📊 Feature Status Matrix

| Feature | Status | Tested | Documented | Demo Video |
|---------|--------|--------|------------|------------|
| AI Summaries | ✅ Stable | ✅ | ✅ | ⏳ |
| Ghost Detection | ✅ Stable | ✅ | ✅ | ⏳ |
| Impact Scoring | ✅ Stable | ✅ | ✅ | ⏳ |
| Ticket Detection | ✅ Released | ✅ | ✅ | ⏳ |
| Title Enhancement | ✅ Released | ✅ | ✅ | ⏳ |
| PR Size Detection | ✅ Released | ✅ | ✅ | ⏳ |
| Custom Placeholders | ✅ Released | ✅ | ✅ | ⏳ |

**Legend:**
- ✅ Complete
- ⏳ In Progress
- ❌ Not Started
- 🔄 Needs Update

---

## 🚀 Adding Features to This Catalog

When adding a new feature:

1. Add to the appropriate section above
2. Create test location in `src/features/[name]/`
3. Add test plan in `tests/scenarios/`
4. Update this file with:
   - Feature description
   - Inputs/outputs
   - How to test
   - Expected results
5. Update the status matrix
6. Commit: `docs: Add [feature] to catalog`

---

## 📚 Related Documents

- **Setup Guide:** `SETUP_GUIDE.md`
- **Testing Framework:** `FEATURE_TESTING_GUIDE.md` (symlink)
- **Main lazyPR Docs:** https://github.com/elvis-ndubuisi/lazypr/tree/main/docs
- **Test Scenarios:** `tests/scenarios/`

---

**Last Updated:** 2026-02-11  
**Maintained by:** lazypr_demo_maintainer agent
