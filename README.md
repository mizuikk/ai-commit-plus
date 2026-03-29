<a name="readme-top"></a>

<div align="center">

<img height="120" src="./images/logo.png" alt="AI Commit Plus logo">

<h1>AI Commit Plus</h1>

Use OpenAI / Azure OpenAI / DeepSeek / Gemini APIs to review staged Git changes, generate conventional commit messages, and keep commit conventions consistent across repositories.

> This project is a fork of [Sitoi/ai-commit](https://github.com/Sitoi/ai-commit), with independent branding, release workflow, and repository-level language override improvements.

**English** · [简体中文](./README.zh_CN.md) · [Report Bug][github-issues-link] · [Request Feature][github-issues-link]

[![][github-release-shield]][github-release-link]
[![][github-downloads-shield]][github-downloads-link]
[![][github-contributors-shield]][github-contributors-link]
[![][github-stars-shield]][github-stars-link]
[![][github-issues-shield]][github-issues-link]
[![][github-license-shield]][github-license-link]

![](./aicommit.gif)

</div>

## Features

- Generate commit messages from staged diffs with OpenAI / Azure OpenAI / DeepSeek / Gemini.
- Support multi-language commit messages.
- Support repository-level language overrides for multi-project workflows.
- Support Gitmoji prompts.
- Support custom system prompts.
- Support Conventional Commits.

## Installation

1. Download the latest `.vsix` asset from [GitHub Releases][github-release-link].
2. In VS Code, run `Extensions: Install from VSIX...`.
3. Select the downloaded `ai-commit-plus-<version>.vsix` package.

> **Note**\
> Use Node.js `24.14.1` or later for local development and packaging.

## Usage

1. Install and enable `AI Commit Plus`.
2. In VS Code settings, configure the `ai-commit-plus` settings namespace.
3. Stage the changes you want to include in the commit.
4. Optional: enter extra context in the Source Control message box before generating the commit message.
5. Click the `AI Commit Plus` action in the Source Control title area.
6. Review the generated message and commit if it looks correct.

If you switch between repositories that require different commit languages, run `Set Commit Language for Current Repository` from the Command Palette. It stores a workspace or folder override only for the active repository.

> **Note**\
> If your diff is too large for the configured model context window, stage and generate the commit in smaller batches.

## Configuration

> **Note**\
> Since `0.0.5`, `EMOJI_ENABLED` and `FULL_GITMOJI_SPEC` are no longer required. The default Gitmoji prompt is [prompt/with_gitmoji.md](./prompt/with_gitmoji.md). If you do not want Gitmoji output, set `AI_COMMIT_SYSTEM_PROMPT` to your own prompt and start from [prompt/without_gitmoji.md](./prompt/without_gitmoji.md).

All settings live under the `ai-commit-plus.` prefix in VS Code:

| Setting | Type | Default | Required | Notes |
| :--- | :---: | :---: | :---: | :--- |
| `AI_PROVIDER` | string | `openai` | Yes | Supported values: `openai`, `gemini` |
| `OPENAI_API_KEY` | string | None | Yes* | Required when `AI_PROVIDER` is `openai` |
| `OPENAI_BASE_URL` | string | None | No | For Azure, use `https://{resource}.openai.azure.com/openai/deployments/{model}` |
| `OPENAI_MODEL` | string | `gpt-4o` | Yes* | You can update it with `Show Available OpenAI Models` |
| `AZURE_API_VERSION` | string | None | No | Azure OpenAI API version |
| `OPENAI_TEMPERATURE` | number | `0.7` | No | Valid range: `0` to `2` |
| `GEMINI_API_KEY` | string | None | Yes* | Required when `AI_PROVIDER` is `gemini` |
| `GEMINI_MODEL` | string | `gemini-2.0-flash-001` | Yes* | Gemini model name |
| `GEMINI_TEMPERATURE` | number | `0.7` | No | Valid range: `0` to `2` |
| `AI_COMMIT_LANGUAGE` | string | `English` | Yes | Supports 19 languages and repository-level overrides |
| `AI_COMMIT_SYSTEM_PROMPT` | string | None | No | Custom system prompt for commit generation |

## Local Development

You can develop online with GitHub Codespaces:

[![][github-codespace-shield]][github-codespace-link]

Or clone the repository locally:

```bash
git clone https://github.com/mizuikk/ai-commit.git
cd ai-commit
npm install
```

Open the project in VS Code and press `F5` to launch an Extension Development Host.

## Contributing

Issues and pull requests are welcome. Use [GitHub Issues][github-issues-link] for bugs, feature requests, and discussion.

[![][pr-welcome-shield]][pr-welcome-link]

### Contributors

[![][github-contrib-shield]][github-contrib-link]

## Credits

- **auto-commit** - <https://github.com/lynxife/auto-commit>
- **opencommit** - <https://github.com/di-sukharev/opencommit>

## License

This project is [MIT](./LICENSE) licensed.

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
