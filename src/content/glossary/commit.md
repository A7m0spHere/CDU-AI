---
term: "提交（Commit）"
en: "Commit"
category: "git"
aliases: ["Commit", "提交记录", "存档"]
definition: "把选定的改动存成一个历史节点，并附上说明，便于回退与协作。"
example: "让 AI 大改代码前先提交一次；改坏了就能回到那次提交保存的版本。"
youMaySay: "提交说明随便写写，有影响吗？"
scenario:
  title: "半年后查历史"
  steps:
    - label: "随手提交"
      body: "提交说明只写「update」。"
      note: "以后难以追溯。"
    - label: "排查问题"
      body: "半年后想知道某段代码为什么改，却查不到。"
      meta: "信息缺失"
    - label: "改进习惯"
      body: "每条说明写清「改了什么、为什么」。"
quiz:
  - question: "好的提交说明应该包含？"
    options:
      - text: "只写日期"
        correct: false
      - text: "改了什么以及为什么改"
        correct: true
      - text: "提交人星座"
        correct: false
    explain: "说明是给未来的自己和协作者看的。"
agentPrompt: "请根据下面的改动内容帮我写一条提交说明，格式为「类型: 简短说明」，并补一句改动原因。"
order: 2
related: ["version-control"]
updated: "2026-10-30"
sources:
  - title: "git-commit 文档 · Git"
    url: "https://git-scm.com/docs/git-commit"
basis: "desk-research"
aiUsage: "drafted"
reviewed: "2026-11-01"
reviewedBy: "AI 初审（负责人授权）"
reviewNote: "AI 按定义、例子及参考资料初审；链接可访问，未逐项核验全部事实或实测产品。"
---

## 是什么

提交是把选定的改动保存为一个历史节点，附一句说明「改了什么、为什么」。

## 什么时候会遇到

完成一个小功能、修完一个 bug、让 AI 大改之前，都该先提交一次。

## 和 AI 的关系

AI 可以帮你写提交说明，但改动内容要你自己确认；提交信息写清楚，以后才能查为什么改。

## 想深入再看

相关词条：版本控制。
