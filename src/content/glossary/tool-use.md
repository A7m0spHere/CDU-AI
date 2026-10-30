---
term: "工具调用"
en: "Tool Use"
category: "agents"
aliases: ["Tool Use", "Function Calling", "函数调用"]
definition: "模型决定该查资料、读文件或发请求，由外接程序代为执行。"
example: "让 AI「查一下明天的课表」，它先判断需要调用日历工具，再由程序去取数据。"
youMaySay: "它说「我查一下」，是真的查了吗？"
scenario:
  title: "调用日历工具"
  steps:
    - label: "提出请求"
      body: "让 AI 查明天的课表。"
      note: "模型先判断需要工具。"
    - label: "生成参数"
      body: "它输出「调用日历工具，日期=明天」。"
      meta: "模型不执行，程序执行"
    - label: "返回结果"
      body: "程序取回课表，模型再整理成回答。"
quiz:
  - question: "工具调用中，真正执行操作的是？"
    options:
      - text: "模型本身"
        correct: false
      - text: "外接程序按模型给出的参数执行"
        correct: true
      - text: "用户手动执行"
        correct: false
    explain: "模型只决定用什么工具、传什么参数。"
agentPrompt: "请判断回答下面的问题需要调用哪些工具、参数是什么；不要假装已经查到结果。"
order: 2
related: ["ai-agent", "mcp"]
updated: "2026-10-26"
sources:
  - title: "Tool use overview · Anthropic"
    url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview"
basis: "desk-research"
aiUsage: "drafted"
---

## 一句话说清

工具调用（也叫函数调用）是模型和外部能力之间的桥：模型输出「我要用哪个工具、传什么参数」，程序执行后把结果交还模型。

## 打个比方

像点菜：模型是顾客说「要这个」，服务员（程序）去后厨下单，菜端回来顾客再决定下一步。

## 它是怎么运作的

开发者定义工具的名称和参数；模型根据任务选择工具并生成参数；程序校验后执行，把结果作为新消息返回。

## 你会碰到它的场景

- Agent 查天气、搜网页、读文件；
- 编程助手运行命令、改文件；
- 产品里「联网」「代码执行」开关。

## 常见误解

- 以为模型自己执行：执行的是外接程序；
- 以为调用一定成功：参数错、权限不足都会失败；
- 以为工具越多越好：权限越大，风险越大。

## 想再深入一点

工具调用是 Agent 的基础部件；MCP 是让工具接入更统一的一种协议。
