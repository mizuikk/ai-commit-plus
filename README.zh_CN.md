<a name="readme-top"></a>

<div align="center">

<img height="120" src="./images/logo.png" alt="AI Commit Plus logo">

<h1>AI Commit Plus</h1>

使用 OpenAI / Azure OpenAI / DeepSeek / Gemini API 审查 Git 暂存区修改，生成符合 Conventional Commits 规范的提交消息，并在多个仓库之间保持统一的提交工作流。

> 本项目基于 [Sitoi/ai-commit](https://github.com/Sitoi/ai-commit) fork，并在品牌、发布流程和按仓库语言配置等方面做了独立演进。

[English](./README.md) · **简体中文** · [报告问题][github-issues-link] · [请求功能][github-issues-link]

[![][github-release-shield]][github-release-link]
[![][github-downloads-shield]][github-downloads-link]
[![][github-contributors-shield]][github-contributors-link]
[![][github-stars-shield]][github-stars-link]
[![][github-issues-shield]][github-issues-link]
[![][github-license-shield]][github-license-link]

![](./aicommit.gif)

</div>

## 特性

- 支持使用 OpenAI / Azure OpenAI / DeepSeek / Gemini 根据暂存区 diff 生成提交消息
- 支持多语言提交消息
- 支持按仓库覆盖提交语言，适合多项目切换
- 支持 Gitmoji 提示词
- 支持自定义系统提示词
- 支持 Conventional Commits 规范

## 安装

1. 从 [GitHub Releases][github-release-link] 下载最新的 `.vsix` 安装包。
2. 在 VS Code 中运行 `Extensions: Install from VSIX...`。
3. 选择下载好的 `ai-commit-plus-<version>.vsix` 文件进行安装。

> **Note**\
> 本地开发和打包请使用 `24.14.1` 或更高版本的 Node.js。

## 使用

1. 安装并启用 `AI Commit Plus`。
2. 在 VS Code 设置中配置 `ai-commit-plus` 命名空间下的选项，或者使用 `Manage Provider Profiles` 命令保存多个供应商配置并在它们之间切换。
3. 将需要提交的修改加入暂存区。
4. 如需补充上下文，可在生成提交消息前先在 Source Control 消息框中输入说明。
5. 点击 Source Control 标题区域中的 `AI Commit Plus` 操作按钮。
6. 检查生成结果，确认后执行提交。

如果你在不同仓库之间需要使用不同的提交语言，可以按 `Ctrl+Shift+P` 打开命令面板（macOS 使用 `Cmd+Shift+P`），然后运行 `Set Commit Language for Current Repository`。该命令只会为当前仓库写入工作区或文件夹级覆盖，不会改动全局默认设置。

> **Note**\
> 该命令会将语言选择保存为 VS Code 的工作区或文件夹级设置。在单文件夹仓库中，通常会写入 `.vscode/settings.json`；如果该文件被 Git 跟踪，你可能会在变更列表中看到它。

> **Note**\
> 如果 diff 超过当前模型的上下文窗口，请分批暂存并分别生成提交消息。

## 配置

> **Note**\
> 自 `0.0.5` 起，不再需要配置 `EMOJI_ENABLED` 和 `FULL_GITMOJI_SPEC`。默认 Gitmoji 提示词为 [prompt/with_gitmoji.md](./prompt/with_gitmoji.md)。如果不需要 Gitmoji 输出，请将 `AI_COMMIT_SYSTEM_PROMPT` 指向你的自定义提示词，并参考 [prompt/without_gitmoji.md](./prompt/without_gitmoji.md)。

所有设置都位于 VS Code 的 `ai-commit-plus.` 前缀下：

| 配置项 | 类型 | 默认值 | 必填 | 说明 |
| :--- | :---: | :---: | :---: | :--- |
| `PROVIDER_PROFILES` | array | `[]` | 否 | 存储多个供应商配置，API Key 保存在 VS Code SecretStorage |
| `ACTIVE_PROVIDER_PROFILE_ID` | string | None | 否 | 当前激活的 profile id，可按工作区或仓库覆盖 |
| `AI_COMMIT_LANGUAGE` | string | `English` | 是 | 支持 19 种语言，并支持按仓库覆盖 |
| `AI_COMMIT_SYSTEM_PROMPT` | string | None | 否 | 自定义提交消息系统提示词 |

### Provider profile 工作流

使用 `Manage Provider Profiles` 命令可以创建、编辑、删除或激活 profile。每个 profile 会保存：

- 供应商类型
- 显示名称
- Base URL
- 模型
- Temperature
- Azure API Version
- 保存在 SecretStorage 中的 API Key

## 本地开发

你可以使用 GitHub Codespaces 进行在线开发：

[![][github-codespace-shield]][github-codespace-link]

也可以在本地克隆仓库：

```bash
git clone https://github.com/mizuikk/ai-commit.git
cd ai-commit
npm install
```

在 VS Code 中打开项目后，按 `F5` 即可启动 Extension Development Host。

## 贡献

欢迎提交 Issue 和 Pull Request。Bug、功能建议和讨论都可以通过 [GitHub Issues][github-issues-link] 发起。

[![][pr-welcome-shield]][pr-welcome-link]

### 贡献者

[![][github-contrib-shield]][github-contrib-link]

## 致谢

- **auto-commit** - <https://github.com/lynxife/auto-commit>
- **opencommit** - <https://github.com/di-sukharev/opencommit>

## 许可证

本项目基于 [MIT](./LICENSE) 许可证发布。

[github-codespace-link]: https://codespaces.new/mizuikk/ai-commit
[github-codespace-shield]: https://github.com/mizuikk/ai-commit/blob/main/images/codespaces.png?raw=true
[github-contributors-link]: https://github.com/mizuikk/ai-commit/graphs/contributors
[github-contributors-shield]: https://img.shields.io/github/contributors/mizuikk/ai-commit?color=c4f042&labelColor=black&style=flat-square
[github-downloads-link]: https://github.com/mizuikk/ai-commit/releases
[github-downloads-shield]: https://img.shields.io/github/downloads/mizuikk/ai-commit/total?label=downloads&labelColor=black&style=flat-square
[github-issues-link]: https://github.com/mizuikk/ai-commit/issues
[github-issues-shield]: https://img.shields.io/github/issues/mizuikk/ai-commit?color=ff80eb&labelColor=black&style=flat-square
[github-license-link]: https://github.com/mizuikk/ai-commit/blob/main/LICENSE
[github-license-shield]: https://img.shields.io/github/license/mizuikk/ai-commit?color=white&labelColor=black&style=flat-square
[github-release-link]: https://github.com/mizuikk/ai-commit/releases
[github-release-shield]: https://img.shields.io/github/v/release/mizuikk/ai-commit?display_name=tag&label=release&color=blue&labelColor=black&style=flat-square
[github-stars-link]: https://github.com/mizuikk/ai-commit/stargazers
[github-stars-shield]: https://img.shields.io/github/stars/mizuikk/ai-commit?color=ffcb47&labelColor=black&style=flat-square
[pr-welcome-link]: https://github.com/mizuikk/ai-commit/pulls
[pr-welcome-shield]: https://img.shields.io/badge/PRs-welcome-ffcb47?labelColor=black&style=for-the-badge
[github-contrib-link]: https://github.com/mizuikk/ai-commit/graphs/contributors
[github-contrib-shield]: https://contrib.rocks/image?repo=mizuikk%2Fai-commit
