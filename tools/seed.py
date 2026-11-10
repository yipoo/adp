import json
from pathlib import Path
root=Path(__file__).resolve().parent.parent
rows=[
('prompt-composer','灵感输入框','Prompt composer','components','AI 与对话','free','prompt','把输入、附件与思考模式，收进一个恰到好处的输入框。',['多行输入与空内容校验','附件选择后显示文件名','提交后在原位显示输入内容'],'#edf1ff'),
('model-selector','模型与思考深度','Model & effort','components','AI 与对话','free','model','同一个问题，用你选择的方式思考。',['分段按钮切换推理强度','模型单选与选中标识','选择后即时更新状态说明'],'#fff2e6'),
('voice-note','声音的形状','Voice note','components','AI 与对话','free','voice','让一段想法，有可以看见的节奏。',['波形播放、暂停与重置','24 秒进度更新','波形为交互演示，不录音、不输出音频'],'#f2efe9'),
('baseline-chart','会回应的图表','Baseline chart','components','数据与图表','free','chart','每一个数字背后，都有一段可以探索的变化。',['点击柱形查看当天数据','选中柱形高亮并轻微上移','数字与说明同步更新'],'#edf3f0'),
('file-upload','轻盈上传','File upload','components','输入与操作','free','upload','从桌面到界面，一次自然的落点。',['支持点击选择与文件拖入','拖入区域高亮','展示文件名和大小；不向服务器上传'],'#f1f1ed'),
('rewind-editor','思绪回溯','Rewind editor','components','输入与操作','pro','rewind','让编辑像思考一样自由，也随时可以回头。',['每次输入保留一个历史版本','撤销、重做与历史滑杆','首尾版本按钮禁用'],'#f0f0f6'),
('action-popup','顺手的下一步','Action popup','components','输入与操作','free','popup','需要的时候出现，完成之后轻轻收起。',['从触发位置展开快捷菜单','点击外部或 Escape 关闭','选择操作后给出反馈'],'#f4f0eb'),
('phrase-switch','文字里的可能性','Phrase switch','components','品牌与展示','free','phrase','一个小小的变化，让一句话有更多表达。',['点击高亮词切换文案','固定句式与高亮区域','按下缩放反馈'],'#eef0fb'),
('live-checklist','会呼吸的清单','Live checklist','components','输入与操作','pro','list','完成、整理、向前，一切都在你的指尖。',['勾选完成后文字划线','完成计数实时更新','拖动排序，并提供键盘可操作的上移按钮'],'#f2f1ec'),
('halo-bands','引力光环','Halo bands','components','品牌与展示','pro','halo','用光、空间与层次，留住第一眼的注意力。',['多层椭圆光环与核心辉光','点击按钮改变光环倾角','减少动态偏好下立即切换'],'#e8ecff'),
('goal-rings','看得见的进步','Goal rings','components','数据与图表','free','rings','让进度有形，让每一点努力被看见。',['拖动滑杆控制 0–100% 进度','圆环与中心数字同步','圆弧使用圆角描边与平滑过渡'],'#f0f2ec'),
('diff-review','更好的那个版本','Diff review','components','AI 与对话','pro','diff','把变化摆在一起，让每次决定都有依据。',['增删文案以符号与颜色共同区分','接受和忽略均有明确结果','决策后禁用操作避免重复提交'],'#f3efec'),
('agent-workspace','思考工作台','Agent workspace','blocks','AI 工作区','free','agent-workspace','从输入到模型选择，组合一个完整的思考入口。',['包含输入框、附件和模型选择','桌面双栏布局','各模块独立响应输入'],'#edf0f7'),
('analytics-overview','数据概览区块','Analytics overview','blocks','数据工作区','pro','analytics','把关键趋势和目标进度，放在同一眼里。',['可点击柱形图','可调整目标进度环','一致的数字与卡片层级'],'#f1f3ef'),
('content-review','内容审阅面板','Content review','blocks','AI 工作区','pro','review-panel','从修改建议，到保留自己的表达。',['差异比较与接受操作','可编辑笔记与历史回溯','窄屏中内容保持可读'],'#f5f0ec'),
('project-planning','项目规划区块','Project planning','blocks','效率工具','free','project-panel','把计划和素材放在一起，开始真正的创造。',['勾选任务、排序与计数','文件拖入与文件信息显示','双栏工作区域'],'#f1f1ec'),
('pricing-section','简洁方案对比','Pricing section','blocks','品牌与展示','pro','pricing','让方案之间的选择，直观而清楚。',['双方案价格与权益对比','推荐方案使用强调边框','选择动作定位到说明区域，未接入支付'],'#f0f1fa'),
('halo-hero','引力首屏','Halo hero','blocks','品牌与展示','pro','hero-block','从一句话到一束光，建立有记忆点的首屏。',['标题、说明、主操作的层级','主操作滚动到内容区','可切换倾角的光环视觉'],'#ecf0fa'),
('studio-dashboard','创作工作室','Studio dashboard','templates','产品模板','pro','saas-template','一个完整的工作室总览，从导航到每天的进步。',['侧栏与工作区布局','可操作趋势图、进度环和任务清单','响应式分栏与自然滚动'],'#edeef2'),
('studio-landing','灵感品牌页','Studio landing','templates','品牌模板','free','landing-template','有留白、有引力，也有清楚的下一步。',['品牌导航、引力首屏与特性区','滚动定位主操作','可交互光环背景'],'#eef0f5'),
('ai-workspace','AI 对话空间','AI workspace','templates','产品模板','pro','ai-template','从第一次输入开始，构建一个平静的 AI 工作空间。',['侧栏、对话输入与模型选择','附件选择与提交反馈','支持长内容与窄视口布局'],'#edf0f7')]
items=[]
for id,title,en,type,category,tier,demo,description,specs,bg in rows:
 prompt=f'''请为我的项目实现「{title} / {en}」{'组件' if type=='components' else '区块' if type=='blocks' else '页面模板'}。

目标
{description}
请先依据项目已有框架、组件约定和设计变量实现，保留当前产品品牌，替换成真实业务内容。

布局与视觉
以温暖的浅灰背景承托白色界面，强调色 #4058F4。圆角 12–18px，1px 低对比边框与轻柔阴影；间距采用 8px 基础单位。主信息优先，辅助信息降低对比。正文 14–16px，中文行高 1.6，数字使用等宽数字。界面随容器宽度自然伸缩，不通过缩小整页适配手机。

必须实现的行为
'''+ '\n'.join(f'{i+1}. {s}' for i,s in enumerate(specs))+'''

交互与动效
按钮按下立即缩放到 0.97，约 160ms 恢复；状态切换使用 180–250ms 的减速过渡，大面板进入 300ms。状态立即更新，动画可以被连续操作打断。尊重 prefers-reduced-motion。悬停、按下、键盘焦点、选中和禁用必须可以区分。

边界与可访问性
使用语义化按钮、表单与 label，为纯图标提供可访问名称。支持 Tab 和 Enter，弹层支持 Escape 并恢复触发按钮焦点。空输入、长文案、连续操作和窄屏都要正确处理。错误时保留已有内容。不得伪造后端调用或支付成功。

验收
交付可以直接运行的实现，说明依赖与接入方式。在桌面与手机实际操作主要流程，检查 200% 缩放、减少动态设置、键盘访问和重复操作。将演示数据与真实业务接入点分开。
'''
 items.append(dict(id=id,title=title,en=en,type=type,category=category,tier=tier,demo=demo,description=description,specs=specs,background=bg,prompt=prompt))
(root/'data/catalog.json').write_text(json.dumps(items,ensure_ascii=False,indent=2)+'\n')
