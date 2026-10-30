---
term: "版权"
en: "Copyright"
category: "safety"
aliases: ["Copyright", "著作权", "AI 版权"]
definition: "AI 生成内容的来源、引用与商用权利边界。"
example: "把 AI 生成的插画直接印在社团招新海报上，要先确认素材来源与商用授权。"
youMaySay: "AI 画的图，我能直接商用吗？"
scenario:
  title: "做招新海报"
  steps:
    - label: "生成插画"
      body: "让 AI 生成一张招新海报背景。"
      note: "生成物可能与他人作品相似。"
    - label: "查条款"
      body: "查看平台对生成物使用的约定。"
      meta: "平台条款"
    - label: "保留记录"
      body: "保存生成过程与提示词，必要时替换素材。"
quiz:
  - question: "AI 生成内容商用前，最应该做的是？"
    options:
      - text: "直接使用，AI 没有版权问题"
        correct: false
      - text: "核对平台条款与当地规定，必要时替换素材"
        correct: true
      - text: "把图改个颜色就算原创"
        correct: false
    explain: "生成物仍可能涉及他人权利。"
agentPrompt: "请帮我列出这张 AI 生成海报商用前需要确认的授权与合规事项，并标出不确定的部分。"
order: 4
related: ["privacy", "hallucination"]
updated: "2026-10-30"
sources:
  - title: "Generative AI: Navigating Intellectual Property · WIPO"
    url: "https://www.wipo.int/edocs/mdocs/mdocs/en/wipo_webinar_ft_24_1/wipo_webinar_ft_24_1_guidelines.pdf"
basis: "desk-research"
aiUsage: "drafted"
---

## 一句话说清

AI 生成内容的版权问题分两层：训练与生成是否侵权、生成物归谁用；各地规则不同，且仍在变化。

## 打个比方

像借用别人的厨房做菜：菜是你做的，但用的食材和菜谱可能有别人的权利。

## 它是怎么运作的

模型从大量作品中学规律；生成物可能与既有作品相似，也可能包含受保护元素。多数平台在用户协议里约定生成物的使用范围。

## 你会碰到它的场景

- 商用海报、视频配图；
- 模仿某位画师风格；
- 把 AI 代码贴进有许可证的项目。

## 常见误解

- 以为 AI 生成就没有版权：可能涉及他人权利；
- 以为改了颜色就算原创：实质性相似仍有风险；
- 以为平台说能用就随便用：还要看训练素材与第三方权利。

## 想再深入一点

正式商用前查平台条款与当地规定；不确定时保留创作过程记录，或改用有明确授权的素材。
