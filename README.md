# vibe-agent-audit

English | [简体中文](README.zh-CN.md)

`vibe-agent-audit` is a small TypeScript CLI for auditing basic repository hygiene in agent, skill, and vibe-coding projects.

It does not score popularity, activity, or community adoption. It checks practical maintenance signals that make a repository easier to understand, test, and collaborate on.

## What It Checks

- README presence.
- License presence.
- Agent or skill files, such as `AGENTS.md` or `SKILL.md`.
- `package.json` test script presence.
- Graceful warnings when no agent or skill files are found.

## What It Does Not Do

- It does not judge project quality or legal compliance.
- It does not verify GitHub stars, downloads, contributors, or activity.
- It does not upload or modify repository files.
- It does not replace human review before publishing.

## Quickstart

```powershell
npm.cmd install
npm.cmd test
npm.cmd run lint
npm.cmd run demo
```

## CLI Usage

Build first:

```powershell
npm.cmd run build
```

Run against a repository:

```powershell
node dist/cli.js --path .
```

Run with JSON output:

```powershell
node dist/cli.js --path . --json
```

## Directory Guide

```text
src/
```

Core audit logic and CLI entrypoint.

```text
test/
```

Node test runner tests for healthy repositories, missing README/license, and missing agent files.

```text
fixtures/
```

Synthetic fixture repository used by tests and demos.

```text
scripts/
```

Local maintenance scripts, currently including a lightweight lint check.

```text
.github/
```

Issue templates and issue drafts for future public backlog items.

## Exit Behavior

The CLI exits with a non-zero code when failed checks exist. Warning-only reports can still exit successfully.

## How To Extend

Good extension points:

- Add warning checks for `CONTRIBUTING.md` and `CHANGELOG.md`.
- Add tests for `--json` output.
- Add configurable severity policy.
- Add CI usage examples.

See `.github/ISSUE_DRAFTS.md` for ready-to-copy issue drafts.

## Publishing Notes

Before publishing:

- Run `npm.cmd test`.
- Run `npm.cmd run lint`.
- Do not commit `node_modules/` or `dist/`.
- Keep README claims factual and avoid adoption metrics unless they are real.
