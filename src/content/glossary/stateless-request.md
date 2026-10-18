---
term: "无状态请求"
en: "Stateless Request"
category: "context"
aliases: ["无状态 API"]
definition: "无状态请求不会自动继承上一轮输入和结果；它是否留存请求数据，要另看服务商的数据政策。"
example: "上一轮生成了表格，下一轮只说「继续」，模型并不知道要继续哪张表。"
order: 11
related: ["conversation-history", "agent-memory", "context-window"]
updated: "2026-10-19"
sources:
  - title: "OpenAI · Conversation state"
    url: "https://developers.openai.com/api/docs/guides/conversation-state"
  - title: "OpenAI · Data controls in the OpenAI platform"
    url: "https://developers.openai.com/api/docs/guides/your-data"
---

## 一句话说清

每次调用只依据本次提供的内容，不会自动接上上一轮对话。要连续交流，应用需要把相关历史一起带上。这描述的是对话状态，不代表服务端没有保存请求或日志。

## 打个比方

每次去窗口办事都要重新交相关材料，柜台不会自动调出你上一次的材料来接着办。但窗口可能仍会保留业务记录，这和是否自动接着办理是两回事。

## 它是怎么运作的

1. 你发请求，把需要的内容全带上。
2. 服务端依据本次内容计算并返回结果；下次调用不会自动沿用这一轮。
3. 想要连续对话，由客户端负责把历史整理好再发一次。

服务商是否记录输入、输出或日志，以及保留多久，取决于产品、接口和账号设置，需要单独核对官方的数据留存说明。

## 你会碰到它的场景

- 自己调 API 时发现模型「失忆」，因为它根本没收到上一轮。
- 只发一句「继续」，得到一段不接上下文的内容。
- 搭建自己的助手，需要自己管理历史长度。

## 常见误解

- 以为模型记得上一轮。多数情况下是客户端在重发历史。
- 以为无状态就不能多轮对话。可以，但历史得你自己带。
- 以为无状态就是零数据留存。不自动继承对话和不保存数据是两个不同的承诺。
- 以为这是缺陷。它让服务更容易扩容、计费更清楚，也是很多接口的设计前提。

## 想再深入一点

理解了这一点，就能明白为什么长对话会变慢变贵：每一轮都在把越来越长的历史重新发一遍。
