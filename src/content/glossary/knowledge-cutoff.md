---
term: "知识截止"
en: "Knowledge Cutoff"
category: "basics"
aliases:
  - "Knowledge Cutoff"
  - "训练截止"
  - "知识有效期"
definition: "模型训练数据所覆盖的时间上限，标志着模型静态内置知识停止更新的节点。"
example: "某模型的知识截止时间为去年年底，当被问及今年新发布的软件版本特性时，仅靠自身记忆无法准确作答。"
order: 5
related:
  - "llm"
  - "training-data"
  - "hallucination"
  - "ai-search"
updated: "2026-11-18"
sources:
  - title: "Models overview（含 reliable knowledge cutoff）· Anthropic"
    url: "https://platform.claude.com/docs/en/about-claude/models/overview"
basis: "desk-research"
aiUsage: "drafted"
reviewNote: "按极简维基体例重构正文与结构，待负责人复审。"
---

知识截止时间由[大语言模型](/glossary/llm/)采集和冻结[训练数据](/glossary/training-data/)的节点决定。由于大规模模型完成训练后权重即处于静态固定状态，模型本身不会在日常运行中自动吸收现实世界的新增事件，一切发生在截止时间之后的动态变化都超出其原生记忆范围。

## 形成原因与跨版本差异

- **训练周期的滞后**：从语料抓取、清洗过滤到正式训练与安全对齐往往耗时数月，因此模型发布日期通常晚于其实际知识截止日期。
- **版本与厂商差异**：不同模型系列乃至同一系列的不同迭代版本，其知识截止时间各不相同，通常会在官方模型说明页中明确标注。

## 对实际使用的影响

- **时效性问题盲区**：面对截止日期后的新闻事件、最新政策变动或刚更新的技术文档，模型可能直接声明不知情，也可能依据历史规律进行推测，从而引发[AI 幻觉](/glossary/hallucination/)。
- **联网与外部检索的补足**：现代对话产品常为模型配置[AI 搜索](/glossary/ai-search/)或[工具调用](/glossary/tool-use/)能力，在回答前实时拉取最新网页或知识库片段，以此绕开静态权重的时间限制。
- **上下文注入**：用户也可在[提示词](/glossary/prompt/)或附件中直接提供最新公告与参考资料，让模型基于当前[上下文窗口](/glossary/context-window/)内的材料进行分析整理。

## 概念边界

- **不代表截止前无所不知**：知识截止仅表示「可能见过的最晚时间点」，并非对截止日期之前所有事实的完整收录；冷门或非公开信息同样可能缺失。
- **检索不等于模型重训**：通过外部搜索获取到最新信息后，数据仅临时存在于当次对话上下文中，并不会改写模型自身的长期权重或推迟其知识截止时间。
