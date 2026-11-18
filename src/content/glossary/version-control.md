---
term: "版本控制"
en: "Version Control"
category: "git"
aliases:
  - "Version Control"
  - "版本管理"
  - "版本库"
definition: "系统化记录文件历史变更、支持版本对比与回退以及多人并行协作的软件管理机制。"
example: "项目代码在一次功能重构后出现异常，开发者通过版本控制工具比对历史变更记录，将受损文件精确恢复到前一个稳定版本。"
order: 1
related:
  - "repository"
  - "commit"
  - "branch"
  - "merge"
updated: "2026-11-18"
sources:
  - title: "About version control · Pro Git"
    url: "https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control"
  - title: "git-stash · Git"
    url: "https://git-scm.com/docs/git-stash"
basis: "desk-research"
aiUsage: "drafted"
reviewNote: "按极简维基体例重构正文与结构，待负责人复审。"
---

在软件与文档的持续迭代中，文件会经历大量修改、实验与多人交接。版本控制通过按时间顺序保存每一次已确认的快照，使开发者无需依靠「最终版_v2」之类的手动重命名即可追踪改动来源、恢复历史状态，并协调多名协作者对同一项目的并行修改。

## 核心机制与主要模式

- **快照与历史追踪**：以[仓库](/glossary/repository/)为管理单元，每次执行[提交（Commit）](/glossary/commit/)都会将选定更改保存为不可变的历史节点，同时记录修改人、时间戳与变更说明，支持随时对比任意两个版本的差异。
- **分支与合并协作**：开发者可以基于主线开辟独立的[分支](/glossary/branch/)进行新功能试验或[调试](/glossary/debugging/)，验证无误后再通过[合并](/glossary/merge/)整合回主线，避免未完成的代码干扰他人工作。
- **集中式与分布式架构**：早期集中式系统依赖单一中央服务器保存完整历史；现代主流系统（如 Git）采用分布式架构，每位协作者本地都拥有完整历史副本，离线也可查看记录与提交更改。

## 与 AI 辅助开发的协同

在使用[AI 编程助手](/glossary/coding-assistant/)进行跨文件修改或大规模[代码生成](/glossary/code-generation/)时，版本控制是最基础的安全护栏。在发出高风险重构指令前先保存当前稳定状态，一旦生成结果引入[Bug（缺陷）](/glossary/bug/)或破坏原有结构，即可借助差异对比逐行审查 AI 的修改，或一键回退至改动前的干净节点。

## 概念边界

- **只记录已纳入跟踪并提交的变更**：工作区中尚未提交的临时修改、以及被忽略规则排除的本地文件，不会自动进入版本历史（部分工具提供独立的临时暂存区，但仍不等同于正式版本节点）。
- **不等同于云端自动备份网盘**：网盘通常仅按时间覆盖文件副本，缺乏逻辑变更分组、分支隔离与冲突合并能力。
