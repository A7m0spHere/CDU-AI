---
term: "MCP"
en: "Model Context Protocol"
category: "agents"
aliases:
  - "Model Context Protocol"
  - "模型上下文协议"
definition: "规定 AI 应用与外部工具、数据源之间交互方式的开放协议标准。"
example: "在支持该协议的桌面对话工具或编程助手中配置同一套本地文件服务后，无需为每个客户端单独编写适配代码即可直接读写笔记。"
order: 6
related:
  - "tool-use"
  - "ai-agent"
  - "api"
  - "prompt-injection"
updated: "2026-11-18"
sources:
  - title: "Model Context Protocol 官方站点"
    url: "https://modelcontextprotocol.io/"
  - title: "Architecture overview · Model Context Protocol"
    url: "https://modelcontextprotocol.io/docs/learn/architecture"
  - title: "Security Best Practices · Model Context Protocol"
    url: "https://modelcontextprotocol.io/docs/2025-11-25/tutorials/security/security_best_practices"
basis: "desk-research"
aiUsage: "drafted"
reviewNote: "按极简维基体例重构正文与结构，待负责人复审。"
---

Model Context Protocol（模型上下文协议）由标准化接口与传输规范构成，旨在解决不同 AI 应用接入各类外部能力时的重复适配问题。在引入统一协议之前，每个[对话助手](/glossary/chatbot/)或[AI 编程助手](/glossary/coding-assistant/)往往需要为不同服务分别编写专有集成逻辑；通过 MCP，客户端与能力提供方只需遵循同一套交互契约即可互通。

## 核心架构与角色

MCP 采用分层架构将用户交互界面、协议调度与外部能力解耦，主要包含以下三个组成部分：

- **宿主与客户端**（Host / Client）：面向用户的 AI 应用及其内部的协议调度模块，负责向用户界面呈现可用能力、转发模型请求并统筹执行前的权限确认。
- **服务端**（Server）：连接本地文件、[数据库](/glossary/database/)或远程 [API](/glossary/api/) 的轻量程序，按协议格式向客户端宣告自身能力并执行具体操作。
- **传输层**（Transport）：支持本机标准输入输出（stdio）与基于 HTTP 的远程通信方式，使服务端既可运行在用户电脑本地，也可托管在远端[服务器](/glossary/server/)上。

## 协议提供的能力原语

服务端可以通过 MCP 向客户端暴露三类标准化能力，各自对应不同的控制权与触发方式：

| 能力类型 | 作用定位 | 控制主体 |
| --- | --- | --- |
| **工具**（Tools） | 供模型触发的可执行操作，如检索记录、写入文件或调用接口 | 由模型发起意图，经应用确认后执行 |
| **资源**（Resources） | 结构化或非结构化的只读数据，如文档内容、配置与查询结果 | 由应用按需读取并注入[上下文窗口](/glossary/context-window/) |
| **提示词模板**（Prompts） | 服务端预置的标准化[提示词模板](/glossary/prompt-template/)与任务片段 | 通常由用户主动选择并加载到对话中 |

## 与工具调用及安全边界的关系

- **与工具调用的区别**：[工具调用](/glossary/tool-use/)描述的是模型生成结构化参数以触发外部功能的机制，而 MCP 定义的是应用层如何发现能力、传输请求与回传结果的通用协议；模型本身并不因接入 MCP 而改变参数或推理能力。
- **权限与安全风险**：连接外部 MCP 服务意味着第三方程序与数据将接入当前会话。若服务端缺少最小权限隔离，或外部数据源返回带有恶意指令的内容，可能引发敏感数据泄露或间接[提示词注入](/glossary/prompt-injection/)，因此涉及写入与外发的操作仍需人工确认。
- **概念边界**：MCP 仅负责打通连接规范，既不保证第三方服务端本身的稳定性与结果准确性，也不等价于具备自主规划能力的[AI Agent](/glossary/ai-agent/)。
