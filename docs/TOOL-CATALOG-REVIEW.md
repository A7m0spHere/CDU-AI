# 工具目录增补与去重记录

核对日期：2026-10-24。输入包括维护者提供的书签截图与工具页缺项核对，入库数据见 [`tools.ts`](../src/data/tools.ts)。本轮优先成熟生态、明确使用场景与现有目录的缺项，同类只保留少量代表；不设置市场份额或热度排名。

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

## 工具页缺项补充（2026-10-24）

按用户确认的候选清单新增 19 项，总目录为 102 项、15 个场景分类。新增「办公与演示」和「翻译与文档处理」；同一资源通过 `alsoIn` 在相关场景可见，不复制条目。

| 工具 | 主分类 | 核对入口 | 具体用途 |
| --- | --- | --- | --- |
| Cherry Studio | 语言模型与对话 | [官方入口](https://cherryai.com/) / [仓库](https://github.com/CherryHQ/cherry-studio) | 在一个客户端里比较不同模型，并反复查询课程资料与个人笔记。 |
| 腾讯元宝 | 语言模型与对话 | [官方入口](https://yuanbao.tencent.com/) | 梳理中文材料、起草活动通知，或把一个问题拆成可继续追问的步骤。 |
| Gamma | 办公与演示 | [官方入口](https://gamma.app/) | 把已有提纲或课程材料整理成一份演示文稿初稿。 |
| Canva AI | 办公与演示 | [官方入口](https://www.canva.com/) | 制作课程展示、活动海报和社团宣传图，并继续手工调整细节。 |
| 沉浸式翻译 | 翻译与文档处理 | [官方入口](https://immersivetranslate.com/zh-Hans/) | 对照原文阅读外文论文、技术文档和课程视频字幕。 |
| 通义听悟 | STT 语音识别 | [官方入口](https://tingwu.aliyun.com/) | 整理课堂录音、访谈和会议记录，先转写再核对重要发言。 |
| Consensus | AI 搜索与科研 | [官方入口](https://consensus.app/) | 查找一个研究问题已有的论文证据，比较不同研究的结论。 |
| MinerU | 翻译与文档处理 | [官方入口](https://mineru.net/) / [仓库](https://github.com/opendatalab/MinerU) | 把复杂 PDF 中的文字、表格和公式提取出来，供检索或进一步整理。 |
| 硅基流动 SiliconFlow | API 与开发平台 | [官方入口](https://www.siliconflow.cn/) | 为客户端或自己的小应用接入模型，比较不同模型的任务表现。 |
| OpenRouter | API 与开发平台 | [官方入口](https://openrouter.ai/) | 让同一个应用切换不同模型，或配置模型不可用时的回退。 |
| 火山方舟 | API 与开发平台 | [官方入口](https://www.volcengine.com/product/ark) | 给自己的应用接入豆包等模型，先体验能力再配置 API 调用。 |
| Google Colab | 云端算力与部署 | [官方入口](https://colab.research.google.com/) | 跟随课程运行 Python 或机器学习 Notebook，分享实验代码与结果。 |
| Open WebUI | 本地模型与部署 | [官方入口](https://openwebui.com/) / [仓库](https://github.com/open-webui/open-webui) | 给本地模型搭一个网页聊天界面，并查询自己的文档。 |
| RAGFlow | Agent 工作流与开发 | [官方入口](https://ragflow.io/) / [仓库](https://github.com/infiniflow/ragflow) | 用一批项目文档搭建可检索来源的问答知识库。 |
| Browser Use | Agent 工作流与开发 | [官方入口](https://browser-use.com/) / [仓库](https://github.com/browser-use/browser-use) | 为 Agent 接入浏览器，自动整理网页信息并记录执行结果。 |
| CrewAI | Agent 工作流与开发 | [官方入口](https://crewai.com/) / [仓库](https://github.com/crewAIInc/crewAI) | 学习多 Agent 分工，搭建资料收集、整理与审阅的实验流程。 |
| llama.cpp | 本地模型与部署 | [官方入口](https://llama.app/) / [仓库](https://github.com/ggml-org/llama.cpp) | 在自己的电脑上尝试量化模型，比较内存占用和推理速度。 |
| 万相 Wan | 视频生成 | [官方入口](https://wan.video/) / [仓库](https://github.com/Wan-Video/Wan2.2) | 生成短视频素材，或进一步学习开放视频模型的部署与工作流。 |
| 海螺 AI | 视频生成 | [官方入口](https://hailuoai.video/) | 把分镜描述或参考图变成短视频片段，尝试不同镜头想法。 |

### 形态、许可与入口边界

- Cherry Studio 是客户端，模型调用条件由所选服务决定；Google Colab 是托管 Notebook，不是模型或模型下载社区。
- Open WebUI 的当前许可含品牌保留条件，MinerU 的当前许可含商业门槛及在线服务标识义务。两项保留仓库与本地部署入口，并在卡片说明许可边界，不加入无条件的「开源」能力筛选。许可原文分别见 [Open WebUI LICENSE](https://github.com/open-webui/open-webui/blob/main/LICENSE) 与 [MinerU LICENSE.md](https://github.com/opendatalab/MinerU/blob/master/LICENSE.md)。
- Cherry Studio（AGPL-3.0）、RAGFlow（Apache-2.0）、Browser Use、CrewAI、llama.cpp（MIT）及 Wan2.2（Apache-2.0）的仓库均未归档，并核对了最近提交和许可。框架、客户端的许可不替代所接模型的许可。
- llama.cpp 保留引擎名称与源码入口，官网链接采用仓库声明的 [llama.app](https://llama.app/)；文案说明该站同时提供 Llama 应用，避免把引擎与桌面产品混成同一个实现。
- 万相网页产品与 Wan2.2 开放模型可能属于不同版本；开源、本地部署标签仅对应已发布模型，不能理解成网页所有功能都可离线复现。
- 所有新增项目优先使用官网；8 项代码项目分别填写 `githubUrl`，不将组织主页、SDK 或示例仓库作为闭源产品的实现仓库。
- 图标保留官方底板和颜色，来源见 [TOOL-LOGOS.md](TOOL-LOGOS.md)。Gamma 本轮未成功获取官方图标，暂用首字母 G。

核对范围为官方页面、文档与仓库，不代表已逐项登录、部署或完成真实模型任务。价格仅说明使用条件，不记录具体金额或固定额度。
