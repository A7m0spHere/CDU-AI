---
term: "自然语言编程"
en: "Natural Language Programming"
category: "vibecoding"
aliases:
  - "Natural Language Programming"
  - "用说话编程"
definition: "以日常语言描述计算意图，由系统将其解析并转化为可执行代码或操作步骤的编程范式。"
example: "向 AI 助手输入「读取表格数据并按成绩排序后统计及格率」，系统随即生成并运行脚本以输出统计结果。"
order: 2
related:
  - "vibe-coding"
  - "code-generation"
  - "prompt"
  - "llm"
updated: "2026-11-18"
sources:
  - title: "Evaluating Large Language Models Trained on Code (arXiv:2107.03374)"
    url: "https://arxiv.org/abs/2107.03374"
basis: "desk-research"
aiUsage: "drafted"
reviewNote: "按极简维基体例重构正文与结构，待负责人复审。"
---

在传统软件开发中，开发者需要掌握特定编程语言的词法、语法与库接口；而在自然语言编程中，人类与计算机之间的主要交互媒介转变为中文、英文等日常语言。依托[大语言模型](/glossary/llm/)对语义与上下文的理解能力，系统能够将非形式化的意图描述映射为程序代码、脚本命令或工作流编排，从而降低编码门槛并缩短从想法到运行结果的距离。

## 实现路径与交互形态

自然语言编程并非单一技术，在实践中通常表现为以下几种实现层次：

- **指令转译**：用户以[提示词](/glossary/prompt/)描述单次任务（如数据清洗、格式转换或正则匹配），由模型生成脚本供本地或沙箱执行。
- **对话式迭代**：借助[对话助手](/glossary/chatbot/)或[AI 编程助手](/glossary/coding-assistant/)，通过多轮追问不断补充条件与修改结果，逐步逼近目标程序。
- **自主执行代理**：在具备[工具调用](/glossary/tool-use/)能力的[AI Agent](/glossary/ai-agent/)框架下，系统不仅生成逻辑，还能自行读取文件、运行测试并根据报错修正实现。

## 与代码生成及 Vibe Coding 的关系

自然语言编程常与以下概念并提，但侧重点各不相同：

| 概念 | 核心定位 | 人的主要职责 |
| --- | --- | --- |
| **自然语言编程** | 强调以自然语言作为表达程序意图的媒介 | 清晰阐述目标、约束条件与业务规则 |
| [代码生成](/glossary/code-generation/) | 关注模型自动产出源码片段或项目的能力 | 审查、集成并验证生成的代码质量 |
| [Vibe Coding](/glossary/vibe-coding/) | 一种高度依赖对话引导、少读底层源码的开发方式 | 通过描述结果与观察运行效果持续调优 |

## 局限与概念边界

- **不等于消除需求分析**：自然语言本身具有歧义与省略特性。如果原始[需求](/glossary/requirements/)界定模糊，模型往往会自行补全默认假设，导致产出与预期偏离。
- **仍需验证与维护**：由自然语言转译出的程序同样可能包含逻辑缺陷或安全隐患，在正式使用前仍需经过[测试用例](/glossary/test-case/)验证与人工[调试](/glossary/debugging/)，而非“说一句即可直接上线”。
