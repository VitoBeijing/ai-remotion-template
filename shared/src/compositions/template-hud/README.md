# template-hud

> 由 ds-remotion-dashboard 从「【vibe知识大赏】傅立叶变换，终于有人把它讲明白了」沉淀的可复用 Remotion 模版（共享工程结构：组件位于 shared/src/compositions/template-hud/）。

## 内容标签
`科普` `知识` `数学` `优化` `局部最优`

## 风格与动画形式
- 风格：科技感 HUD
- 动画主体形式：数据可视化
- 模版来源：数据可视化
- 摘要：以波形叠加与频谱分解为核心，用动态图表直观演示傅立叶变换的抽象概念，节奏清晰、科技感强。

## 合成结构
- 分辨率：1920×1080
- 帧率：30 fps
- 时长：180 帧（约 6 秒）
- 关键动画：`标题与介绍文字淡入上滑`、`多组正弦波叠加循环动画`、`频谱柱状图随波形实时变化`、`HUD 网格扫描与脉冲点循环`、`公式高亮与关键参数标注`

## 使用场景
- 科普 类短片，可作为片头 / 转场 / 循环背景元素复用。

## 如何渲染
在共享工程 `shared/` 目录下：

```bash
cd shared
npx remotion render src/index.ts template-hud src/compositions/template-hud/preview.mp4
```

## 自定义
- 文案/配色：改 `meta.json` 的 `defaultProps`（title/subtitle/bgFrom/bgTo/accentFrom/accentTo），不动动画逻辑。
- 动画逻辑：改 `TemplateComponent.tsx`（可对照 refs/ 下的原视频关键帧微调）。

- 主色：`#22d3ee` → `#3b82f6`
- 背景：`#020617` → `#0f172a`

## 来源
源视频：https://www.youtube.com/watch?v=TrCg2Bpvw4Y

