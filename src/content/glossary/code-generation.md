---
term: "代码生成"
en: "Code Generation"
category: "vibecoding"
aliases:
  - "Code Generation"
  - "AI 写代码"
  - "生成代码"
definition: "由 AI 模型根据自然语言描述或代码上下文自动生成、补全或改写程序源码的技术过程。"
example: "开发者在编辑器中写下函数注释后，模型自动补全读取 CSV 文件并绘制柱状图表的完整函数实现。"
order: 3
related:
  - "coding-assistant"
  - "natural-language-programming"
  - "debugging"
  - "bug"
updated: "2026-11-18"
sources:
  - title: "Evaluating Large Language Models Trained on Code (arXiv:2107.03374)"
    url: "https://arxiv.org/abs/2107.03374"
basis: "desk-research"
aiUsage: "drafted"
reviewNote: "按极简维基体例重构正文与结构，待负责人复审。"
---

代码生成依托经过大量开源代码与技术文档训练的[大语言模型](/glossary/llm/)，将开发者的文本指令、注释或既有文件上下文转化为符合目标语言语法的源码输出。在现代软件工程中，它既是[AI 编程助手](/glossary/coding-assistant/)的核心能力，也是推动[自然语言编程](/glossary/natural-language-programming/)落地的基础环节。

## 常见应用形态

根据输入上下文的规模与输出粒度，代码生成通常体现在以下场景中：

- **行内补全**：在编辑器中根据光标前后的变量命名与控制流，实时预测并补全单行代码或单个函数体。
- **局部重构与生成**：依据[提示词](/glossary/prompt/)或函数签名，一次性生成特定算法模块、正则表达式、SQL 查询或单元测试代码。
- **多文件脚手架搭建**：结合项目目录结构与依赖配置，连续生成跨模块的页面[组件](/glossary/component/)、接口路由或基础配置文件。

## 在开发流程中的协作机制

在实际开发中，代码生成通常不是单向交付，而是「生成—验证—修正」的循环过程：

1. **上下文注入**：开发者提供目标框架、[输出格式](/glossary/output-format/)要求或相关文件片段，帮助模型对齐项目既有规范。
2. **初稿生成与集成**：模型输出候选源码后，由开发者审阅逻辑结构、依赖版本与安全边界，再合并进[仓库](/glossary/repository/)。
3. **运行与反馈**：通过执行程序与[测试用例](/glossary/test-case/)发现运行时错误，并将报错堆栈回传给模型以辅助后续[调试](/glossary/debugging/)。

## 局限与概念边界

- **可能引入幻觉与隐蔽缺陷**：受限于训练语料时效与[AI 幻觉](/glossary/hallucination/)，生成的代码可能调用不存在的库方法、使用已废弃的接口，或包含不易察觉的逻辑 [Bug](/glossary/bug/) 与安全漏洞。
- **生成速度不等于工程质量**：代码生成解决的是「从零写出初稿」的效率问题，无法替代架构权衡、代码审查与长期可维护性管理；未经人工核验直接[部署](/glossary/deployment/)至生产环境存在较高风险。
