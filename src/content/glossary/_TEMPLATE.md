---
# 使用方式：把本文件复制为「英文短名.md」（例如 token.md），再逐项填写。
# 以 _ 开头的文件不会进入构建，本文件仅作模板。
term: "术语中文名"
en: "English Term"
category: "basics" # 主分支：basics / prompt / tools / agents / safety / cost
#                     延伸分支（只做术语介绍）：vibecoding / frontend / backend / product / testing / git
aliases: []
definition: "一句话百科定义（≤ 55 字）：列表页、搜索结果和详情页导语都会用到。"
example: "一句简洁中立的具体示例说明，用于词典列表页展示。"
order: 1 # 同一分类内从 1 连续；唯一性由 npm run check:content 检查
related: [] # 「接下来学什么」：相关词条的 id（文件名，不含 .md），必须是已存在的词条
updated: "2026-11-18" # 最后核对日期，YYYY-MM-DD
sources: [] # 发布前至少补 1 条支持正文的官方文档或原始论文，包含 title / url

# 内容状态字段（可选）。默认显示「初稿 · 尚未审核」；
# 审核负责人确认结论后同时填 reviewed / reviewedBy；可使用 AI 初审与辅助审核，规则见 docs/CONTENT-REVIEW.md。
# reviewed: "2026-11-18"
# reviewedBy: "审校人笔名"
# needsUpdate: false
# reviewNote: "审校范围或待更新原因（不超过 200 字）"
# basis: "teaching-example" # first-hand / desk-research / teaching-example
# aiUsage: "drafted" # none / assisted / drafted
# contributors: ["贡献者笔名"]
---

（开篇导语：紧接页面定义导语之后，补充该术语的核心定位、工作机理或工程背景，不重复 `definition` 原话；提及本表其他词条时用 `[词条名](/glossary/词条id/)` 建立站内跳转。）

## 核心机制与切入点

（根据词条本身特点组织 3–4 个自然小节，例如机制原理、主要构成/类型、与相关概念的关系、概念边界；适当使用要点列表或简洁表格。）

## 概念边界与常见差异

- （指出该概念容易与其他概念混淆的边界或限制。）
