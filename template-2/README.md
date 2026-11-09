# template-2

> 由 ds-remotion-dashboard 从「局部最优」沉淀的可复用 Remotion 模版。

## 内容标签
`科普` `知识` `数学` `优化` `局部最优`

## 风格与动画形式
- 风格：极简排版
- 动画主体形式：数据可视化
- 模版来源：数据可视化
- 摘要：以简洁的函数曲线图表演示局部最优概念，动点沿曲面滑动展示寻优过程，配合文字注解层层推进，节奏理性克制。

## 合成结构
- 分辨率：1920×1080
- 帧率：30 fps
- 时长：180 帧（约 6 秒）
- 关键动画：`标题淡入上滑`、`渐变强调条展开`、`循环脉冲点`

## 参考帧（原视频关键帧，供对照修改）
![frame_001.jpg](refs/frame_001.jpg)
![frame_002.jpg](refs/frame_002.jpg)
![frame_003.jpg](refs/frame_003.jpg)
![frame_004.jpg](refs/frame_004.jpg)

## 使用场景
- 科普 类短片，可作为片头 / 转场 / 循环背景元素复用。

## 如何使用
在模版目录内（node_modules 复用 remotion 环境）：

```bash
pnpm render            # 或 npm run render
# 等价于：remotion render src/index.ts MainTemplate preview.mp4
```

## 自定义
修改 `src/Composition.tsx` 中 `TemplateComposition` 的 `defaultProps`（标题/配色/合成参数），
即可在不改动画逻辑的情况下复用本模版。动画主体组件在文件内按需调整参数；
可对照 refs/ 下的原视频关键帧，微调元素位置/颜色/节奏。

- 主色：`#0f172a` → `#334155`
- 背景：`#f8fafc` → `#e2e8f0`

## 来源
源视频：https://www.xiaohongshu.com/discovery/item/6ad0af11000000001802eef9?source=webshare&xhsshare=pc_web&xsec_token=ABDSMghjAJ0BdlgUn5PQ7Amvzp4EuaVYAj83oYJAAFOBI=&xsec_source=pc_share

