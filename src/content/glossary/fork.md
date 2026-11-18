---
term: "Fork（派生）"
en: "Fork"
category: "git"
aliases:
  - "Fork"
  - "派生"
  - "复刻仓库"
definition: "在代码托管平台上将他人仓库完整复制到自己账号下，形成独立权限域副本的机制。"
example: "外部贡献者没有原开源仓库的写入权限，通常会先 Fork 到个人账号，在副本中完成修改后再向上游发起合并请求。"
order: 5
related:
  - "repository"
  - "pull-request"
  - "branch"
  - "version-control"
updated: "2026-11-18"
sources:
  - title: "Fork a repository · GitHub Docs"
    url: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo"
  - title: "Forks · GitHub Docs"
    url: "https://docs.github.com/en/pull-requests/reference/forks"
basis: "desk-research"
aiUsage: "drafted"
reviewNote: "按极简维基体例重构正文与结构，待负责人复审。"
---

Fork 是代码托管平台提供的账号级协作机制，用于在自己的账号或组织名下建立一份原[仓库](/glossary/repository/)（常称为**上游仓库**，Upstream）的独立远程副本。派生出的副本拥有完整的历史[提交](/glossary/commit/)与独立的权限配置，开发者对其进行的任何修改都不会直接影响原仓库。

## 核心作用与协作模式

在开源协作与跨团队开发中，Fork 主要解决权限隔离与自由演化两类需求：

- **跨权限贡献改动**：外部参与者通常没有原仓库的直接写入权限。通过先 Fork 到个人账号，在副本中建立[分支](/glossary/branch/)并完成修改，再向上游发起 [Pull Request](/glossary/pull-request/)，维护者即可在审阅后决定是否接纳该改动。
- **独立实验与二次衍生**：开发者可以基于既有项目探索新思路、调整技术选型或长期独立维护衍生版本，而不必担心干扰原项目主线。

## 与分支、克隆的区分

在日常使用[版本控制](/glossary/version-control/)时，Fork 常与分支和本地克隆混淆，三者的作用位置与隔离层级各不相同：

| 概念 | 所在位置 | 隔离与权限范围 | 主要用途 |
| --- | --- | --- | --- |
| **Fork**（派生） | 托管平台远程账号下 | 独立远程仓库，由派生者管理权限 | 跨账号协作贡献或建立独立衍生项目 |
| **分支**（Branch） | 同一仓库内部 | 共享仓库权限，仅隔离提交历史线 | 同一项目内的并行开发与功能拆分 |
| **克隆**（Clone） | 远程到本地计算机 | 将远程仓库完整下载至本地工作区 | 在本地环境中编辑、运行与提交变更 |

## 同步机制与 AI 协作注意

Fork 创建之后即与上游仓库各自演化，原仓库的新提交不会自动同步到个人副本中。若长期未同步上游变更，后续向上游提交合并请求时更容易产生冲突，因此通常需要定期从上游拉取最新历史。

借助[AI 编程助手](/glossary/coding-assistant/)辅助改造派生项目时，应注意区分当前本地工作区指向的远程地址是个人 Fork 还是上游仓库，并先查阅原项目的 [Issue](/glossary/issue/) 记录与贡献规范，确认相关改动方向是否符合上游维护预期。

## 概念边界

- **属于平台功能而非 Git 原生命令**：底层 Git 工具本身并没有「Fork」操作，它是 GitHub、GitLab 等托管平台构建的账号级复制与关联追踪机制。
- **权限独立不代表脱离版权约束**：派生副本虽然归个人账号管理，但仍受原仓库所附带开源协议与[版权](/glossary/copyright/)声明的约束，不能移除原作者署名或违背许可条款。
