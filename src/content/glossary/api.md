---
term: "API"
en: "Application Programming Interface"
category: "tools"
aliases: ["接口", "应用程序接口"]
definition: "让不同程序按约定交换数据或调用功能的接口；AI 服务可通过它供程序调用。"
example: "做个自动整理实验数据的小工具，就要用 API 把模型接进程序，而不是手动复制粘贴。"
youMaySay: "为什么网页能用，写脚本就要另外申请 Key？"
scenario:
  title: "把模型接进脚本"
  steps:
    - label: "申请密钥"
      body: "在平台创建 API Key，按文档发请求。"
      note: "密钥是调用凭证，要保密。"
    - label: "看到计费"
      body: "分别核对网页版套餐与 API 用量规则，会员未必包含 API 额度。"
      meta: "计费方式不同"
    - label: "处理错误"
      body: "遇到限速与超时，加重试与退避。"
quiz:
  - question: "API 和网页版最本质的区别是？"
    options:
      - text: "API 用的模型更强"
        correct: false
      - text: "API 面向程序调用，网页版面向人操作"
        correct: true
      - text: "API 不需要联网"
        correct: false
    explain: "两者面向的使用方式不同；可用模型、工具与计费规则也可能不同。"
agentPrompt: "请根据这份官方 API 文档，说明请求参数、认证方式、返回格式与常见错误；用占位符表示密钥，不要让我公开真实凭证。"
order: 2
related: ["chatbot", "usage-based-billing", "deployment"]
updated: "2026-10-30"
sources:
  - title: "API · MDN Glossary"
    url: "https://developer.mozilla.org/en-US/docs/Glossary/API"
  - title: "API overview · Anthropic"
    url: "https://platform.claude.com/docs/en/api/overview"
basis: "desk-research"
aiUsage: "drafted"
---

## 一句话说清

API 是程序之间交换数据、调用功能的约定，不只用于 AI。以模型 API 为例，你的程序按格式发请求，服务按格式返回结果；网页版则提供给人直接操作。

## 打个比方

像餐厅给订餐系统提供固定的下单格式：程序填菜名和数量，餐厅返回订单结果。这个入口和堂食菜单的品类、价格不一定相同。

## 它是怎么运作的

云端模型 API 通常需要密钥等认证凭证，按文档发送模型名、消息和参数。服务返回结果，并按相应规则记录用量；泄露凭证可能让别人冒用权限或产生费用。

## 你会碰到它的场景

- 做自动化脚本、网站、Agent；
- 看到「API Key」「接口文档」「调用量」；
- 比较网页版订阅与 API 用量、模型和工具的差别。

## 常见误解

- 以为 API 更聪明：模型可能一样，差别在参数与工具；
- 以为有密钥就能随便用：额度、限速、计费都受约束；
- 以为 API 结果一定稳定：同样有随机性和幻觉。

## 想再深入一点

API 只是通道，真正的产品体验还取决于你怎么写提示词、怎么处理错误与重试。
