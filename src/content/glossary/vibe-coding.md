---
term: "Vibe Coding"
en: "Vibe Coding"
category: "vibecoding"
aliases:
  - "Vibe Coding"
  - "氛围编程"
  - "跟着感觉编程"
definition: "以自然语言指令驱动 AI 生成并反复调整代码、弱化人工逐行阅读源码的软件构建方式。"
example: "开发者向模型描述需求并运行预览，发现按钮样式或交互异常后直接用口头语言要求重写，直至效果符合预期。"
order: 1
related:
  - "natural-language-programming"
  - "code-generation"
  - "coding-assistant"
  - "prototype"
updated: "2026-11-18"
sources:
  - title: "What is vibe coding? · IBM"
    url: "https://www.ibm.com/think/topics/vibe-coding"
  - title: "Vibe coding · OpenSSF Glossary"
    url: "https://glossary.openssf.org/vibe-coding/"
basis: "desk-research"
aiUsage: "drafted"
reviewNote: "按极简维基体例重构正文与结构，待负责人复审。"
---

Vibe Coding（常译作「氛围编程」）是一种高度依赖[AI 编程助手](/glossary/coding-assistant/)的软件构建实践，属于[自然语言编程](/glossary/natural-language-programming/)的典型体现。其最初定义强调开发者完全通过自然语言描述意图、直接采纳模型生成的变更，并将注意力集中在运行结果与交互体验上，而非逐行阅读或手工维护底层源码。

## 运行与协作机制

在 Vibe Coding 模式下，人与 AI 形成了一种「表达意图—运行验证—口语修正」的闭环协作流程：

- **需求输入**：开发者用日常语言向模型说明功能目标、页面布局或交互细节，替代传统的手写[需求](/glossary/requirements/)文档与编码起步。
- **整段生成与应用**：模型直接完成[代码生成](/glossary/code-generation/)并改动工程文件，开发者通常跳过代码审查，直接运行程序或查看[界面（UI）](/glossary/ui/)渲染效果。
- **表象驱动迭代**：遇到编译报错或交互异常时，开发者将错误信息原样贴回对话框或口头描述偏差，由模型自行定位并重写代码，而非由人工介入[调试](/glossary/debugging/)。

## 与规范化 AI 辅助开发的关系

| 维度 | Vibe Coding | 规范化 AI 辅助工程开发 |
| --- | --- | --- |
| **代码所有权与理解** | 弱化源码阅读，默认接受模型改动 | 开发者需理解核心逻辑并承担代码责任 |
| **质量保障手段** | 依赖人工试跑与直观体验判断 | 结合[版本控制](/glossary/version-control/)、代码评审与自动化[测试用例](/glossary/test-case/) |
| **典型适用阶段** | 快速验证[原型](/glossary/prototype/)、一次性个人脚本或创意演示 | 长期维护、多人协作及生产级系统建设 |

## 局限与概念边界

- **表面可用不等于安全可靠**：跳过源码审阅的快速迭代极易引入隐蔽 [Bug](/glossary/bug/)、性能瓶颈、输入校验缺失或[隐私](/glossary/privacy/)泄露风险；在正式对外[部署](/glossary/deployment/)前，仍需经过严谨的安全审计与功能[验收](/glossary/acceptance/)。
- **不代表全部 AI 编程方式**：随着该词流行，部分讨论将其泛指所有借助 AI 写代码的做法；但严格而言，保留完整架构设计、代码审阅与工程纪律的开发流程仍属传统工程实践的延伸，与最初强调「顺着感觉交由 AI 主导」的 Vibe Coding 存在明确边界。
