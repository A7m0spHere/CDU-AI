---
term: "温度"
en: "Temperature"
category: "basics"
aliases: ["Temperature", "随机性", "采样温度"]
definition: "控制回答随机程度的设置：调低更稳定，调高更多样。"
example: "在支持调节温度的接口里，固定其他输入后调低温度，生成的通知通常更相似，但仍不保证完全一致。"
youMaySay: "同样的问题问两遍，答案怎么不一样？"
scenario:
  title: "让 AI 写三版通知"
  steps:
    - label: "连续生成"
      body: "同一段要求让 AI 写三遍，得到三个略有不同的版本。"
      note: "重复生成可能有差异，不能只凭差异判断温度值。"
    - label: "调低温度"
      body: "在 API 里把 temperature 调低，再生成三遍，结果高度接近。"
      meta: "API 参数"
    - label: "按需选择"
      body: "要稳定用低温度，要创意用高温度。"
quiz:
  - question: "把温度调低，最直接的变化是？"
    options:
      - text: "回答更正确"
        correct: false
      - text: "回答更稳定、更接近最常见写法"
        correct: true
      - text: "模型会联网查资料"
        correct: false
    explain: "温度直接调整采样随机性；它可能影响具体结果，但调低并不保证事实正确。"
agentPrompt: "请用两种不同的表达风格各写一版下面这段话，并说明两版的主要差异。"
order: 6
related: ["llm", "prompt"]
updated: "2026-10-30"
sources:
  - title: "Messages API（temperature 参数）· Anthropic"
    url: "https://platform.claude.com/docs/en/api/messages"
basis: "desk-research"
aiUsage: "drafted"
---

## 一句话说清

温度是生成时的一个参数：值低时模型更倾向选最可能的词，回答稳定；值高时更愿意选冷门词，回答多样但不稳。

## 打个比方

像做选择题：低温度总选「最像标准答案」的那个，高温度偶尔选个冷门的，可能更有创意也可能跑偏。

## 它是怎么运作的

模型每步会得到一组候选词的概率。温度调低会让高概率词更占优，调高会拉平差距，随机性变大。

## 你会碰到它的场景

- 写文案想要多个版本时调高；
- 整理数据、写代码时希望稳定，调低；
- 网页版产品通常不暴露这个参数，只有 API 或自建应用能调。

## 常见误解

- 以为低温更正确：只是更稳定地输出「最常见」的结果；
- 以为高温更聪明：多样不等于质量；
- 以为低温度必然每次一样：服务实现和其他生成设置也可能带来差异。

## 想再深入一点

除了温度，还有 top-p 等采样参数，作用类似：控制「从多大概率范围里选词」。
