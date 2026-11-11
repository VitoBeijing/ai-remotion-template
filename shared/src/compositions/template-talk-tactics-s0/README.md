# template-talk-tactics-s0

> 由 ds-remotion-dashboard 从「《话术博弈》如何优雅的套出对方的真心话？」沉淀的可复用 Remotion 模版（共享工程结构：组件位于 shared/src/compositions/template-talk-tactics-s0/）。

## 内容标签
`标题入场` `缩放弹入` `深灰蓝`

## 风格与动画形式
- 风格：扁平插画
- 动画主体形式：标题入场
- 模版来源：AI 生成（参考关键帧）
- 摘要：深灰蓝背景中央，白色“话术博弈”四字由小到大弹入，橙色副标题“如何优雅地套出对方真心话”逐字上浮出现，底部一条浅金色细线从左向右划出。

## 合成结构
- 分辨率：1920×1080
- 帧率：30 fps
- 时长：135 帧（约 5 秒）
- 关键动画：见 TemplateComponent.tsx

## 参考帧（原视频关键帧，供对照修改）
![uni_000.jpg](refs/uni_000.jpg)
![uni_001.jpg](refs/uni_001.jpg)

## 使用场景
- 标题入场 类短片，可作为片头 / 转场 / 循环背景元素复用。

## 如何渲染
在共享工程 `shared/` 目录下：

```bash
cd shared
npx remotion render src/index.ts template-talk-tactics-s0 src/compositions/template-talk-tactics-s0/preview.mp4
```

## 自定义
- 文案/配色：改 `meta.json` 的 `defaultProps`（title/subtitle/bgFrom/bgTo/accentFrom/accentTo），不动动画逻辑。
- 动画逻辑：改 `TemplateComponent.tsx`（可对照 refs/ 下的原视频关键帧微调）。

- 主色：`#f97316` → `#fbbf24`
- 背景：`#fef3c7` → `#fde68a`

## 来源
源视频：https://www.bilibili.com/video/BV1yVn16XEz7/?spm_id_from=333.337.search-card.all.click

