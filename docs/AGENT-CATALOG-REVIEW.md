# Agent 工具补充核对记录

核对日期：2026-10-24。核对范围为官网、官方文档、仓库 README、许可证与维护状态；价格只记录模式，不写具体额度。此记录不代表已安装或完成真实模型任务测试。

## 本次新增

主流产品、社区工具和开发框架分别标明形态；LangGraph 放入「Agent 工作流与开发」，通过次级分类在 Agent 筛选中可见。

| 工具 | 主分类 | 官方入口 | 代码仓库 |
| --- | --- | --- | --- |
| GitHub Copilot | Agent 与 Harness | [官网 / 官方介绍](https://github.com/features/copilot) | 闭源产品，不附实现仓库 |
| TRAE | Agent 与 Harness | [官网 / 官方介绍](https://www.trae.cn/) | 闭源产品，不附实现仓库 |
| Qwen Code | Agent 与 Harness | [官网 / 官方介绍](https://qwenlm.github.io/qwen-code-docs/en/users/overview/) | [仓库](https://github.com/QwenLM/qwen-code) |
| Google Antigravity | Agent 与 Harness | [官网 / 官方介绍](https://antigravity.google/) | 闭源产品，不附实现仓库 |
| Manus | Agent 与 Harness | [官网 / 官方介绍](https://manus.im/) | 闭源产品，不附实现仓库 |
| OpenClaw | Agent 与 Harness | [官网 / 官方介绍](https://openclaw.ai/) | [仓库](https://github.com/openclaw/openclaw) |
| OpenHands | Agent 与 Harness | [官网 / 官方介绍](https://www.openhands.dev/) | [仓库](https://github.com/OpenHands/OpenHands) |
| Devin Desktop | Agent 与 Harness | [官网 / 官方介绍](https://devin.ai/desktop) | 闭源产品，不附实现仓库 |
| Pi | Agent 与 Harness | [官网 / 官方介绍](https://pi.dev/) | [仓库](https://github.com/earendil-works/pi) |
| Oh My Pi | Agent 与 Harness | [官网 / 官方介绍](https://omp.sh/) | [仓库](https://github.com/can1357/oh-my-pi) |
| Goose | Agent 与 Harness | [官网 / 官方介绍](https://goose-docs.ai/) | [仓库](https://github.com/aaif-goose/goose) |
| Hermes Agent | Agent 与 Harness | [官网 / 官方介绍](https://hermes-agent.nousresearch.com/) | [仓库](https://github.com/NousResearch/hermes-agent) |
| Aider | Agent 与 Harness | [官网 / 官方介绍](https://aider.chat/) | [仓库](https://github.com/Aider-AI/aider) |
| Open Interpreter | Agent 与 Harness | [官网 / 官方介绍](https://www.openinterpreter.com/cli) | [仓库](https://github.com/openinterpreter/openinterpreter) |
| mini-SWE-agent | Agent 与 Harness | [官网 / 官方介绍](https://mini-swe-agent.com/latest/) | [仓库](https://github.com/SWE-agent/mini-swe-agent) |
| LangGraph | Agent 工作流与开发 | [官网 / 官方介绍](https://www.langchain.com/langgraph) | [仓库](https://github.com/langchain-ai/langgraph) |

## 名称与迁移

- Pi 使用官网 [pi.dev](https://pi.dev/) 与当前仓库 [earendil-works/pi](https://github.com/earendil-works/pi)；保留 `pi-mono`、`badlogic/pi-mono` 等搜索别名。这里指编码 Agent Harness，不是同名聊天产品。
- Goose 已加入 Agentic AI Foundation，使用 [goose-docs.ai](https://goose-docs.ai/) 与 [aaif-goose/goose](https://github.com/aaif-goose/goose)；保留 `Block Goose` 和旧仓库名作为搜索别名。
- Open Interpreter 当前 CLI 的仓库为 [openinterpreter/openinterpreter](https://github.com/openinterpreter/openinterpreter)，介绍按当前 CLI 架构整理，不沿用旧版 Python 解释器安装说明。
- Windsurf 的当前名称为 [Devin Desktop](https://devin.ai/desktop)，旧名保留为别名，不重复创建两条工具。

## 未作为活跃工具新增

- [Continue](https://github.com/continuedev/continue)：README 明确说明仓库不再积极维护、对用户只读，并发布最终版本。即使 GitHub `archived` 标记尚未设置或近期有提交，也优先采用 README 的维护说明。
- [Roo Code](https://github.com/RooCodeInc/Roo-Code)：核对时仓库已归档，因此不作为活跃工具新增。

## 图标与链接

- 图标自托管，逐项来源见 [TOOL-LOGOS.md](TOOL-LOGOS.md)。彩色图标保留原色；只有黑白灰的近黑图标适用深色反色。
- GitHub Copilot 官网位于 `github.com/features/copilot`，它是产品页。卡片以是否与显式 `githubUrl` 相同来判断仓库入口，不再把整个 GitHub 域名都当成代码仓库。
- 软件开源或本地运行不代表云端模型免费或请求完全离线；条目分别说明模型费用、配置与托管服务的边界。
