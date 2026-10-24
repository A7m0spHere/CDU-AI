# 工具 Logo 来源与授权

> 本文件由 `src/data/tools.ts` 整理而来，用于审核图标授权与追溯来源。新增或替换图标时，先改数据里的 `logo.source` / `logo.license`，再同步这张表。

## 使用原则

1. **用官方发布的图标本体**：品牌官网的 apple-touch-icon / favicon / PWA 图标，或官方 GitHub 组织头像；
2. 官方图标自带底板（白底、深底、圆角方块）时**保留底板**，不再抠成透明，也不再自己加白框；
3. 图标只用于**识别对应产品**，不代表品牌方对本站的认可或背书；商标归各品牌方所有；
4. 不使用搜索引擎随机图片、带水印图片、来源不明的 CDN 热链，也不用 AI 重绘官方 Logo；
5. **首字母只在图标加载失败时出现**：正常状态下隐藏，避免字母从透明图标的空白处露出来；加载失败后移除图片并显示首字母；
6. 没有适合小尺寸展示的官方图标时回退首字母，不使用 GitHub 自动生成头像代替产品标志。

## 图标清单

| 工具 | 文件 | 来源 | 授权 / 说明 | 深色反色 |
| --- | --- | --- | --- | --- |
| ChatGPT | `/tool-logos/chatgpt.webp` | https://chatgpt.com/cdn/assets/favicon-180x180-od45eci6.webp | 品牌官网图标，仅用于识别该产品 | 否 |
| Claude | `/tool-logos/claude.webp` | https://claude.ai/apple-touch-icon.png | 品牌官网图标，仅用于识别该产品 | 否 |
| Gemini | `/tool-logos/gemini.webp` | https://www.gstatic.com/lamda/images/gemini_sparkle_4g_512_lt_f94943af3be039176192d.png | 品牌官网图标，仅用于识别该产品 | 否 |
| DeepSeek | `/tool-logos/deepseek.webp` | https://fe-static.deepseek.com/chat/icon-180.png | 品牌官网图标，仅用于识别该产品 | 否 |
| Kimi | `/tool-logos/kimi.webp` | https://www.kimi.com/pwa-192.png | 品牌官网图标，仅用于识别该产品 | 否 |
| Qwen Chat | `/tool-logos/qwen-chat.webp` | https://assets.alicdn.com/g/qwenweb/qwen-chat-fe/0.3.22/favicon.png | 品牌官网图标，仅用于识别该产品 | 否 |
| 豆包 | `/tool-logos/doubao.webp` | https://lf-flow-web-cdn.doubao.com/obj/flow-doubao/favicon/new-doubao/128x128.png | 品牌官网图标，仅用于识别该产品 | 否 |
| Z.ai | `/tool-logos/zai.svg` | https://z-cdn.chatglm.cn/z-ai/static/logo.svg | 品牌官网图标，仅用于识别该产品 | 否 |
| Codex | `/tool-logos/codex.webp` | https://github.com/openai.png | 官方 GitHub 组织头像，仅用于识别该产品 | 否 |
| Claude Code | `/tool-logos/claude-code.webp` | https://anthropic.gallerycdn.vsassets.io/extensions/anthropic/claude-code/2.1.310/1792798885198/Microsoft.VisualStudio.Services.Icons.Default | 官方扩展图标，仅用于识别该产品 | 否 |
| Gemini CLI | `/tool-logos/gemini-cli.webp` | https://geminicli.com/_astro/icon.Bo4M5sF3.png | 品牌官网图标，仅用于识别该产品 | 否 |
| OpenCode | `/tool-logos/opencode.webp` | https://opencode.ai/apple-touch-icon-v3.png | 品牌官网图标，仅用于识别该产品 | 否 |
| DeepSeek Harness | `/tool-logos/deepseek-harness.webp` | https://raw.githubusercontent.com/deepseek-ai/deepseek-harness/master/apps/desktop/resources/icon.svg | 官方仓库应用图标，仅用于识别该产品 | 否 |
| Cursor | `/tool-logos/cursor.webp` | https://cursor.com/marketing-static/icon-192x192-light.png | 品牌官网图标，仅用于识别该产品 | 否 |
| Cline | `/tool-logos/cline.webp` | https://cline.bot/assets/branding/favicons/apple-touch-icon.png | 品牌官网图标，仅用于识别该产品 | 是 |
| Midjourney | `/tool-logos/midjourney.svg` | https://docs.midjourney.com/hc/theming_assets/01K1K3SHJHG4BTD9YK9VH9G86N | 官方文档帆船 SVG，仅用于识别该产品 | 是 |
| ComfyUI | `/tool-logos/comfyui.webp` | https://www.comfy.org/apple-touch-icon.png | 品牌官网图标，仅用于识别该产品 | 否 |
| 即梦 AI | `/tool-logos/jimeng.webp` | https://lf3-lv-buz.vlabstatic.com/obj/image-lvweb-buz/common/images/dreamina-v1.ico | 品牌官网图标，仅用于识别该产品 | 否 |
| 可灵 AI | `/tool-logos/kling.webp` | https://s16-kling.klingai.com/kos/s101/nlav112918/kling-homepage-aio/logo-180x180.png | 品牌官网图标，仅用于识别该产品 | 否 |
| Runway | `/tool-logos/runway.webp` | https://runway.com/icon.png | 品牌官网图标，仅用于识别该产品 | 否 |
| ElevenLabs | `/tool-logos/elevenlabs.webp` | https://elevenlabs.io/apple-icon.png | 品牌官网图标，仅用于识别该产品 | 否 |
| FunASR | `/tool-logos/funasr.webp` | https://github.com/modelscope.png | 官方 GitHub 组织头像，仅用于识别该产品 | 否 |
| Suno | `/tool-logos/suno.webp` | https://cdn-o.suno.com/favicon-192x192.png | 品牌官网图标，仅用于识别该产品 | 否 |
| Udio | `/tool-logos/udio.webp` | https://www.udio.com/favicon.ico | 品牌官网图标，仅用于识别该产品 | 否 |
| Perplexity | `/tool-logos/perplexity.webp` | https://www.perplexity.ai/apple-touch-icon.png | 品牌官网图标，仅用于识别该产品 | 否 |
| NotebookLM | `/tool-logos/notebooklm.svg` | https://notebook.google/_/static/branding/v6/light_mode/favicon/apple-touch-icon.png | 品牌官网图标，仅用于识别该产品 | 否 |
| 秘塔 AI 搜索 | `/tool-logos/metaso.webp` | https://metaso.cn/apple-touch-icon.png | 品牌官网图标，仅用于识别该产品 | 否 |
| Elicit | `/tool-logos/elicit.webp` | https://elicit.com/apple-touch-icon.png | 品牌官网图标，仅用于识别该产品 | 否 |
| Dify | `/tool-logos/dify.svg` | https://dify.ai/favicon.svg | 品牌官网图标，仅用于识别该产品 | 否 |
| n8n | `/tool-logos/n8n.webp` | https://n8n.io/apple-touch-icon.png | 品牌官网图标，仅用于识别该产品 | 否 |
| 扣子 Coze | `/tool-logos/coze.svg` | https://simple-icons.org/coze | CC0 1.0（Simple Icons）；商标归品牌方 | 否 |
| Ollama | `/tool-logos/ollama.webp` | https://ollama.com/public/apple-touch-icon.png | 品牌官网图标，仅用于识别该产品 | 否 |
| LM Studio | `/tool-logos/lmstudio.webp` | https://lmstudio.ai/assets/marketing/logo-192x192.png | 品牌官网图标，仅用于识别该产品 | 否 |
| vLLM | `/tool-logos/vllm.svg` | https://vllm.ai/vLLM-Logo.svg | 品牌官网图标，仅用于识别该产品 | 否 |
| GitHub Copilot | `/tool-logos/github-copilot.svg` | https://github.com/features/copilot | 官方产品页内联图标，仅用于识别该产品 | 是 |
| TRAE | `/tool-logos/trae.webp` | https://lf-cdn.trae.com.cn/obj/trae-com-cn/trae_website_prod_cn/favicon.png | 品牌官网图标，仅用于识别该产品 | 否 |
| Qwen Code | `/tool-logos/qwen-code.webp` | https://qwenlm.github.io/qwen-code-docs/favicon.png?v=2 | 品牌官网图标，仅用于识别该产品 | 否 |
| Google Antigravity | `/tool-logos/google-antigravity.webp` | https://antigravity.google/apple-touch-icon.png | 品牌官网图标，仅用于识别该产品 | 否 |
| Manus | `/tool-logos/manus.webp` | https://manus.im/apple-icon.png?apple-icon.153es_5lvwth1.png | 品牌官网图标，仅用于识别该产品 | 否 |
| OpenClaw | `/tool-logos/openclaw.svg` | https://openclaw.ai/favicon.svg | 品牌官网图标，仅用于识别该产品 | 否 |
| OpenHands | `/tool-logos/openhands.svg` | https://www.openhands.dev/favicon.svg | 品牌官网图标，仅用于识别该产品 | 否 |
| Devin Desktop | `/tool-logos/devin-desktop.webp` | https://devin.ai/apple-icon.png | 品牌官网图标，仅用于识别该产品 | 否 |
| Pi | `/tool-logos/pi.svg` | https://pi.dev/favicon.svg?v=ce56f151-ae5c-4099-952b-3a34fea01d2c | 品牌官网图标，仅用于识别该产品 | 是 |
| Oh My Pi | `/tool-logos/oh-my-pi.webp` | https://omp.sh/favicon-180x180.png | 品牌官网图标，仅用于识别该产品 | 否 |
| Goose | `/tool-logos/goose.webp` | https://avatars.githubusercontent.com/u/271095942?v=4 | 官方 GitHub 组织头像，仅用于识别该项目 | 否 |
| Hermes Agent | `/tool-logos/hermes-agent.webp` | https://web-assets.nousresearch.com/marketing/706fb678b93ec8750030067c0778e57d9203985f/assets/hermes-agent/icon.png | 品牌官网图标，仅用于识别该产品 | 否 |
| Aider | `/tool-logos/aider.webp` | https://avatars.githubusercontent.com/u/172139148?v=4 | 官方 GitHub 组织头像，仅用于识别该项目 | 否 |
| Open Interpreter | `/tool-logos/open-interpreter.webp` | https://www.openinterpreter.com/apple-icon?c4f9453b74d8034f | 品牌官网图标，仅用于识别该产品 | 否 |
| mini-SWE-agent | `/tool-logos/mini-swe-agent.svg` | https://mini-swe-agent.com/latest/assets/mini_square.svg | 品牌官网图标，仅用于识别该产品 | 否 |
| LangGraph | `/tool-logos/langgraph.webp` | https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/69a17e4f0c916c644f4de1cd_webclip%20lg.png | 品牌官网图标，仅用于识别该产品 | 否 |
| Hugging Face | `/tool-logos/hugging-face.svg` | https://huggingface.co/front/assets/huggingface_logo-noborder.svg | 品牌官网图标，仅用于识别该社区 | 否 |
| ModelScope 魔搭社区 | `/tool-logos/modelscope.webp` | https://g.alicdn.com/sail-web/maas/2.13.170/favicon/128.ico | 品牌官网图标，仅用于识别该社区 | 否 |
| Kaggle | `/tool-logos/kaggle.webp` | https://www.kaggle.com/static/images/favicon-new.ico | 品牌官网图标，仅用于识别该社区 | 否 |
| 飞桨 AI Studio 星河社区 | `/tool-logos/ai-studio.webp` | https://paddlepaddle-org-cn.cdn.bcebos.com/paddle-site-front/favicon-128.png | 品牌官网图标，仅用于识别该社区 | 否 |

