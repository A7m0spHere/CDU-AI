---
term: "工具调用"
en: "Tool Use"
category: "agents"
aliases:
  - "Tool Use"
  - "Function Calling"
  - "函数调用"
definition: "大语言模型根据任务需求生成结构化调用指令，交由外部程序执行并将结果回传以参与后续推理的机制。"
example: "用户询问实时天气或本地代码结构时，模型输出检索函数名与查询参数，由宿主程序请求接口并将结果送回模型。"
order: 2
related:
  - "ai-agent"
  - "mcp"
  - "api"
  - "output-format"
updated: "2026-11-18"
sources:
  - title: "Tool use overview · Anthropic"
    url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview"
basis: "desk-research"
aiUsage: "drafted"
reviewNote: "按极简维基体例重构正文与结构，待负责人复审。"
---

由于[大语言模型](/glossary/llm/)本身只处理文本与多模态信号、受限于[知识截止](/glossary/knowledge-cutoff/)且无法直接访问外部环境，**工具调用**（Tool Use，又称 Function Calling）为模型与外部系统之间建立了标准化的交互桥梁，也是[AI Agent](/glossary/ai-agent/)实现实际行动的基础原语。

## 调用机制与执行闭环

工具调用并非由模型直接运行外部代码，而是模型与宿主程序协同完成的一次多步交互：

1. **工具声明**：开发者通过接口参数或[系统提示词](/glossary/system-prompt/)向模型描述可用工具的名称、用途及参数结构。
2. **指令生成**：模型判断需要外部能力时，遵循[输出格式](/glossary/output-format/)约束生成包含工具名与参数的调用请求，并暂停最终回答。
3. **宿主执行**：宿主程序解析并校验参数，代为调用对应的[API](/glossary/api/)、[数据库](/glossary/database/)或本地命令。
4. **结果回注**：程序将执行返回值或报错信息重新放入[上下文窗口](/glossary/context-window/)，由模型结合新信息继续生成后续内容或发起下一次调用。

## 常见工具类别与协议化

根据宿主环境开放的能力，常见工具可分为以下几类：

| 工具类别 | 典型能力 | 常见用途 |
| --- | --- | --- |
| **信息检索类** | [AI 搜索](/glossary/ai-search/)、文档与知识库查询 | 补充实时信息与私有资料 |
| **数据读写类** | 查询或更新数据库、读写本地文件 | 业务系统联动与项目文件修改 |
| **计算与执行类** | 运行代码沙箱、终端命令或测试脚本 | 精确数学计算与代码验证 |

随着工具数量增长，不同应用重复编写适配代码的成本逐渐上升。[MCP](/glossary/mcp/)等开放协议通过统一工具、数据源与上下文的暴露规范，使同一套工具能力能够被多个支持该协议的客户端复用。

## 概念边界与失效风险

- **模型决策，宿主执行**：模型只负责输出「调用意图与参数」，网络请求、文件写入和凭证管理均由宿主程序在受控权限下完成。
- **调用不保证成功**：模型可能生成缺失字段、类型错误或不存在的接口参数，外部服务也可能超时或拒绝访问，宿主需要校验与容错处理。
- **工具定义与结果均计入开销**：所有工具描述与返回内容都会占用上下文长度与[Token](/glossary/token/)额度；接入过多工具既会增加开销，也会扩大[提示词注入](/glossary/prompt-injection/)的受攻击面。
