---
term: "开源模型"
en: "Open-source Model"
category: "basics"
aliases:
  - "Open-source Model"
  - "开源大模型"
definition: "公开模型参数、相关代码与训练数据信息，并授予自由使用、研究、修改及再分发权利的人工智能模型。"
example: "某模型虽提供权重下载但协议禁止商业用途，仅属于开放权重模型；只有同时开放必要材料并允许任意用途使用与修改的模型，才符合开源 AI 定义。"
order: 11
related:
  - "llm"
  - "local-deployment"
  - "training-data"
  - "fine-tuning"
updated: "2026-11-18"
sources:
  - title: "The Open Source AI Definition 1.0 · OSI"
    url: "https://opensource.org/ai/open-source-ai-definition"
  - title: "Open Weights: not quite what you’ve been told · OSI"
    url: "https://opensource.org/ai/open-weights"
  - title: "Open Source AI Definition FAQ · OSI"
    url: "https://opensource.org/ai/faq"
basis: "desk-research"
aiUsage: "drafted"
reviewNote: "按极简维基体例重构正文与结构，待负责人复审。"
---

社区与商业宣传中对「开源模型」的界定并不统一，常与仅开放权重的模型混用。依据开放源代码促进会（OSI）发布的《开源 AI 定义 1.0》，真正意义上的开源 AI 模型不仅需授予自由使用、研究、修改与分享的权利，还必须提供相应的参数、代码以及足够详细的[训练数据](/glossary/training-data/)信息。

## 核心判定标准与开放要素

评估一个[大语言模型](/glossary/llm/)是否符合 OSI 开源 AI 标准，需同时核对权限条款与公开材料，而非仅看宣传名称：

- **四大基本自由**：允许任何人出于任何目的使用、研究、修改和再分发模型；禁止商用、限制用户规模或限制特定行业用途的协议均不符合开源定义。
- **模型参数**（Weights）：训练完成的参数文件可供下载获取，且附带的授权协议不限制上述基本自由。
- **训练与运行代码**：公开覆盖数据处理、训练流程及推理运行的完整代码，使外部研究者能够理解、复现或改进模型。
- **训练数据信息**：提供足够详细的数据来源说明、构成分布与清洗方法信息，确保研究与二次开发的可追溯性。

## 开源模型与开放权重的区别

业界大量可下载权重的模型在材料开放度或商用许可上存在限制，两者核心差异如下：

| 比较维度 | 开放权重（Open Weights） | 符合 OSI 开源 AI 定义 |
| --- | --- | --- |
| **模型参数** | 权重可供下载，获取条件由发布方设定 | 提供符合要求的参数及其开放许可 |
| **代码与数据信息** | 未必公开训练代码或训练数据说明 | 必须提供训练与运行代码及充分的数据信息 |
| **使用与修改权** | 常附带禁止商用、衍生约束等附加条款 | 允许任意目的使用、修改与分享（可要求署名或同协议共享） |

具备公开权重的模型通常均支持[本地部署](/glossary/local-deployment/)与针对性[微调](/glossary/fine-tuning/)，有助于降低对外部[API](/glossary/api/)服务的单一依赖。

## 概念边界

- **不要求公开全部原始训练数据**：OSI 标准要求公开足以支持研究和复现的数据说明信息，并不强制所有受版权或隐私保护的原始数据集都可直接下载。
- **开源不等于零使用成本**：获得开放模型与免费许可后，实际运行仍需承担硬件购置、显存算力消耗及工程运维成本，参数规模越大门槛越高。
- **下载获取不代表无限制**：不同开源或开放权重协议的传染性与署名要求各异，投入商业产品前仍需逐项核对原始许可证条款。