| 工具 | 文件 | 来源 | 授权 / 说明 | 深色反色 |
| --- | --- | --- | --- | --- |
| Grok | `/tool-logos/grok.webp` | https://grok.com/images/apple-touch-icon.png | 品牌官网图标，仅用于识别该产品 | 否 |
| 智谱清言 | `/tool-logos/chatglm.webp` | https://chatglm.cn/favicon.ico | 品牌官网图标，仅用于识别该产品 | 否 |
| Civitai | `/tool-logos/civitai.webp` | https://civitai.com/images/apple-touch-icon.png | 品牌官网图标，仅用于识别该社区 | 否 |
| RunningHub | `/tool-logos/runninghub.webp` | https://www.runninghub.cn/favicon.ico?v=1.4 | 品牌官网图标，仅用于识别该产品 | 否 |
| AutoDL 算力云 | `/tool-logos/autodl.webp` | https://www.autodl.com/favicon.png | 品牌官网图标，仅用于识别该平台 | 否 |
| Google AI Studio | `/tool-logos/google-ai-studio.webp` | https://www.gstatic.com/images/branding/productlogos/ai_studio/v1/web-512dp/logo_ai_studio_color_1x_web_512dp.png | 品牌官网图标，仅用于识别该平台 | 否 |
| 阿里云百炼 | `/tool-logos/aliyun-bailian.webp` | https://img.alicdn.com/imgextra/i1/O1CN01Es0c28049TL083Vo_!!6000000002263-2-tps-64-64.png | 官方控制台图标，仅用于识别该平台 | 否 |
| DeepSeek 开放平台 | `/tool-logos/deepseek-api.webp` | https://fe-static.deepseek.com/platform/favicon.svg | 官方平台图标，仅用于识别该平台 | 否 |
| 智谱 BigModel 开放平台 | `/tool-logos/zhipu-api.webp` | https://bigmodel.cn/static/images/favicon.png | 官方平台图标，仅用于识别该平台 | 否 |
| Kimi API 开放平台 | `/tool-logos/kimi-api.webp` | https://platform.kimi.com/favicon-light.ico?v=3 | 官方平台图标，仅用于识别该平台 | 否 |
| MiniMax 开放平台 | `/tool-logos/minimax-api.webp` | https://platform.minimax.cn/docs/_mintlify/favicons/minimax-zh/DMz0Zpj7JInghPSs/_generated/favicon/apple-touch-icon.png | 官方平台图标，仅用于识别该平台 | 否 |
| Tavily | `/tool-logos/tavily.webp` | https://www.tavily.com/apple-icon.png?apple-icon.2rsjznomrsf77.png | 品牌官网图标，仅用于识别该平台 | 否 |
| fal.ai | `/tool-logos/fal.webp` | https://cdn.prod.website-files.com/6a72ef21c470312422dea9b3/6adae13a030770b54ecc8783_fal-icon-favicon.png | 品牌官网图标，仅用于识别该平台 | 否 |
| ZCode | `/tool-logos/zcode.webp` | https://zcode.z.ai/apple-icon.png?v=20260707-transparent | 品牌官网图标，仅用于识别该产品 | 否 |
| WorkBuddy | `/tool-logos/workbuddy.svg` | https://download.codebuddy.cn/web/workbuddy/eb02746771ab068964c9ce8804176ef2692ddd80/assets/logo.svg | 品牌官网图标（官方 SVG），仅用于识别该产品；矢量图保留 SVG 不转位图 | 否 |
| Qoder | `/tool-logos/qoder.webp` | https://img.alicdn.com/imgextra/i4/O1CN01QkSxiCocd3D0prc8_!!6000000008124-2-tps-412-412.png | 品牌官网图标，仅用于识别该产品 | 否 |
| Kimi Code | `/tool-logos/kimi.webp` | https://www.kimi.com/pwa-192.png | 品牌官网图标，仅用于识别该产品；与上方 Kimi 条目同源，复用同一文件，不单独存放重复图标 | 否 |
| MiniMax Code | `/tool-logos/minimax-code.webp` | https://agent.minimax.cn/assets/logo/apple-touch_v2.png | 品牌官网图标，仅用于识别该产品 | 否 |

