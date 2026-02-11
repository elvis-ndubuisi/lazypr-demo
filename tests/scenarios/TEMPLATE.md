# Feature Test Plan Template

**Feature Name:** [Insert Feature Name]  
**Version Added:** v[X.Y.Z]  
**Date Created:** [YYYY-MM-DD]  
**Created By:** [Name or Agent]

---

## 📋 Overview

### Purpose
[One-sentence description of what this feature does]

### Problem Solved
[What pain point does this feature address?]

### Key Benefits
1. [Benefit 1]
2. [Benefit 2]
3. [Benefit 3]

---

## ⚙️ Configuration

### Inputs
| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `input_name` | Yes/No | `default_value` | [Description] |

### Outputs
| Output | Description |
|--------|-------------|
| `output_name` | [Description] |

### Configuration Example
```yaml
- uses: elvis-ndubuisi/lazypr@v[X.Y.Z]
  with:
    api_key: ${{ secrets.GEMINI_API_KEY }}
    provider: gemini
    [input_name]: [value]
```

---

## 🧪 Test Scenarios

### Scenario 1: Basic Functionality (Happy Path)

**Objective:** Test the feature works as expected under normal conditions

**Setup:**
- [ ] Step 1: [What to do]
- [ ] Step 2: [What to do]
- [ ] Step 3: [What to do]

**Test Code:**
Create file: `src/features/[feature-name]/example1.js`
```javascript
/**
 * [Feature Name] - Basic Test
 * Expected: [What should happen]
 */

[Code that triggers the feature]
```

**Expected Results:**
- [ ] [Expected output 1]
- [ ] [Expected output 2]
- [ ] [Expected output 3]

**Verification:**
```bash
# Check the output
echo "${{ steps.lazypr.outputs.[output_name] }}"
```

**Status:** ⏳ Not Tested / ✅ Passed / ❌ Failed

---

### Scenario 2: Edge Case

**Objective:** Test how the feature handles edge cases

**Setup:**
- [ ] [Edge case conditions]

**Test Code:**
Create file: `src/features/[feature-name]/example2.js`
```javascript
/**
 * [Feature Name] - Edge Case Test
 * Expected: [How it should handle this]
 */

[Code with edge case]
```

**Expected Results:**
- [ ] [Expected behavior]

**Status:** ⏳ Not Tested / ✅ Passed / ❌ Failed

---

### Scenario 3: Error Handling

**Objective:** Test error handling and invalid inputs

**Setup:**
- [ ] [Invalid configuration or input]

**Test Code:**
Create file: `src/features/[feature-name]/example3.js`
```javascript
/**
 * [Feature Name] - Error Handling Test
 * Expected: [Error message or fallback]
 */

[Code that triggers error]
```

**Expected Results:**
- [ ] [Expected error or fallback behavior]

**Status:** ⏳ Not Tested / ✅ Passed / ❌ Failed

---

### Scenario 4: Integration with Other Features

**Objective:** Test how this feature works with other lazyPR features

**Setup:**
- [ ] Enable this feature + [other feature]

**Test Code:**
```javascript
/**
 * [Feature Name] + [Other Feature] Integration
 */

[Code that tests integration]
```

**Expected Results:**
- [ ] This feature works correctly
- [ ] Other features still work
- [ ] No conflicts or unexpected behavior

**Status:** ⏳ Not Tested / ✅ Passed / ❌ Failed

---

## 📁 Test Artifacts

### Files Created
- [ ] `src/features/[feature-name]/example1.js` - Basic test
- [ ] `src/features/[feature-name]/example2.js` - Edge case
- [ ] `src/features/[feature-name]/example3.js` - Error handling
- [ ] `src/features/[feature-name]/README.md` - Feature-specific docs
- [ ] `templates/features/[feature-name].md` - Custom template (if applicable)

### PRs Created for Testing
1. **PR #1:** [Description] - [Link]
2. **PR #2:** [Description] - [Link]
3. **PR #3:** [Description] - [Link]

---

## 📊 Test Results Summary

| Scenario | Status | Notes |
|----------|--------|-------|
| Basic Functionality | ⏳/✅/❌ | [Notes] |
| Edge Case | ⏳/✅/❌ | [Notes] |
| Error Handling | ⏳/✅/❌ | [Notes] |
| Integration | ⏳/✅/❌ | [Notes] |

**Overall Status:** ⏳ In Progress / ✅ Complete / ❌ Needs Work

---

## 🎬 Demo Content

### Screenshots to Capture
- [ ] [Screenshot 1: Description]
- [ ] [Screenshot 2: Description]
- [ ] [Screenshot 3: Description]

### Video Script
**Title:** [Feature Name] Demo

**Script:**
```
0:00-0:30: [Introduction - The Problem]
0:30-1:00: [Setup - Configuration]
1:00-1:30: [Demo - Feature in Action]
1:30-2:00: [Results and Benefits]
```

### Marketing Copy

**Hook:**
[The problem this solves]

**Solution:**
[How lazyPR handles it]

**Benefit:**
[What users gain]

**Call to Action:**
[Try it now link]

---

## 🐛 Known Issues

### Issue 1: [Brief description]
- **Status:** Open / In Progress / Fixed
- **Workaround:** [How to work around it]
- **Planned Fix:** [When it will be fixed]

### Issue 2: [Brief description]
- **Status:** Open / In Progress / Fixed
- **Workaround:** [How to work around it]
- **Planned Fix:** [When it will be fixed]

---

## 📝 Notes and Observations

[Any additional observations, learnings, or notes about testing this feature]

---

## ✅ Sign-off

- [ ] All test scenarios documented
- [ ] Test code written and working
- [ ] Demo content created
- [ ] Marketing copy approved
- [ ] Documentation updated
- [ ] Feature added to FEATURES.md catalog
- [ ] Changes committed to demo repo

**Tested By:** [Name]  
**Date Completed:** [YYYY-MM-DD]  
**Approved For Release:** Yes / No

---

## 🔗 Related Links

- Feature Documentation: [Link]
- Demo Video: [Link]
- Example PR: [Link]
- Marketing Post: [Link]

---

**Template Version:** 1.0  
**Template Location:** `tests/scenarios/TEMPLATE.md`

**Instructions:**
1. Copy this file: `cp tests/scenarios/TEMPLATE.md tests/scenarios/[feature]-test-plan.md`
2. Fill in all sections
3. Create test code in `src/features/[feature-name]/`
4. Test each scenario
5. Update FEATURES.md catalog
6. Commit when complete
