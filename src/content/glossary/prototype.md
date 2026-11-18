---
term: "原型"
en: "Prototype"
category: "product"
aliases:
  - "Prototype"
  - "样品"
  - "低保真原型"
definition: "为验证产品方向、交互逻辑或技术可行性而低成本构建的早期样品，侧重快速试错而非完整交付。"
example: "用几句话让 AI 生成一个可点击的网页草图，先拿给潜在用户试用流程是否顺畅，这一版本即属于原型。"
order: 2
related:
  - "requirements"
  - "acceptance"
  - "ui"
  - "vibe-coding"
updated: "2026-11-18"
sources:
  - title: "Prototyping · Interaction Design Foundation"
    url: "https://www.interaction-design.org/literature/topics/prototyping"
  - title: "Making prototypes · GOV.UK Service Manual"
    url: "https://www.gov.uk/service-manual/design/making-prototypes"
basis: "desk-research"
aiUsage: "drafted"
reviewNote: "按极简维基体例重构正文与结构，待负责人复审。"
---

原型是在投入正式开发资源之前建立的初步可感知模型。它通过模拟核心流程与[界面](/glossary/ui/)结构，帮助团队在早期发现设计盲区，将沟通焦点从抽象文字转向具体体验，从而降低后续返工成本。

## 主要类型与保真度

根据验证目标与制作成本的不同，原型通常可分为三种形态：

| 类型 | 常见形式 | 核心用途 |
| --- | --- | --- |
| **低保真原型** | 纸面草图、线框图、流程示意 | 快速对齐信息架构与页面跳转逻辑 |
| **高保真原型** | 贴近成品视觉的可点击交互稿 | 验证视觉层级、细节体验与操作路径 |
| **功能性原型** | 含基础代码或模拟数据的可运行网页 | 测试技术方案可行性与真实交互反馈 |

## 在开发协作中的作用

原型位于[需求](/glossary/requirements/)梳理之后、正式研发之前。文字描述容易让不同角色产生各自想象，而可直观操作或点击的原型能够迅速暴露遗漏的边界条件与不合理流程。当原型经过多轮反馈并定稿后，其中的核心交互规则可转化为后续开发规范与[验收](/glossary/acceptance/)参考。

## AI 时代的原型构建

借助[代码生成](/glossary/code-generation/)、[无代码/低代码](/glossary/no-code-low-code/)平台或 [Vibe Coding](/glossary/vibe-coding/) 方式，开发者只需描述想法即可在短时间内产出可运行的交互网页，大幅压缩了传统原型制作周期。这种高效率也带来了认知混淆风险：看似完整的前端画面背后，往往缺少真实的数据校验、权限控制与异常处理机制。

## 概念边界

- **原型不等于成品**：原型通常忽略性能、安全性与高并发稳定性，直接将其作为线上版本交付容易引发运行故障。
- **重点在验证而非完美**：过度打磨早期原型的配色或局部代码，会削弱其低成本快速试错的核心价值。
