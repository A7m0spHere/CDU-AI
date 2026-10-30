---
term: "多模态"
en: "Multimodal"
category: "basics"
aliases: ["Multimodal", "多模态模型"]
definition: "不只处理文字，还能理解或生成图像、声音等形式的模型。"
example: "拍一张食堂菜单问 AI「这份菜热量大概多少」，能看图回答的模型就是多模态模型。"
youMaySay: "发张图给它，它真能看懂吗？"
scenario:
  title: "拍菜单问热量"
  steps:
    - label: "拍照上传"
      body: "拍食堂菜单发给支持看图的模型。"
      note: "不同模型支持的图片能力不同。"
    - label: "得到估算"
      body: "它给出大致热量范围，但把「红烧」看成了「清蒸」。"
      meta: "识别错误"
    - label: "人工核对"
      body: "对着菜单原文再确认一次。"
      note: "看图不等于精确识字。"
quiz:
  - question: "多模态模型看图回答时，哪种风险仍然存在？"
    options:
      - text: "小字和手写内容识别错误"
        correct: true
      - text: "完全不能处理图片"
        correct: false
      - text: "只能处理黑白图片"
        correct: false
    explain: "多模态能看图，但小字、表格、手写仍容易出错。"
agentPrompt: "请描述这张图里能确认的信息和不确定的信息，分开列出；看不清的地方不要猜。"
order: 8
related: ["llm", "copyright", "deepfake"]
updated: "2026-10-26"
sources:
  - title: "Vision · Anthropic"
    url: "https://platform.claude.com/docs/en/build-with-claude/vision"
basis: "desk-research"
aiUsage: "drafted"
---

## 一句话说清

多模态模型能同时处理多种形式的信息：文字、图片、音频、视频。你可以发图让它解释，也可以让它把文字画成图。

## 打个比方

像从「只会读字」变成「也能看图听声」的助手：本事变宽了，但每样本事都有边界。

## 它是怎么运作的

图片等输入会被转换成模型能处理的表示，再和文字一起参与理解与生成。不同模型支持的模态和精度不同。

## 你会碰到它的场景

- 拍板书、菜单、设备铭牌让 AI 解释；
- 发截图让它改代码或排版；
- 用文字生成图片、语音。

## 常见误解

- 以为能看图就能精确识字：小字、表格、手写常出错；
- 以为生成的图可以直接商用：版权与授权要另看；
- 以为所有模型都能看视频：能力各不相同。

## 想再深入一点

「模态」指信息的形态；多模态不是某一种模型架构的专名，而是能力描述。
