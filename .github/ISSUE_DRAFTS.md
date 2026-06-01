# Issue Drafts

These are real backlog items intended for GitHub issues after the repository is published.

## Add JSON output test coverage

### Problem

The CLI supports `--json`, but the current tests only cover the library API and text-oriented CLI demo.

### Proposed change

Add a CLI test that runs `node dist/cli.js --path fixtures/healthy-agent-repo --json`, parses stdout as JSON, and asserts the summary fields.

### Acceptance criteria

- JSON output is valid JSON.
- The test verifies at least `summary.failed`, `summary.warned`, and `summary.agentFiles`.
- `npm.cmd test` passes.

### Labels

`good first issue`, `tests`

## Check for CONTRIBUTING and CHANGELOG files

### Problem

The audit currently checks README, license, agent files, and test scripts. It does not check contribution or release-history files.

### Proposed change

Add warning-level checks for `CONTRIBUTING.md` and `CHANGELOG.md`.

### Acceptance criteria

- Missing `CONTRIBUTING.md` produces a warning, not a failure.
- Missing `CHANGELOG.md` produces a warning, not a failure.
- Existing tests are updated without changing current failure semantics.

### Labels

`enhancement`, `good first issue`

## Add GitHub Actions workflow example

### Problem

Users who want to run the audit in CI need to infer the workflow setup.

### Proposed change

Add a documented GitHub Actions example that installs dependencies, builds, and runs the CLI against the repository.

### Acceptance criteria

- README includes a minimal CI snippet.
- The snippet uses `npm ci`, `npm run build`, and `node dist/cli.js --path .`.
- The documentation explains that failed checks produce a non-zero exit code.

### Labels

`documentation`, `ci`

## Support configurable warning and failure policy

### Problem

All checks currently have fixed severities. Different projects may want stricter policies.

### Proposed change

Add an optional config file, such as `.vibe-agent-audit.json`, that can promote warnings to failures for selected checks.

### Acceptance criteria

- The CLI still works without a config file.
- Config supports at least one severity override.
- Invalid config produces a clear error message.
- Tests cover default and configured behavior.

### Labels

`enhancement`, `help wanted`
