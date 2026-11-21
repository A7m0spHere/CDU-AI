---
term: "过度授权"
en: "Excessive Agency"
category: "safety"
aliases:
  - "Excessive Agency"
  - "权限过度"
  - "过度自主权"
definition: "赋予 AI 系统过多工具能力、过宽访问权限或缺少人工确认的高自主权，从而放大误操作与注入风险。"
example: "只需让 Agent 整理本地文档摘要时却同时开放了全部磁盘删除和自动发邮件权限，一旦误解指令就会造成不可逆损失。"
order: 8
related:
  - "sandbox"
  - "prompt-injection"
  - "ai-agent"
  - "tool-use"
updated: "2026-11-21"
sources:
  - title: "LLM06:2025 Excessive Agency · OWASP"
    url: "https://genai.owasp.org/llmrisk/llm062025-excessive-agency/"
basis: "desk-research"
aiUsage: "drafted"
reviewNote: "配合指南《权限与结果检查》补充 OWASP 安全术语，待负责人复审。"
---

过度授权（Excessive Agency）是开放全球应用安全项目（OWASP）在大语言模型应用安全清单中提出的核心风险之一，指当系统将[大语言模型](/glossary/llm/)接入外部插件、[工具调用](/glossary/tool-use/)或本地命令后，由于开放的功能过多、权限范围过宽或缺乏人工把关，导致模型在产生[AI 幻觉](/glossary/hallucination/)、误解意图或遭遇[提示词注入](/glossary/prompt-injection/)时，执行了破坏性或越权的操作。

## 常见的三种诱因

在 [AI Agent](/glossary/ai-agent/) 的实际使用与系统搭建中，过度授权通常表现为以下三类问题之一或叠加：

- **功能超出必需**：任务只需要读取和检索资料，却同时接入了写入、删除、改库或外发消息等高危工具。
- **权限范围过宽**：未遵循最小权限原则，例如直接赋予工具管理员账号凭证、全盘读写权限或跨项目的修改能力。
- **缺少人工确认环节**：对于删除文件、转账、对外发送邮件等高影响或不可逆动作，未设置执行前的弹窗审批，允许模型连续自动放行。

## 与提示词注入的联动风险

过度授权本身属于系统架构与权限配置问题，即使没有外部攻击者，模型自身一次普通的理解偏差或幻觉就可能触发误删、误改。而当外部文档或网页中藏有恶意指令时，提示词注入提供「恶意意图」，过度授权则提供了「足以造成严重后果的执行通道」，两者叠加会显著放大数据外泄与系统受损的风险。

## 常见缓解思路与边界

- **收敛工具与权限面**：按任务最小需要开放只读或受限写入接口，并结合[沙盒](/glossary/sandbox/)机制隔离底层文件系统与网络访问。
- **关键动作保留人工审批**：将不可逆修改、批量操作和外部通信放在人工确认节点之后。
- **不能仅靠模型自觉规避**：过度授权无法通过加强[系统提示词](/glossary/system-prompt/)或更换更强模型来根治，必须依靠宿主程序与权限系统的刚性约束。
