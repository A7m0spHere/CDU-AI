---
term: "本地部署"
en: "Local Deployment"
category: "tools"
aliases: ["Local Deployment", "本地运行", "私有化部署"]
definition: "把模型下载到自己的电脑或服务器上运行，不依赖官方网页。"
example: "宿舍电脑装个本地模型跑问答，断网也能用，但显卡和内存要够。"
youMaySay: "把模型装自己电脑上，是不是就什么都不用管了？"
scenario:
  title: "宿舍电脑跑本地模型"
  steps:
    - label: "下载模型"
      body: "按工具文档下载小模型并加载。"
      note: "硬件决定能跑多大。"
    - label: "对比效果"
      body: "回答质量明显不如网页版，速度也慢。"
      meta: "能力与硬件相关"
    - label: "检查网络"
      body: "发现工具仍在联网下载组件，并非完全离线。"
quiz:
  - question: "本地部署的主要代价不包括哪一项？"
    options:
      - text: "硬件与维护成本"
        correct: false
      - text: "模型许可与更新"
        correct: false
      - text: "数据必须上传到厂商服务器"
        correct: true
    explain: "本地部署的意义之一就是数据不出本机。"
agentPrompt: "请列出在普通笔记本上本地运行小模型的三个限制，并给出对应的规避建议。"
order: 5
related: ["open-source-model", "server"]
updated: "2026-10-26"
sources:
  - title: "Ollama 官方文档"
    url: "https://docs.ollama.com/"
basis: "desk-research"
aiUsage: "drafted"
---

## 一句话说清

本地部署是把模型文件下载到自己设备上运行：数据不出本机，但硬件、维护和效果都要自己承担。

## 打个比方

像把外卖店搬进自家厨房：食材和锅得自己备，做得好不好也看手艺。

## 它是怎么运作的

下载模型权重，用推理工具加载；效果取决于模型大小、量化程度和硬件。小设备通常只能跑小模型或降精度版本。

## 你会碰到它的场景

- 数据敏感、不想上传到云端；
- 断网环境仍要用；
- 折腾开源模型与本地工具。

## 常见误解

- 以为本地就不联网：工具仍可能联网下载或上报；
- 以为本地更安全：配置不当一样有风险；
- 以为效果等于网页版：小模型能力通常弱不少。

## 想再深入一点

本地部署要考虑模型许可、显存占用和更新维护，不是下载完就一劳永逸。
