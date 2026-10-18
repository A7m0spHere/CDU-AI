---
term: "MCP"
en: "Model Context Protocol"
category: "agents"
aliases: ["模型上下文协议", "MCP Server"]
definition: "MCP 是让模型与外部数据源和工具互相调用的开放协议。"
example: "通过 MCP 连接社团文档库，让助手查询公开资料；权限仍由系统控制。"
order: 5
related: ["tool-calling", "permission-mode"]
updated: "2026-10-19"
sources:
  - title: "Model Context Protocol · Architecture overview"
    url: "https://modelcontextprotocol.io/docs/learn/architecture"
---

## 一句话说清

一套让 AI 工具接外部系统的通用接口。有了它，接笔记库、数据库、文档系统不用每次重写一套对接代码。

## 打个比方

USB 接口。显示器、键盘、U 盘都走同一套标准，不用为每个设备换一种插头。

## 它是怎么运作的

1. MCP 服务器把某个系统的能力列出来：能查什么、能改什么。
2. AI 应用（客户端）连上去，发现这些能力。
3. 模型按需调用，服务器负责真正执行。

## 你会碰到它的场景

- 让助手读你的笔记库，再基于笔记回答问题。
- 把社团的文档系统接进来，让 AI 查公开资料。
- 在本地跑一个 MCP 服务，让 AI 操作你电脑上的某个工具。

## 常见误解

- 以为 MCP 是模型。它是协议，模型还是那个模型。
- 以为接上就什么都能读。权限仍由服务器和客户端控制。
- 以为它是某家公司的私有产品。它是公开的规范，谁都可以实现。

## 想再深入一点

MCP 让「接工具」标准化了，代价是多出一层服务要部署和维护。小项目不接也能用，接不接取决于你有多需要它。
