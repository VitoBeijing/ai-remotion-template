// 模版注册表：由沉淀流程（ds-remotion-dashboard）自动重写，请勿手改。
import type { ComponentType } from "react";
import type { TemplateProps } from "../lib/props";

import { TemplateComponent as C0 } from "./template/TemplateComponent";
import { TemplateComponent as C1 } from "./template-2/TemplateComponent";
import { TemplateComponent as C2 } from "./template-hud/TemplateComponent";

export type RegistryEntry = {
  id: string;
  Component: ComponentType<TemplateProps>;
  durationInFrames: number;
  fps: number;
  width: number;
  height: number;
  defaultProps: TemplateProps;
};

export const REGISTRY: RegistryEntry[] = [
  { id: "template", Component: C0, durationInFrames: 450, fps: 30, width: 1920, height: 1080, defaultProps: {"title":"「Vibe知识大赏」看懂了熵增 ，就原谅了生","subtitle":"扁平插画 · 文字排版动画","bgFrom":"#fef3c7","bgTo":"#fde68a","accentFrom":"#f97316","accentTo":"#fbbf24"} },
  { id: "template-2", Component: C1, durationInFrames: 180, fps: 30, width: 1920, height: 1080, defaultProps: {"title":"【vibe知识大赏】傅立叶变换，终于有人把它讲明白了","subtitle":"极简排版 · 文字排版动画","bgFrom":"#f8fafc","bgTo":"#e2e8f0","accentFrom":"#0f172a","accentTo":"#334155"} },
  { id: "template-hud", Component: C2, durationInFrames: 180, fps: 30, width: 1920, height: 1080, defaultProps: {"title":"【vibe知识大赏】傅立叶变换，终于有人把它讲明白了","subtitle":"科技感 HUD · 数据可视化","bgFrom":"#020617","bgTo":"#0f172a","accentFrom":"#22d3ee","accentTo":"#3b82f6"} },
];
