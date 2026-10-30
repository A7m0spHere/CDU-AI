---
term: "偏见"
en: "Bias"
category: "safety"
aliases: ["Bias", "算法偏见", "模型偏见"]
definition: "模型输出中对人群、性别、地域的系统性倾向，来自数据与设计。"
example: "让 AI 描述「程序员」时总是默认男性，这类倾向就是偏见的一种表现。"
youMaySay: "它说的「大家都这样」，真的代表所有人吗？"
scenario:
  title: "评价职业适配"
  steps:
    - label: "提问"
      body: "问 AI「什么人适合当程序员」。"
      note: "回答可能带刻板印象。"
    - label: "发现倾向"
      body: "多次生成的人物描述高度相似。"
      meta: "系统性倾向"
    - label: "人工复核"
      body: "涉及评价人的场景改为人工判断。"
quiz:
  - question: "模型偏见通常来自哪里？"
    options:
      - text: "用户故意输入"
        correct: false
      - text: "训练数据与产品设计中的不均衡"
        correct: true
      - text: "网络延迟"
        correct: false
    explain: "数据与设计共同决定倾向。"
agentPrompt: "请检查下面这段描述是否包含对某类人群的刻板印象，指出具体语句并给出中性改写。"
order: 5
related: ["training-data", "deepfake"]
updated: "2026-10-30"
sources:
  - title: "What is AI bias? · IBM"
    url: "https://www.ibm.com/think/topics/ai-bias"
basis: "desk-research"
aiUsage: "drafted"
---

## 一句话说清

偏见是模型输出里对某些群体的系统性倾斜：不是偶尔说错，而是反复出现的模式。

## 打个比方

像只看过一类报纸的人写评论：不是故意偏，而是材料本身就不均衡。

## 它是怎么运作的

训练数据反映现实中的不均衡与刻板印象；标注、优化目标与产品设计也会放大或削弱它。

## 你会碰到它的场景

- 让 AI 评价某类人适合什么工作；
- 生成示例人物时总是同一类形象；
- 翻译里出现性别刻板用词。

## 常见误解

- 以为问一次就能测出偏见：需要多组对照；
- 以为模型中立：数据与设计都带立场；
- 以为改提示词就能消除：只能缓解表面表现。

## 想再深入一点

涉及评价人、筛选人的场景，应保留人工复核，不把模型输出当唯一依据。
