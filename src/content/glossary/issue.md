---
term: "Issue（议题）"
en: "Issue"
category: "git"
aliases:
  - "Issue"
  - "议题"
  - "问题单"
definition: "代码托管平台中用于记录缺陷、功能建议、讨论事项与待办任务的跟踪条目。"
example: "用户发现页面链接失效后新建一条 Issue 并附上访问路径与复现步骤，维护者据此分配任务并关联后续修复提交。"
order: 7
related:
  - "pull-request"
  - "bug"
  - "requirements"
  - "repository"
updated: "2026-11-18"
sources:
  - title: "About issues · GitHub Docs"
    url: "https://docs.github.com/en/issues/tracking-your-work-with-issues/learning-about-issues/about-issues"
basis: "desk-research"
aiUsage: "drafted"
reviewNote: "按极简维基体例重构正文与结构，待负责人复审。"
---

Issue 是代码托管平台中用于公开记录、讨论与追踪项目事项的结构化条目。每个[仓库](/glossary/repository/)中的每条 Issue 都拥有唯一编号、开启或关闭状态以及完整的讨论时间线，使维护者与参与者能够在动手修改代码之前对齐问题背景、明确目标并沉淀协作记录。

## 主要用途与结构要素

围绕软件与文档项目的日常维护，Issue 通常承担三类核心职能：

| 常见用途 | 核心记录内容 | 后续流转方式 |
| --- | --- | --- |
| **缺陷报告** | 错误现象、运行环境、预期结果与复现步骤 | 定位 [Bug](/glossary/bug/) 原因并关联修复代码 |
| **需求与建议** | 新功能设想、文档补充方向或体验改进建议 | 讨论[需求](/glossary/requirements/)优先级后拆解排期 |
| **任务追踪** | 阶段性待办清单、版本发布检查项与分工记录 | 逐项核对完成状态并留存决策依据 |

此外，平台通常提供**标签**（Label）、**负责人**（Assignee）与**里程碑**（Milestone）等元数据工具，便于按模块或紧急程度筛选事项。Issue 还可以与具体[提交](/glossary/commit/)或 [Pull Request](/glossary/pull-request/) 相互关联，当对应修复方案被[合并](/glossary/merge/)入主线时，系统可自动将关联的 Issue 标记为已关闭。

## AI 辅助整理与信息真实性

当遇到零散的报错日志、模糊的使用困惑或多条反馈时，借助[对话助手](/glossary/chatbot/)将口头描述整理为结构清晰的 Issue 草稿，能够显著提升维护者的排查效率。

但在使用 AI 整理内容时必须守住真实性底线：报错原文、访问路径、版本号以及已经验证过的复现步骤必须全部来自真实操作结果，绝不能让模型补充未经验证的猜测或虚构错误现象，否则反而会误导排查方向。

## 概念边界

- **本身不包含代码改动**：Issue 属于问题管理与沟通层面的记录工具，开启或关闭一条 Issue 不会改变仓库中的任何文件；实际变更仍需通过[分支](/glossary/branch/)修改与 PR 提交实现。
- **不是即时聊天窗口**：高质量的 Issue 强调上下文自洽与长期可检索性，适合沉淀明确且可跟进的事项，而不宜充当缺乏背景说明的碎片化闲聊。
