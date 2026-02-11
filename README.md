# lazyPR Demo Repository

This repository demonstrates the capabilities of [lazyPR](https://github.com/elvis-ndubuisi/lazypr) - an AI-powered GitHub Action that generates intelligent PR summaries.

## 🎯 What This Demo Shows

This repo showcases all **Batch 1** features of lazyPR v1.2.1:

- ✅ **Ticket Detection** - Auto-link JIRA, GitHub, and Linear tickets
- ✅ **Title Enhancement** - Fix vague PR titles automatically  
- ✅ **Custom Placeholders** - Dynamic templates for team workflows
- ✅ **PR Size Detection** - Warn on oversized PRs
- ✅ **Ghost Commit Detection** - Catch mismatched commits
- ✅ **Impact Scoring** - Automatic risk assessment

## 🚀 Quick Start

1. **Fork this repository**
2. **Add your API key** as a repository secret:
   - Go to Settings → Secrets and variables → Actions
   - Add `GEMINI_API_KEY` (or `OPENAI_API_KEY` / `ANTHROPIC_API_KEY`)
3. **Create a Pull Request** with:
   - A ticket reference in the title (e.g., "Fix authentication PROJ-123")
   - Some code changes
   - Watch lazyPR automatically generate a summary!

## 📁 Repository Structure

```
├── .github/workflows/
│   └── lazypr.yml          # The lazyPR configuration
├── src/
│   ├── auth.js             # Sample auth module
│   ├── api.js              # Sample API endpoints
│   └── utils.js            # Utility functions
├── templates/
│   └── custom-template.md  # Example custom template
└── README.md               # This file
```

## 🎨 Example Workflows

### Basic Setup
```yaml
- uses: elvis-ndubuisi/lazypr@v1.2.1
  with:
    api_key: ${{ secrets.GEMINI_API_KEY }}
    provider: gemini
```

### With Ticket Detection
```yaml
- uses: elvis-ndubuisi/lazypr@v1.2.1
  with:
    api_key: ${{ secrets.GEMINI_API_KEY }}
    provider: gemini
    ticket_pattern: "[A-Z]+-\\d+"
    ticket_url_template: "https://github.com/${{ github.repository }}/issues/{{id}}"
```

### With Title Enhancement
```yaml
- uses: elvis-ndubuisi/lazypr@v1.2.1
  with:
    api_key: ${{ secrets.GEMINI_API_KEY }}
    provider: gemini
    auto_update_title: true
```

### With PR Size Detection
```yaml
- uses: elvis-ndubuisi/lazypr@v1.2.1
  with:
    api_key: ${{ secrets.GEMINI_API_KEY }}
    provider: gemini
    pr_size_warning: "500"
    pr_size_block: "2000"
```

### Full Configuration
```yaml
- uses: elvis-ndubuisi/lazypr@v1.2.1
  with:
    api_key: ${{ secrets.GEMINI_API_KEY }}
    provider: gemini
    ticket_pattern: "[A-Z]+-\\d+"
    ticket_url_template: "https://github.com/${{ github.repository }}/issues/{{id}}"
    auto_update_title: true
    pr_size_warning: "500"
    pr_size_block: "2000"
    custom_placeholders: |
      {
        "{{securityReview}}": "Auth changes reviewed",
        "{{testCoverage}}": "Unit tests added"
      }
```

## 🧪 Test Scenarios

Create PRs to test different features:

### 1. Ticket Detection Test
**Title:** `Fix login bug AUTH-456`
**Expected:** lazyPR detects and links AUTH-456

### 2. Title Enhancement Test  
**Title:** `Fix bug`
**Expected:** lazyPR updates to something like `Fix null pointer in authentication flow`

### 3. PR Size Detection Test
Create a PR with 600+ lines of changes.
**Expected:** Warning appears about PR size

### 4. Ghost Commit Test
Commit with message: "Update database schema"
But change: Only CSS files
**Expected:** lazyPR flags ghost commit

## 📊 Sample PRs

Check out these example PRs to see lazyPR in action:

- [#1 - Basic Feature](https://github.com/elvis-ndubuisi/lazypr-demo/pull/1) - Simple feature addition
- [#2 - Bug Fix](https://github.com/elvis-ndubuisi/lazypr-demo/pull/2) - Bug fix with ticket reference
- [#3 - Refactoring](https://github.com/elvis-ndubuisi/lazypr-demo/pull/3) - Code refactoring

## 📖 Learn More

- [lazyPR Repository](https://github.com/elvis-ndubuisi/lazypr)
- [GitHub Marketplace](https://github.com/marketplace/actions/lazypr-ai-pr-summary)
- [Documentation](https://github.com/elvis-ndubuisi/lazypr#readme)

---

**Note:** This demo uses the official marketplace release (`v1.2.1`), not development code.
