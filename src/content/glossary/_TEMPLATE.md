---
# 使用方式：把本文件复制为「英文短名.md」（例如 09-token.md），再逐项填写。
# 以 _ 开头的文件不会进入构建，本文件仅作模板。
term: "术语中文名"
en: "English Term"
category: "basics" # 主分支：basics / prompt / tools / agents / safety / cost
#                     延伸分支（只做术语介绍）：vibecoding / frontend / backend / product / testing / git
aliases: []
definition: "一句话释义：列表卡片、搜索和页面标题都会用到。"
example: "校园或学习中的具体场景。"
order: 1 # 同一分类内从 1 连续；唯一性由 npm run check:content 检查
related: [] # 「接下来学什么」：相关词条的 id（文件名，不含 .md），必须是已存在的词条
updated: "2026-10-21" # 最后核对日期，YYYY-MM-DD
sources: [] # 发布前至少补 1 条支持正文的官方文档或原始论文，包含 title / url

# ---- 术语模块的可选区块（不写就不渲染）----------------------------------
# 1) 你可能会说：读者真实会问出口的一句话
# youMaySay: "这份 AI 旅行攻略写得很肯定，但景点开放时间我不敢直接信……"
#
# 2) 场景拆解：2–4 步可点击流程，点每一步显示对应的「提示画面」
# scenario:
#   title: "AI 写进攻略的开放时间怎样被核验"
#   steps:
#     - label: "看见说法"
#       body: "攻略里写得很具体，先当成待核验的说法。"
#       quote: "城市博物馆周一开放到 22:00，晚上去人少。"
#       meta: "示例 AI 旅行攻略 · 尚未核验"
#       note: "行程已经排上了，但还没查官方开放时间。"
#     - label: "核对来源"
#       body: "打开官网或官方预约页，核对开放时间与发布日期。"
#       note: "只有搜索摘要时，先按不确定处理。"
#     - label: "改正攻略"
#       body: "按官方信息改正行程，并附上来源链接。"
#
# 3) 选择题：最多 3 题，每题 2–4 个选项，且必须恰好一个 correct: true
# quiz:
#   - question: "……哪种做法最合适？"
#     options:
#       - text: "继续问同一个 AI 它是否确定"
#         correct: false
#       - text: "联网核对官网、官方预约页后再决定"
#         correct: true
#     explain: "模型说「我确定」不能当作证据……"
#
# 4) 你可以这样告诉 AI Agent：可直接复制的一段提示词
# agentPrompt: "请联网逐项核对……并附上来源链接、发布日期。"
# 内容状态字段（可选）。默认显示「初稿 · 尚未审核」；
# 审核负责人确认结论后同时填 reviewed / reviewedBy；可使用 AI 初审与辅助审核，规则见 docs/CONTENT-REVIEW.md。
# reviewed: "2026-10-21"
# reviewedBy: "审校人笔名"
# needsUpdate: false
# reviewNote: "审校范围或待更新原因（不超过 200 字）"
# basis: "teaching-example" # first-hand / desk-research / teaching-example
# aiUsage: "drafted" # none / assisted / drafted
# contributors: ["贡献者笔名"]
---

<!-- 以下为 AI 主分支结构。延伸分支请改为「是什么 / 什么时候会遇到 / 和 AI 的关系 /（可选）想深入再看」，不写操作教程。详见 docs/CONTENT-GUIDE.md 第 5 节。 -->

## 一句话说清

## 打个比方

## 它是怎么运作的

## 你会碰到它的场景

## 常见误解

## 想再深入一点（可选）
