---
term: "深度伪造"
en: "Deepfake"
category: "safety"
aliases: ["Deepfake", "AI 换脸", "伪造音视频"]
definition: "利用 AI 合成或修改具有真实感的图像、声音或视频的技术及内容；既可能用于经授权的创作，也可能被用于冒充和欺骗。"
example: "收到「辅导员」的语音借钱消息，声音很像，也可能是伪造的——先通过官方渠道核实。"
youMaySay: "视频里那个人，真的是我认识的人吗？"
scenario:
  title: "收到熟人语音借钱"
  steps:
    - label: "收到消息"
      body: "微信里「辅导员」发语音借钱。"
      note: "声音可以克隆。"
    - label: "起疑"
      body: "语气很像，但账号是新加的。"
      meta: "换渠道核实"
    - label: "回拨确认"
      body: "挂断后用已知号码回拨，或当面确认。"
quiz:
  - question: "遇到疑似深度伪造的语音或视频，最可靠的应对是？"
    options:
      - text: "反复听几遍确认"
        correct: false
      - text: "换一个独立渠道核实身份"
        correct: true
      - text: "直接转发给同学判断"
        correct: false
    explain: "换渠道核实是防线，单看单听都不可靠。"
agentPrompt: "请帮我起草一条提醒，告诉同学遇到「熟人」语音借钱时如何通过独立渠道核实，语气简洁。"
order: 6
related: ["multimodal", "privacy"]
updated: "2026-11-01"
sources:
  - title: "The Creation and Detection of Deepfakes: A Survey (arXiv:2004.11138)"
    url: "https://arxiv.org/abs/2004.11138"
  - title: "Scammers use AI to enhance their family emergency schemes · FTC"
    url: "https://consumer.ftc.gov/consumer-alerts/2023/03/scammers-use-ai-enhance-their-family-emergency-schemes"
  - title: "Voice Cloning Comment · FTC（声音克隆的用途与风险）"
    url: "https://www.ftc.gov/system/files/ftc_gov/pdf/FTC-Comment-VoiceCloning.pdf"
basis: "desk-research"
aiUsage: "drafted"
reviewed: "2026-11-01"
reviewedBy: "A7m"
reviewNote: "负责人确认修改定义并保留其余内容；未实测具体工具。"
---

## 一句话说清

深度伪造是用 AI 合成的逼真音视频：换脸、克隆声音、生成不存在的场景。门槛越来越低。

## 打个比方

像高仿假钞：看着像真的，但经不起正规渠道验证。

## 它是怎么运作的

生成模型学习人脸、声音特征，再合成新内容；有的声音克隆工具只需短录音就能模仿说话者，实际效果取决于工具和素材。

## 你会碰到它的场景

- 语音借钱、冒充老师通知；
- 视频会议里的「熟人」；
- 社交平台上的合成视频。

## 常见误解

- 以为眼见为实：视频也能伪造；
- 以为听出感情就是真的：声音克隆已很难分辨；
- 以为只有名人会被伪造：普通人的素材同样可用。

## 想再深入一点

防线的核心是「换渠道核实」：挂断后用已知号码回拨，或当面、在官方群确认。
