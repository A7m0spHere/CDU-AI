# 术语词条 P1 审核记录（2026-11-01）

本记录覆盖初审交接单列出的 13 篇 P1 词条。审核基于变更前的 `main` 版本 `d5f203d` 及本次工作区修改；本记录与词条修改应作为同一批次追溯。

AI 对照词条的定义、正文、示例和选择题整理问题，核对下列资料中的相关内容，再提交负责人二审。负责人 `A7m` 同意修改 7 篇指定内容，其余 6 篇保留原文，并确认审核通过；本批审核于 2026-11-01 完成。以下来源各自只支持所列范围，不代表已经逐条核验词条中所有事实和所有原有链接；未实际测试具体产品、模型或托管环境。法律与政策依具体法域和情形适用。

| 词条 | 审核取舍与本次核对的依据 |
| --- | --- |
| [版权](../src/content/glossary/copyright.md) | 保留原文。[WIPO 指引](https://www.wipo.int/edocs/mdocs/mdocs/en/wipo_webinar_ft_24_1/wipo_webinar_ft_24_1_guidelines.pdf)讨论生成物权利与合同约定的不确定性；版权适用范围依具体法域判断。 |
| [隐私](../src/content/glossary/privacy.md) | 调整上传前检查与数据处理场景。[个人信息保护法](https://www.cac.gov.cn/2021-08/20/c_1631050028355286.htm)涉及必要范围和个人信息处理；[Anthropic 隐私政策](https://www.anthropic.com/legal/privacy)仅作为该服务的政策示例。 |
| [AI Agent](../src/content/glossary/ai-agent.md) | 修改定义，说明任务可能失败、暂停或需要确认。[Anthropic 指南](https://www.anthropic.com/research/building-effective-agents)介绍动态执行、人工反馈和停止条件。 |
| [MCP](../src/content/glossary/mcp.md) | 保留原文。[MCP 架构](https://modelcontextprotocol.io/docs/learn/architecture)说明 Host、Client 和 Server；[安全实践](https://modelcontextprotocol.io/docs/2025-11-25/tutorials/security/security_best_practices)说明实现层面的安全风险。只读权限仍需实际配置和验证。 |
| [自然语言编程](../src/content/glossary/natural-language-programming.md) | 保留原文。[Codex 论文](https://arxiv.org/abs/2107.03374)涉及从描述生成代码的研究，不单独定义该术语的全部范围。 |
| [深度伪造](../src/content/glossary/deepfake.md) | 修改定义，保留冒充场景和核实方式。[FTC 声音克隆说明](https://www.ftc.gov/system/files/ftc_gov/pdf/FTC-Comment-VoiceCloning.pdf)讨论声音克隆的有益用途与欺诈风险；它不单独覆盖所有图像和视频场景。 |
| [数据库](../src/content/glossary/database.md) | 保留原文。[MDN 数据库词条](https://developer.mozilla.org/en-US/docs/Glossary/Database)解释数据库基础概念；应用也可能在数据库或记忆系统中保存数据。 |
| [部署](../src/content/glossary/deployment.md) | 修改定义、题目解释及正文中的访问范围。[MDN 网站发布教程](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website/Publishing_your_website)介绍网站发布与托管方式。 |
| [原型](../src/content/glossary/prototype.md) | 保留原文。[GOV.UK 原型说明](https://www.gov.uk/service-manual/design/making-prototypes)也包含纸面草图等形式，并非所有原型都可交互。 |
| [上下文窗口](../src/content/glossary/context-window.md) | 保留原文。[Claude 上下文窗口说明](https://platform.claude.com/docs/en/build-with-claude/context-windows)说明该产品的容量与超限处理；文件处理和外部检索依产品实现而异。 |
| [Fork](../src/content/glossary/fork.md) | 修改协作说明和题目解释。[GitHub Fork 文档](https://docs.github.com/en/pull-requests/reference/forks)区分独立 Fork 与同一仓库内分支。 |
| [速率限制](../src/content/glossary/rate-limit.md) | 修改限流场景并补充等待提示。[Claude API 限流文档](https://platform.claude.com/docs/en/api/rate-limits)说明该服务的限制与 `retry-after`；实际行为因服务而异。 |
| [系统提示词](../src/content/glossary/system-prompt.md) | 修改接口封装说明，保留安全边界提醒。[Claude Messages API](https://platform.claude.com/docs/en/api/messages/create)列出 `system` 参数与消息格式；其他平台的传法与优先级可能不同。 |
