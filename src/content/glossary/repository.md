---
term: "仓库"
en: "Repository"
category: "git"
aliases:
  - "Repository"
  - "代码仓库"
  - "repo"
definition: "集中存放项目全部文件以及由版本控制系统维护的完整变更历史的存储空间。"
example: "团队将后端服务代码与接口文档共同托管在同一个远程代码仓库中，新成员克隆该仓库后即可在本地获取全部文件与历次提交记录。"
order: 3
related:
  - "version-control"
  - "branch"
  - "fork"
  - "commit"
updated: "2026-11-18"
sources:
  - title: "About repositories · GitHub Docs"
    url: "https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories"
basis: "desk-research"
aiUsage: "drafted"
reviewNote: "按极简维基体例重构正文与结构，待负责人复审。"
---

仓库（常简称为 Repo）是[版本控制](/glossary/version-control/)系统的基本管理边界。它不仅包含当前可见的源代码、文档与资源文件，还在隐藏的元数据目录中保存着每一次[提交（Commit）](/glossary/commit/)、所有[分支](/glossary/branch/)结构以及协作者记录，使项目在跨设备迁移与多人协作时能够保持完整上下文。

## 本地仓库与远程仓库

| 类型 | 存放位置 | 主要职责 |
| --- | --- | --- |
| **本地仓库** | 开发者个人电脑的项目目录 | 支持日常编辑、查看历史与离线提交 |
| **远程仓库** | 代码托管平台或私有[服务器](/glossary/server/) | 作为团队共享中心，承载同步、[Pull Request](/glossary/pull-request/) 与协作评审 |

当团队成员从远程仓库克隆（Clone）项目时，获取的不仅是最新版本的文件压缩包，而是包含完整历史与分支拓扑的独立本地仓库。外部协作者则常先通过 [Fork](/glossary/fork/) 复制一份属于自己的远程仓库，再向原仓库提交更改建议。

## 常见目录构成与忽略机制

一个规范的软件仓库通常包含三类内容：核心业务源码与配置、说明文档与[测试用例](/glossary/test-case/)，以及指向 [Issue](/glossary/issue/) 或自动构建流程的协作配置。对于本地依赖包、编译产物以及包含个人账号密码的密钥文件，仓库通常会通过忽略清单（如 `.gitignore`）将其排除在跟踪范围之外，防止敏感信息泄露或仓库体积膨胀。

## 在 AI 辅助开发中的意义

对于[AI 编程助手](/glossary/coding-assistant/)而言，仓库既是读取项目结构、理解跨文件依赖的上下文来源，也是[代码生成](/glossary/code-generation/)后落地的目标位置。开发者在借助 AI 整理或提交仓库内容时，需自行核对忽略规则是否生效，避免将密钥、临时缓存或私密数据误提交到公开仓库中引发[隐私](/glossary/privacy/)或安全风险。

## 概念边界

- **不等同于普通项目文件夹**：普通文件夹只保存文件的当前状态，删除或覆盖即丢失历史；仓库则通过版本元数据保留可追溯的演进轨迹。
- **工作区编辑不会自动同步进远程**：本地未提交的修改既不会进入仓库历史，也不会自动上传至远程托管平台。
