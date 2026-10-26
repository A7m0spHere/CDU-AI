---
term: "API"
en: "Application Programming Interface"
category: "tools"
aliases: ["接口", "应用程序接口", "API Key"]
definition: "让程序调用模型的接口；和网页版是同一个模型的两种用法。"
example: "做个自动整理实验数据的小工具，就要用 API 把模型接进程序，而不是手动复制粘贴。"
order: 2
related: ["chatbot", "usage-based-billing", "deployment"]
updated: "2026-10-26"
sources:
  - title: "API overview · Anthropic"
    url: "https://platform.claude.com/docs/en/api/overview"
basis: "desk-research"
aiUsage: "drafted"
---

## 一句话说清

API 是程序之间的约定：你的程序按格式发请求，模型服务按格式回结果。网页版是人点，API 是程序调。

## 打个比方

像点餐：网页版是你在店里点，API 是你打电话按固定话术下单，后厨是同一个。

## 它是怎么运作的

你拿到密钥，按文档发送请求（模型名、消息、参数），服务返回结果并计费。密钥等于账号，泄露会被别人用。

## 你会碰到它的场景

- 做自动化脚本、网站、Agent；
- 看到「API Key」「接口文档」「调用量」；
- 同一模型网页版不单独计费，API 按量收费。

## 常见误解

- 以为 API 更聪明：模型可能一样，差别在参数与工具；
- 以为有密钥就能随便用：额度、限速、计费都受约束；
- 以为 API 结果一定稳定：同样有随机性和幻觉。

## 想再深入一点

API 只是通道，真正的产品体验还取决于你怎么写提示词、怎么处理错误与重试。
