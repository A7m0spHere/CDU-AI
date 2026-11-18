---
term: "深度伪造"
en: "Deepfake"
category: "safety"
aliases:
  - "Deepfake"
  - "AI 换脸"
  - "伪造音视频"
definition: "利用人工智能技术合成或篡改具有高度真实感的图像、音频及视频内容的技术与产物。"
example: "通过少数公开视频或简短录音样本提取声纹与面部特征，即可合成足以以假乱真的通话语音或视频会议画面。"
order: 6
related:
  - "multimodal"
  - "privacy"
  - "copyright"
updated: "2026-11-18"
sources:
  - title: "The Creation and Detection of Deepfakes: A Survey (arXiv:2004.11138)"
    url: "https://arxiv.org/abs/2004.11138"
  - title: "Scammers use AI to enhance their family emergency schemes · FTC"
    url: "https://consumer.ftc.gov/consumer-alerts/2023/03/scammers-use-ai-enhance-their-family-emergency-schemes"
  - title: "Voice Cloning Comment · FTC（声音克隆的用途与风险）"
    url: "https://www.ftc.gov/system/files/ftc_gov/pdf/FTC-Comment-VoiceCloning.pdf"
basis: "desk-research"
aiUsage: "drafted"
reviewNote: "按极简维基体例重构正文与结构，待负责人复审。"
---

深度伪造（Deepfake）由「深度学习」（Deep Learning）与「伪造」（Fake）组合而来，指利用深度神经网络学习人物的面部表情、动作姿态或声音特征，进而生成逼真替代媒体内容的技术。相较于传统依赖人工逐帧剪辑的特效合成，现代生成式模型大幅降低了高质量合成的素材需求与制作门槛，能够同时覆盖视觉与听觉等多种[多模态](/glossary/multimodal/)信息形态。

## 主要合成类型

| 类型 | 核心机制 | 常见表现形式 |
| --- | --- | --- |
| **面部替换与重演** | 提取源人物的面部特征并驱动至目标视频帧 | 替换视频人物面容、伪造口型与微表情 |
| **语音克隆** | 从短音频样本中学习音色、语调与说话习惯 | 合成特定人物声线的通话语音或留言 |
| **全合成媒体** | 不依赖原始实拍画面，直接生成人物与场景 | 虚构人物播报、不存在的现场影像 |

## 应用场景与安全风险

- **合规创作与辅助**：在影视后期修复、多语言配音口型同步及无障碍语音合成等领域具备实用价值。
- **欺诈与冒充风险**：攻击者可利用伪造的熟人语音或视频画面实施财务诈骗、社会工程学攻击或虚假指令传达。
- **肖像与数据滥用**：未经授权采集个人公开影像或音频用于合成，易侵害个人[隐私](/glossary/privacy/)与[版权](/glossary/copyright/)，并引发名誉损害。

## 识别与核验局限

- **跨渠道核实**：面对涉及资金转账或异常指令的音视频通信，单靠肉眼观察画面细节或主观辨识语气已不足以确认真实性，需通过已知的独立联系方式进行二次核验。
- **技术对抗演进**：基于数字水印、生理特征分析与模型鉴伪的检测方案持续发展，但伪造生成与鉴伪检测之间仍处于动态对抗状态，尚无通用且绝对可靠的单点识别手段。

## 概念边界

- **不等同于传统修图与剪辑**：常规调色、美颜或人工抠像属于显式媒体编辑，而深度伪造强调由神经网络自动学习特征并重建逼真细节。
- **技术本身具有两面性**：深度伪造指代合成技术及产物本身，是否构成违法或恶意行为取决于授权状态与使用意图。
