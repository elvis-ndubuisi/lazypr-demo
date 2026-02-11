# 🎯 LazyPR Demo Repository - Master Index

**Quick Links:** [Features](#-feature-catalog) | [Testing](#-testing-guide) | [Workflow](#-workflow) | [Agents](#-available-agents)

---

## 📁 Repository Structure

This repository is organized to support **any lazyPR feature** - current and future:

```
lazypr-demo/
├── 📋 FEATURE_TESTING_GUIDE.md      ← Master guide (symlink to main repo)
├── 📖 README.md                      ← Project overview
├── 🚀 SETUP_GUIDE.md                 ← Setup instructions
├── 🎯 docs/
│   └── FEATURES.md                   ← Feature catalog
├── 🧪 tests/
│   └── scenarios/
│       ├── TEMPLATE.md               ← Test plan template
│       └── [feature]-test-plan.md    ← Individual test plans
├── 💻 src/
│   ├── features/                     ← Feature test code
│   │   ├── ticket-detection/
│   │   ├── title-enhancement/
│   │   └── [new-feature]/
│   ├── auth.js                       ← Auth module
│   ├── api.js                        ← API module
│   └── utils.js                      ← Utils
├── 📝 templates/
│   ├── default.md
│   └── features/                     ← Feature templates
├── 📊 .github/workflows/
│   ├── lazypr.yml                    ← Main workflow
│   └── feature-tests/                ← Feature-specific tests
└── 🎨 marketing/
    ├── screenshots/
    ├── scripts/
    └── copy/
```

---

## 🎬 Quick Start

### For Viewers (Using the Demo)

1. **Fork this repository**
2. **Add API key secret** (Settings → Secrets → Actions)
   - Name: `GEMINI_API_KEY` (or `OPENAI_API_KEY` / `ANTHROPIC_API_KEY`)
   - Value: Your API key
3. **Create a Pull Request** with:
   - Ticket reference in title: `Fix bug PROJ-123`
   - Code changes in `src/`
4. **Watch lazyPR analyze your PR!**

### For Contributors (Adding Features)

1. **Read the guide:** `FEATURE_TESTING_GUIDE.md`
2. **Check existing features:** `docs/FEATURES.md`
3. **Create test plan:** Copy `tests/scenarios/TEMPLATE.md`
4. **Write test code:** Add to `src/features/[name]/`
5. **Test in PR:** Create PR with your changes
6. **Document results:** Update test plan and FEATURES.md

---

## 🎯 Feature Catalog

### Current Features (v1.2.1)

| Feature | Status | Test Location | Demo Ready |
|---------|--------|---------------|------------|
| **AI Summaries** | ✅ Active | Any PR | ✅ Yes |
| **Ghost Detection** | ✅ Active | Mismatched commits | ✅ Yes |
| **Impact Scoring** | ✅ Active | Auth/DB changes | ✅ Yes |
| **Ticket Detection** | ✅ Released | `src/features/ticket-detection/` | ✅ Yes |
| **Title Enhancement** | ✅ Released | Vague titles | ✅ Yes |
| **PR Size Detection** | ✅ Released | Large PRs (>500 lines) | ✅ Yes |
| **Custom Placeholders** | ✅ Released | Dynamic templates | ✅ Yes |

[View Full Catalog →](docs/FEATURES.md)

---

## 🧪 Testing Guide

### How to Test Any Feature

1. **Locate the feature** in `docs/FEATURES.md`
2. **Find test plan** in `tests/scenarios/[feature]-test-plan.md`
3. **Create test PR** following the scenario
4. **Verify outputs** match expected results

### Creating Tests for New Features

**Step 1: Copy Template**
```bash
cp tests/scenarios/TEMPLATE.md tests/scenarios/[feature]-test-plan.md
```

**Step 2: Fill Template**
- Feature overview
- Configuration options
- Test scenarios
- Expected results

**Step 3: Create Test Code**
```bash
mkdir -p src/features/[feature-name]
touch src/features/[feature-name]/example1.js
```

**Step 4: Update Workflow**
Add inputs to `.github/workflows/lazypr.yml`

**Step 5: Test & Document**
- Create PR with test scenario
- Record results in test plan
- Update FEATURES.md

[View Full Testing Guide →](FEATURE_TESTING_GUIDE.md)

---

## 🔄 Workflow

### Standard Workflow (Any PR)

All PRs trigger the main workflow: `.github/workflows/lazypr.yml`

**What it does:**
1. Uses marketplace version `@v1.2.1` ✅
2. Enables all Batch 1 features
3. Generates PR summary
4. Displays all outputs in logs

### Feature-Specific Testing

For focused testing, use dedicated workflows in `.github/workflows/feature-tests/`

**Example:**
```yaml
# .github/workflows/feature-tests/ticket-detection.yml
name: Test Ticket Detection
on:
  pull_request:
    paths:
      - 'src/features/ticket-detection/**'
```

---

## 🤖 Available Agents

These agents help maintain and extend the demo:

### `lazypr_demo_maintainer`
**Purpose:** Maintains demo repository  
**Use for:**
- Creating sample PRs
- Updating documentation
- Ensuring tests work
- Creating visual examples

**Activate:** Use in opencode with this repo

### `lazypr_demo_content_creator`
**Purpose:** Creates demo content  
**Use for:**
- Sample code modules
- PR test scenarios
- Commit messages
- Before/after examples

**Activate:** Use in opencode with this repo

### `lazypr_marketing_copywriter`
**Purpose:** Creates marketing materials  
**Use for:**
- Feature highlights
- Demo scripts
- Social media posts
- Video outlines

**Activate:** Use in opencode with this repo

### `lazypr_documentarian`
**Purpose:** Creates feature docs  
**Use for:**
- Feature documentation
- Usage guides
- Configuration examples

**Activate:** Use in opencode with main lazypr repo

---

## 🚀 Adding a New Feature

### Complete Workflow

When lazyPR adds a new feature, follow this process:

#### Phase 1: Preparation (Before Release)
1. **Read guide:** `FEATURE_TESTING_GUIDE.md`
2. **Create test plan:** Copy `TEMPLATE.md`
3. **Write test code:** Add to `src/features/[name]/`
4. **Update workflow:** Add new inputs/outputs

#### Phase 2: Testing (After Release)
1. **Update version:** Change `@vX.Y.Z` in workflow
2. **Create PRs:** Test each scenario
3. **Record results:** Update test plan
4. **Fix issues:** Iterate until working

#### Phase 3: Documentation
1. **Update FEATURES.md:** Add to catalog
2. **Create marketing:** Use marketing agents
3. **Record demos:** Videos/screenshots
4. **Commit changes:** All files to repo

#### Phase 4: Public Demo
1. **Share examples:** Tweet/LinkedIn posts
2. **Update README:** Add new features
3. **Create tutorials:** How-to guides
4. **Announce release:** Blog post/video

[View Detailed Process →](FEATURE_TESTING_GUIDE.md#-adding-a-new-feature-to-the-demo)

---

## 📊 Status Tracking

### Feature Status Legend

- ✅ **Released** - Feature is live and tested
- ⏳ **In Progress** - Being implemented/tested
- 🔄 **Needs Update** - Feature changed, docs outdated
- ❌ **Not Started** - Planned but not begun

### Repository Health

| Metric | Status |
|--------|--------|
| Test Coverage | 7/7 features ✅ |
| Documentation | Current ✅ |
| Demo Videos | Needed ⏳ |
| Marketing Copy | Partial ⏳ |

---

## 🎯 Common Tasks

### Task: Test Ticket Detection
```bash
# 1. Create branch
git checkout -b test/ticket-detection

# 2. Add code
echo "// AUTH-123: Test" >> src/features/ticket-detection/basic.js

# 3. Commit
git commit -m "AUTH-123: Test ticket detection"

# 4. Push and create PR with title: "Test feature AUTH-123"
git push origin test/ticket-detection
```

### Task: Add New Feature Test
```bash
# 1. Copy template
cp tests/scenarios/TEMPLATE.md tests/scenarios/my-feature-test-plan.md

# 2. Create directory
mkdir -p src/features/my-feature

# 3. Write test code
cat > src/features/my-feature/example.js << 'EOF'
// Test code here
EOF

# 4. Update workflow
# Edit .github/workflows/lazypr.yml

# 5. Commit
git add -A
git commit -m "test: Add my-feature test scenarios"
```

### Task: Update to New Version
```bash
# 1. Update workflow version
sed -i '' 's/@v[0-9.]*/@vX.Y.Z/g' .github/workflows/lazypr.yml

# 2. Test
git add .
git commit -m "chore: Update to lazyPR vX.Y.Z"
git push

# 3. Create test PR
# Verify all features still work
```

---

## 📚 Documentation

### Essential Reading

1. **[FEATURE_TESTING_GUIDE.md](FEATURE_TESTING_GUIDE.md)**
   - Complete testing framework
   - How to add new features
   - Templates and patterns
   - **Start here for new features**

2. **[docs/FEATURES.md](docs/FEATURES.md)**
   - Feature catalog
   - Configuration reference
   - Test scenarios
   - **Check this for what's available**

3. **[SETUP_GUIDE.md](SETUP_GUIDE.md)**
   - Initial setup instructions
   - Test PR creation
   - Troubleshooting
   **Use this for first-time setup**

4. **[README.md](README.md)**
   - Project overview
   - Quick start
   - Example configurations
   **Share this with users**

### Templates

- **[Test Plan Template](tests/scenarios/TEMPLATE.md)** - For new features
- **[Ticket Detection Example](tests/scenarios/ticket-detection-test-plan.md)** - Real example

---

## 🎨 Marketing Materials

### Location: `marketing/`

**screenshots/** - Demo screenshots  
**scripts/** - Video scripts  
**copy/** - Marketing copy

### Creating Marketing Content

Use the `lazypr_marketing_copywriter` agent to create:
- Feature highlight posts
- Demo video scripts
- Before/after comparisons
- Social media content

---

## 🔧 Troubleshooting

### Issue: Feature not working
1. Check version tag in workflow (should be @v1.2.1 or higher)
2. Verify API key secret is set
3. Check feature inputs are configured correctly
4. Review test plan for correct setup

### Issue: Can't create test scenario
1. Check `FEATURE_TESTING_GUIDE.md` for patterns
2. Look at existing test plans for examples
3. Use `lazypr_demo_content_creator` agent

### Issue: Documentation outdated
1. Check `docs/FEATURES.md` for current status
2. Update using `lazypr_documentarian` agent
3. Follow update process in testing guide

---

## 🌟 Best Practices

### For Feature Testing
- ✅ Test happy path first
- ✅ Test edge cases
- ✅ Test error handling
- ✅ Document expected outputs
- ✅ Use realistic code examples

### For Documentation
- ✅ Keep test plans current
- ✅ Update FEATURES.md immediately
- ✅ Use consistent formatting
- ✅ Include configuration examples
- ✅ Note known issues

### For Demos
- ✅ Use marketplace version (not local)
- ✅ Create clear before/after
- ✅ Focus on value, not implementation
- ✅ Keep videos under 2 minutes
- ✅ Show real-world scenarios

---

## 📞 Support

### Resources
- **Main Repo:** https://github.com/elvis-ndubuisi/lazypr
- **Marketplace:** https://github.com/marketplace/actions/lazypr-ai-pr-summary
- **Releases:** https://github.com/elvis-ndubuisi/lazypr/releases
- **Issues:** https://github.com/elvis-ndubuisi/lazypr/issues

### Agents
All agents are configured in `opencode.json` in the main lazypr repo.

---

## ✅ Checklist: Repository Ready?

Before using this repo for public demos:

- [ ] API key secret configured
- [ ] All features have test plans
- [ ] Test code exists for all features
- [ ] Documentation is current
- [ ] Marketing materials created
- [ ] README explains setup clearly
- [ ] Example PRs created
- [ ] Workflow uses marketplace version

---

**Maintained by:** lazypr_demo_maintainer agent  
**Last Updated:** 2026-02-11  
**Version:** Compatible with lazyPR v1.2.1+

**Questions?** Start with `FEATURE_TESTING_GUIDE.md` or activate any of the demo agents.
