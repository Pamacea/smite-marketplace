# Integration Examples

Examples of integrating the Quality Gate with various systems and workflows.

---

## Table of Contents

- [CI/CD Integration](#cicd-integration)
- [Pre-commit Hooks](#pre-commit-hooks)
- [IDE Integration](#ide-integration)
- [Git Hooks](#git-hooks)
- [Docker Integration](#docker-integration)
- [Monitoring and Alerts](#monitoring-and-alerts)

---

## CI/CD Integration

### GitHub Actions

**Workflow file:** `.github/workflows/quality-gate.yml`

```yaml
name: Quality Gate Check

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]

jobs:
  quality-gate:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build quality gate
        run: |
          cd plugins/quality-gate
          npm install
          npm run build

      - name: Run validation
        run: |
          # Validate all TypeScript files
          npx quality-check 'src/**/*.ts' --format json --output validation-report.json

      - name: Upload validation report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: validation-report
          path: validation-report.json

      - name: Check for critical issues
        run: |
          # Fail if critical issues found
          CRITICAL_COUNT=$(jq '[.issues[] | select(.severity == "critical")] | length' validation-report.json)
          if [ "$CRITICAL_COUNT" -gt 0 ]; then
            echo "❌ Found $CRITICAL_COUNT critical issues"
            exit 1
          fi

      - name: Comment PR with results
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const report = JSON.parse(fs.readFileSync('validation-report.json', 'utf8'));

            const body = `## Quality Gate Results\n\n` +
              `**Decision**: ${report.decision === 'allow' ? '✅ Pass' : '❌ Fail'}\n` +
              `**Confidence**: ${(report.confidence * 100).toFixed(0)}%\n` +
              `**Issues**: ${report.issues.length}\n\n` +
              `### Issues by Severity\n\n` +
              `- **Critical**: ${report.issues.filter(i => i.severity === 'critical').length}\n` +
              `- **Error**: ${report.issues.filter(i => i.severity === 'error').length}\n` +
              `- **Warning**: ${report.issues.filter(i => i.severity === 'warning').length}\n`;

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: body
            });
```

### GitLab CI

**Workflow file:** `.gitlab-ci.yml`

```yaml
stages:
  - quality

quality-gate:
  stage: quality
  image: node:18

  before_script:
    - npm ci

  script:
    - cd plugins/quality-gate && npm install && npm run build
    - npx quality-check 'src/**/*.ts' --format json --output validation-report.json

  artifacts:
    reports:
      quality: validation-report.json
    paths:
      - validation-report.json

  allow_failure: false

  only:
    - merge_requests
    - main
```

### Jenkins Pipeline

**Jenkinsfile:**

```groovy
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup') {
            steps {
                sh 'npm ci'
                sh 'cd plugins/quality-gate && npm install && npm run build'
            }
        }

        stage('Quality Gate') {
            steps {
                sh '''
                    npx quality-check 'src/**/*.ts' \
                        --format json \
                        --output validation-report.json
                '''
            }
        }

        stage('Report') {
            steps {
                script {
                    def report = readJSON file: 'validation-report.json'

                    if (report.decision != 'allow') {
                        error("Quality gate failed: ${report.issues.length} issues found")
                    }

                    // Publish to Jenkins
                    recordIssues(
                        tools: [checkStyle(pattern: 'validation-report.json')],
                        qualityGates: [
                            [threshold: 1, type: 'TOTAL', unstable: false]
                        ]
                    )
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'validation-report.json'
        }
    }
}
```

---

## Pre-commit Hooks

### Using Husky

**1. Install Husky:**

```bash
npm install --save-dev husky
npx husky install
npx husky add .husky/pre-commit "npm run quality-check"
```

**2. Create pre-commit hook:**

**File:** `.husky/pre-commit`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "Running quality gate..."

# Get list of staged TypeScript files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep '\.ts$' | grep -v '\.test\.ts$')

if [ -n "$STAGED_FILES" ]; then
  echo "Checking files:"
  echo "$STAGED_FILES"

  # Run quality gate on staged files
  npx quality-check $STAGED_FILES

  if [ $? -ne 0 ]; then
    echo "❌ Quality gate failed. Fix issues before committing."
    exit 1
  fi
fi

echo "✅ Quality gate passed"
```

**3. Make executable:**

```bash
chmod +x .husky/pre-commit
```

### Using lint-staged

**1. Install dependencies:**

```bash
npm install --save-dev lint-staged
```

**2. Configure:**

**File:** `package.json`

```json
{
  "lint-staged": {
    "*.ts": [
      "quality-check --format json --output quality-report.json",
      "sh -c 'cat quality-report.json | jq -e \".decision == \\\"allow\\\"\" || exit 1'"
    ]
  }
}
```

**3. Add pre-commit hook:**

```bash
npx husky add .husky/pre-commit "npx lint-staged"
```

---

## IDE Integration

### VS Code Extension

**Extension concept:** Quality Gate status in editor

**File:** `extension.ts`

```typescript
import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export function activate(context: vscode.ExtensionContext) {
  // Diagnostic collection
  const collection = vscode.languages.createDiagnosticCollection('quality-gate');

  // Validate current file on save
  vscode.workspace.onDidSaveTextDocument(async (document) => {
    if (document.languageId !== 'typescript') return;

    const filePath = document.fileName;

    try {
      const { stdout } = await execAsync(`quality-check "${filePath}" --format json`);
      const result = JSON.parse(stdout);

      const diagnostics: vscode.Diagnostic[] = [];

      for (const issue of result.issues) {
        const range = new vscode.Range(
          new vscode.Position(issue.location.line - 1, issue.location.column),
          new vscode.Position(issue.location.line - 1, issue.location.column + 1)
        );

        const diagnostic = new vscode.Diagnostic(
          range,
          issue.message,
          issue.severity === 'critical'
            ? vscode.DiagnosticSeverity.Error
            : issue.severity === 'error'
            ? vscode.DiagnosticSeverity.Error
            : vscode.DiagnosticSeverity.Warning
        );

        diagnostic.source = 'Quality Gate';
        diagnostic.code = issue.rule;

        diagnostics.push(diagnostic);
      }

      collection.set(vscode.Uri.file(filePath), diagnostics);
    } catch (error) {
      vscode.window.showErrorMessage(`Quality gate error: ${error}`);
    }
  });

  // Status bar item
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarItem.command = 'qualityGate.showReport';
  statusBarItem.show();

  context.subscriptions.push(collection, statusBarItem);
}
```

### JetBrains Plugin (Concept)

Similar integration for IntelliJ/WebStorm using the IDE's external tools and inspection system.

---

## Git Hooks

### Commit Message Validation

**File:** `.git/hooks/commit-msg`

```bash
#!/bin/bash

# Validate commit message follows conventional commits
COMMIT_MSG_FILE=$1
COMMIT_MSG=$(cat "$COMMIT_MSG_FILE")

# Pattern: type(scope): subject
PATTERN="^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .{1,50}"

if ! [[ "$COMMIT_MSG" =~ $PATTERN ]]; then
  echo "❌ Invalid commit message format"
  echo ""
  echo "Expected format: type(scope): subject"
  echo "Example: feat(auth): add user login"
  echo ""
  echo "Types: feat, fix, docs, style, refactor, test, chore"
  exit 1
fi

# Check if quality gate ran for this commit
if git diff --cached --name-only | grep -q '\.ts$'; then
  if ! git log -1 --pretty=%B | grep -q "Quality Gate:"; then
    echo "⚠️  Warning: TypeScript files changed but quality gate not mentioned in commit"
    echo "   Consider running: quality-check src/**/*.ts"
  fi
fi
```

---

## Docker Integration

### Multi-stage Dockerfile

```dockerfile
# Stage 1: Build quality gate
FROM node:18 AS quality-gate-builder
WORKDIR /app
COPY plugins/quality-gate ./quality-gate
RUN cd quality-gate && npm install && npm run build

# Stage 2: Run quality checks
FROM node:18 AS quality-check
WORKDIR /app
COPY --from=quality-gate-builder /app/quality-gate ./quality-gate
COPY package*.json ./
RUN npm ci
COPY . .

# Run validation
RUN node quality-gate/dist/cli.js check 'src/**/*.ts' --fail-on-violation

# Stage 3: Production image
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
CMD ["npm", "start"]
```

**Build and run:**

```bash
docker build -t myapp:latest .
```

---

## Monitoring and Alerts

### Slack Notifications

**Webhook integration:**

```typescript
// scripts/quality-gate-notification.ts
import fetch from 'node-fetch';

interface QualityGateResult {
  decision: 'allow' | 'deny';
  issues: Array<{
    severity: string;
    message: string;
    location: { file: string; line: number };
  }>;
}

async function sendSlackNotification(result: QualityGateResult) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  const critical = result.issues.filter(i => i.severity === 'critical').length;
  const errors = result.issues.filter(i => i.severity === 'error').length;

  const color = result.decision === 'allow' ? 'good' : 'danger';
  const emoji = result.decision === 'allow' ? '✅' : '❌';

  const message = {
    attachments: [
      {
        color: color,
        title: `${emoji} Quality Gate ${result.decision === 'allow' ? 'Passed' : 'Failed'}`,
        fields: [
          { title: 'Critical', value: critical.toString(), short: true },
          { title: 'Errors', value: errors.toString(), short: true },
          { title: 'Total Issues', value: result.issues.length.toString(), short: true }
        ],
        footer: 'Quality Gate System',
        ts: Math.floor(Date.now() / 1000)
      }
    ]
  };

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message)
  });
}

// Usage
sendSlackNotification(qualityGateResult);
```

### Prometheus Metrics

**Export metrics endpoint:**

```typescript
// scripts/quality-gate-metrics.ts
import express from 'express';
import { promisify } from 'util';
import { readFile } from 'fs';

const app = express();
const readFileAsync = promisify(readFile);

app.get('/metrics/quality-gate', async (req, res) => {
  try {
    const auditLog = await readFileAsync('.claude/.smite/judge-audit.log', 'utf8');
    const entries = auditLog.split('\n').filter(Boolean).map(JSON.parse);

    // Calculate metrics
    const totalValidations = entries.length;
    const denials = entries.filter(e => e.decision === 'deny').length;
    const allowRate = ((totalValidations - denials) / totalValidations) * 100;

    const issues = entries.flatMap(e => e.issues || []);
    const criticalIssues = issues.filter(i => i.severity === 'critical').length;

    // Prometheus format
    const metrics = `
# HELP quality_gate_validations_total Total number of validations
# TYPE quality_gate_validations_total counter
quality_gate_validations_total ${totalValidations}

# HELP quality_gate_denials_total Total number of denials
# TYPE quality_gate_denials_total counter
quality_gate_denials_total ${denials}

# HELP quality_gate_allow_rate Percentage of validations that passed
# TYPE quality_gate_allow_rate gauge
quality_gate_allow_rate ${allowRate}

# HELP quality_gate_critical_issues_total Total critical issues found
# TYPE quality_gate_critical_issues_total counter
quality_gate_critical_issues_total ${criticalIssues}
`;

    res.set('Content-Type', 'text/plain');
    res.send(metrics);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(9090, () => {
  console.log('Metrics server running on port 9090');
});
```

**Grafana dashboard query:**

```promql
# Allow rate over time
rate(quality_gate_allow_rate[5m])

# Critical issues trend
rate(quality_gate_critical_issues_total[1h])

# Denial rate
sum(rate(quality_gate_denials_total[5m])) by (session_id)
```

---

## Best Practices

### 1. Gradual Rollout

Start with warnings only:

```json
{
  "complexity": {
    "maxCyclomaticComplexity": 20
  },
  "semantics": {
    "enabled": false
  }
}
```

Then gradually tighten:

```json
{
  "complexity": {
    "maxCyclomaticComplexity": 10
  },
  "semantics": {
    "enabled": true
  }
}
```

### 2. Team Adoption

1. **Pilot with one team**
2. **Gather feedback**
3. **Adjust configuration**
4. **Roll out to other teams**
5. **Provide training and documentation**

### 3. Performance

Cache validation results:

```typescript
class CachedValidator {
  private cache = new Map<string, ValidationResults>();

  async validate(filePath: string, content: string): Promise<ValidationResults> {
    const hash = this.hashContent(content);

    if (this.cache.has(filePath + hash)) {
      return this.cache.get(filePath + hash)!;
    }

    const result = await this.validator.validate(filePath, content);
    this.cache.set(filePath + hash, result);

    return result;
  }
}
```

### 4. Error Handling

Always provide fallback:

```typescript
try {
  const result = await qualityCheck(filePath);
  return result;
} catch (error) {
  console.error('Quality gate error:', error);
  // Fallback: allow but log
  return { decision: 'allow', warning: 'Quality gate unavailable' };
}
```

---

## Related Documentation

- [README.md](../README.md) - User guide
- [ARCHITECTURE.md](../ARCHITECTURE.md) - System architecture
- [CONFIG_REFERENCE.md](../CONFIG_REFERENCE.md) - Configuration reference
- [TROUBLESHOOTING.md](../TROUBLESHOOTING.md) - Troubleshooting guide

---

**Last Updated:** 2025-01-19
