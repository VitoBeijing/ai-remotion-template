# template

> 由 ds-remotion-dashboard 从「Big_Buck_Bunny_360_10s_1MB」沉淀的可复用 Remotion 模版。

## 内容标签
`通用`

## 风格与动画形式
- 风格：极简排版
- 动画主体形式：文字排版动画
- 摘要：规则模式：仅依据标题生成的粗略判断，请在人工确认工作台核对关键帧后修正。

## 合成结构
- 分辨率：1920×1080
- 帧率：30 fps
- 时长：180 帧（约 6 秒）
- 关键动画：`标题淡入上滑`、`渐变强调条展开`、`循环脉冲点`

## 使用场景
- 通用 类短片的片头 / 转场 / 循环背景元素。

## 如何使用
在模版目录内（node_modules 复用 remotion 环境）：

```bash
pnpm render            # 或 npm run render
# 等价于：remotion render src/index.ts MainTemplate preview.mp4
```

## 自定义
修改 `src/Composition.tsx` 中 `TemplateComposition` 的 `defaultProps`（标题/副标题/配色），
即可在不改动画逻辑的情况下复用本模版。

- 主色：`#0f172a` → `#334155`
- 背景：`#f8fafc` → `#e2e8f0`

## 来源
源视频：https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4

