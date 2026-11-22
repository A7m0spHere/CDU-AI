# 术语词条批次审核记录（M0 · PR #37）

> 本文件归档 M0 术语库（首批 64 条）在 [PR #37](https://github.com/A7m0spHere/CDU-AI/pull/37) 中的 P0、P1、P2 分批审核范围、负责人取舍与参考依据；现行分类与写作规范见[内容维护规范](../CONTENT-GUIDE.md#5-术语表)，审校状态规则见[内容审校与溯源规范](../CONTENT-REVIEW.md)。

## P0 词条审核记录（2026-10-31）

本记录覆盖初审交接单列出的 8 篇 P0 词条。审核基于当时变更前的 `main` 版本 `d5f203d` 及该批次修改；本记录与词条修改作为同一批次追溯。

AI 根据交接单检查词条定义、正文、示例和选择题，核对了部分参考资料，并将问题与修改建议提交审核负责人二审。负责人 `A7m` 于 2026-10-31 确认下列取舍和审核结论；未逐一在线核验所有参考来源，也未对具体模型或产品进行实测。审核日期与负责人写入各词条，不代表这些未覆盖项目已经验证。

| 词条 | 负责人确认的处理 |
| --- | --- |
| [微调](../../src/content/glossary/fine-tuning.md) | 修改周报示例，其余建议不采用，保留原文。 |
| [训练数据](../../src/content/glossary/training-data.md) | 保留原文；对知识时间覆盖的绝对表述，AI 初审提出不同意见。 |
| [截断](../../src/content/glossary/truncation.md) | 保留原文；AI 初审指出输入截断及其他中断原因未覆盖。 |
| [Vibe Coding](../../src/content/glossary/vibe-coding.md) | 补充原始与宽泛用法的区别，以及实际使用前的检查提醒。 |
| [思维链](../../src/content/glossary/chain-of-thought.md) | 修改计算过程的类比与提示词，保留示例和选择题。 |
| [工作流](../../src/content/glossary/workflow.md) | 调整定义、流程说明、选择题及与 Agent 的关系。 |
| [提示词注入](../../src/content/glossary/prompt-injection.md) | 保留原文；AI 初审提醒单靠提示词不能保证阻止注入。 |
| [对话助手](../../src/content/glossary/chatbot.md) | 保留原文；AI 初审提醒聊天记录保存和同步方式依产品而异。 |

本轮参考依据包括 [Hugging Face 的提示词与微调说明](https://huggingface.co/docs/transformers/main/tasks/prompting)、[知识截止时间研究](https://arxiv.org/abs/2403.12958)、[Claude 上下文窗口说明](https://platform.claude.com/docs/en/build-with-claude/context-windows)、[OpenSSF Vibe Coding 术语](https://glossary.openssf.org/vibe-coding/)、[思维链忠实性研究](https://www.anthropic.com/news/measuring-faithfulness-in-chain-of-thought-reasoning)、[Anthropic 工作流与 Agent 说明](https://www.anthropic.com/research/building-effective-agents)及 [OWASP 提示词注入说明](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)。这些资料用于核对相关问题，不代表已经逐条验证所有词条与外部链接。

## P1 词条审核记录（2026-11-01）

本记录覆盖初审交接单列出的 13 篇 P1 词条。审核基于当时变更前的 `main` 版本 `d5f203d` 及该批次修改；本记录与词条修改作为同一批次追溯。

AI 对照词条的定义、正文、示例和选择题整理问题，核对下列资料中的相关内容，再提交负责人二审。负责人 `A7m` 同意修改 7 篇指定内容，其余 6 篇保留原文，并确认审核通过；本批审核于 2026-11-01 完成。以下来源各自只支持所列范围，不代表已经逐条核验词条中所有事实和所有原有链接；未实际测试具体产品、模型或托管环境。法律与政策依具体法域和情形适用。

| 词条 | 审核取舍与本次核对的依据 |
| --- | --- |
| [版权](../../src/content/glossary/copyright.md) | 保留原文。[WIPO 指引](https://www.wipo.int/edocs/mdocs/mdocs/en/wipo_webinar_ft_24_1/wipo_webinar_ft_24_1_guidelines.pdf)讨论生成物权利与合同约定的不确定性；版权适用范围依具体法域判断。 |
| [隐私](../../src/content/glossary/privacy.md) | 调整上传前检查与数据处理场景。[个人信息保护法](https://www.cac.gov.cn/2021-08/20/c_1631050028355286.htm)涉及必要范围和个人信息处理；[Anthropic 隐私政策](https://www.anthropic.com/legal/privacy)仅作为该服务的政策示例。 |
| [AI Agent](../../src/content/glossary/ai-agent.md) | 修改定义，说明任务可能失败、暂停或需要确认。[Anthropic 指南](https://www.anthropic.com/research/building-effective-agents)介绍动态执行、人工反馈和停止条件。 |
| [MCP](../../src/content/glossary/mcp.md) | 保留原文。[MCP 架构](https://modelcontextprotocol.io/docs/learn/architecture)说明 Host、Client 和 Server；[安全实践](https://modelcontextprotocol.io/docs/2025-11-25/tutorials/security/security_best_practices)说明实现层面的安全风险。只读权限仍需实际配置和验证。 |
| [自然语言编程](../../src/content/glossary/natural-language-programming.md) | 保留原文。[Codex 论文](https://arxiv.org/abs/2107.03374)涉及从描述生成代码的研究，不单独定义该术语的全部范围。 |
| [深度伪造](../../src/content/glossary/deepfake.md) | 修改定义，保留冒充场景和核实方式。[FTC 声音克隆说明](https://www.ftc.gov/system/files/ftc_gov/pdf/FTC-Comment-VoiceCloning.pdf)讨论声音克隆的有益用途与欺诈风险；它不单独覆盖所有图像和视频场景。 |
| [数据库](../../src/content/glossary/database.md) | 保留原文。[MDN 数据库词条](https://developer.mozilla.org/en-US/docs/Glossary/Database)解释数据库基础概念；应用也可能在数据库或记忆系统中保存数据。 |
| [部署](../../src/content/glossary/deployment.md) | 修改定义、题目解释及正文中的访问范围。[MDN 网站发布教程](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website/Publishing_your_website)介绍网站发布与托管方式。 |
| [原型](../../src/content/glossary/prototype.md) | 保留原文。[GOV.UK 原型说明](https://www.gov.uk/service-manual/design/making-prototypes)也包含纸面草图等形式，并非所有原型都可交互。 |
| [上下文窗口](../../src/content/glossary/context-window.md) | 保留原文。[Claude 上下文窗口说明](https://platform.claude.com/docs/en/build-with-claude/context-windows)说明该产品的容量与超限处理；文件处理和外部检索依产品实现而异。 |
| [Fork](../../src/content/glossary/fork.md) | 修改协作说明和题目解释。[GitHub Fork 文档](https://docs.github.com/en/pull-requests/reference/forks)区分独立 Fork 与同一仓库内分支。 |
| [速率限制](../../src/content/glossary/rate-limit.md) | 修改限流场景并补充等待提示。[Claude API 限流文档](https://platform.claude.com/docs/en/api/rate-limits)说明该服务的限制与 `retry-after`；实际行为因服务而异。 |
| [系统提示词](../../src/content/glossary/system-prompt.md) | 修改接口封装说明，保留安全边界提醒。[Claude Messages API](https://platform.claude.com/docs/en/api/messages/create)列出 `system` 参数与消息格式；其他平台的传法与优先级可能不同。 |

## P2 词条初审与复核记录（2026-11-01）

本次审阅交接单中的 43 篇 P2 词条；其中「AI 幻觉」已有负责人审核记录，保留原有状态，其余 42 篇纳入本轮初审。审核基于当时 `main` 提交 `d5f203d` 与该批次修改；本记录应与词条状态变更一同追溯。

负责人授权 AI 按三个基础标准独立判断：是否说明术语含义、是否有参考资料、是否有合适示例。AI 阅读定义、正文、场景和题目，并对参考链接做 HTTP 可访问性检查；返回成功不等于逐项证明正文事实。没有逐一核验全部事实、许可或产品行为，也没有实际运行模型或产品。

### AI 初审通过（33 篇）

以下词条依据授权填写 `reviewedBy: AI 初审（负责人授权）` 和日期，审核范围见词条的 `reviewNote`。这是 AI 独立初审的结论，不冒充人工二审；词条内容未修改。

[验收](../../src/content/glossary/acceptance.md)、[Agent 记忆](../../src/content/glossary/agent-memory.md)、[AI 搜索](../../src/content/glossary/ai-search.md)、[API](../../src/content/glossary/api.md)、[偏见](../../src/content/glossary/bias.md)、[分支](../../src/content/glossary/branch.md)、[Bug](../../src/content/glossary/bug.md)、[代码生成](../../src/content/glossary/code-generation.md)、[AI 编程助手](../../src/content/glossary/coding-assistant.md)、[提交](../../src/content/glossary/commit.md)、[调试](../../src/content/glossary/debugging.md)、[Issue](../../src/content/glossary/issue.md)、[大语言模型](../../src/content/glossary/llm.md)、[本地部署](../../src/content/glossary/local-deployment.md)、[多智能体](../../src/content/glossary/multi-agent.md)、[多模态](../../src/content/glossary/multimodal.md)、[无代码 / 低代码](../../src/content/glossary/no-code-low-code.md)、[输出格式](../../src/content/glossary/output-format.md)、[提示词](../../src/content/glossary/prompt.md)、[提示词模板](../../src/content/glossary/prompt-template.md)、[Pull Request](../../src/content/glossary/pull-request.md)、[仓库](../../src/content/glossary/repository.md)、[需求](../../src/content/glossary/requirements.md)、[响应式布局](../../src/content/glossary/responsive-design.md)、[服务器](../../src/content/glossary/server.md)、[订阅制](../../src/content/glossary/subscription.md)、[任务规划](../../src/content/glossary/task-planning.md)、[温度](../../src/content/glossary/temperature.md)、[测试用例](../../src/content/glossary/test-case.md)、[工具调用](../../src/content/glossary/tool-use.md)、[试用额度](../../src/content/glossary/trial-quota.md)、[界面](../../src/content/glossary/ui.md)、[按量计费](../../src/content/glossary/usage-based-billing.md)。

### 初审提出需复核的问题（9 篇）

以下保留初审时提出的意见；后续处理见下节。

| 词条 | 待确认的问题与建议参考 |
| --- | --- |
| [组件](../../src/content/glossary/component.md) | 十个外观相同的按钮不一定使用同一个组件；可改为「可以复用同一个组件」。[React 组件说明](https://react.dev/learn/your-first-component)。 |
| [少样本示例](../../src/content/glossary/few-shot.md) | 「两三条通常够用」「堆多了反而稀释重点」说得过于固定；数量和效果需按任务验证。[Anthropic 示例提示指南](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/multishot-prompting)。 |
| [越狱](../../src/content/glossary/jailbreak.md) | 将提示词注入限定为外部内容不完整，也存在直接注入；两者概念可以重叠。[OWASP 提示词注入](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)。 |
| [知识截止](../../src/content/glossary/knowledge-cutoff.md) | 没有实际依据就把未答对校历归因于训练数据缺失；不同来源的有效知识时间也可能不同。[知识截止时间研究](https://arxiv.org/abs/2403.12958)。 |
| [合并](../../src/content/glossary/merge.md) | 同一位置被双方修改不必然产生冲突，需看具体改动能否自动合并。[Git 合并文档](https://git-scm.com/docs/git-merge)。 |
| [开源模型](../../src/content/glossary/open-source-model.md) | 示例把「限制商用的可下载权重」放在开源模型条目开头，可能与正文依据的 OSI 定义冲突；可明确它是开放权重而非符合该定义的开源例子。[OSI 开源 AI 定义](https://opensource.org/ai/open-source-ai-definition)。 |
| [角色设定](../../src/content/glossary/role-prompting.md) | 「只改变表达，不改变模型掌握的事实」容易被理解成只影响语气；角色提示也可能影响任务表现，但不会赋予新知识或权限。[Anthropic 提示指南](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/system-prompts)。 |
| [Token](../../src/content/glossary/token.md) | 示例称「先摘要再分段」会让同样任务的 token 消耗小很多；摘要和多轮调用也有成本，效果取决于具体用量。[Anthropic token 计数](https://platform.claude.com/docs/en/build-with-claude/token-counting)。 |
| [版本控制](../../src/content/glossary/version-control.md) | 「没提交过的改动找不回」过于绝对；提交历史本身不能保证找回，但暂存或其他备份可能保留。[Git stash 文档](https://git-scm.com/docs/git-stash)。 |

### 负责人确认修改后的处理

负责人要求按初审建议修改「组件、少样本示例、越狱、合并、版本控制」，并要求「开源模型」同时解释和比较开源 AI 与开放权重、完善示例和参考来源。AI 已根据要求修改这 6 篇，并按此前授权对修改后的定义、示例与来源再次初审；审核字段如实标注 `AI 初审（负责人授权）`，不冒充人工逐篇终审。各词条补充或保留的来源分别列在自身 `sources` 中；开源模型的甲、乙只是教学假设，没有核验具体模型许可。

初审通过从 33 篇增加至 39 篇。负责人随后确认[知识截止](../../src/content/glossary/knowledge-cutoff.md)、[角色设定](../../src/content/glossary/role-prompting.md)、[Token](../../src/content/glossary/token.md)保留原文并审核通过，审核字段记录负责人 `A7m` 和日期；上述 AI 初审意见及其证据边界继续保留在本记录和各词条的 `reviewNote` 中。原有「AI 幻觉」的负责人审核记录不变。
