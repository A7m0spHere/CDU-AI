---
term: "分支"
en: "Branch"
category: "git"
aliases:
  - "Branch"
  - "代码分支"
definition: "在版本控制系统中从现有提交历史分叉出的独立开发线，用于在不影响主线的前提下隔离修改。"
example: "开发新功能或修复缺陷时先创建独立分支，待修改验证通过后再合并回主分支，避免未完成的代码影响主线版本。"
order: 4
related:
  - "repository"
  - "commit"
  - "merge"
  - "pull-request"
updated: "2026-11-18"
sources:
  - title: "About branches · GitHub Docs"
    url: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-branches"
basis: "desk-research"
aiUsage: "drafted"
reviewNote: "按极简维基体例重构正文与结构，待负责人复审。"
---

在[版本控制](/glossary/version-control/)系统中，分支本质上是指向特定[提交](/glossary/commit/)记录的可移动指针，而非整份项目文件的物理拷贝。每次产生新的提交，当前所在分支的指针便向前推进，从而使同一[仓库](/glossary/repository/)内的多条开发线能够并行演进、互不干扰。

## 运行机制与常见类型

分支通过共享共同的历史起点并记录各自的后续提交来实现分叉。实际协作中，不同分支通常承担明确的角色分工：

| 分支类型 | 核心定位 | 常见生命周期 |
| --- | --- | --- |
| **主分支**（Main Branch） | 承载稳定、可交付或当前基准状态的内容 | 长期存在，通常受保护限制直接写入 |
| **功能分支**（Feature Branch） | 围绕单个新特性、页面或文档专题展开修改 | 从主分支切出，完成后合入并删除 |
| **修复分支**（Fix Branch） | 专门用于排查和解决已发现的 [Bug](/glossary/bug/) | 针对具体问题创建，验证通过后及时合回 |

## 协作流转与工作区状态

一条分支从创建到结束通常遵循「从基准提交分叉—持续产生新提交—经 [Pull Request](/glossary/pull-request/) 审阅—执行[合并](/glossary/merge/)」的流程。多个协作者可以在各自独立的分支上同时修改不同模块，再分批集成回目标分支。

需要注意的是，分支隔离的是**已经提交的版本历史**，而不是工作区中尚未保存或尚未提交的临时修改。若本地存在未提交的改动，切换分支时这些变更可能会被带入新分支，或因与目标分支冲突而被系统阻止。

## 与 AI 辅助开发的配合

在使用[AI 编程助手](/glossary/coding-assistant/)进行[代码生成](/glossary/code-generation/)或大范围重构时，先切出独立分支是控制改动风险的关键做法。由于 AI 的多文件改写可能偏离预期，将试验过程留在独立分支中，可以在不满意时直接放弃该分支而不波及主线。在让 AI 修改文件之前，也应确认当前所处分支名称及工作区状态，避免将未验证的产物直接写入主分支。

## 概念边界

- **不等于仓库副本**：分支存在于同一仓库内部，共享权限与底层存储对象；若需跨账号复制整座仓库，则对应 [Fork](/glossary/fork/) 机制。
- **不隔离外部运行环境**：分支只隔离源码与文档历史，若多个分支共用同一本地端口、配置文件或[数据库](/glossary/database/)，切换分支不会自动还原外部环境中的数据状态。
