# GitHub Workflows & Templates

This directory contains GitHub Actions workflows, issue templates, and pull request templates for the Alumimundo AI Platform.

## 📁 Contents

### Workflows (`.github/workflows/`)

#### `ci.yml` - Continuous Integration Pipeline
Automated quality checks that run on every push and pull request.

**Jobs:**
1. **Lint & Type Check**
   - ESLint code quality checks
   - TypeScript type validation
   - Continues on error to show all issues

2. **Build**
   - Next.js production build
   - Dependency caching with pnpm
   - Build artifact upload (7-day retention)

3. **Security Scan**
   - Trivy vulnerability scanner
   - SARIF format security reports
   - Automatic upload to GitHub Security tab

4. **Dependency Review** (PRs only)
   - Checks for vulnerable dependencies
   - Fails on moderate+ severity issues
   - Prevents insecure dependencies from merging

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

**Caching:**
- pnpm store cache for faster builds
- Cache key based on `pnpm-lock.yaml` hash

### Dependabot Configuration (`dependabot.yml`)

Automated dependency updates to keep the project secure and up-to-date.

**npm/pnpm Updates:**
- Schedule: Weekly on Mondays at 9:00 AM
- Open PRs limit: 10
- Auto-reviewers: @dioinnovo
- Labels: `dependencies`, `automated`
- Ignores major version updates for:
  - React
  - React DOM
  - Next.js

**GitHub Actions Updates:**
- Schedule: Weekly on Mondays at 9:00 AM
- Open PRs limit: 5
- Labels: `ci/cd`, `automated`

### Issue Templates (`.github/ISSUE_TEMPLATE/`)

#### `bug_report.md`
Template for reporting bugs with:
- Steps to reproduce
- Expected vs actual behavior
- Environment details (browser, device, OS)
- Agent-specific information (ALMA, Chat, Products)
- Console logs section
- Priority classification

#### `feature_request.md`
Template for requesting new features with:
- Problem statement and use cases
- Module/area affected (5 core modules + agents)
- AI/LLM enhancement tracking
- User impact assessment
- Technical considerations
- Success metrics

### Pull Request Template (`PULL_REQUEST_TEMPLATE.md`)

Comprehensive checklist for code reviews including:
- Change type classification
- AI agent changes section
- Testing requirements
- Deployment notes
- Performance impact
- Database migration tracking
- Environment variables documentation

## 🚀 Usage

### Creating Issues
1. Go to the [Issues](../../issues) tab
2. Click "New Issue"
3. Select the appropriate template
4. Fill in all required sections
5. Submit

### Creating Pull Requests
1. Create a branch from `main` or `develop`
2. Make your changes and commit
3. Push to your branch
4. Open a PR - the template will auto-populate
5. Fill in all sections and check all applicable boxes
6. Request review

### Monitoring CI/CD
1. Go to the [Actions](../../actions) tab
2. View workflow runs for your PRs/commits
3. Check build status, test results, and security scans
4. Review any failures and fix issues

## 🔧 Customization

### Modifying Workflows
Edit `.github/workflows/ci.yml`:
```yaml
# Example: Add a new job
deploy:
  name: Deploy to Staging
  runs-on: ubuntu-latest
  needs: build
  steps:
    - name: Deploy
      run: pnpm deploy:staging
```

### Adjusting Dependabot
Edit `.github/dependabot.yml`:
```yaml
# Example: Change update frequency
schedule:
  interval: "daily"  # or "weekly", "monthly"
  day: "monday"
  time: "09:00"
```

### Customizing Templates
- Edit `.github/PULL_REQUEST_TEMPLATE.md` for PR template
- Edit `.github/ISSUE_TEMPLATE/*.md` for issue templates
- Add new templates as needed

## 📊 Best Practices

### For Contributors
1. ✅ Always fill out PR templates completely
2. ✅ Link PRs to related issues using "Closes #123"
3. ✅ Wait for CI checks to pass before requesting review
4. ✅ Address all CI failures before merging
5. ✅ Document AI agent changes clearly

### For Reviewers
1. ✅ Check that all template sections are completed
2. ✅ Verify CI checks pass
3. ✅ Review security scan results
4. ✅ Test AI agent changes locally if applicable
5. ✅ Ensure environment variables are documented

### For Maintainers
1. ✅ Monitor Dependabot PRs weekly
2. ✅ Review security alerts promptly
3. ✅ Keep workflows up to date
4. ✅ Update templates as project evolves

## 🔒 Security

### Automated Security Checks
- **Trivy Scanner**: Scans for vulnerabilities in dependencies and code
- **Dependency Review**: Prevents merging PRs with vulnerable dependencies
- **Dependabot Alerts**: Automatic security updates for known vulnerabilities

### Viewing Security Reports
1. Go to the [Security](../../security) tab
2. View vulnerability alerts
3. Check Dependabot pull requests
4. Review code scanning results (SARIF)

## 📖 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [Next.js CI/CD Best Practices](https://nextjs.org/docs/deployment)
- [pnpm with GitHub Actions](https://pnpm.io/continuous-integration#github-actions)

---

🤖 Maintained with [Claude Code](https://claude.com/claude-code)
