# template-talk-tactics-s2

> 由 ds-remotion-dashboard 从「《话术博弈》如何优雅的套出对方的真心话？」沉淀的可复用 Remotion 模版（共享工程结构：组件位于 shared/src/compositions/template-talk-tactics-s2/）。

## 内容标签
`要点排版` `逐行滑入` `卡片`

## 风格与动画形式
- 风格：极简排版
- 动画主体形式：文字排版动画
- 模版来源：AI 生成（参考关键帧）
- 摘要：画面切换为浅灰背景，左侧橙色序号“01”弹入，右侧标题“多听少问”及三行正文从左到右逐行滑入，关键词用橙色高亮，卡片白底轻轻上浮。

## 合成结构
- 分辨率：1920×1080
- 帧率：30 fps
- 时长：240 帧（约 8 秒）
- 关键动画：见 TemplateComponent.tsx

## 参考帧（原视频关键帧，供对照修改）
![uni_000.jpg](refs/uni_000.jpg)
![uni_001.jpg](refs/uni_001.jpg)

## 使用场景
- 要点排版 类短片，可作为片头 / 转场 / 循环背景元素复用。

## 如何渲染
在共享工程 `shared/` 目录下：

```bash
cd shared
npx remotion render src/index.ts template-talk-tactics-s2 src/compositions/template-talk-tactics-s2/preview.mp4
```

## 自定义
- 文案/配色：改 `meta.json` 的 `defaultProps`（title/subtitle/bgFrom/bgTo/accentFrom/accentTo），不动动画逻辑。
- 动画逻辑：改 `TemplateComponent.tsx`（可对照 refs/ 下的原视频关键帧微调）。

- 主色：`#0f172a` → `#334155`
- 背景：`#f8fafc` → `#e2e8f0`

## 来源
源视频：https://www.bilibili.com/video/BV1yVn16XEz7/?spm_id_from=333.337.search-card.all.click

