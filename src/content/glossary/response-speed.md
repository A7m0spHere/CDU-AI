---
term: "TTFT / TPS"
en: "TTFT / TPS"
category: "runtime"
aliases: ["首 Token 延迟", "生成速度"]
definition: "TTFT 是从发出请求到收到首个 Token 的等待时间；TPS（Tokens Per Second）是每秒生成的 Token 数。"
example: "首字快不代表整段回答快；长回答还要看总时长和生成速度。"
order: 6
related: ["streaming-response", "token"]
updated: "2026-10-19"
sources:
  - title: "NVIDIA · LLM inference metrics"
    url: "https://docs.nvidia.com/nim/benchmarking/llm/metrics"
  - title: "NVIDIA AIPerf · TTFT 与首个非推理输出"
    url: "https://docs.nvidia.com/aiperf/reference/ai-perf-metrics-reference"
---

## 一句话说清

衡量「快不快」的两个数：发出请求后多久收到首个 Token（TTFT），以及每秒生成多少 Token（TPS）。Token 是模型处理内容的单位，不等于字数，因此 TPS 不能直接读成「每秒多少字」。

## 打个比方

烧水接水：TTFT 是等多久出第一滴水，TPS 是之后水流有多大。第一滴快不代表接满一壶快。

## 它是怎么运作的

1. TTFT 受排队、上下文长度、模型规模影响。
2. TPS 受模型规模和当前负载影响。
3. 流式响应可能一次传回多个 Token；界面何时显示文字，还会受到传输、缓冲和渲染的影响。
4. 比较 TPS 前要看测量口径：是单次请求还是整个服务的总吞吐量，计时是否包含等待首个 Token 的时间。

## 你会碰到它的场景

- 选模型时对比响应速度。
- 长回答时判断「是不是卡住了」。
- 同一工具早晚速度差很多。

## 常见误解

- 以为首字快就是整体快。长回答的总时长主要由 TPS 决定。
- 以为 TPS 高就一定好。还要看内容质量，快而错没有意义。
- 以为不同工具的数字能直接比。测试条件不同，数字没法横向对照。
- 以为首个 Token 就是首个可见回答。有些服务先返回思考内容，看到最终回答的等待时间需要另行测量。

## 想再深入一点

上下文越长，TTFT 通常越慢。如果首字很慢，先检查是不是历史对话太长、附件太大。
