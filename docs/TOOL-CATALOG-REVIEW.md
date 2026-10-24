# 工具目录增补与去重记录

核对日期：2026-10-24。输入为维护者提供的书签截图，入库数据见 [`tools.ts`](../src/data/tools.ts)。本轮优先成熟生态、明确使用场景与现有目录的缺项，同类只保留少量代表；不设置市场份额或热度排名。

信息依据为官方入口、页面说明和官方开发文档。本轮未逐个平台注册账号、配置密钥或完成真实模型任务测试。

## 本轮新增

| 主分类 | 条目 | 官方核对入口与用途 |
| --- | --- | --- |
| 语言模型与对话 | Grok | [官网](https://grok.com/)：对话、联网与创作入口 |
| 语言模型与对话 | 智谱清言 | [官网](https://chatglm.cn/)：中文 GLM 助手与任务处理 |
| 模型与数据社区 | Civitai | [官网](https://civitai.com/)：图像模型、LoRA 与创作资源；同时在图像分类可见 |
| 图像生成与编辑 | RunningHub | [官网](https://www.runninghub.cn/)：云端 ComfyUI 与内容创作；同时在视频、工作流分类可见 |
| 云端算力与部署 | AutoDL 算力云 | [官网](https://www.autodl.com/)：GPU 实例、镜像与远程实验环境 |
| API 与开发平台 | Google AI Studio | [官方快速入门](https://ai.google.dev/gemini-api/docs/ai-studio-quickstart)：模型与提示词试验、获取接入代码 |
| API 与开发平台 | 阿里云百炼 | [官方说明](https://help.aliyun.com/zh/model-studio/what-is-model-studio)：模型调用、智能体与知识库应用 |
| API 与开发平台 | DeepSeek 开放平台 | [官方平台](https://platform.deepseek.com/)：模型 API 与开发控制台 |
| API 与开发平台 | 智谱 BigModel 开放平台 | [官方平台](https://bigmodel.cn/)：GLM 等模型的接口接入 |
| API 与开发平台 | Kimi API 开放平台 | [当前平台](https://platform.kimi.com/)：Kimi 模型接入与开发文档 |
| API 与开发平台 | MiniMax 开放平台 | [当前平台](https://platform.minimax.cn/)：文本、语音、视频、图像等模型 API |
| API 与开发平台 | Tavily | [官网](https://www.tavily.com/)：Agent 网页搜索与内容提取 API；同时在搜索科研分类可见 |
| API 与开发平台 | fal.ai | [官网](https://fal.ai/)：图像、视频、音频等生成模型 API；同时在图像、视频分类可见 |

截图中标题为「Generative AI」的条目，按标题与粉色图标判断为 fal.ai；这是对截图的识别判断，入库内容另按 fal.ai 官网核对。

## 去重与名称处理

- Claude、Qwen、Z.ai、豆包、即梦与 DeepSeek Harness 已收录，沿用现有条目。
- Google AI Studio 在截图出现两次，合并为一个条目；Google 的开发工作台与飞桨 AI Studio 星河社区分别保留厂商全名。
- 智谱清言使用 `chatglm.cn` 中文产品入口，Z.ai 保留其现有入口；`ChatGLM` 别名归到智谱清言。BigModel 开放平台单独放入 API 分类。
- 厂商聊天产品与 API 平台解决的任务不同，分别记录；同一个平台的登录页、密钥页、控制台与文档页不重复入库。
- 本次核对时，`platform.moonshot.cn` 跳转至 `platform.kimi.com`；`platform.minimaxi.com` 跳转至 `platform.minimax.cn` 的文档入口。新条目使用当前域名。
- 分类按实际用途维护，不照搬书签文件夹名。RunningHub 的主要入口是创作与工作流，AutoDL 算力云提供云端 GPU 实例。

## 本轮暂缓

| 条目 | 取舍依据 |
| --- | --- |
| RWKV | 模型体系较专门，当前先补可直接使用的产品与通用开发入口 |
| updream、NovelAI、互动文字游戏页 | 创作场景较细分；本轮优先现有图像、视频工具与资源社区的补充 |
| MiMo、阶跃星辰开放平台 | 同类入口先保留本轮所选的少量代表，后续有明确模型或任务需求再补 |
| Dots API | 截图不足以确认具体官方网址，先不猜测入口 |
| AutoDL.ART | 内容创作场景先由已有工具与 RunningHub 覆盖；不与 GPU 实例平台混为同一条目 |
| OpenCode Zen | 专项编程模型服务，本轮先保留已有 OpenCode 与通用 API 开发平台 |
| Home | 通用标题不足以确认目标网址，不按图标猜测收录 |

暂缓条目在后续出现明确使用场景时重新核对。收录仍需填写实际核对日期、说明用途与限制；不写零成本使用承诺，不将平台托管的开放资源等同于平台本身开源或可本地部署。
