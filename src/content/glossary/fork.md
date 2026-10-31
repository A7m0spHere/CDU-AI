---
term: "Fork（派生）"
en: "Fork"
category: "git"
aliases: ["Fork", "派生", "复刻仓库"]
definition: "把别人的仓库复制一份到自己账号下，随便改不影响原仓库。"
example: "想给上游项目提 PR，先 fork 到自己账号，再在自己的副本上开分支修改。"
youMaySay: "Fork 和克隆到底有什么区别？"
scenario:
  title: "给上游项目贡献"
  steps:
    - label: "Fork"
      body: "把上游仓库复制到自己账号下。"
      note: "副本归你，原仓库完全不受影响。"
    - label: "在副本改"
      body: "克隆自己的副本，建分支、提交改动。"
    - label: "提 PR"
      body: "向上游发起合并请求，由维护者审阅决定是否接受。"
quiz:
  - question: "Fork 之后，你的修改默认会？"
    options:
      - text: "直接改到原仓库"
        correct: false
      - text: "只留在你自己的副本里"
        correct: true
      - text: "自动合并到上游"
        correct: false
    explain: "Fork 是独立副本；改动通常通过 PR 提议合并到上游。"
agentPrompt: "请帮我梳理给上游仓库贡献的步骤：fork、克隆、建分支、提交、发起 PR，每步说明注意点。"
order: 5
related: ["pull-request", "branch", "repository"]
updated: "2026-11-01"
sources:
  - title: "Fork a repository · GitHub Docs"
    url: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo"
  - title: "Forks · GitHub Docs"
    url: "https://docs.github.com/en/pull-requests/reference/forks"
basis: "desk-research"
aiUsage: "drafted"
reviewed: "2026-11-01"
reviewedBy: "A7m"
reviewNote: "负责人确认修改协作说明；未实测各项目的权限配置。"
---

## 是什么

Fork 是把别人的仓库复制一份到自己账号下，得到一个由你控制的副本。改动只发生在副本里，原仓库不会变。

## 什么时候会遇到

想给开源项目提改动、自己没有推送权限、或者只是想拿别人的项目做实验时。

## 和 AI 的关系

AI 可以帮你操作副本里的代码，但要记住：改的是你的 fork，不是上游；想把修改贡献回上游，通常可以发起 Pull Request，具体协作方式取决于项目规则和权限。

## 想深入再看

相关词条：Pull Request、分支、克隆与仓库。
