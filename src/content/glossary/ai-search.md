---
term: "AI 搜索"
en: "AI Search"
category: "tools"
aliases:
  - "AI Search"
  - "AI 搜索引擎"
  - "联网搜索"
definition: "结合实时信息检索与大模型总结生成能力，直接输出带引用来源综合回答的检索工具。"
example: "查询某项政策的最新修订条款时，工具会先抓取近期官方网页，再归纳要点并附带原文参考链接。"
order: 4
related:
  - "knowledge-cutoff"
  - "hallucination"
  - "chatbot"
  - "tool-use"
updated: "2026-11-18"
sources:
  - title: "Web search tool · Anthropic"
    url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool"
basis: "desk-research"
aiUsage: "drafted"
reviewNote: "按极简维基体例重构正文与结构，待负责人复审。"
---

AI 搜索是将实时网络检索与[大语言模型](/glossary/llm/)文本生成相结合的信息获取工具。相比仅依赖固定[训练数据](/glossary/training-data/)的离线模型或常规[对话助手](/glossary/chatbot/)，它能够在回答前主动获取外部网页信息，从而突破模型的[知识截止](/glossary/knowledge-cutoff/)限制，并输出附带参考链接的结构化综述。

## 典型处理流程

AI 搜索本质上属于检索增强生成（RAG）在互联网信息场景下的应用，通常按以下阶段完成一次查询：

1. **查询改写与检索**：系统分析用户的自然语言提问，将其拆解为一组适配搜索引擎的关键词，通过[工具调用](/glossary/tool-use/)向检索索引发起实时查询。
2. **信源抓取与筛选**：提取排名靠前或相关性高的网页正文片段，剔除广告与冗余排版后送入模型的[上下文窗口](/glossary/context-window/)。
3. **综合归纳与引文标注**：模型基于抓取到的多篇资料提炼要点、对比差异并生成连贯回答，同时在对应句子末尾标注来源编号或原文链接。

## 与传统搜索引擎的差异

| 对比维度 | 传统搜索引擎 | AI 搜索 |
| --- | --- | --- |
| **主要交互方式** | 输入关键词组合，逐条筛选结果 | 使用自然语言描述完整问题并支持多轮追问 |
| **结果呈现形式** | 呈现网页标题、摘要与链接列表 | 直接生成整合后的文字结论与内嵌引文 |
| **信息加工深度** | 由用户自行点开多个页面并总结 | 由模型预先完成跨页面的摘要、对比与归纳 |

## 概念边界

- **带有引用链接不等于绝对准确**：模型在整合多源文本时仍可能出现误读原意、张冠李戴或 [AI 幻觉](/glossary/hallucination/)，甚至将无直接支撑的链接附在结论之后。
- **无法突破原始信源的质量上限**：AI 搜索的准确性高度依赖检索命中的网页质量；若网络信源本身陈旧、包含商业软文或存在[偏见](/glossary/bias/)，生成结果也会受到污染。涉及政策法规、医疗建议或学术数据时，仍需点开原始链接核实发布时间与出处。
