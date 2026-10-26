# 术语选题清单（M0）

> 状态：**选题规划**。逐条「口径」是 `definition` 草稿，**未经人工审校，不是定稿**；来源只写候选方向，起草时核实可打开再写入 `sources`。
> 分类目标、分批节奏与分工见 [术语库规划](GLOSSARY-PLAN.md)，字段与写法见 [内容维护规范](CONTENT-GUIDE.md#5-术语表)，审校规则见 [CONTENT-REVIEW.md](CONTENT-REVIEW.md)。
> 起草流程：复制 [`_TEMPLATE.md`](../src/content/glossary/_TEMPLATE.md) → 填字段与正文 → 来源核实可打开 → `npm run verify` → 真人按 [审校清单](CONTENT-REVIEW.md#5-审校清单逐项过) 核校签字后才填 `reviewed`。

## 0. 怎么用这份清单

- 每条给出：文件名（即词条 id）、口径草稿、写作要点与「不成立」边界、`related` 目标。条数与分类顺序和 [`glossary.ts`](../src/data/glossary.ts) 的分支树一致。
- **口径草稿供人审校改写**，目标长度 ≤60 字（`definition` 上限）；定稿以人签字为准。
- **`related` 是目标态**：`npm run check:content` 要求 `related` 只引用已存在的词条，因此先落地的条目只写已存在引用，随批次推进补齐连线。
- 文件名沿用已有惯例（`hallucination.md`）：英文小写与连字符，不加序号前缀；`order` 在同一分类内从 1 连续。
- 两类正文结构不同（AI 主分支六段 / 延伸分支四段短文），每个分类表格后标注；可选区块（`youMaySay` / `scenario` / `quiz` / `agentPrompt`）不是每条都写，写法见模板。
- 新词条至少 1 条官方文档或原始论文来源；没有可打开的一手来源就不发布该条。

## 1. AI 主分支（40 条）

### 1.1 基础 basics（8 条）——六段结构

| # | 术语 | 文件 | 口径草稿（≤60 字） | 不成立边界 / 写作要点 | related（目标态） |
| --- | --- | --- | --- | --- | --- |
| 1 | AI 幻觉 AI Hallucination | `hallucination.md`（已落地） | AI 生成看似可信、但不准确、无依据或虚构的信息。 | 已审校示范条；联网也不必然正确 | — |
| 2 | 大语言模型 LLM | `llm.md` | 用海量文本训练、按概率生成文字的 AI 模型，是对话产品的底座。 | 不是数据库也不是搜索引擎；答得顺≠答得对；不能说明「从哪条学的」 | `token` `training-data` `hallucination` |
| 3 | Token | `token.md` | 模型切分与计量文字的单位，也是最常见的计费单位。 | 不等于字数；不同模型切法不同；中文一字常对应 1–2 个 token | `llm` `usage-based-billing` |
| 4 | 训练数据 Training Data | `training-data.md` | 模型学习时见过的文本集合，决定了它会什么、偏向什么。 | 有截止时间与偏见；「没公开」不等于不存在 | `llm` `bias` `knowledge-cutoff` |
| 5 | 知识截止 Knowledge Cutoff | `knowledge-cutoff.md` | 训练资料的最后时间点；之后发生的事模型没学过。 | 截止≠自动联网；截止后的事一律自己核对来源 | `llm` `hallucination` |
| 6 | 温度 Temperature | `temperature.md` | 控制回答随机程度的设置：调低更稳定，调高更多样。 | 低温度≠更正确，只是更稳定地复述模式 | `llm` `prompt` |
| 7 | 微调 Fine-tuning | `fine-tuning.md` | 用一批自己的例子继续训练模型，让它更贴合特定任务。 | **微调不能可靠记住新事实**（本条校准锚点）；记事实要另想办法 | `training-data` `llm` |
| 8 | 多模态 Multimodal | `multimodal.md` | 不只处理文字，还能理解或生成图像、声音等形式的模型。 | 看得懂图≠精确转录；生成图≠有版权保障 | `llm` `copyright` `deepfake` |

### 1.2 提示词 prompt（8 条）——六段结构

| # | 术语 | 文件 | 口径草稿（≤60 字） | 不成立边界 / 写作要点 | related（目标态） |
| --- | --- | --- | --- | --- | --- |
| 1 | 提示词 Prompt | `prompt.md` | 你发给模型的全部文字指令，决定这次回答什么、怎么回答。 | 不是「关键词」；同一问题不同问法结果差别很大 | `system-prompt` `context-window` |
| 2 | 系统提示词 System Prompt | `system-prompt.md` | 提前设定角色与规则的指令，用户通常看不到，但一直生效。 | 它不是安全边界，也会被带偏 | `prompt` `prompt-injection` |
| 3 | 上下文窗口 Context Window | `context-window.md` | 模型一次能读进去的文字总量；超出部分会被挤掉或截断。 | 超出≠自动查资料；长材料先选重点再问 | `prompt` `token` `truncation` |
| 4 | 少样本示例 Few-shot | `few-shot.md` | 在问题里给几个「输入→输出」样例，让模型照着格式答。 | 教会的是格式与倾向，不保证事实正确 | `prompt` `output-format` |
| 5 | 思维链 Chain-of-Thought | `chain-of-thought.md` | 让模型把推理步骤一步步写出来，而不是直接甩结论。 | 步骤像样≠推理可靠；提高可检查性，不保证正确 | `prompt` `hallucination` |
| 6 | 角色设定 Role Prompting | `role-prompting.md` | 给模型一个身份与口吻，比如「你是耐心的辅导员」。 | 影响语气与视角，不会真的获得该职业的权限和知识 | `prompt` `system-prompt` |
| 7 | 输出格式 Output Format | `output-format.md` | 要求回答以清单、表格、JSON 等固定结构给出。 | 格式对≠内容对；结构越死越要抽查字段含义 | `few-shot` `prompt` |
| 8 | 提示词模板 Prompt Template | `prompt-template.md` | 把常用指令写成可复用框架，换任务只改细节。 | 复用必须随任务微调；不同模型的最优写法不同 | `prompt` `few-shot` |

### 1.3 工具 tools（6 条）——六段结构

| # | 术语 | 文件 | 口径草稿（≤60 字） | 不成立边界 / 写作要点 | related（目标态） |
| --- | --- | --- | --- | --- | --- |
| 1 | 对话助手 Chatbot | `chatbot.md` | 以聊天形式使用 AI 的产品，例如网页版的 DeepSeek、Kimi。 | 是产品不是模型本身；同名模型在不同产品里表现不同；网页版给人点、API 给程序调 | `api` `llm` |
| 2 | API | `api.md` | 让程序调用模型的接口；和网页版是同一个模型的两种用法。 | 要自己写代码；计费与网页版分开算 | `chatbot` `usage-based-billing` `deployment` |
| 3 | AI 编程助手 Coding Assistant | `coding-assistant.md` | 写代码场景的 AI 产品，能补全、解释、改写和生成代码。 | 生成代码要自己跑通、看懂再留；不能盲贴进课程作业 | `code-generation` `debugging` |
| 4 | AI 搜索 AI Search | `ai-search.md` | 把检索和 AI 总结结合的工具，回答里常带来源链接。 | 有链接≠链接支持结论；摘要仍可能以偏概全 | `hallucination` `chatbot` |
| 5 | 本地部署 Local Deployment | `local-deployment.md` | 把模型下载到自己的电脑或服务器上运行，不依赖官方网页。 | 本地≠不联网；硬件有门槛；许可另说 | `open-source-model` `server` |
| 6 | 开源模型 Open-source Model | `open-source-model.md` | 公开了权重或代码的模型，可以自己下载、部署和改造。 | 开放权重≠随便商用；许可各不相同；能力不一定更强 | `local-deployment` `llm` |

### 1.4 Agent agents（7 条）——六段结构

| # | 术语 | 文件 | 口径草稿（≤60 字） | 不成立边界 / 写作要点 | related（目标态） |
| --- | --- | --- | --- | --- | --- |
| 1 | AI Agent 智能体 | `ai-agent.md` | 能自己拆任务、调工具、多步执行，直到完成目标的 AI 系统。 | 不是更会聊天的机器人；每步都可能出错，重要动作要人确认 | `tool-use` `task-planning` |
| 2 | 工具调用 Tool Use | `tool-use.md` | 模型决定该查资料、读文件或发请求，由外接程序代为执行。 | 模型自己不执行；执行的是外接程序，权限要最小化 | `ai-agent` `mcp` |
| 3 | 任务规划 Task Planning | `task-planning.md` | 把大目标拆成可执行的小步骤，再按顺序推进或试错调整。 | 规划可能走偏；计划越长越要中途检查 | `ai-agent` `workflow` |
| 4 | Agent 记忆 Memory | `agent-memory.md` | 让 Agent 跨轮次记住你的偏好、目标和已完成的事。 | 记住≠记得对；装不下时会遗忘或记混 | `ai-agent` `context-window` |
| 5 | 工作流 Workflow | `workflow.md` | 把多个 AI 与工具步骤固定成流水线，按设定自动跑。 | 适合重复任务；意外情况处理不了就会卡住或错下去 | `ai-agent` `task-planning` |
| 6 | MCP | `mcp.md` | 让 AI 连接外部工具和数据源的一种开放协议标准。 | 是接口规范不是模型能力；连上的服务可信度各不相同 | `tool-use` `ai-agent` |
| 7 | 多智能体 Multi-Agent | `multi-agent.md` | 多个各有分工的 Agent 协作完成同一个任务。 | 分工清晰才有用；多个 Agent 会放大错误，不会自动抵消 | `ai-agent` `workflow` |

### 1.5 安全 safety（6 条）——六段结构

| # | 术语 | 文件 | 口径草稿（≤60 字） | 不成立边界 / 写作要点 | related（目标态） |
| --- | --- | --- | --- | --- | --- |
| 1 | 提示词注入 Prompt Injection | `prompt-injection.md` | 藏在网页、文档或输入里的指令，诱导模型执行攻击者的意图。 | 不能靠「别听它」根治；来源不明的内容当数据不当指令 | `jailbreak` `system-prompt` |
| 2 | 越狱 Jailbreak | `jailbreak.md` | 用话术绕过模型的使用限制，让它输出本来拒绝的内容。 | 提示会变种；被拒的规则往往是安全底线，不是可关的开关 | `prompt-injection` |
| 3 | 隐私 Privacy | `privacy.md` | 关于谁能看、存多久、拿去做什么的数据边界问题。 | 对话可能被留存或用于改进；传材料先脱敏；「企业版」≠绝对保密 | `copyright` `prompt-injection` |
| 4 | 版权 Copyright | `copyright.md` | AI 生成内容的来源、引用与商用权利边界。 | 生成物权利归属各地判法不同；模仿风格≠获得授权 | `privacy` `hallucination` |
| 5 | 偏见 Bias | `bias.md` | 模型输出中对人群、性别、地域的系统性倾向，来自数据与设计。 | 一次提问消不掉；涉及评价人的场景必须人复核 | `training-data` `deepfake` |
| 6 | 深度伪造 Deepfake | `deepfake.md` | 用 AI 伪造的逼真声音、图像或视频，常用于冒充与诈骗。 | 看起来真≠是真的；官方渠道二次确认才是防线 | `multimodal` `privacy` |

### 1.6 成本 cost（5 条）——六段结构

| # | 术语 | 文件 | 口径草稿（≤60 字） | 不成立边界 / 写作要点 | related（目标态） |
| --- | --- | --- | --- | --- | --- |
| 1 | 按量计费 Usage-based Billing | `usage-based-billing.md` | 按实际用掉的 token 数量收费，用得多付得多。 | **不写死金额**；价格会变；长对话可能比想象贵 | `token` `subscription` |
| 2 | 订阅制 Subscription | `subscription.md` | 按月或按年买套餐，获得一定用量或功能的付费方式。 | 额度会用完；订阅≠无限；个人与团队计价不同 | `usage-based-billing` `free-tier` |
| 3 | 免费额度 Free Tier | `free-tier.md` | 产品先给的一点试用量，用完要等刷新或转付费。 | 规则经常变；免费≠永久；超了可能限速或停用 | `rate-limit` `subscription` |
| 4 | 速率限制 Rate Limit | `rate-limit.md` | 单位时间内允许请求次数的上限，超了会被拒绝或排队。 | 被限速≠账号有问题；反复重试只会更糟 | `free-tier` `truncation` |
| 5 | 截断 Truncation | `truncation.md` | 回答写到一半被字数或 token 上限切断，话说不完。 | 续写可能前后不一致；长任务主动分段要结果 | `context-window` `rate-limit` |

## 2. 延伸分支（18 条）——四段短文

延伸分支统一用「是什么 / 什么时候会遇到 / 和 AI 的关系 /（可选）想深入再看」，300–500 字，**只解释术语，不教操作步骤**。

### 2.1 Vibe Coding vibecoding（5 条）

| # | 术语 | 文件 | 口径草稿（≤60 字） | 不成立边界 / 写作要点 | related（目标态） |
| --- | --- | --- | --- | --- | --- |
| 1 | Vibe Coding | `vibe-coding.md` | 用自然语言描述想法、让 AI 生成能跑代码的开发方式。 | 能跑≠做对了；不懂代码也要能验收结果 | `code-generation` `natural-language-programming` |
| 2 | 自然语言编程 Natural Language Programming | `natural-language-programming.md` | 直接用说话的方式让计算机做事，不必先学编程语法。 | 降低写代码门槛，没降低想清楚的门槛 | `vibe-coding` |
| 3 | 代码生成 Code Generation | `code-generation.md` | AI 根据描述写出程序代码，从片段到完整小项目都有。 | 要能跑通、看得懂再留；照抄代码有许可问题 | `debugging` `coding-assistant` |
| 4 | 调试 Debugging | `debugging.md` | 找出程序为什么不按预期工作并修好它的过程。 | 和「测试」（判断有没有坏）是两件事；「修好了」要自己复现 | `bug` `code-generation` |
| 5 | 无代码 / 低代码 No-code / Low-code | `no-code-low-code.md` | 用拖拽和配置代替写代码来做工具的开发路线。 | 灵活度有上限；复杂需求会撞墙；数据在别人平台上 | `vibe-coding` `deployment` |

### 2.2 前端 frontend（3 条）

| # | 术语 | 文件 | 口径草稿（≤60 字） | 不成立边界 / 写作要点 | related（目标态） |
| --- | --- | --- | --- | --- | --- |
| 1 | 界面（UI）User Interface | `ui.md` | 你在屏幕上看到和操作的一切：按钮、输入框、文字与颜色。 | 好看≠好用；界面只是系统露出的一部分 | `component` |
| 2 | 组件 Component | `component.md` | 拼成页面的积木块；一个按钮、一张卡片都可以是组件。 | 组件化是工程手段，不是页面更好看的原因 | `ui` `responsive-design` |
| 3 | 响应式布局 Responsive Design | `responsive-design.md` | 同一套页面自动适配手机、平板和电脑屏幕。 | 适配屏幕≠都好点；触屏操作要单独想 | `ui` `component` |

### 2.3 后端 backend（3 条）

| # | 术语 | 文件 | 口径草稿（≤60 字） | 不成立边界 / 写作要点 | related（目标态） |
| --- | --- | --- | --- | --- | --- |
| 1 | 服务器 Server | `server.md` | 一直开着、负责存数据和回应请求的计算机。 | 不是「网盘」的代名词；服务器挂了页面就打不开 | `deployment` `database` |
| 2 | 数据库 Database | `database.md` | 按结构存、查、改数据的地方；账号、成绩都放在这里。 | 数据≠备份；删错很难恢复 | `server` `api` |
| 3 | 部署 Deployment | `deployment.md` | 把做好的东西放到服务器上，让别人也能打开使用。 | 部署≠上线运营；链接外传前想清楚暴露范围 | `server` `api` |

### 2.4 产品 product（3 条）

| # | 术语 | 文件 | 口径草稿（≤60 字） | 不成立边界 / 写作要点 | related（目标态） |
| --- | --- | --- | --- | --- | --- |
| 1 | 需求 Requirements | `requirements.md` | 把「想做什么」说清楚：给谁用、解决什么问题、做到什么算完。 | 需求会变；没写下来的需求不算需求 | `prototype` `acceptance` |
| 2 | 原型 Prototype | `prototype.md` | 先做出来的粗糙样品，用来看方向对不对，不求完善。 | 原型不是成品；拿原型当交付物会伤信任 | `requirements` `acceptance` |
| 3 | 验收 Acceptance | `acceptance.md` | 按事先说好的标准检查结果行不行，决定算不算完成。 | 没有标准就没有验收；验收通过≠没有 bug | `requirements` `test-case` |

### 2.5 测试 testing（2 条）

| # | 术语 | 文件 | 口径草稿（≤60 字） | 不成立边界 / 写作要点 | related（目标态） |
| --- | --- | --- | --- | --- | --- |
| 1 | Bug 缺陷 | `bug.md` | 程序行为与预期不一致的地方，小到错别字，大到数据丢失。 | 修一个可能引入新的；复现步骤比吐槽有用 | `test-case` `debugging` |
| 2 | 测试用例 Test Case | `test-case.md` | 一组「输入什么、应该得到什么」的具体检查条目。 | 通过≠全对，只说明这几种情况没坏 | `bug` `acceptance` |

### 2.6 Git git（2 条）

| # | 术语 | 文件 | 口径草稿（≤60 字） | 不成立边界 / 写作要点 | related（目标态） |
| --- | --- | --- | --- | --- | --- |
| 1 | 版本控制 Version Control | `version-control.md` | 记录文件每次改动的系统；改坏了能退回以前的版本。 | 没提交的改动回不去；它不是网盘同步 | `commit` |
| 2 | 提交 Commit | `commit.md` | 把当前改动存成一个历史节点，并附上说明，便于回退与协作。 | 提交信息糊弄，以后就查不到为什么改 | `version-control` |

## 3. 分批与 PR 切法

对齐 [术语库规划第 4 节](GLOSSARY-PLAN.md#4-分批节奏)：**每个 PR 只做一个分类的一批词条**，延伸分支按分类逐个小 PR。批 0 示范计入所属分类的 M0 条数。

| 批次 | 分类与条目 | 新增 | PR 切法 | 前置 |
| --- | --- | --- | --- | --- |
| 批 0（示范） | `hallucination`（已完成，主分支示范）+ `vibe-coding`（延伸分支示范） | 1 | 1 个 PR（延伸示范） | 走完「起草→查证→人审校→合并」，补 [规划第 6 节](GLOSSARY-PLAN.md#6-验收对应-7) 的延伸示范缺口 |
| 批 1 | `basics` 8（含已有 1 条）+ `prompt` 8 | 15 | 2 个 PR（basics / prompt 各一） | 批 0 合并后 |
| 批 2 | `tools` 6 + `safety` 6 | 12 | 2 个 PR（tools / safety 各一） | — |
| 批 3 | `cost` 5 + `agents` 7 | 12 | 2 个 PR（cost / agents 各一） | — |
| 批 3 | 延伸分支 18 条 | 18 | 按分类 6 个小 PR（vibecoding 5 / frontend 3 / backend 3 / product 3 / testing 2 / git 2，批 0 的 `vibe-coding` 已计入） | 每个 PR 合并前人审校对应分类 |

条目落地顺序注意事项：

1. `related` 只能引用**已存在**词条：同批内互相引用的条目要同 PR 落地或先落地被引用方（例如 `token` 先于 `usage-based-billing` 的 related 补线）。
2. 跨分类 related（如 `api` → `deployment`）允许引用未落地目标时**先留空数组**，目标落地后在后续 PR 补线，不写占位假引用。
3. 每条合并前更新 `updated` 为当天核对日期；真人审校签字前保持「初稿 · 尚未人工核校」，不预填 `reviewed`。

## 4. 批 0 延伸分支示范条目提纲（`vibe-coding.md`）

按「是什么 / 什么时候会遇到 / 和 AI 的关系 / 想深入再看」四段起草，供人改写定稿：

1. **是什么**：用说话的方式描述想要的东西，AI 写出能跑的代码；对应口径草稿。
2. **什么时候会遇到**：想做一个报名统计页、宿舍值日轮换器这类小工具时；别人说「用 AI 直接 vibe 一个」。
3. **和 AI 的关系**：AI 负责生成代码，人负责说清想法、跑起来看结果、决定要不要；「能跑」不等于「做对了」。
4. **想深入再看**（可选）：`code-generation` / `debugging` / `prototype`（相关词条）。

frontmatter 要点：`category: "vibecoding"`、`basis: "desk-research"`、`aiUsage` 按实际填、`sources` 起草时核实（候选方向见下节）、不写 `reviewed` 直到人签。

## 5. 来源候选方向（起草时核实，不预写链接）

| 词条组 | 候选一手来源方向 |
| --- | --- |
| 基础 / 提示词 | OpenAI、Anthropic、Google 的官方模型文档与提示词指南；原始论文（如介绍思维链、少样本的论文） |
| 工具 / Agent | 各产品官方文档（DeepSeek、Kimi 等官方帮助页）；MCP 官方规范站点；产品官方定价说明页（只写计费方式，不抄数字） |
| 安全 | OWASP 关于 LLM 应用的安全指南；厂商安全文档；Deepfake 相关的官方反诈提示 |
| 成本 | 厂商官方计费 / 限速文档；只写「按量 / 订阅 / 免费额度」等机制，不写死金额 |
| 延伸分支 | MDN（前端 / 后端基础概念）、Git 官方文档、产品与测试领域的权威入门资料 |

规则重申：来源必须支持正文结论而不只是同名；链接核实可打开再写入 `sources`；找不到官方文档或原始论文的条目先不发布。

## 6. 起草与验收对照（每条逐项过）

- [ ] 六段 / 四段结构完整；面向非计算机专业同学，术语当场解释或链到本表另一条
- [ ] `definition` ≤60 字；`example` 是校园或学习场景；`order` 分类内连续唯一
- [ ] 指出了「不成立」的边界；没有写死价格、额度、版本号
- [ ] `sources` ≥1 条可打开的官方文档或原始论文；来源支持结论
- [ ] `related` 只引用已存在词条；站内链接用 `/glossary/` 或文件 id，不写完整域名
- [ ] 可选区块遵守约束（`scenario` 2–4 步、`quiz` 恰好一个正确项、`agentPrompt` ≤600 字）
- [ ] `npm run verify` 通过；页面：列表卡片、搜索、详情路由、分支树筛选正常
- [ ] 真人按 [审校清单](CONTENT-REVIEW.md#5-审校清单逐项过) 核校后才填 `reviewed` / `reviewedBy`
