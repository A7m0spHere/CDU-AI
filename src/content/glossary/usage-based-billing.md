---
term: "按量计费"
en: "Usage-based Billing"
category: "cost"
aliases: ["Usage-based Billing", "按量付费", "按 token 计费"]
definition: "按实际用掉的 token 数量收费，用得多付得多。"
example: "同一份报告，让 AI 写摘要和让它逐字改写全文，消耗的 token 可能差很多倍。"
youMaySay: "为什么账单每天都不一样？"
scenario:
  title: "一个月的 API 账单"
  steps:
    - label: "开始使用"
      body: "脚本每天处理几十份材料。"
      note: "token 消耗随时累积。"
    - label: "查看账单"
      body: "发现长文档处理的那几天费用明显上升。"
      meta: "按量计费"
    - label: "优化"
      body: "先摘要再处理，控制上下文长度。"
quiz:
  - question: "按量计费下，成本主要取决于？"
    options:
      - text: "账号注册时间"
        correct: false
      - text: "实际消耗的 token 数量"
        correct: true
      - text: "电脑性能"
        correct: false
    explain: "用量决定费用，长上下文与重复请求影响最大。"
agentPrompt: "请分析下面这个任务哪些步骤最耗 token，并给出三条降低成本的具体建议。"
order: 1
related: ["token", "subscription"]
updated: "2026-10-26"
sources:
  - title: "Pricing · Anthropic"
    url: "https://platform.claude.com/docs/en/about-claude/pricing"
basis: "desk-research"
aiUsage: "drafted"
---

## 一句话说清

按量计费是按实际消耗收费：输入和输出的 token 都算钱，用多少付多少，不用不付。

## 打个比方

像打车按里程计费：路远就贵，堵车绕路也会多花。

## 它是怎么运作的

服务商按模型单价乘以 token 数结算，输入与输出单价可能不同；长对话每轮都会重复带上历史，成本累积更快。

## 你会碰到它的场景

- API 账单按天或按项目统计；
- 长文档处理费用明显上升；
- 试用额度用完后开始扣费。

## 常见误解

- 以为一次提问只算一次：历史上下文也会计入；
- 以为价格固定：不同模型、不同时间会变；
- 以为便宜就一定划算：还要算重试与人工核对成本。

## 想再深入一点

控制成本常用：缩短上下文、缓存重复内容、按任务选合适大小的模型。
