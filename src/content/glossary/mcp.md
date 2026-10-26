---
term: "MCP"
en: "Model Context Protocol"
category: "agents"
aliases: ["Model Context Protocol", "模型上下文协议"]
definition: "让 AI 连接外部工具和数据源的一种开放协议标准。"
example: "同一个 MCP 服务，可以让不同的 AI 客户端都能读你的本地笔记、查数据库。"
order: 6
related: ["tool-use", "ai-agent"]
updated: "2026-10-26"
sources:
  - title: "Model Context Protocol 官方站点"
    url: "https://modelcontextprotocol.io/"
basis: "desk-research"
aiUsage: "drafted"
---

## 一句话说清

MCP（Model Context Protocol）是一套开放协议：规定 AI 应用如何发现和调用外部工具、读取数据源。

## 打个比方

像 USB 接口：设备按同一套标准做，换个电脑也能插上用。

## 它是怎么运作的

服务端暴露工具与资源，客户端（AI 应用）按协议连接、读取清单、发起调用；权限由客户端和服务端共同控制。

## 你会碰到它的场景

- 编程工具支持「添加 MCP 服务器」；
- 桌面 AI 连接本地文件、数据库；
- 配置里出现 server 命令与参数。

## 常见误解

- 以为 MCP 是模型能力：它是接口标准，模型本身不变；
- 以为连上就安全：第三方服务可能读取或篡改数据；
- 以为只有一种实现：协议开放，实现质量参差。

## 想再深入一点

MCP 解决的是「工具接入标准化」，不解决工具本身是否可靠。
