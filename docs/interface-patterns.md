# Agent 控件收录与分级

日期：2026-11-11。本批新增适用于 Agent 产品的筛选、导航、通知、浮层和设置组件，均为独立实现。

| ID | 名称 | 类型 | 等级 |
| --- | --- | --- | --- |
| source-scope-picker | 资料范围多选 | Components | Free |
| agent-command-search | Agent 命令搜索 | Components | Free |
| run-notifications | 任务通知队列 | Components | Free |
| execution-records | 执行记录筛选表 | Blocks | Pro |
| task-inspector | 任务详情抽屉 | Components | Pro |
| agent-preferences | Agent 设置面板 | Blocks | Pro |

基础入口组件开放 Free；涉及组合数据操作、模态上下文和多控件设置的组件归 Pro，沿用现有 Lifetime 权益与价格。全部支持双语预览与 React / Vue / HTML 源码。原有条目的等级不变。

ADP 当前共有 39 项：24 Components / 10 Blocks / 5 Templates；25 Free / 14 Pro；234 个框架及语言源文件。

## 与 motion 的关系

[motion 的界面动效机制包](https://motion.yipoo.com/?pack=interface) 负责加载、反馈和运动参数；ADP 负责完整布局、状态、键盘操作与宿主接入。新增条目保留两个产品之间的关联入口。本批不原样收录旅游、音乐、天气、来电及行业主题 404。

## 接入与状态

- 来源选择区分暂存勾选与已应用标签；应用时拒绝空选择。搜索不丢失隐藏项的勾选状态。
- 命令搜索支持方向键、Enter、Escape，通过冒泡的 `adp-action` 事件返回 `research / approvals / knowledge / records`。
- 通知队列上限三条，关闭和撤销只改变当前队列，不处理真实后台通知。
- 执行记录以数值排序耗时，搜索与状态筛选组合使用；示例数据不代表真实运行记录。
- 任务抽屉使用原生模态对话框，支持 Escape、标签键盘操作和关闭后的焦点恢复。
- 设置保存在当前组件的会话状态，并通过 `adp-preferences` 事件返回 `{mode,budget,approval,citations}`；重置派发 `adp-preferences-reset`。接入方负责持久化、真实预算和服务端授权。偏好开关本身不改变安全策略。

## 验证与交付范围

`npm run generate:sources` 和 `npm run check` 生成并编译全部 234 个文件。新增六项进行双语真实浏览器检查，覆盖搜索空结果、隐藏选择、数值排序、通知上限与撤销、方向键、模态焦点恢复、保存与重置，以及 390 / 768 / 1440 视口和减少动态。新增六项也在真实 React 与 Vue 挂载后执行相同操作，修正 React 布尔 checked 属性的默认值转换，沿用原有卸载清理。

`npm run build:vercel`、`node tools/verify-static.mjs` 验证 Free 内容公开，Pro prompt 和三框架源文件不进入公共目录；既有计费测试使用本地替身，不代表真实付款验证。实际画面与验证结果位于 `.oil-ui/interface-review/`。

本次为本地分支交付，未部署、推送、上传付费下载包或修改线上权益。
