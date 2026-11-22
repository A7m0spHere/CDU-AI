# 工具目录核对与取舍记录

> 本文归档 [`src/data/tools.ts`](../../src/data/tools.ts) 各批次（2026-10-24 至 2026-11-15）的官方入口核对依据、名称/仓库迁移、许可边界与暂缓/不收录取舍；现行分类与字段规则见[内容维护规范](../CONTENT-GUIDE.md#6-工具数据)，视图与分区实现见[工具目录开发说明](../modules/tool-catalog.md)，图标来源见[工具图标记录](../TOOL-LOGOS.md)。
>
> 各批次核对范围为官网、官方文档、仓库 README、许可证与维护状态，未逐个平台注册账号、配置密钥或执行真实模型任务测试；价格仅记录模式或使用条件，不写具体金额。

## 1. Agent 与 Personal Agent 核对记录（2026-10-24、2026-11-15）

### 1.1 主流与社区 Agent（2026-10-24）

| 工具 | 官方入口 | 代码仓库 / 性质 |
| --- | --- | --- |
| GitHub Copilot | [官网 / 官方介绍](https://github.com/features/copilot) | 闭源产品，不附实现仓库（卡片以是否与显式 `githubUrl` 相同判断仓库入口） |
| TRAE | [官网 / 官方介绍](https://www.trae.cn/) | 闭源产品，不附实现仓库 |
| Qwen Code | [官网 / 官方介绍](https://qwenlm.github.io/qwen-code-docs/en/users/overview/) | [仓库](https://github.com/QwenLM/qwen-code) |
| Google Antigravity | [官网 / 官方介绍](https://antigravity.google/) | 闭源产品，不附实现仓库 |
| Manus | [官网 / 官方介绍](https://manus.im/) | 闭源产品（[官方公告](https://manus.im/blog/manus-joins-meta-for-next-era-of-innovation)说明加入 Meta 并继续从新加坡运营，按海外产品展示） |
| OpenClaw | [官网 / 官方介绍](https://openclaw.ai/) | [仓库](https://github.com/openclaw/openclaw) |
| OpenHands | [官网 / 官方介绍](https://www.openhands.dev/) | [仓库](https://github.com/OpenHands/OpenHands) |
| Devin Desktop | [官网 / 官方介绍](https://devin.ai/desktop) | 闭源产品，不附实现仓库 |
| Pi | [官网 / 官方介绍](https://pi.dev/) | [仓库](https://github.com/earendil-works/pi) |
| Oh My Pi | [官网 / 官方介绍](https://omp.sh/) | [仓库](https://github.com/can1357/oh-my-pi) |
| Goose | [官网 / 官方介绍](https://goose-docs.ai/) | [仓库](https://github.com/aaif-goose/goose) |
| Hermes Agent | [官网 / 官方介绍](https://hermes-agent.nousresearch.com/) | [仓库](https://github.com/NousResearch/hermes-agent) |
| Aider | [官网 / 官方介绍](https://aider.chat/) | [仓库](https://github.com/Aider-AI/aider) |
| Open Interpreter | [官网 / 官方介绍](https://www.openinterpreter.com/cli) | [仓库](https://github.com/openinterpreter/openinterpreter) |
| mini-SWE-agent | [官网 / 官方介绍](https://mini-swe-agent.com/latest/) | [仓库](https://github.com/SWE-agent/mini-swe-agent) |
| LangGraph | [官网 / 官方介绍](https://www.langchain.com/langgraph) | [仓库](https://github.com/langchain-ai/langgraph) |

### 1.2 模型厂商自家 Agent（2026-10-24）

| 工具 | 厂商 | 官方入口 | 代码仓库 | 与同厂商聊天产品的区别 |
| --- | --- | --- | --- | --- |
| ZCode | Z.ai（智谱 / BigModel） | [zcode.z.ai](https://zcode.z.ai/) | [zai-org/ZCode](https://github.com/zai-org/ZCode)（Apache-2.0） | 编程 Harness，不是聊天入口；聊天产品是 `chat.z.ai` |
| WorkBuddy | 腾讯 | [workbuddy.cn](https://www.workbuddy.cn/) | 未找到产品源码仓库 | 办公 Agent 工作台；聊天产品是腾讯元宝 |
| Qoder | 阿里云 | [qoder.com](https://qoder.com/)（中国站 `qoder.com.cn`） | 官方组织 [QoderAI](https://github.com/QoderAI)，未见 CLI / 桌面端产品源码（未填 `githubUrl`） | 智能体工作台；聊天产品是 Qwen Chat，Qwen Code 是另一个开源终端 Agent；条目 `caution` 写明国际站与中国站入口分开 |
| Kimi Code | 月之暗面 | [kimi.com/code](https://www.kimi.com/code/zh) | [MoonshotAI/kimi-code](https://github.com/MoonshotAI/kimi-code)（MIT，CLI） | 同一会员体系下的编程服务，与 Kimi 网页/App 共享额度 |
| MiniMax Code | MiniMax | [agent.minimax.cn](https://agent.minimax.cn/) | [MiniMax-AI/minimax-code](https://github.com/MiniMax-AI/minimax-code)（MIT，CLI） | 桌面 Agent，不是 MiniMax 开放平台；CLI 名为 MCode |

> 说明：DSH（DeepSeek Harness）与 Qwen Code 属于厂商官方开源工具，分别依据 [DSH 官网](https://deepseek.com/harness/)、[Qwen Code 官方文档](https://qwenlm.github.io/qwen-code-docs/en/index) 归入国内工具，补充 `DSH` 搜索别名；Hermes Agent 依据[官方文档](https://hermes-agent.nousresearch.com/docs/)归入海外工具；社区开源项目默认展示名单集中在 [`src/data/tool-sections.mjs`](../../src/data/tool-sections.mjs) 的 `collapse.featuredIds` 维护。

### 1.3 Personal Agent · 个人助理（2026-11-15）

在「Agent 与 Harness」新增个人助理分区，除已有 OpenClaw、Hermes Agent 移入外，新增 4 项入口：

| 条目 | 本轮核对的能力与接入条件 | 官方依据 |
| --- | --- | --- |
| Grok Bot | 持续云电脑、跨设备任务、Skills 与定时流程；长期使用依赖支持该产品的付费方案，部分账号提供试用 | [产品入口](https://x.ai/bot)、[官方 FAQ](https://docs.x.ai/grok-bot/faq) |
| Meta Muse | 个人目标、邮件与日历、云电脑和 WhatsApp 入口；开放地区、账号资格与订阅按实际入口核对 | [产品官网](https://muse.ai/)、[Meta 产品介绍](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/) |
| OpenAI Dots | ChatGPT 记忆、应用连接、云电脑与跨对话持续工作；当前向支持地区的 Pro、Business Premium、Enterprise 开放 | [产品介绍](https://chatgpt.com/features/dots/) |
| Claude Duet | 连接应用、每日简报、邮件日程和后台任务；美国 Pro、Max、Ultra 用户通过邀请进入研究预览 | [产品介绍](https://claude.com/resources/articles/claude-duet)、[接入说明](https://support.claude.com/en/articles/17631495-get-started-with-claude-duet) |

## 2. 通用工具与 API 平台增补依据（2026-10-24—2026-10-28）

### 2.1 对话、创作、科研、客户端与本地工具

| 条目 | 官方核对入口 | 核对要点与说明 |
| --- | --- | --- |
| Grok / 智谱清言 / 腾讯元宝 | [grok.com](https://grok.com/) / [chatglm.cn](https://chatglm.cn/) / [yuanbao.tencent.com](https://yuanbao.tencent.com/) | 对话与任务入口；`ChatGLM` 别名归智谱清言，Z.ai 保留其现有入口 |
| Civitai / RunningHub / AutoDL 算力云 / Google Colab | [civitai.com](https://civitai.com/) / [runninghub.cn](https://www.runninghub.cn/) / [autodl.com](https://www.autodl.com/) / [colab.research.google.com](https://colab.research.google.com/) | 创作资源社区、云端 ComfyUI 工作流、GPU 实例与托管 Notebook（Colab 不是模型下载社区） |
| Cherry Studio / RikkaHub | [cherryai.com](https://cherryai.com/)（[仓库](https://github.com/CherryHQ/cherry-studio)） / [rikka-ai.com](https://rikka-ai.com/)（[仓库](https://github.com/rikkahub/rikkahub)） | 多模型客户端（均为 AGPL-3.0）；RikkaHub 为 Android 多模型聊天客户端，需自行配置模型服务，不标 `local` |
| Gamma / Canva AI / 万相 Wan / 海螺 AI | [gamma.app](https://gamma.app/) / [canva.com](https://www.canva.com/canva-ai/) / [wan.video](https://wan.video/) / [hailuoai.video](https://hailuoai.video/) | 演示文稿、设计与视频创作；即梦（[jimeng.jianying.com](https://jimeng.jianying.com/)）、可灵（[kling.ai](https://kling.ai/)）、Runway（[runway.com](https://runway.com/)）与万相按主用途归类并在简介保留多模态创作能力 |
| 沉浸式翻译 / 通义听悟 / Consensus / MinerU | [immersivetranslate.com](https://immersivetranslate.com/zh-Hans/) / [tingwu.aliyun.com](https://tingwu.aliyun.com/) / [consensus.app](https://consensus.app/) / [mineru.net](https://mineru.net/)（[仓库](https://github.com/opendatalab/MinerU)） | 对照阅读、录音转写、论文检索与结构化文档解析；MinerU 依据官网范围独立归入 `ocr` |
| WPS AI / Notion AI / Zotero / Obsidian | [x.wps.cn](https://x.wps.cn/)（[功能介绍](https://plus.wps.cn/blog/p109234.html)） / [notion.com](https://www.notion.com/zh-cn/product/ai) / [zotero.org](https://www.zotero.org/)（[仓库](https://github.com/zotero/zotero)） / [obsidian.md](https://obsidian.md/) | 办公文档归 AIGC；知识库与文献管理归搜索科研。Zotero 使用 AGPL-3.0；Obsidian 依据[许可说明](https://obsidian.md/license)不标开源，Zotero 联动需[社区插件](https://community.obsidian.md/plugins/obsidian-zotero-desktop-connector) |
| RAGFlow / Browser Use / CrewAI / llama.cpp | [ragflow.io](https://ragflow.io/) / [browser-use.com](https://browser-use.com/) / [crewai.com](https://crewai.com/) / [llama.app](https://llama.app/) | 开源项目（Apache-2.0 / MIT）；llama.cpp 保留引擎定位并说明 `llama.app` 同时提供桌面应用 |

### 2.2 API 与开发平台

| 平台 | 官方核对依据 | 说明 |
| --- | --- | --- |
| Google AI Studio / 阿里云百炼 / 硅基流动 / OpenRouter / 火山方舟 | [AI Studio](https://ai.google.dev/gemini-api/docs/ai-studio-quickstart) / [百炼说明](https://help.aliyun.com/zh/model-studio/what-is-model-studio) / [SiliconFlow](https://www.siliconflow.cn/) / [OpenRouter](https://openrouter.ai/) / [火山方舟](https://www.volcengine.com/product/ark) | 模型工作台、聚合与推理平台；百炼归国内聚合与推理平台 |
| DeepSeek / 智谱 BigModel / Kimi / MiniMax 开放平台 | [DeepSeek](https://platform.deepseek.com/) / [BigModel](https://bigmodel.cn/) / [Kimi](https://platform.kimi.com/) / [MiniMax](https://platform.minimax.cn/) | 厂商接口与开发平台；与同厂商聊天产品分开维护 |
| 腾讯云 TokenHub / 百度千帆 / 阶跃星辰 / 讯飞星火 / 小米 MiMo / Qwen API | [TokenHub 简介](https://cloud.tencent.com/document/product/1823/130050)（[迁移公告](https://cloud.tencent.com/announce/detail/2287)） / [千帆文档](https://cloud.baidu.com/doc/Qianfan/index.html) / [阶跃星辰](https://platform.stepfun.com/) / [星火 API](https://xinghuo.xfyun.cn/sparkapi)（[HTTP 文档](https://www.xfyun.cn/doc/spark/HTTP调用文档.html)） / [MiMo 文档](https://mimo.mi.com/docs/zh-CN/quick-start/summary/first-api-call) / [Qwen API](https://qwen.ai/apiplatform)（[百炼调用文档](https://help.aliyun.com/zh/model-studio/first-api-call-to-qwen)） | Qwen API 作为厂商官方接入指引展示，实际凭证、地区与计费按百炼接入平台核对 |
| OpenAI / Claude / Grok / Mistral Studio / Cohere 开发平台 | [OpenAI](https://developers.openai.com/api/reference/overview) / [Claude](https://platform.claude.com/docs/en/api/overview) / [Grok](https://docs.x.ai/overview) / [Mistral Studio](https://docs.mistral.ai/getting-started/platform-overview) / [Cohere](https://docs.cohere.com/) | 海外模型厂商开发平台 |
| Tavily / fal.ai | [tavily.com](https://www.tavily.com/) / [fal.ai](https://fal.ai/) | 专用接口（Tavily 明确为搜索服务 API）；n8n 运营方归属依据[公司信息](https://n8n.io/imprint/)归海外 |

## 3. 名称迁移、去重与许可边界

- **名称与仓库迁移**：
  - **Pi**：使用官网 [pi.dev](https://pi.dev/) 与当前仓库 [earendil-works/pi](https://github.com/earendil-works/pi)；保留 `pi-mono`、`badlogic/pi-mono` 搜索别名（指编码 Agent Harness）。
  - **Goose**：加入 Agentic AI Foundation，使用 [goose-docs.ai](https://goose-docs.ai/) 与 [aaif-goose/goose](https://github.com/aaif-goose/goose)；保留 `Block Goose` 及旧仓库名作为别名。
  - **Open Interpreter**：使用当前 CLI 架构与仓库 [openinterpreter/openinterpreter](https://github.com/openinterpreter/openinterpreter)。
  - **Devin Desktop**：原 Windsurf 现名，旧名保留为搜索别名，不重复建条目。
  - **Qoder**：CN 系列原名「通义灵码」（2026-05-20 更名），保留旧名别名。
  - **MiniMax Code**：口语称呼「Mini Code」无同名官方产品，以官方名称入库并保留 `Mini Code`（及 CLI 名 `MCode`）作为别名。
  - **其他别名与域名跳转**：`TokenHub` 保留旧混元名称为别名；`Mistral Studio` 保留 `La Plateforme` 为别名；`platform.moonshot.cn` 跳转至 `platform.kimi.com`，`platform.minimaxi.com` 跳转至 `platform.minimax.cn` 文档入口，均采用当前域名；同一平台的登录页、密钥页与文档页不重复入库。
- **开源与本地部署标签边界**：
  - 源码可获取但含附加限制条款的项目省略 `open-source` 能力标签，在 `caution` 说明边界：例如 [MinerU LICENSE.md](https://github.com/opendatalab/MinerU/blob/master/LICENSE.md)（含商业门槛与在线服务标识义务）、[n8n LICENSE.md](https://github.com/n8n-io/n8n/blob/master/LICENSE.md)、[Dify LICENSE](https://github.com/langgenius/dify/blob/main/LICENSE)。
  - 在线对话产品（如 Qwen Chat）不借用关联模型开放权重的标签；客户端在本地运行但需连接云端模型时（如 RikkaHub）不标为 `local`；软件开源或本地运行不代表云端模型调用免费或完全离线。

## 4. 暂缓、移除与未收录依据

- **未作为活跃工具收录（维护状态）**：
  - [Continue](https://github.com/continuedev/continue)：README 明确说明仓库不再积极维护、对用户只读并发布最终版本，因此不新增。
  - [Roo Code](https://github.com/RooCodeInc/Roo-Code)：核对时仓库已归档，不作为活跃工具新增。
- **复看移除或停止服务（2026-10-24、2026-11-15）**：
  - **QClaw**：[官网公告](https://claw.guanjia.qq.com/)已停止新用户注册与订阅购买，计划于 2026-12-24 停止服务并引导迁移至 WorkBuddy，未保留为新增项。
  - **AutoClaw / LobsterAI / QwenPaw**：Personal Agent 批次复看页面后按维护者要求移除。
  - **Open WebUI**：按维护者要求在 2026-10-24 目录精简时移除（其 [LICENSE](https://github.com/open-webui/open-webui/blob/main/LICENSE) 含品牌保留条件）。
  - **11 个独立模型条目**：为保持目录聚焦可直接使用的产品与平台入口，于 2026-10-24 移除 FLUX、Stable Diffusion、Qwen-Image、Nano Banana、Veo、LTX-Video、CosyVoice、Fish Speech、IndexTTS、Whisper、Qwen3-ASR；万相仅保留网页创作入口，移除模型下载仓库。
- **早期书签筛选暂缓项（2026-10-24）**：
  - **RWKV、updream、NovelAI、互动文字游戏页、OpenCode Zen**：场景较专门或先由同类代表覆盖，待后续有明确使用场景再补。
  - **Dots API、Home**：仅凭截图无法确认唯一官方网址，不猜测入库。
  - **AutoDL.ART**：不与 AutoDL GPU 实例平台混为同一条目，创作需求先由已有工作流工具覆盖。
