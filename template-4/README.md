# template-4

> 由 ds-remotion-dashboard 从「局部最优」沉淀的可复用 Remotion 模版。

## 内容标签
`教育` `数学` `算法` `科技` `AI` `科普`

## 风格与动画形式
- 风格：扁平插画
- 动画主体形式：数据可视化
- 模版变体：数据可视化
- 摘要：以函数曲线与坐标系演示梯度下降过程，动点沿曲线滑动落入局部最优凹陷处，节奏平稳、图解式的理科科普动画语言。

## 合成结构
- 分辨率：1920×1080
- 帧率：30 fps
- 时长：180 帧（约 6 秒）
- 关键动画：`坐标系与函数曲线 SVG 路径描边生长动画`、`动点沿曲线梯度下降步进滑动（带下降箭头/轨迹虚线）`、`动点落入局部最优凹陷处并高亮标记`、`最优点循环脉冲光环强调`、`标题与标注文字淡入上滑`

## 使用场景
- 教育 类短片，可作为片头 / 转场 / 循环背景元素复用。

## 如何使用
在模版目录内（node_modules 复用 remotion 环境）：

```bash
pnpm render            # 或 npm run render
# 等价于：remotion render src/index.ts MainTemplate preview.mp4
```

## 自定义
修改 `src/Composition.tsx` 中 `TemplateComposition` 的 `defaultProps`（标题/配色/合成参数），
即可在不改动画逻辑的情况下复用本模版。动画主体组件（如波形、粒子、旋转卡片）在文件内按需调整参数。

- 主色：`#f97316` → `#fbbf24`
- 背景：`#fef3c7` → `#fde68a`

## 来源
源视频：https://www.xiaohongshu.com/discovery/item/6ad0af11000000001802eef9?source=webshare&xhsshare=pc_web&xsec_token=ABDSMghjAJ0BdlgUn5PQ7Amvzp4EuaVYAj83oYJAAFOBI=&xsec_source=pc_share

