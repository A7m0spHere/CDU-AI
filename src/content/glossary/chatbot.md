---
term: "对话助手"
en: "Chatbot"
category: "tools"
aliases:
  - "Chatbot"
  - "聊天机器人"
  - "AI 助手"
definition: "以自然语言多轮对话为主要交互形态、面向终端用户的人工智能应用产品。"
example: "通过网页端或桌面客户端输入问题、上传参考文档并连续追问，即可完成文案起草、信息整理或基础代码问答。"
order: 1
related:
  - "llm"
  - "api"
  - "system-prompt"
  - "ai-search"
updated: "2026-11-18"
sources:
  - title: "Claude Help Center · Anthropic"
    url: "https://support.claude.com/en/"
basis: "desk-research"
aiUsage: "drafted"
reviewNote: "按极简维基体例重构正文与结构，待负责人复审。"
---

对话助手是终端用户接触[大语言模型](/glossary/llm/)最常见的产品形态。它将底层模型推理能力封装为直观的聊天界面，并结合上下文管理、安全策略与外部工具能力，使用户无需编写程序即可通过自然语言[提示词](/glossary/prompt/)完成问答、文本起草、翻译与文档整理等任务。

## 产品构成与运行机制

用户实际交互的并非裸露的模型权重，而是由产品层协同调度的一整套应用系统：

| 构成层级 | 核心职责 | 对使用体验的影响 |
| --- | --- | --- |
| **交互界面层** | 提供输入框、文件上传、多模态展示与历史会话管理 | 决定操作便捷性及代码块、表格等渲染效果 |
| **上下文与编排层** | 注入产品预设的[系统提示词](/glossary/system-prompt/)，拼接历史消息并控制[上下文窗口](/glossary/context-window/) | 影响回答风格、长对话连贯性与指令遵循稳定性 |
| **模型推理层** | 负责语义理解与内容生成，部分产品支持切换不同规格的模型 | 决定基础推理能力、响应速度与知识覆盖面 |
| **扩展工具层** | 集成[AI 搜索](/glossary/ai-search/)、代码运行环境、文件解析与[工具调用](/glossary/tool-use/) | 扩展实时信息获取、文档读取与复杂计算边界 |

## 常见部署与计费形态

- **云端网页与客户端**：由服务商托管算力与交互界面，通常采用免费体验与[订阅制](/glossary/subscription/)结合的模式，按周期限制可用模型、扩展功能或消息频次。
- **本地对话客户端**：结合[本地部署](/glossary/local-deployment/)框架运行开源模型，或通过配置[API](/glossary/api/)密钥接入远程模型，将数据存储与界面控制权保留在用户设备端。

## 概念边界

- **产品不等于底层模型**：同一底层模型在不同对话助手产品中，因系统提示词、联网检索策略与历史消息[截断](/glossary/truncation/)逻辑存在差异，实际回复表现往往不同。
- **不同于应用程序接口**：对话助手面向人工交互操作，侧重即开即用与会话管理；API 主要面向程序集成与自动化编排，通常按 [Token](/glossary/token/) 消耗实施[按量计费](/glossary/usage-based-billing/)。
