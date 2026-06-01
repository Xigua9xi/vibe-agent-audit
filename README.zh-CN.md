# vibe-agent-audit

[English](README.md) | 简体中文

`vibe-agent-audit` 是一个 TypeScript CLI，用于检查 agent、skill、vibe coding 类仓库的基础维护状态。

它不评价项目热度、star、下载量或社区活跃度，只检查仓库是否具备方便理解、测试和协作的基础信号。

## 它检查什么

- 是否有 README。
- 是否有 License。
- 是否有 `AGENTS.md` 或 `SKILL.md` 这类 agent/skill 文件。
- `package.json` 是否配置了 test script。
- 没有发现 agent/skill 文件时给出 warning，而不是直接崩溃。

## 它不做什么

- 不判断项目质量高低。
- 不验证 GitHub stars、downloads、contributors 或活跃度。
- 不上传或修改仓库文件。
- 不替代发布前的人工检查。

## 快速开始

```powershell
npm.cmd install
npm.cmd test
npm.cmd run lint
npm.cmd run demo
```

## CLI 用法

先构建：

```powershell
npm.cmd run build
```

检查当前仓库：

```powershell
node dist/cli.js --path .
```

输出 JSON：

```powershell
node dist/cli.js --path . --json
```

## 目录说明

```text
src/
```

核心审计逻辑和 CLI 入口。

```text
test/
```

测试健康仓库、缺少 README/license、没有 agent 文件等情况。

```text
fixtures/
```

测试和 demo 使用的合成仓库。

```text
scripts/
```

本地维护脚本，目前包含轻量 lint 检查。

```text
.github/
```

Issue 模板和后续优化 issue 草稿。

## 如何扩展

适合后续贡献的方向：

- 增加 `CONTRIBUTING.md` 和 `CHANGELOG.md` 检查。
- 增加 `--json` 输出测试。
- 增加可配置严重级别策略。
- 增加 CI 使用示例。

更多 issue 草稿见 `.github/ISSUE_DRAFTS.md`。

## 发布前注意

- 运行 `npm.cmd test`。
- 运行 `npm.cmd run lint`。
- 不提交 `node_modules/` 或 `dist/`。
- README 中不要写不真实的使用量、star、下载量或贡献者信息。
