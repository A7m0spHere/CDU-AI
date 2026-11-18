---
term: "无代码/低代码"
en: "No-code / Low-code"
category: "vibecoding"
aliases:
  - "No-code"
  - "Low-code"
  - "零代码"
  - "低代码"
definition: "通过可视化拖拽、组件配置与少量脚本来构建软件应用和自动化流程的开发方式。"
example: "运营人员在可视化平台中配置表单字段、审批流和数据视图，无需编写后端代码即可发布一套活动报名工具。"
order: 4
related:
  - "vibe-coding"
  - "workflow"
  - "deployment"
  - "natural-language-programming"
updated: "2026-11-18"
sources:
  - title: "Microsoft Power Platform 官方文档"
    url: "https://learn.microsoft.com/en-us/power-platform/"
basis: "desk-research"
aiUsage: "drafted"
reviewNote: "按极简维基体例重构正文与结构，待负责人复审。"
---

无代码与低代码（No-code / Low-code）是一类以图形化配置与模块化组装为核心的软件构建方法。平台将常见的页面[组件](/glossary/component/)、数据存储和业务规则封装为可复用的可视化积木，使非技术背景人员或工程师能够以极少的手工编码完成应用搭建，近年来也常与[自然语言编程](/glossary/natural-language-programming/)结合以进一步简化配置。

## 无代码与低代码的差异

两者均以可视化构建为核心，但在代码扩展深度上有所区分：

| 类型 | 构建方式 | 扩展能力 | 常见适用场景 |
| --- | --- | --- | --- |
| **无代码**（No-code） | 纯拖拽界面与预设规则 | 依赖平台内置功能与插件 | 收集表、展示页、轻量[工作流](/glossary/workflow/) |
| **低代码**（Low-code） | 可视化主体加局部脚本 | 支持自定义函数与外部 [API](/glossary/api/) | 内部管理系统、审批看板 |

## 常见构成与运行机制

无代码/低代码平台通常围绕三类能力提供支持：

- **界面编排**：在画布中拖拽表单、表格与图表，快速形成可交互的 [UI](/glossary/ui/) 或[原型](/glossary/prototype/)。
- **数据与逻辑连接**：内置轻量[数据库](/glossary/database/)或外部数据源连接器，并通过条件分支编排业务规则。
- **托管与发布**：多数平台集成权限控制与一键[部署](/glossary/deployment/)能力，应用可由平台托管，部分方案也支持私有化运行。

## 与 AI 辅助开发的关系

借助[大语言模型](/glossary/llm/)，平台用户可通过自然语言生成初始页面结构或补充低代码脚本。与自由产出源码的 [Vibe Coding](/glossary/vibe-coding/) 相比，无代码/低代码的结果受平台元模型与组件规范约束，结构更可控，但灵活度也受平台限制。

## 局限与概念边界

- **平台锁定与迁移成本**：应用逻辑与数据结构往往绑定特定服务商，超出平台能力上限后，通常难以直接导出为独立通用的源码工程。
- **并非零门槛**：构建稳定应用仍需清晰的数据建模思维、权限意识及对[需求](/glossary/requirements/)的准确拆解；数据托管位置与导出权限也需按实际方案核实。
