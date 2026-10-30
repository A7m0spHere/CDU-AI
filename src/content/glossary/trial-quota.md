---
term: "试用额度"
en: "Trial Quota"
category: "cost"
aliases: ["试用期额度", "赠送额度", "试用次数"]
definition: "产品为评估用途提供的有限用量或时长；到期、用尽后的处理以规则为准。"
example: "新注册的 AI 产品送几天高级模型试用，到期后回到基础版——这就是试用额度。"
youMaySay: "试用额度用完了怎么办？"
scenario:
  title: "新产品的试用期"
  steps:
    - label: "注册试用"
      body: "新产品送几天高级模型试用。"
      note: "规则随时会变。"
    - label: "额度用完"
      body: "查看到期、用尽和续费规则，不假定第二天会恢复。"
      meta: "额度限制"
    - label: "评估价值"
      body: "判断它是否值得继续用，再决定是否付费。"
quiz:
  - question: "试用额度的正确用法是？"
    options:
      - text: "当作长期方案"
        correct: false
      - text: "用来评估产品是否适合自己"
        correct: true
      - text: "多注册账号延长使用"
        correct: false
    explain: "试用是评估期，规则不稳定。"
agentPrompt: "请帮我在试用期内设计一个一周测试计划，覆盖我最重要的三个使用场景，并记录结果。"
order: 3
related: ["rate-limit", "subscription"]
updated: "2026-10-30"
sources:
  - title: "Free Google Cloud features and trial offer · Google Cloud"
    url: "https://docs.cloud.google.com/free/docs/free-cloud-features"
basis: "desk-research"
aiUsage: "drafted"
---

## 一句话说清

试用额度是产品给的试用资源：一定次数的对话、一定量的 token 或几天的高级功能。

## 打个比方

像超市试吃：尝一口不要钱，但吃不饱，也不保证一直有。

## 它是怎么运作的

服务商为试用提供一定用量或时长，可能附带领取条件、到期日与适用功能。一次性试用、按周期刷新的基础额度和付费套餐中的额度是不同安排，不能互相推断。

## 你会碰到它的场景

- 新用户注册礼；
- 评估期内提供一定调用量或功能；
- 额度用完后提示升级。

## 常见误解

- 以为试用额度永久有效：随时可能变；
- 以为基础版功能一样：模型与速度常受限；
- 以为多注册几个号就能一直白用：违反条款且不稳定。

## 想再深入一点

把试用额度当评估期：够用来判断产品是否适合，而不是长期方案。
