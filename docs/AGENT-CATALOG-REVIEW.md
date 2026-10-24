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

## 厂商自家 Agent 追加（2026-10-24）

用户要求补充「模型厂商自己的 Agent 工具」。按官网、官方文档与官方仓库核对后新增 5 条，全部为 `tier: '主流产品'`，默认直接显示：

| 工具 | 厂商 | 官方入口 | 代码仓库 | 与同厂商聊天产品的区别 |
| --- | --- | --- | --- | --- |
| ZCode | Z.ai（智谱 / BigModel） | [zcode.z.ai](https://zcode.z.ai/) | [zai-org/ZCode](https://github.com/zai-org/ZCode)（Apache-2.0） | 编程 Harness，不是聊天入口；聊天产品是 chat.z.ai |
| WorkBuddy | 腾讯 | [workbuddy.cn](https://www.workbuddy.cn/) | 未找到产品源码仓库 | 办公 Agent 工作台；聊天产品是腾讯元宝 |
| Qoder | 阿里云 | [qoder.com](https://qoder.com/)（中国站 qoder.com.cn） | 官方组织 [QoderAI](https://github.com/QoderAI)，未见产品源码 | 智能体工作台；聊天产品是 Qwen Chat，Qwen Code 是另一个开源终端 Agent |
| Kimi Code | 月之暗面 | [kimi.com/code](https://www.kimi.com/code/zh) | [MoonshotAI/kimi-code](https://github.com/MoonshotAI/kimi-code)（MIT，CLI） | 同一会员体系下的编程服务，与 Kimi 网页/App 共享额度 |
| MiniMax Code | MiniMax | [agent.minimax.cn](https://agent.minimax.cn/) | [MiniMax-AI/minimax-code](https://github.com/MiniMax-AI/minimax-code)（MIT，CLI） | 桌面 Agent，不是 MiniMax 开放平台；CLI 名为 MCode |

命名与取舍说明：

- 用户口中的「Mini Code」没有查到同名的官方产品；官方名称为 **MiniMax Code**，终端 CLI 名为 MCode。条目以官方名称入库，「Mini Code」仅作为搜索别名保留。
- Qoder CN 系列原名「通义灵码」，2026-05-20 更名；国际站与中国站账号、套餐是否互通未核对，条目 `caution` 已写明两个入口分开。
- WorkBuddy 官网只提供 SVG 标志，未找到官方 apple-touch-icon / PWA PNG；按矢量图规范使用 SVG，未从安装包提取位图。
- Qoder 未填 `githubUrl`：官方组织里只有 SDK、Action 与 changelog，未见 CLI / 桌面端产品源码，避免把组织页当作产品仓库。
- 本轮未登录任何厂商账号，未安装客户端，也未执行真实模型任务；价格只记录订阅或积分模式，不写具体金额。

## 名称与迁移

- Pi 使用官网 [pi.dev](https://pi.dev/) 与当前仓库 [earendil-works/pi](https://github.com/earendil-works/pi)；保留 `pi-mono`、`badlogic/pi-mono` 等搜索别名。这里指编码 Agent Harness，不是同名聊天产品。
- Goose 已加入 Agentic AI Foundation，使用 [goose-docs.ai](https://goose-docs.ai/) 与 [aaif-goose/goose](https://github.com/aaif-goose/goose)；保留 `Block Goose` 和旧仓库名作为搜索别名。
- Open Interpreter 当前 CLI 的仓库为 [openinterpreter/openinterpreter](https://github.com/openinterpreter/openinterpreter)，介绍按当前 CLI 架构整理，不沿用旧版 Python 解释器安装说明。
- Windsurf 的当前名称为 [Devin Desktop](https://devin.ai/desktop)，旧名保留为别名，不重复创建两条工具。

## 分组与默认展示（2026-10-24）

按维护者要求依次展示「国内工具」「海外工具」「社区项目」，使用 `catalogGroup` 明确归属，不再按 `tier` 判断一个工具是否属于社区。全部 32 个 Agent 相关条目（含次要分类）均保留，不增加重复条目。

- 国内工具包含 DSH（DeepSeek Harness）、TRAE、Qwen Code、ZCode、WorkBuddy、Qoder、Kimi Code、MiniMax Code、扣子 Coze。
- DSH 和 Qwen Code 属于厂商官方开源工具，从社区区移到国内工具；Hermes Agent 由模型团队 Nous Research 推出，移到海外工具。依据分别见 [DSH 官网](https://deepseek.com/harness/)、[Qwen Code 官方文档](https://qwenlm.github.io/qwen-code-docs/en/index)、[Hermes 官方文档](https://hermes-agent.nousresearch.com/docs/)。
- 社区区指独立开发者及第三方社区维护的工具，不代表没有官网或维护组织；模型厂商自己的官方 Agent 不归入这一组。OpenCode、Pi、OpenClaw 默认直接显示，其余社区项目收进「更多社区 Agent 与 Harness」折叠区。
- Manus 按海外产品展示，其[官方公告](https://manus.im/blog/manus-joins-meta-for-next-era-of-innovation)说明加入 Meta 并继续从新加坡运营。

折叠只影响默认展开状态：进入或切换场景分类时保持收起，可手动展开；搜索或能力筛选生效时自动展开匹配条目，清除后恢复收起。结果数量与搜索索引仍按完整目录计算。默认展示名单在 `src/data/tools.ts` 的 `agentSpotlightIds` 维护；官方工具不会进入社区折叠区。补充 `DSH` 搜索别名，名称仍沿用 DeepSeek Harness。

## 未作为活跃工具新增

- [Continue](https://github.com/continuedev/continue)：README 明确说明仓库不再积极维护、对用户只读，并发布最终版本。即使 GitHub `archived` 标记尚未设置或近期有提交，也优先采用 README 的维护说明。
- [Roo Code](https://github.com/RooCodeInc/Roo-Code)：核对时仓库已归档，因此不作为活跃工具新增。

## 图标与链接

- 图标自托管，逐项来源见 [TOOL-LOGOS.md](TOOL-LOGOS.md)。彩色图标保留原色；只有黑白灰的近黑图标适用深色反色。
- GitHub Copilot 官网位于 `github.com/features/copilot`，它是产品页。卡片以是否与显式 `githubUrl` 相同来判断仓库入口，不再把整个 GitHub 域名都当成代码仓库。
- 软件开源或本地运行不代表模型请求完全离线；云端模型可能另行计费，条目分别说明模型费用、配置与托管服务的边界。
