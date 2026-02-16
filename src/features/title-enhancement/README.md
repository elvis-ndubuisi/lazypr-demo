# Title Enhancement Test Scenarios

This directory demonstrates lazyPR's automatic title enhancement and ghost commit detection features.

## 📁 Files

- **database-manager.js** - Database connection manager (moderate complexity)

## 🧪 Test Scenarios

### Scenario 1: Vague Title Enhancement

**Setup:**
- Commit message: `Fix stuff` (vague, doesn't match code)
- PR Title: `Update code` (intentionally vague)
- Actual changes: Complete database refactoring

**Expected Results:**
1. Title analyzed as vague (high vagueness score)
2. Suggested title: "Refactor database connection management with pooling"
3. PR title auto-updated (if `auto_update_title: true`)
4. Ghost commit detected (message doesn't match changes)

**Test Steps:**
```bash
git checkout -b test/title-enhancement
git add src/features/title-enhancement/database-manager.js
git commit -m "Fix stuff"  # Intentionally vague
git push origin test/title-enhancement
# Create PR with title: "Update code"
```

### Scenario 2: Descriptive Title (Control Test)

**Setup:**
- Commit message: `feat: Implement database connection pooling and retry logic`
- PR Title: `Implement database connection pooling with retry logic and health checks`

**Expected Results:**
- Title analyzed as descriptive (low vagueness score)
- No enhancement needed
- PR title unchanged

**Test Steps:**
```bash
git checkout -b test/descriptive-title
git add src/features/title-enhancement/database-manager.js
git commit -m "feat: Implement database connection pooling and retry logic"
git push origin test/descriptive-title
# Create PR with descriptive title
```

## 📝 Configuration

```yaml
- uses: elvis-ndubuisi/lazypr@v1.2.1
  with:
    api_key: ${{ secrets.GEMINI_API_KEY }}
    provider: gemini
    auto_update_title: "true"  # Enable automatic title updates
```

## 🎭 The Ghost Commit

The "Fix stuff" commit is intentionally vague and doesn't describe the actual changes:

**Commit says:** "Fix stuff"  
**Actual changes:**
- Connection pooling implementation
- Retry logic with exponential backoff
- Connection queuing
- Graceful shutdown
- Health monitoring

lazyPR should flag this as a ghost commit!

## 📊 Expected Output

### For Vague Scenario:
```
⚠️ Ghost Commit Detected:
  - abc1234: Message "Fix stuff" doesn't describe database refactoring

✏️ Title Analysis:
  Original: "Update code"
  Vagueness Score: 85%
  Reason: Too generic, doesn't specify what code or what update
  
✨ Title Enhanced:
  "Refactor database connection management with pooling and retry logic"
```

### For Descriptive Scenario:
```
✓ Title Analysis:
  Current: "Implement database connection pooling..."
  Vagueness Score: 12%
  Status: Descriptive enough
  
No changes needed.
```

## 🔍 Code Details

The database-manager.js includes:
- **600+ lines** of production-quality code
- Connection pooling with configurable size
- Retry logic with exponential backoff
- Connection queuing for high-load scenarios
- Graceful shutdown handling
- Health check endpoint
- Event-driven architecture
- Comprehensive error handling

## 🎯 Why This Tests Both Features

1. **Title Enhancement:**
   - Starts with vague title
   - Complex code changes
   - lazyPR should analyze code and suggest better title

2. **Ghost Commit Detection:**
   - Commit message is "Fix stuff"
   - Actual code is database refactoring
   - Clear mismatch for lazyPR to detect

## 📸 Screenshot Opportunities

- Before/After title comparison
- Ghost commit warning in PR summary
- Vagueness score display
- Auto-update confirmation
- Git history showing improved titles

## 🚀 Quick Test

1. Use the vague scenario steps above
2. Create PR with title "Update code"
3. Watch lazyPR enhance it automatically
4. Check for ghost commit warning

---

**Full test plan:** See `tests/scenarios/title-enhancement-ghost-commit-test-plan.md`
