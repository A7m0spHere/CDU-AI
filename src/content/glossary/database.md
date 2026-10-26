---
term: "数据库"
en: "Database"
category: "backend"
aliases: ["Database", "DB", "数据库系统"]
definition: "按结构存、查、改数据的地方；账号、成绩都放在这里。"
example: "教务系统能秒查你的成绩，是因为成绩存在数据库里，而不是翻文件。"
youMaySay: "删错一条记录，还能找回来吗？"
scenario:
  title: "误删报名数据"
  steps:
    - label: "误操作"
      body: "后台误删了一批报名记录。"
      note: "数据不等于备份。"
    - label: "尝试恢复"
      body: "没有备份，只能从导出文件里找回部分。"
      meta: "备份缺失"
    - label: "建立习惯"
      body: "定期导出备份，删除前二次确认。"
quiz:
  - question: "数据库最容易被忽视的风险是？"
    options:
      - text: "数据量大"
        correct: false
      - text: "没有备份与误删保护"
        correct: true
      - text: "颜色不好看"
        correct: false
    explain: "数据不等于备份，误删很难恢复。"
agentPrompt: "请为这个报名数据表设计一个简单的备份与误删保护方案，说明频率、存放位置和恢复步骤。"
order: 2
related: ["server", "api"]
updated: "2026-10-26"
sources:
  - title: "Database · MDN Glossary"
    url: "https://developer.mozilla.org/en-US/docs/Glossary/Database"
basis: "desk-research"
aiUsage: "drafted"
---

## 是什么

数据库是有组织地存放数据的地方，支持快速查询和修改：用户账号、课程成绩、订单记录都常存在数据库里。

## 什么时候会遇到

注册账号、查成绩、后台管理数据时；开发时要「连数据库」。

## 和 AI 的关系

AI 本身不存你的业务数据，需要程序把数据库里的内容取出来再交给模型；让 AI 直接操作数据库风险很高。

## 想深入再看

相关词条：服务器、接口（API）。
