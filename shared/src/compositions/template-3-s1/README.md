# template-3-s1

> 由 ds-remotion-dashboard 从「《话术博弈》如何优雅的套出对方的真心话？」沉淀的可复用 Remotion 模版（共享工程结构：组件位于 shared/src/compositions/template-3-s1/）。

## 内容标签
`章节标题` `金色大字` `居中排版`

## 风格与动画形式
- 风格：黑金章节标题卡
- 动画主体形式：标题入场
- 模版来源：文字排版
- 摘要：纯黑背景中央，顶部细线框住小字「第 四 层」，下方超大号金色衬线体汉字「回音留白」横向排列，上下各一条暗金细横线收束，整体庄重如书籍章节页，文字淡入呈现。

## 合成结构
- 分辨率：1920×1080
- 帧率：30 fps
- 时长：180 帧（约 6 秒）
- 关键动画：见 TemplateComponent.tsx

## 参考帧（原视频关键帧，供对照修改）
![uni_002.jpg](refs/uni_002.jpg)

## 使用场景
- 章节标题 类短片，可作为片头 / 转场 / 循环背景元素复用。

## 如何渲染
在共享工程 `shared/` 目录下：

```bash
cd shared
npx remotion render src/index.ts template-3-s1 src/compositions/template-3-s1/preview.mp4
```

## 自定义
- 文案/配色：改 `meta.json` 的 `defaultProps`（title/subtitle/bgFrom/bgTo/accentFrom/accentTo），不动动画逻辑。
- 动画逻辑：改 `TemplateComponent.tsx`（可对照 refs/ 下的原视频关键帧微调）。

- 主色：`#38bdf8` → `#818cf8`
- 背景：`#0f172a` → `#020617`

## 来源
源视频：https://www.bilibili.com/video/BV1yVn16XEz7/?spm_id_from=333.337.search-card.all.click

