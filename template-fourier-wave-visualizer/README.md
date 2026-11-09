# template-fourier-wave-visualizer

> 由 ds-remotion-dashboard 从「【vibe知识大赏】傅立叶变换，终于有人把它讲明白了」沉淀的可复用 Remotion 模版。

## 内容标签
`科技` `教育` `数学` `科普` `可视化`

## 风格与动画形式
- 风格：科技感 HUD
- 动画主体形式：数据可视化
- 摘要：以波形叠加与频谱分解为核心，用动态图表直观演示傅立叶变换的抽象概念，节奏清晰、科技感强。

## 合成结构
- 分辨率：1920×1080
- 帧率：30 fps
- 时长：180 帧（约 6 秒）
- 关键动画：`标题与介绍文字淡入上滑`、`多组正弦波叠加循环动画`、`频谱柱状图随波形实时变化`、`HUD 网格扫描与脉冲点循环`、`公式高亮与关键参数标注`

## 使用场景
- 科技 类短片的片头 / 转场 / 循环背景元素。

## 如何使用
在模版目录内（node_modules 复用 remotion 环境）：

```bash
pnpm render            # 或 npm run render
# 等价于：remotion render src/index.ts MainTemplate preview.mp4
```

## 自定义
修改 `src/Composition.tsx` 中 `TemplateComposition` 的 `defaultProps`（标题/副标题/配色），
即可在不改动画逻辑的情况下复用本模版。

- 主色：`#22d3ee` → `#3b82f6`
- 背景：`#020617` → `#0f172a`

## 来源
源视频：https://www.youtube.com/watch?v=TrCg2Bpvw4Y

