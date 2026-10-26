---
term: "版本控制"
en: "Version Control"
category: "git"
aliases: ["Version Control", "版本管理", "版本库"]
definition: "记录文件每次改动的系统；改坏了能退回以前的版本。"
example: "论文改到第七版想找回第三版的段落，版本控制可以做到——但没提交过的改动找不回。"
youMaySay: "改乱了想回到昨天的版本，还有救吗？"
scenario:
  title: "AI 大改代码前"
  steps:
    - label: "先提交"
      body: "把当前可用版本提交一次。"
      note: "提交过的才能回退。"
    - label: "让 AI 改"
      body: "生成大量修改。"
      meta: "保留历史节点"
    - label: "改坏回退"
      body: "对比差异，回到提交前的版本。"
quiz:
  - question: "版本控制能回退的前提是？"
    options:
      - text: "自动保存"
        correct: false
      - text: "改动已经被提交"
        correct: true
      - text: "文件在桌面上"
        correct: false
    explain: "没提交的改动回不去。"
agentPrompt: "请说明在让 AI 大改代码前应该做哪些版本控制准备，按步骤列出。"
order: 1
related: ["commit"]
updated: "2026-10-26"
sources:
  - title: "About version control · Pro Git"
    url: "https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control"
basis: "desk-research"
aiUsage: "drafted"
---

## 是什么

版本控制是记录文件历史改动的系统：每次提交留下一个版本，可以对比、回退、多人协作。

## 什么时候会遇到

代码改乱了想回到昨天的版本、多人改同一份文件、看到 .git 目录或「版本库」。

## 和 AI 的关系

AI 改代码前最好先提交一次，改坏了能回退；AI 不能替代你判断哪些改动该保留。

## 想深入再看

相关词条：提交（Commit）。
