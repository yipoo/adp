# ADP — Prompt for Agents Design

[English](README.en.md) · 简体中文

为 AI Agent 产品设计的可交互 UI、完整页面模板、设计 prompt 和多框架源码库。

**33 项设计 · 5 套 Agent 模板 · 中英文 · Next.js / React、Vue 3、HTML**

## 本地运行

```sh
npm run dev
```

打开 http://127.0.0.1:4180 。浏览网站不需要安装依赖，不需要模型 API Key。Node.js 22+；可用 `PORT=4181 npm run dev` 修改端口。

## 内容

| 类型 | 数量 | 内容 |
| --- | --- | --- |
| Components | 20 | 原有 12 项，以及工具调用、计划队列、操作审批、来源引用、子任务、重试、检查点、上下文用量 |
| Blocks | 8 | Agent 工作台、数据概览、内容审阅、项目规划、方案对比、品牌首屏、Agent 执行时间线、耗时瀑布图 |
| Templates | 5 | Agent 对话、深度研究、工作流控制台、人工审批、知识库 |

模板是带有导航、项目、页头、主内容、上下文、交互反馈的页面。桌面三栏；平板收起上下文；手机使用单列和可开关的导航、上下文抽屉。所有模板默认完整展示，可以打开独立预览并切换 Desktop 1440 / Tablet 768 / Mobile 390。

Free 包含全部 demo、设备预览、搜索、收藏，以及 Free 条目的 prompt 和三框架源码。Lifetime 开放全部在线 Pro prompt / 源码、批量管理和完整打包下载。已公开的 GitHub 版本继续免费。ADP Lifetime 为 **$29.90 美元一次付费**，提供完整双语源码包的便捷下载，已下载版本永久可用，后续打包更新在产品持续维护期间提供。网站通过 Vercel 部署至 https://adp.yipoo.com ，账号与付款说明见 [billing/README.md](billing/README.md)。当前为 Stripe 测试环境，不收取真实款项。

## Agent Timeline

在 Components 或 Blocks 中选择 **Agent Timeline** 分类。新增 10 项均为 Free，提供中英文交互演示、设计 prompt 和 React / Vue / HTML 源码。详情页附公开交互参考链接；来源、收录范围及验证说明见 [Agent Timeline 参考说明](docs/agent-timeline-references.md)。

这些组件展示可观察的任务事件与公开摘要。推进、审批、重试、压缩和恢复仅影响本地预览；真实运行与持久化由接入方服务负责。

## 中英文

- 界面、名称、描述、交互规范、prompt、源码及 demo 内文案均支持 EN / 中文切换。
- 首次根据浏览器语言选择；之后记住用户选择。
- prompt 按语言分别编辑与保存，互不覆盖。
- 中英文名称、描述和交互关键词均可搜索。

## 复制源码

打开任一设计 → **实现源码 / Source code** → 选择框架 → 复制或下载完整文件：

| 框架 | 文件 | 接入 |
| --- | --- | --- |
| Next.js / React | `.jsx` | 复制进现有项目并导入默认组件，包含 `use client`，支持 React 18+ |
| Vue 3 | `.vue` | 复制到现有 Vue 项目中，直接导入组件 |
| HTML / CSS / JS | `index.html` | 独立文件，可直接打开 |

源文件位于 `sources/<id>/<en|zh>/`。33 项 × 2 种语言 × 3 种实现，共 198 个文件。每个文件包含布局、样式和交互实现；React 使用 JSX、`useRef` / `useEffect`，Vue 使用原生 template、`script setup` 及生命周期清理；不会把整个 demo 塞进 iframe，也不使用运行时 eval。

源码不依赖外部字体、图片、CDN 或 UI 库。样式按设计 id 隔离，可与 Tailwind CSS、shadcn/ui 项目共存；目前不是单独的 shadcn registry 或 Tailwind 专用导出。复制到使用 Tailwind Preflight 的项目后，仍应结合项目样式做集成验收。

模板导航触发冒泡的 `adp-navigate` 自定义事件，`event.detail.kind` 为 `chat / research / workflow / inbox / knowledge`。在自己的应用中监听该事件连接路由；ADP 的独立预览已支持这五个页面互相切换。

## 你们的 prompt

正式内容源：`data/catalog.json`。每条包含 `id`、`type`、`tier`、`title`、`en`、`description` / `descriptionEn`、`specs` / `specsEn`、`demo`、`prompt` / `promptEn`。

页面支持逐条编辑，以及 JSON 批量导入与导出：

```json
[
  { "id": "agent-chat", "lang": "en", "prompt": "Your full prompt…" },
  { "id": "agent-chat", "lang": "zh", "prompt": "你们的完整 prompt…" }
]
```

`lang` 省略时使用当前界面语言。文件限制 2MB、单条 prompt 限制 50000 字符；所有条目通过验证后一次保存。无效 id、语言、重复 id/语言、无效 JSON 或空 prompt 不会覆盖原内容。导入只处理文本，不执行 HTML 和脚本。

浏览器编辑、收藏和主题只保存在当前浏览器。团队共享或发布时更新 `data/catalog.json`。旧版本中文 prompt 与收藏仍可恢复。

## 演示与真实服务的边界

- Agent 回复、研究资料和工作流步骤是本地交互内容，未调用模型或执行后台工具。
- 人工审批只更新当前页面的展示状态，不会发布公告、修改项目或发送邮件。
- 文件选择仅展示文件元数据，不上传、不解析、不索引文件；知识库预览为内置内容。
- 「分享简报」下载本地文本文件，不创建公开链接。
- 波形是视觉播放效果，不录音、不输出音频。
- 模板内部的模型与业务行为仍需接入自己的服务。ADP 网站自身已接入 Supabase Auth、独立账单数据及私有下载存储，并通过 Stripe 测试付款验证 Lifetime 权益。

## 开发与检查

```sh
npm ci
npm run check
# 修改 demo、模板或语言后，重新生成可复制源码
npm run generate:sources
# 准备本地 React / Vue 源码运行验收页
npm run prepare:runtime
```

`npm run check` 验证全部双语目录、Free / Pro 覆盖、prompt 完整性，编译 React JSX、Vue script / template / CSS，检查 HTML 演示脚本和源码与 demo 的一致性。

`qa-runtime/` 是本机生成的运行验收产物，不提交到仓库。工具 `tools/update-catalog.mjs` / `tools/seed.py` 是内容初始化脚本，修改正式目录后不要重复运行以免覆盖已有文案。

## 文件结构

- `src/app.js`：浏览、双语、详情、源码和 prompt 管理。
- `src/locale.js`：界面与原有组件演示的语言资源。
- `src/demos.js`：演示组装与组件实现。
- `src/agent-templates.js`：五套 Agent 页面及交互。
- `src/agent-timeline.js`：10 项时间线相关组件与区块的双语演示、样式和状态交互。
- `src/preview.js`：独立全页预览、设备宽度与页面导航。
- `sources/`：可直接复制、下载的双语源文件。
- `tools/generate-sources.mjs`：从同一实现生成三框架源码；`tools/check-sources.mjs` 校验编译。

## 参考

视觉与浏览体验参考 [Detent](https://detentui.com/)，所有演示、源码、prompt 和素材均为独立编写，未复制其付费源码或品牌素材。框架接入参考 [Next.js client components](https://nextjs.org/docs/app/api-reference/directives/use-client) 与 [Vue lifecycle hooks](https://vuejs.org/api/composition-api-lifecycle.html)。
