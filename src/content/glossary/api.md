---
term: "API"
en: "Application Programming Interface"
category: "tools"
aliases:
  - "接口"
  - "应用程序接口"
definition: "让不同软件按约定协议交换数据或调用功能的标准接口；AI 服务常借此向外部程序开放模型能力。"
example: "开发者在自动化脚本中传入密钥与提示词，通过接口获取模型返回的 JSON 数据，而无需在网页端手动复制粘贴。"
order: 2
related:
  - "chatbot"
  - "usage-based-billing"
  - "rate-limit"
  - "deployment"
updated: "2026-11-18"
sources:
  - title: "API · MDN Glossary"
    url: "https://developer.mozilla.org/en-US/docs/Glossary/API"
  - title: "API overview · Anthropic"
    url: "https://platform.claude.com/docs/en/api/overview"
basis: "desk-research"
aiUsage: "drafted"
reviewNote: "按极简维基体例重构正文与结构，待负责人复审。"
---

API（Application Programming Interface，应用程序接口）是软件系统之间约定请求格式、数据结构与交互规则的通信契约。在人工智能领域，云端模型服务商通过 API 将底层[大语言模型](/glossary/llm/)的推理能力封装为网络接口，使外部程序无需依赖网页端[对话助手](/glossary/chatbot/)即可直接发送请求并获取结果。

## 请求构成与调用机制

一次标准的模型 API 调用通常采用请求—响应模式，由调用方按接口文档组装结构化数据包并发送至服务端：

- **身份认证**：调用方需在请求头中附带 **API 密钥**（API Key）等凭证，用于校验权限、统计消耗并关联计费账户。密钥泄露可能导致未授权调用与额度损失。
- **请求参数**：除输入文本或[提示词](/glossary/prompt/)外，程序还可显式指定目标模型版本、[系统提示词](/glossary/system-prompt/)、[温度](/glossary/temperature/)及期望的[输出格式](/glossary/output-format/)（如 JSON）。
- **响应与状态**：服务端完成推理后返回生成内容及本次消耗的 [token](/glossary/token/) 统计；若触发异常或[速率限制](/glossary/rate-limit/)，则通过状态码与错误信息提示调用方进行重试或降级处理。

## 与网页端产品的差异

| 对比维度 | 网页端对话产品 | 模型 API 接口 |
| --- | --- | --- |
| **面向对象** | 终端用户直接通过图形界面操作 | 开发者与自动化程序通过代码集成 |
| **状态维护** | 平台自动保存历史对话与记忆 | 通常为无状态调用，需自行维护[上下文窗口](/glossary/context-window/) |
| **计费模式** | 多采用[订阅制](/glossary/subscription/)或[试用额度](/glossary/trial-quota/) | 多按输入与输出长度实行[按量计费](/glossary/usage-based-billing/) |
| **能力扩展** | 平台内置联网、文件解析等固定工具 | 由调用方按需接入[工具调用](/glossary/tool-use/)与外部系统 |

## 概念边界

- **不等于独立的模型版本**：API 与网页端背后往往指向同类模型，两者效果差异主要来自系统默认指令、采样参数及内置工具链，API 同样存在输出波动与 [AI 幻觉](/glossary/hallucination/)。
- **不涵盖完整应用逻辑**：API 仅负责提供基础能力通道；前端展示、长会话截断、安全过滤及生产环境[部署](/glossary/deployment/)仍需开发者在客户端或[工作流](/glossary/workflow/)中自行实现。
