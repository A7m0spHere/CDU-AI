---
term: "API"
en: "Application Programming Interface"
category: "tools"
aliases: ["接口", "应用程序接口", "API Key"]
definition: "让程序调用模型的接口；和网页版是同一个模型的两种用法。"
example: "做个自动整理实验数据的小工具，就要用 API 把模型接进程序，而不是手动复制粘贴。"
youMaySay: "为什么网页能用，写脚本就要另外申请 Key？"
scenario:
  title: "把模型接进脚本"
  steps:
    - label: "申请密钥"
      body: "在平台创建 API Key，按文档发请求。"
      note: "密钥等于账号，要保密。"
    - label: "看到计费"
      body: "网页版不单独计费，API 按 token 计费。"
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
    explain: "同一模型两种用法，接口对象不同。"
agentPrompt: "请按以下 JSON 结构输出三条待办事项：title、due、owner；缺失字段填 null，不要编造。"
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
