# Ticket Detection Test Scenarios

This directory contains test scenarios for lazyPR's ticket detection feature.

## 📁 Files

- **auth-service.js** - Authentication module with ticket references (AUTH-456, SECURITY-789)

## 🧪 Test Scenarios

### Scenario 1: Basic Ticket Detection
**PR Title:** `Fix authentication bug AUTH-456`

**Expected Results:**
- AUTH-456 detected from title
- Linked to GitHub issue or JIRA
- Displayed in "Related Tickets" section

**Test Command:**
```bash
git checkout -b test/AUTH-456
git add src/features/ticket-detection/auth-service.js
git commit -m "AUTH-456: Fix authentication"
git push origin test/AUTH-456
# Create PR on GitHub
```

### Scenario 2: Multi-Source Detection
**PR Title:** `Update user management PROJ-100`
**PR Body:** `This addresses #456 and fixes TICKET-789`
**Commit:** `ENG-555: Refactor validation`

**Expected Results:**
- PROJ-100 from title
- #456 and TICKET-789 from body
- ENG-555 from commit
- All shown in markdown list
- No duplicates

### Scenario 3: Custom Pattern
**Pattern:** `MYPROJECT-[0-9]{4}`
**PR Title:** `Fix login MYPROJECT-1234`

**Expected Results:**
- MYPROJECT-1234 detected with custom pattern

## 📝 Configuration

```yaml
- uses: elvis-ndubuisi/lazypr@v1.2.1
  with:
    api_key: ${{ secrets.GEMINI_API_KEY }}
    provider: gemini
    ticket_pattern: "[A-Z]+-\\d+"
    ticket_url_template: "https://github.com/${{ github.repository }}/issues/{{id}}"
```

## 🎫 Tickets Referenced

- AUTH-456 - Implement secure authentication
- SECURITY-789 - Secure password verification
- #123 - Related issue (add to PR body)

## 📊 Expected Output

```markdown
### 🎫 Related Tickets
- [AUTH-456](https://github.com/.../issues/AUTH-456) (Jira)
- [SECURITY-789](https://github.com/.../issues/SECURITY-789) (Jira)
- [#123](https://github.com/.../issues/123) (GitHub)
```

## 🔍 Code Details

The auth-service.js file includes:
- Password hashing
- Token generation
- Account lockout protection
- Session management
- Comprehensive error handling

This demonstrates lazyPR's ability to:
1. Detect tickets from multiple sources
2. Analyze security-sensitive code
3. Provide risk assessment
4. Generate meaningful summaries

## 🚀 Quick Test

1. Copy this file to your PR
2. Reference AUTH-456 in the PR title
3. Include "Fixes #123" in PR body
4. Push and create PR
5. Watch lazyPR detect all tickets!

---

**Full test plan:** See `tests/scenarios/ticket-detection-test-plan.md`
