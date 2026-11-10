# Agent Timeline 组件收录说明

调研及本地验证日期：2026-11-10。

本轮新增 10 项 Free 设计（8 个 Components、2 个 Blocks），使目录达到 33 项设计、198 份双语三框架源码。沿用现有 ADP 视觉及源码生成流程，没有引入额外 UI 依赖。全部实现独立编写；以下链接为交互模式参考，没有复制第三方组件源码、付费内容或品牌素材，也不代表与上游 SDK 的兼容认证。

## 收录与参考

| 目录 id | 组件 | 官方交互参考 | 本地演示 |
| --- | --- | --- | --- |
| `agent-timeline` | Agent 执行时间线（Block） | [shadcn/ui Trace](https://ui.shadcn.com/docs/components/trace) | 可展开步骤，推进完成数，重置 |
| `tool-call` | 工具调用卡片 | [shadcn/ui Tool](https://ui.shadcn.com/docs/ai-elements/base/tool)、[assistant-ui Tool fallback](https://www.assistant-ui.com/elements/tool-fallback) | 参数与结果切换，演示完成与重置 |
| `agent-plan` | Agent 计划队列 | [shadcn/ui Queue](https://ui.shadcn.com/docs/ai-elements/base/queue) | 按顺序推进，完成后禁用 |
| `tool-approval` | 工具操作审批 | [shadcn/ui Confirmation](https://ui.shadcn.com/docs/ai-elements/base/confirmation) | 操作范围、批准、拒绝与决定锁定 |
| `source-citations` | 来源与行内引用 | [shadcn/ui Trace](https://ui.shadcn.com/docs/components/trace)、[AI Elements](https://ui.shadcn.com/docs/ai-elements) | 引用与来源同步，摘要及外部原文 |
| `subagent-tasks` | 子 Agent 任务卡 | [shadcn/ui Subagent](https://ui.shadcn.com/docs/ai-elements/base/subagent) | 两个已完成的子任务，展开职责、耗时与结果 |
| `agent-retry` | 失败与重试 | [assistant-ui Tool fallback](https://www.assistant-ui.com/elements/tool-fallback) | 失败、重试中、成功、跳过与重置 |
| `agent-checkpoint` | 任务检查点 | [shadcn/ui Checkpoint](https://ui.shadcn.com/docs/ai-elements/base/checkpoint) | 选择、确认、取消与恢复预览摘要 |
| `context-usage` | 上下文与用量 | [shadcn/ui AI Elements](https://ui.shadcn.com/docs/ai-elements)、[Cuelark Agent UI](https://ui.cuelark.com/agents) | 分组预算、可访问用量条与压缩预览 |
| `trace-waterfall` | Agent 耗时瀑布图（Block） | [Cuelark Agent UI](https://ui.cuelark.com/agents) | 同一时间轴的并行跨度、工具筛选、跨度详情 |

## 集成方式与范围

- `data/catalog.json` 是名称、分类、双语说明、prompt 与参考链接的正式内容源。新条目使用 `Agent Timeline` 分类。
- `src/agent-timeline.js` 独立管理新增演示，经 `src/demos.js` 接入卡片、详情和独立预览。
- `npm run generate:sources` 生成 `sources/<id>/<en|zh>/` 中的 React、Vue、HTML；不要直接修改生成文件。
- 详情页展示条目对应的公开交互参考；普通旧条目不显示空参考区。
- 组件显示可观察的任务步骤和公开摘要，不依赖模型私有内部推理。
- 所有操作都是本地预览，没有模型调用、文件写入、真实审批、真实回滚或计费。用量、费用、时间跨度均为固定示例。
- 真实项目应从服务端接入任务和工具事件；批准决定与执行结果分开处理。失败重试演示仅针对只读检索，不应用来自动重试结果未知的写入。

## 本地验收

- `npm run check`：33 项目录条目完整性及 198 份 React / Vue / HTML 双语源码编译检查通过。
- 10 项 × 2 种语言 × 390 / 768 / 1440 三种宽度，共 60 个 HTML 视图检查通过；无水平溢出、英文预览无中文残留。
- 10 项的关键交互逐项验证，包括结束禁用、重复操作、重试期间重置、检查点取消 / Escape / 焦点恢复、引用同步及瀑布筛选。
- React 与 Vue 分别以中英文在 390px 实际挂载及操作，40 项交互检查通过；React 采用 StrictMode，无浏览器运行错误。
- 真实目录入口、8 个 Components / 2 个 Blocks 的分类筛选、详情参考链接、prompt 和三种源码切换通过。
- 检查了时间线的 200% 缩放等效布局与减少动态设置；关键桌面、手机截图已人工查看。未进行独立评审。

这些检查仅覆盖本地组件与导出，不证明任何线上发布或真实服务执行。
