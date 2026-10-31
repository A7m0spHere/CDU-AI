---
term: "仓库"
en: "Repository"
category: "git"
aliases: ["Repository", "代码仓库", "repo"]
definition: "存放项目文件及已提交版本历史的地方。"
example: "课程设计的小工具放进 GitHub 仓库，换电脑克隆下来就能接着改。"
youMaySay: "老师说的「仓库」到底是个文件夹还是一个网站？"
scenario:
  title: "把项目放进仓库"
  steps:
    - label: "创建仓库"
      body: "在 GitHub 新建仓库，选择公开或私有。"
      note: "公开仓库任何人都能看到里面的文件与历史。"
    - label: "上传文件"
      body: "把本地项目提交并推送上去，文件和历史一起保存。"
      meta: "文件 + 历史"
    - label: "以后协作"
      body: "同学克隆仓库，各自改完再提交回来。"
quiz:
  - question: "仓库和普通文件夹最大的区别是？"
    options:
      - text: "仓库容量更大"
        correct: false
      - text: "仓库保存已经提交的版本历史"
        correct: true
      - text: "仓库只能放代码"
        correct: false
    explain: "仓库不只存文件，还存每次提交的历史和分支，所以能回退与协作。"
agentPrompt: "请帮我规划这个课程项目在仓库里的目录结构，说明哪些文件应该提交、哪些应该忽略。"
order: 3
related: ["branch", "fork", "version-control"]
updated: "2026-10-30"
sources:
  - title: "About repositories · GitHub Docs"
    url: "https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories"
basis: "desk-research"
aiUsage: "drafted"
reviewed: "2026-11-01"
reviewedBy: "AI 初审（负责人授权）"
reviewNote: "AI 按定义、例子及参考资料初审；链接可访问，未逐项核验全部事实或实测产品。"
---

## 是什么

仓库是存放项目的地方：既有项目文件，也有通过提交保存的版本历史；未提交的编辑不会自动进入历史。代码、文档、图片都可以放进去。

## 什么时候会遇到

老师说「交到仓库里」、同学让你克隆某个仓库、看到 `github.com/用户名/项目名` 这样的地址时。

## 和 AI 的关系

AI 能帮你解释仓库结构、写提交说明，但哪些文件该进仓库、哪些是密钥要排除，仍要你自己判断。

## 想深入再看

相关词条：分支、Fork、版本控制。
