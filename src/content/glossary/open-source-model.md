---
term: "开源模型"
en: "Open-source Model"
category: "basics"
aliases: ["Open-source Model", "开源大模型"]
definition: "允许使用、研究、修改和分享，并提供所需代码、权重与数据信息的模型。"
example: "有的模型把权重放在网上，你可以下载到本地跑；但许可条款可能限制商用。"
youMaySay: "开源模型是不是就能随便商用？"
scenario:
  title: "核对模型的开放范围"
  steps:
    - label: "下载权重"
      body: "从官方渠道拿到模型文件。"
      note: "先看许可条款。"
    - label: "读许可"
      body: "区分开放权重与开源，并检查用途限制、署名与再分发要求。"
      meta: "许可限制"
    - label: "决定方案"
      body: "超出许可就换模型或申请授权。"
quiz:
  - question: "看到模型提供权重下载，哪种判断正确？"
    options:
      - text: "公开权重就可以随意商用"
        correct: false
      - text: "还要核对许可与开放材料，公开权重不自动等于开源"
        correct: true
      - text: "一定比闭源模型弱"
        correct: false
    explain: "按 OSI 的定义，开源 AI 还要求相应自由、代码与数据信息；只有权重可下载并不够。"
agentPrompt: "请帮我对比这两个开源模型的许可条款，重点看商用、署名与再分发要求，并列出不确定的地方。"
order: 11
related: ["local-deployment", "llm"]
updated: "2026-10-30"
sources:
  - title: "The Open Source AI Definition 1.0 · OSI"
    url: "https://opensource.org/ai/open-source-ai-definition"
basis: "desk-research"
aiUsage: "drafted"
---

## 一句话说清

开源模型和开放权重不是同一个概念。按开放源代码促进会（OSI）的开源 AI 定义，除了权重，还需要提供相应代码与足够的训练数据信息，并允许使用、研究、修改和分享。

## 打个比方

像提供可研究、修改和分享的配方与制作材料。只让你拿走成品，或规定只能在家用，并不等于满足这套开放要求。

## 它是怎么运作的

发布者决定开放哪些材料、采用什么许可。开源许可可以要求署名或以相同许可分享修改版；如果禁止商用或限制用途，就不符合 OSI 定义中的相应自由。

## 你会碰到它的场景

- 想本地部署、微调；
- 看到「开源」「开放权重」宣传；
- 比较不同模型的能力与许可。

## 常见误解

- 以为公开权重就是开源：还要检查开放材料与许可；
- 以为开源一定能力弱：有的很强，但部署成本也高；
- 以为下载即拥有：仍受许可约束。

## 想再深入一点

模型宣传中的「开源」用法并不统一。只确认权重可下载时，先称为「开放权重」；需要判断是否符合开源定义时，再对照公开材料与许可，不只看宣传名称。