## 处理说明

- 产品类工具优先取官网 180×180 以上的 apple-touch-icon / PWA 图标，其次 favicon；开源项目取官方 GitHub 组织头像。
- 位图统一压到 96×96 WebP（保留原图透明通道），矢量图保留原始 SVG；单个文件均在 12KB 以内。
- 图标区不带底色和描边：图标自己有底板就显示底板，本身透明的就浮在卡片上，不额外加白框。
- 只有黑白灰的近黑标志（如 Cline、Midjourney）才标 `mono: true`，深色主题用 `filter: invert(1)` 提高可见性；Qwen、Udio、Elicit、Coze 等彩色图标不反色，保留品牌原色。
- 没有配置 `logo` 时显示首字母；已配置图标时默认隐藏字母，`onerror` 移除失败图片后显示首字母。
- Pi 的官方 SVG 带系统主题媒体查询；保留图形路径，固定为官方浅色单色样式，再由本站主题控制反色，避免系统主题与站点主题不一致。

## 本轮新增资源图标（2026-10-24）

| 工具 | 文件 | 来源 | 授权 / 说明 | 深色反色 |
| --- | --- | --- | --- | --- |
| Cherry Studio | `/tool-logos/cherry-studio.webp` | https://cherryai.com/assets/favicon-BmbgeFTf.png | 品牌官网图标，仅用于识别该产品或项目 | 否 |
| 腾讯元宝 | `/tool-logos/yuanbao.webp` | https://static.yuanbao.tencent.com/m/yuanbao-web/favicon_new@32.png | 品牌官网图标，仅用于识别该产品或项目 | 否 |
| Gamma | 首字母 G | https://gamma.app/ | 官方图标资源本轮未成功获取，暂用首字母，不以来源不明的图片替代 | 不适用 |
| Canva AI | `/tool-logos/canva.webp` | https://static.canva.com/domain-assets/canva/static/images/favicon-1.ico | 品牌官网图标，仅用于识别该产品或项目 | 否 |
| 沉浸式翻译 | `/tool-logos/immersive-translate.webp` | https://immersivetranslate.com/_next/static/media/logo.761c1cd1.png | 品牌官网图标，仅用于识别该产品或项目 | 否 |
| 通义听悟 | `/tool-logos/tingwu.webp` | https://g.alicdn.com/idst-fe/mind-meeting-assistant2/0.0.189/favicon.png | 品牌官网图标，仅用于识别该产品或项目 | 否 |
| Consensus | `/tool-logos/consensus.webp` | https://consensus.app/images/icon-384.png | 品牌官网图标，仅用于识别该产品或项目 | 否 |
| MinerU | `/tool-logos/mineru.webp` | https://mineru.net/apple-touch-icon.png | 品牌官网图标，仅用于识别该产品或项目 | 否 |
| 硅基流动 SiliconFlow | `/tool-logos/siliconflow.webp` | https://cloud.siliconflow.cn/favicon.ico | 品牌官网图标，仅用于识别该产品或项目 | 否 |
| OpenRouter | `/tool-logos/openrouter.webp` | https://openrouter.ai/apple-touch-icon.png | 品牌官网图标，仅用于识别该产品或项目 | 否 |
| 火山方舟 | `/tool-logos/volcengine-ark.webp` | https://portal.volccdn.com/obj/volcfe/misc/favicon.png | 品牌官网图标，仅用于识别该产品或项目 | 否 |
| Google Colab | `/tool-logos/google-colab.webp` | https://colab.research.google.com/img/colab_favicon_256px.png | 品牌官网图标，仅用于识别该产品或项目 | 否 |
| RAGFlow | `/tool-logos/ragflow.svg` | https://ragflow.io/img/logo.svg | 品牌官网图标，仅用于识别该产品或项目 | 否 |
| Browser Use | `/tool-logos/browser-use.webp` | https://browser-use.com/apple-touch-icon.png | 品牌官网图标，仅用于识别该产品或项目 | 否 |
| CrewAI | `/tool-logos/crewai.webp` | https://crewai.com/favicon.ico | 品牌官网图标，仅用于识别该产品或项目 | 否 |
| llama.cpp | `/tool-logos/llama-cpp.svg` | https://llama.app/ | 品牌官网图标，仅用于识别该产品或项目 | 是 |
| 万相 Wan | `/tool-logos/wan.webp` | https://avatars.githubusercontent.com/u/200620180?v=4 | 官方 GitHub 组织头像，仅用于识别该项目 | 否 |
| 海螺 AI | `/tool-logos/hailuo.webp` | https://cdn.hailuoai.video/open-hailuo-video-web/public_assets/favicon.png | 品牌官网图标，仅用于识别该产品或项目 | 否 |
| RikkaHub | `/tool-logos/rikkahub.webp` | https://raw.githubusercontent.com/rikkahub/rikkahub/master/docs/icon.png | 官方仓库应用图标，仅用于识别该项目 | 否 |
