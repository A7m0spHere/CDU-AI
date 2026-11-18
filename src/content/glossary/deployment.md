---
term: "部署"
en: "Deployment"
category: "backend"
aliases:
  - "Deployment"
  - "上线"
  - "发布"
definition: "将开发完成的软件、网站或服务配置并发布到目标运行环境，使其能够被外部稳定访问的过程。"
example: "开发者在本地调试通过一个工具网页后，将其构建产物上传至静态托管平台并绑定域名，其他用户即可通过链接直接访问。"
order: 3
related:
  - "server"
  - "local-deployment"
  - "version-control"
  - "api"
updated: "2026-11-18"
sources:
  - title: "Deployments overview · Vercel"
    url: "https://vercel.com/docs/deployments/overview"
  - title: "Publishing your website · MDN"
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website/Publishing_your_website"
basis: "desk-research"
aiUsage: "drafted"
reviewNote: "按极简维基体例重构正文与结构，待负责人复审。"
---

在本地计算机完成代码编写与初步[调试](/glossary/debugging/)后，程序通常只能在开发者的本机环境中运行。部署解决的是将软件从开发状态推向可访问运行状态的问题，涵盖依赖安装、构建打包、环境变量注入、进程托管以及网络入口配置等一系列环节。

## 常见部署方式

根据项目是否包含后端服务与持久化需求，常见部署形式有所区分：

| 部署形式 | 运行特征 | 常见适用对象 |
| --- | --- | --- |
| **静态站点托管** | 预先构建为 HTML、CSS 与脚本文件后分发，无需维护常驻后端 | 展示页面、文档站点与纯前端网页工具 |
| **云主机与容器部署** | 在远程[服务器](/glossary/server/)或容器平台中持续运行后端进程，可灵活配置运行环境 | 需要常驻服务、[数据库](/glossary/database/)连接或自定义运行时 |
| **自动化持续部署** | 与[仓库](/glossary/repository/)及[分支](/glossary/branch/)联动，代码合并后自动触发构建、检查并更新线上版本 | 团队协作开发与需要高频迭代的在线项目 |

## 与 AI 应用及辅助开发的关系

- **上线 AI 辅助产物**：通过[代码生成](/glossary/code-generation/)或 [Vibe Coding](/glossary/vibe-coding/) 快速完成原型后，仍需经历正式部署才能脱离本机临时端口供他人使用；静态页面与全栈应用所需的托管条件并不相同。
- **密钥与环境配置**：调用第三方模型 [API](/glossary/api/) 的服务在部署时，必须通过运行环境的保密变量注入凭据，而不能将密钥硬编码进公开源码或前端静态资源中。
- **私有化与本地运行**：若对数据合规或离线可用性有严格要求，服务也可不发布至公网，而是以[本地部署](/glossary/local-deployment/)或内网部署的形式运行在受控主机中。

## 概念边界

- **上线不等于长期稳定**：单次部署成功仅表明当前版本已在目标环境启动，后续仍需依赖[版本控制](/glossary/version-control/)回滚机制、资源监控与依赖维护，否则服务仍可能因流量或环境变化中断。
- **发布范围由配置决定**：完成部署并不自动意味着向全网公开，服务可以通过访问鉴权、白名单或内网隔离策略限定仅对特定用户群体开放。
