---
term: "越狱"
en: "Jailbreak"
category: "safety"
aliases:
  - "Jailbreak"
  - "越狱提示词"
definition: "通过构造特定对话语境或编码话术，诱导模型绕过既定安全护栏并输出受限内容的行为。"
example: "以「撰写虚构小说情节」或「假设不受规则约束」为由进行多轮引导，试图让模型回答原本会拒绝的危险问题。"
order: 2
related:
  - "prompt-injection"
  - "role-prompting"
  - "system-prompt"
  - "llm"
updated: "2026-11-18"
sources:
  - title: "Mitigate jailbreaks and prompt injections · Anthropic"
    url: "https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks"
  - title: "LLM01: Prompt Injection · OWASP"
    url: "https://genai.owasp.org/llmrisk/llm01-prompt-injection/"
basis: "desk-research"
aiUsage: "drafted"
reviewNote: "按极简维基体例重构正文与结构，待负责人复审。"
---

[大语言模型](/glossary/llm/)在发布前通常会经过安全对齐训练，并配合[系统提示词](/glossary/system-prompt/)与内容过滤规则，以拒绝生成违法、有害或高风险信息。越狱是指构造特定的[提示词](/glossary/prompt/)语境，利用模型对复杂上下文的顺从倾向，诱导其突破上述安全护栏。

## 常见诱导手法

越狱话术通常通过改变请求的表层形式来削弱模型对风险意图的识别：

- **语境伪装与角色代入**：借助[角色设定](/glossary/role-prompting/)将受限请求包装为小说创作、学术研讨、安全测试或历史推演场景，使模型在虚拟框架下给出原本会拒绝的回答。
- **多轮渐进引导**：先从无害话题切入建立对话顺从度，再分步骤将上下文引向受限主题，利用长对话稀释初始安全约束的权重。
- **编码与格式变换**：采用冷门语种翻译、字符拆分、Base64 编码或指定特定[输出格式](/glossary/output-format/)等方式，绕过基于明文关键词的安全检测规则。

## 与提示词注入的辨析

越狱与[提示词注入](/glossary/prompt-injection/)均涉及利用文本操纵模型输出，但两者的攻击目标与触发路径有所不同：

| 对比维度 | 越狱（Jailbreak） | 提示词注入（Prompt Injection） |
| --- | --- | --- |
| **核心目标** | 绕过模型自身的安全底线与内容策略 | 劫持应用预设流程或篡改指令执行方向 |
| **指令来源** | 主要由当前对话发起者主动构造 | 可来自用户输入，也常隐藏于网页、文档等外部数据 |
| **典型后果** | 输出被禁止的敏感、危险或违规内容 | 泄露系统规则、篡改读取结果或触发非预期外部操作 |

## 机制演进与概念边界

- **话术的时效性**：公开传播的越狱提示词通常不具备长期稳定性，模型厂商会通过补充对抗样本训练与更新护栏策略持续修补漏洞，旧话术在版本迭代后往往失效。
- **非系统层面的破解**：AI 领域的越狱仅针对模型对齐策略与交互护栏的语义绕过，并不涉及底层[服务器](/glossary/server/)权限提升或本地设备系统破解。
- **拒绝机制的属性**：模型对高风险请求返回拒绝提示，通常反映预设的安全与合规基线生效，而非语义理解能力不足。
