---
term: "Skill"
en: "Agent Skill"
category: "agents"
aliases:
  - "Agent Skill"
  - "技能包"
  - "技能模块"
definition: "将特定任务的指令规范、参考资料和辅助脚本打包成标准化目录，供兼容的 AI Agent 按需加载复用。"
example: "在项目里装入一个「文献整理 Skill」后，每次触发该任务，Agent 都会按统一字段格式和脚本流程处理 PDF。"
order: 9
related:
  - "ai-agent"
  - "mcp"
  - "workflow"
  - "prompt-template"
updated: "2026-11-21"
sources:
  - title: "Agent Skills Specification · agentskills.io"
    url: "https://agentskills.io/specification"
  - title: "Extend Claude with skills · Claude Code 文档"
    url: "https://code.claude.com/docs/en/skills"
basis: "desk-research"
aiUsage: "drafted"
contributors: ["A7m0spHere"]
reviewNote: "整理开放 Agent Skills 规范核心概念，待负责人复审。"
---

Skill（常称 Agent Skill）是一种面向 [AI Agent](/glossary/ai-agent/) 的模块化能力封装格式。开发者或使用者可以把某类专业任务的操作规范、领域知识、模板素材与可执行脚本放进一个约定结构的文件夹中，使不同的兼容工具能够像「安装说明书和专用工具包」一样复用同一套能力，而不必每次重新输入冗长的背景提示。

## 典型结构与按需加载机制

在开放的 Agent Skills 规范中，一个 Skill 通常是一个包含说明文件与可选资源的目录，其中核心文件以元数据加正文的形式描述用途：

- **元信息索引**：记录技能名称与触发描述。Agent 启动时通常只读取这部分轻量信息，尽量减少对[上下文窗口](/glossary/context-window/)的占用。
- **指令正文**：当用户需求与描述匹配时，Agent 才按需加载完整操作步骤与格式规范。
- **附带脚本与参考资料**：需要执行确定性计算、文件校验或查阅长文档时，再按指令调用目录内附带的脚本或参考文件。

这种「先看简介、匹配后再读全文」的分层加载方式，有助于在装入大量技能的同时保持对话上下文精简。

## 与提示词模板及 MCP 的区别

| 概念 | 主要封装对象 | 常见用途 |
| --- | --- | --- |
| **Skill** | 任务流程规范、知识文档与本地配套脚本 | 教会 Agent 按特定方法与标准完成某类工作 |
| **[提示词模板](/glossary/prompt-template/)** | 带占位变量的单段指令文本 | 固定某次提问或生成任务的表述框架 |
| **[MCP](/glossary/mcp/)** | 连接外部数据源与服务接口的通信协议 | 让模型能够访问数据库、仓库或第三方系统接口 |

实际项目中，Skill 与 MCP 常配合使用：MCP 负责提供「能连到哪里」的接口通道，Skill 则进一步规定「遇到具体任务时该按什么顺序和标准去用这些能力」。

## 概念边界

- **依赖客户端支持与权限控制**：不同工具对 Skill 目录路径、触发方式及附带脚本的执行权限支持程度不同，引入第三方 Skill 前同样需要核查其脚本行为，防止隐藏的[提示词注入](/glossary/prompt-injection/)或越权风险。
- **不能替代人工校验**：Skill 提升了同类任务执行的一致性，但模型在具体运行时仍可能遗漏细则或出错，关键输出仍需人工核对。
