---
term: "提示词"
en: "Prompt"
category: "prompt"
aliases:
  - "Prompt"
  - "提问词"
  - "指令"
definition: "发送给人工智能模型的全部输入内容，用于传达任务目标、背景信息与约束条件并引导生成结果。"
example: "「帮我润色这段文字」往往只能得到泛泛修改；而「保留原有实验数据，将语气调整为正式摘要并控制在三百字内」则能更精准地引导输出。"
order: 1
related:
  - "system-prompt"
  - "context-window"
  - "few-shot"
  - "output-format"
updated: "2026-11-18"
sources:
  - title: "Prompt engineering overview · Anthropic"
    url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview"
basis: "desk-research"
aiUsage: "drafted"
reviewNote: "按极简维基体例重构正文与结构，待负责人复审。"
---

在与[大语言模型](/glossary/llm/)或[多模态](/glossary/multimodal/)模型交互时，提示词是人机之间传递意图的直接载体。模型无法感知用户的隐含处境或真实业务背景，只能依据本次输入的文本、附件及历史对话概率性地推演后续内容，因此提示词的清晰度直接决定输出的相关性与可用度。

## 提示词的核心要素

一条结构清晰的提示词不必冗长，但通常包含若干关键组成部分：

| 要素 | 作用说明 | 常见写法举例 |
| --- | --- | --- |
| **任务指令** | 明确希望模型执行的动作 | 总结、改写、分类、提取字段 |
| **背景上下文** | 补充受众、用途与相关素材 | 面向非技术读者的产品更新说明 |
| **输出约束** | 限制篇幅、语气或[输出格式](/glossary/output-format/) | 使用 Markdown 表格、不超过 200 字 |
| **参考示例** | 通过样例直观对齐预期标准 | 给出 1 至 2 组输入与理想输出对 |

## 常用提示词策略

针对不同复杂度的任务，可以通过结构化技巧提升模型响应稳定性。例如，使用[少样本示例](/glossary/few-shot/)向模型展示期望的格式与风格；在处理多步计算或逻辑判断时，引导模型展开[思维链](/glossary/chain-of-thought/)逐步推导后再给出结论；对于高频重复任务，则可沉淀为可复用的[提示词模板](/glossary/prompt-template/)以统一输出质量。

## 在消息层级中的位置

在实际对话产品或接口调用中，用户输入的提示词只是完整请求的一部分。它常与开发者预设的[系统提示词](/glossary/system-prompt/)及历史对话一并切分为 [Token](/glossary/token/)，共同占用模型的[上下文窗口](/glossary/context-window/)。此外，面对复杂任务时，通过多轮对话逐步补充细节和修正偏差，往往比试图在单次提示词中穷举所有规则更为有效。

## 概念边界

- **并非越长越好**：堆砌无关信息或相互矛盾的规则会稀释模型注意力，反而降低关键指令的执行率。
- **不能替代事实核验**：即使提示词要求严格基于事实回答，模型仍可能产生错误或编造内容，关键结论仍需人工核对。
