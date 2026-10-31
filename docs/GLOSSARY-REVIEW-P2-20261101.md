# 术语词条 P2 初审记录（2026-11-01）

本次审阅交接单中的 43 篇 P2 词条；其中「AI 幻觉」已有负责人审核记录，保留原有状态，其余 42 篇纳入本轮初审。审核基于 `main` 提交 `d5f203d` 与本次工作区修改；本记录应与词条状态变更一同追溯。

负责人授权 AI 按三个基础标准独立判断：是否说明术语含义、是否有参考资料、是否有合适示例。AI 阅读定义、正文、场景和题目，并对参考链接做 HTTP 可访问性检查；返回成功不等于逐项证明正文事实。没有逐一核验全部事实、许可或产品行为，也没有实际运行模型或产品。

## AI 初审通过（33 篇）

以下词条依据授权填写 `reviewedBy: AI 初审（负责人授权）` 和日期，审核范围见词条的 `reviewNote`。这是 AI 独立初审的结论，不冒充人工二审；词条内容未修改。

[验收](../src/content/glossary/acceptance.md)、[Agent 记忆](../src/content/glossary/agent-memory.md)、[AI 搜索](../src/content/glossary/ai-search.md)、[API](../src/content/glossary/api.md)、[偏见](../src/content/glossary/bias.md)、[分支](../src/content/glossary/branch.md)、[Bug](../src/content/glossary/bug.md)、[代码生成](../src/content/glossary/code-generation.md)、[AI 编程助手](../src/content/glossary/coding-assistant.md)、[提交](../src/content/glossary/commit.md)、[调试](../src/content/glossary/debugging.md)、[Issue](../src/content/glossary/issue.md)、[大语言模型](../src/content/glossary/llm.md)、[本地部署](../src/content/glossary/local-deployment.md)、[多智能体](../src/content/glossary/multi-agent.md)、[多模态](../src/content/glossary/multimodal.md)、[无代码 / 低代码](../src/content/glossary/no-code-low-code.md)、[输出格式](../src/content/glossary/output-format.md)、[提示词](../src/content/glossary/prompt.md)、[提示词模板](../src/content/glossary/prompt-template.md)、[Pull Request](../src/content/glossary/pull-request.md)、[仓库](../src/content/glossary/repository.md)、[需求](../src/content/glossary/requirements.md)、[响应式布局](../src/content/glossary/responsive-design.md)、[服务器](../src/content/glossary/server.md)、[订阅制](../src/content/glossary/subscription.md)、[任务规划](../src/content/glossary/task-planning.md)、[温度](../src/content/glossary/temperature.md)、[测试用例](../src/content/glossary/test-case.md)、[工具调用](../src/content/glossary/tool-use.md)、[试用额度](../src/content/glossary/trial-quota.md)、[界面](../src/content/glossary/ui.md)、[按量计费](../src/content/glossary/usage-based-billing.md)。

## 初审提出需复核的问题（9 篇）

以下保留初审时提出的意见；后续处理见本节之后的记录。

| 词条 | 待确认的问题与建议参考 |
| --- | --- |
| [组件](../src/content/glossary/component.md) | 十个外观相同的按钮不一定使用同一个组件；可改为「可以复用同一个组件」。[React 组件说明](https://react.dev/learn/your-first-component)。 |
| [少样本示例](../src/content/glossary/few-shot.md) | 「两三条通常够用」「堆多了反而稀释重点」说得过于固定；数量和效果需按任务验证。[Anthropic 示例提示指南](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/multishot-prompting)。 |
| [越狱](../src/content/glossary/jailbreak.md) | 将提示词注入限定为外部内容不完整，也存在直接注入；两者概念可以重叠。[OWASP 提示词注入](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)。 |
| [知识截止](../src/content/glossary/knowledge-cutoff.md) | 没有实际依据就把未答对校历归因于训练数据缺失；不同来源的有效知识时间也可能不同。[知识截止时间研究](https://arxiv.org/abs/2403.12958)。 |
| [合并](../src/content/glossary/merge.md) | 同一位置被双方修改不必然产生冲突，需看具体改动能否自动合并。[Git 合并文档](https://git-scm.com/docs/git-merge)。 |
| [开源模型](../src/content/glossary/open-source-model.md) | 示例把「限制商用的可下载权重」放在开源模型条目开头，可能与正文依据的 OSI 定义冲突；可明确它是开放权重而非符合该定义的开源例子。[OSI 开源 AI 定义](https://opensource.org/ai/open-source-ai-definition)。 |
| [角色设定](../src/content/glossary/role-prompting.md) | 「只改变表达，不改变模型掌握的事实」容易被理解成只影响语气；角色提示也可能影响任务表现，但不会赋予新知识或权限。[Anthropic 提示指南](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/system-prompts)。 |
| [Token](../src/content/glossary/token.md) | 示例称「先摘要再分段」会让同样任务的 token 消耗小很多；摘要和多轮调用也有成本，效果取决于具体用量。[Anthropic token 计数](https://platform.claude.com/docs/en/build-with-claude/token-counting)。 |
| [版本控制](../src/content/glossary/version-control.md) | 「没提交过的改动找不回」过于绝对；提交历史本身不能保证找回，但暂存或其他备份可能保留。[Git stash 文档](https://git-scm.com/docs/git-stash)。 |

## 负责人确认修改后的处理

负责人要求按初审建议修改「组件、少样本示例、越狱、合并、版本控制」，并要求「开源模型」同时解释和比较开源 AI 与开放权重、完善示例和参考来源。AI 已根据要求修改这 6 篇，并按此前授权对修改后的定义、示例与来源再次初审；审核字段如实标注 `AI 初审（负责人授权）`，不冒充人工逐篇终审。各词条补充或保留的来源分别列在自身 `sources` 中；开源模型的甲、乙只是教学假设，没有核验具体模型许可。

初审通过从 33 篇增加至 39 篇。负责人随后确认[知识截止](../src/content/glossary/knowledge-cutoff.md)、[角色设定](../src/content/glossary/role-prompting.md)、[Token](../src/content/glossary/token.md)保留原文并审核通过，审核字段记录负责人 `A7m` 和日期；上述 AI 初审意见及其证据边界继续保留在本记录和各词条的 `reviewNote` 中。原有「AI 幻觉」的负责人审核记录不变。
