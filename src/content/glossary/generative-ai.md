---
term: "生成式 AI"
en: "Generative AI"
category: "basics"
aliases:
  - "Generative AI"
  - "GenAI"
  - "生成式人工智能"
  - "AIGC"
definition: "基于从大量数据中学到的分布规律，按输入要求新生成文本、图像、音频、视频或代码的人工智能技术。"
example: "用文本模型起草活动文案、用图像模型生成海报配图，或让模型根据草图生成前端页面代码，都属于生成式 AI 应用。"
order: 12
related:
  - "llm"
  - "multimodal"
  - "training-data"
  - "hallucination"
updated: "2026-11-21"
sources:
  - title: "NIST AI 600-1: Generative Artificial Intelligence Profile"
    url: "https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf"
  - title: "Generative AI Use Cases · Google Cloud"
    url: "https://cloud.google.com/use-cases/generative-ai"
basis: "desk-research"
aiUsage: "drafted"
reviewNote: "配合指南首页与工具目录概念补充生成式 AI 词条，待负责人复审。"
---

生成式 AI（Generative AI，中文常与 AIGC「人工智能生成内容」并提）是人工智能的一个重要分支。与传统机器学习侧重对已有信息做分类、识别或数值预测不同，生成式 AI 能够依据从海量[训练数据](/glossary/training-data/)中学到的统计规律，响应用户的[提示词](/glossary/prompt/)或输入素材，创作出全新的文本、代码、图像、音频或视频内容。

## 常见内容形态与代表分支

在实际应用与工具生态中，生成式 AI 覆盖多种媒介形态，底层往往采用不同的模型结构与生成机理：

- **文本与代码生成**：以[大语言模型](/glossary/llm/)为代表，擅长问答、摘要、改写与[代码生成](/glossary/code-generation/)。
- **图像与视频生成**：多基于扩散模型等视觉生成架构，可根据文字描述或参考图片绘制插画、海报与短视频。
- **语音与跨模态生成**：将文字转为自然语音、克隆音色或合成音乐；许多现代[多模态](/glossary/multimodal/)模型已将多种理解与生成能力整合在同一入口中。

## 典型风险与使用边界

生成式 AI 降低了内容创作和软件原型的起步门槛，但也带来与传统判别式模型不同的局限：

- **真实性无保障**：模型按概率拼接最合理的输出，并不对事实真伪负责，容易出现[AI 幻觉](/glossary/hallucination/)或以假乱真的[深度伪造](/glossary/deepfake/)风险。
- **版权与隐私争议**：生成内容可能受训练数据来源、风格模仿与平台服务条款影响，涉及公开传播或商用前需留意[版权](/glossary/copyright/)与[隐私](/glossary/privacy/)合规要求。

## 概念边界

- **生成式 AI 不等于全部人工智能**：手机人脸解锁、推荐算法、垃圾邮件过滤等传统识别或决策系统通常不属于生成式 AI；而[对话助手](/glossary/chatbot/)只是生成式 AI 的一种常见产品形态。
- **输出流畅不代表经过验证**：无论是文章段落还是运行脚本，生成产物都应经过人工核实或实测，不能直接当作权威事实或最终交付品。
