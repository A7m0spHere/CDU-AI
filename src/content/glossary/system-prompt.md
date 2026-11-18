---
term: "系统提示词"
en: "System Prompt"
category: "prompt"
aliases:
  - "System Prompt"
  - "系统消息"
  - "系统指令"
definition: "由产品或开发者预先设定的高优先级指令，用于在对话开始前规定模型的角色定位、语气风格与行为边界。"
example: "开发客服助手时，预先配置「仅依据知识库作答、未知问题直接提示转人工」的后台指令，即属于系统提示词。"
order: 2
related:
  - "prompt"
  - "role-prompting"
  - "prompt-injection"
  - "ai-agent"
updated: "2026-11-18"
sources:
  - title: "Giving Claude a role with a system prompt · Anthropic"
    url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/system-prompts"
  - title: "Create a Message（system 参数）· Claude API"
    url: "https://platform.claude.com/docs/en/api/messages/create"
basis: "desk-research"
aiUsage: "drafted"
reviewNote: "按极简维基体例重构正文与结构，待负责人复审。"
---

系统提示词在用户发出具体问题之前就已生效，主要负责确立模型在整个会话或工作流中的基础行为准则。在常见网页端[对话助手](/glossary/chatbot/)中，系统提示词通常由平台在后台自动注入而不直接展示给普通用户；而在应用开发场景下，它则是开发者控制模型表现与业务边界的核心配置入口。

## 典型职责与配置内容

开发者通常在系统提示词中统一约定跨越单轮提问的全局规则：

- **身份与语气**：结合[角色设定](/glossary/role-prompting/)明确模型的专业视角、语言风格及与用户的交互姿态。
- **任务范围与禁区**：限定模型应当处理的问题领域，并说明遇到越界问题时的拒答或引导话术。
- **工具与格式规范**：在 [AI Agent](/glossary/ai-agent/) 或自动化应用中，规定[工具调用](/glossary/tool-use/)的触发条件及全局[输出格式](/glossary/output-format/)要求。

## 与普通提示词及接口实现的关系

与用户每轮输入的具体[提示词](/glossary/prompt/)相比，系统提示词承担的是全局预设与规则基线的作用，而用户提示词负责传达当下的具体任务。在底层 [API](/glossary/api/) 调用中，不同模型平台的传递方式存在差异：有的通过消息列表中的 `system` 角色字段传入，有的则在请求体中提供专门的 `system` 参数。同时，系统提示词同样消耗[上下文窗口](/glossary/context-window/)额度，且在多轮长对话中是否持续保留取决于应用的上下文管理机制。

## 安全局限与概念边界

- **并非绝对安全边界**：系统提示词本质上仍是模型处理的文本指令，仍可能面临[提示词注入](/glossary/prompt-injection/)或[越狱](/glossary/jailbreak/)攻击而被绕过或泄露，不能替代后端的权限校验与数据隔离。
- **不等于具体业务指令**：系统提示词只适合放置通用规则与持久约束；单次任务的细节、临时素材与即时要求仍需通过用户提示词传入。
