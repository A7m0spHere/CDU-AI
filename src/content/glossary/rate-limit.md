---
term: "速率限制"
en: "Rate Limit"
category: "cost"
aliases: ["Rate Limit", "限流", "请求频率限制"]
definition: "单位时间内允许请求次数的上限，超了会被拒绝或排队。"
example: "批量让 AI 处理 200 条数据时，程序突然报错「请求过于频繁」，就是撞上了速率限制。"
youMaySay: "脚本跑一半突然报「请求过于频繁」？"
scenario:
  title: "批量处理 200 条数据"
  steps:
    - label: "批量请求"
      body: "循环调用接口处理数据。"
      note: "短时间请求过多。"
    - label: "触发限流"
      body: "错误码提示超过速率限制。"
      meta: "限流保护"
    - label: "退避重试"
      body: "加等待与重试，分批处理。"
quiz:
  - question: "遇到速率限制，正确的处理方式是？"
    options:
      - text: "立刻高频重试"
        correct: false
      - text: "退避等待、分批请求"
        correct: true
      - text: "换一个账号继续刷"
        correct: false
    explain: "重试风暴只会加重拥堵。"
agentPrompt: "请为这个批量任务设计一个不会触发限流的请求节奏，说明分批与重试策略。"
order: 4
related: ["trial-quota", "truncation"]
updated: "2026-10-26"
sources:
  - title: "Rate limits · Anthropic"
    url: "https://platform.claude.com/docs/en/api/rate-limits"
basis: "desk-research"
aiUsage: "drafted"
---

## 一句话说清

速率限制是服务商对单位时间内请求次数或 token 量的上限，用来保护服务稳定与公平使用。

## 打个比方

像景区限流：不是不让你进，而是分批放行，硬挤只会更慢。

## 它是怎么运作的

服务端按时间窗口统计请求，超出就返回错误或让你等待；不同模型、不同账号等级的限额不同。

## 你会碰到它的场景

- 批量脚本跑到一半大量报错；
- 多人共用一个账号时变慢；
- 基础版比付费版更容易触发。

## 常见误解

- 以为账号被封了：多数只是临时限流；
- 以为重试越快越好：会加重拥堵；
- 以为限额固定：会随套餐与政策变化。

## 想再深入一点

工程上常用退避重试（越等越久）和排队，而不是原地狂刷。
