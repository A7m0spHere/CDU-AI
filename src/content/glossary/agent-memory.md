---
term: "Agent 记忆"
en: "Agent Memory"
category: "agents"
aliases:
  - "Memory"
  - "记忆"
  - "长期记忆"
definition: "使 AI Agent 跨会话持久化保存用户偏好、任务进展与历史经验，并在后续任务中按需检索利用的机制。"
example: "编程助手在多次协作中记录项目使用的代码规范与构建命令，后续新开会话时无需用户重复说明即可直接沿用。"
order: 4
related:
  - "ai-agent"
  - "context-window"
  - "database"
  - "privacy"
updated: "2026-11-18"
sources:
  - title: "Effective context engineering for AI agents · Anthropic"
    url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"
basis: "desk-research"
aiUsage: "drafted"
reviewNote: "按极简维基体例重构正文与结构，待负责人复审。"
---

单次对话依赖的[上下文窗口](/glossary/context-window/)属于临时工作区，窗口容量有限且在会话结束后通常不会自动延续。**Agent 记忆**（Agent Memory）通过将关键信息提炼并存入外部存储，使[AI Agent](/glossary/ai-agent/)能够在不同会话与长期协作中保持连续性。

## 记忆层次与存储方式

工程实践中，Agent 记忆通常按作用范围与信息性质分层组织：

| 记忆类型 | 保存内容 | 典型载体与生命周期 |
| --- | --- | --- |
| **工作记忆** | 当前任务上下文、工具返回与临时状态 | 位于当前上下文窗口，受限于[截断](/glossary/truncation/)策略 |
| **事实与偏好记忆** | 用户习惯、项目约定与长期有效的客观事实 | 存入结构化文件或[数据库](/glossary/database/)，跨会话长期保留 |
| **情景与经验记忆** | 过往执行轨迹、成功模式与踩坑记录 | 经摘要或向量索引归档，按相关性检索复用 |

## 写入、检索与更新流程

记忆机制的核心在于筛选与上下文管理，而非无差别留存全部历史对话：

- **提炼写入**：系统在对话中或会话结束时识别高价值事实与约定，经摘要或结构化抽取后写入持久层，避免冗余原文堆积。
- **按需召回**：新任务启动时，系统根据当前[提示词](/glossary/prompt/)语义或任务标签检索相关记忆片段，将其注入当前上下文参与推理。
- **冲突更新与清理**：当新约定推翻旧规则时，系统需覆盖或标记过期条目，防止相互矛盾的历史记录干扰判断。

## 概念边界与数据风险

- **不同于模型微调**：记忆属于应用层的上下文编排机制，不会改变[大语言模型](/glossary/llm/)本身的权重参数，也不同于需要重新训练的[微调](/glossary/fine-tuning/)。
- **并非越多越好**：误记、过时或与当前任务无关的记忆会挤占有效上下文额度，甚至诱导模型沿用错误前提并加剧[AI 幻觉](/glossary/hallucination/)。
- **涉及隐私与权限边界**：跨会话留存个人信息或项目资料直接关联[隐私](/glossary/privacy/)安全，负责任的产品通常提供记忆查看、编辑、清除及作用域隔离机制。
