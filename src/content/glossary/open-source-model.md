---
term: "开源模型"
en: "Open-source Model"
category: "tools"
aliases: ["Open-source Model", "开放权重", "开源大模型"]
definition: "公开了权重或代码的模型，可以自己下载、部署和改造。"
example: "有的模型把权重放在网上，你可以下载到本地跑；但许可条款可能限制商用。"
youMaySay: "开源模型是不是就能随便商用？"
scenario:
  title: "用开源模型做社团工具"
  steps:
    - label: "下载权重"
      body: "从官方渠道拿到模型文件。"
      note: "先看许可条款。"
    - label: "读许可"
      body: "发现商用需要满足署名或用户数条件。"
      meta: "许可限制"
    - label: "决定方案"
      body: "超出许可就换模型或申请授权。"
quiz:
  - question: "「开源模型」最准确的理解是？"
    options:
      - text: "公开权重就可以随意商用"
        correct: false
      - text: "公开权重或代码，但使用受许可约束"
        correct: true
      - text: "一定比闭源模型弱"
        correct: false
    explain: "开放不等于无条件使用，许可条款才是边界。"
agentPrompt: "请帮我对比这两个开源模型的许可条款，重点看商用、署名与再分发要求，并列出不确定的地方。"
order: 6
related: ["local-deployment", "llm"]
updated: "2026-10-26"
sources:
  - title: "The Llama 3 Herd of Models (arXiv:2407.21783)"
    url: "https://arxiv.org/abs/2407.21783"
basis: "desk-research"
aiUsage: "drafted"
---

## 一句话说清

开源模型通常指公开了模型权重（有时还包括训练代码）的模型：能下载、部署、微调，但「开放」不等于「随便用」。

## 打个比方

像公开了菜谱的餐厅：你能照着做，但菜谱上写着「仅限家庭使用」时，开店就不行。

## 它是怎么运作的

模型文件发布后，任何人可在许可范围内使用。不同许可对商用、署名、再分发的要求不同。

## 你会碰到它的场景

- 想本地部署、微调；
- 看到「开源」「开放权重」宣传；
- 比较不同模型的能力与许可。

## 常见误解

- 以为开源等于可随意商用：许可可能限制；
- 以为开源一定能力弱：有的很强，但部署成本也高；
- 以为下载即拥有：仍受许可约束。

## 想再深入一点

「开放权重」比「开源」更准确：很多模型只公开权重，不公开训练数据与完整代码。
