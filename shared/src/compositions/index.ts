// 模版注册表：由沉淀流程（ds-remotion-dashboard）自动重写，请勿手改。
import type { ComponentType } from "react";
import type { TemplateProps } from "../lib/props";

import { TemplateComponent as C0 } from "./template-hud/TemplateComponent";

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
  { id: "template-hud", Component: C0, durationInFrames: 180, fps: 30, width: 1920, height: 1080, defaultProps: {"title":"【vibe知识大赏】傅立叶变换，终于有人把它讲明白了","subtitle":"科技感 HUD · 数据可视化","bgFrom":"#020617","bgTo":"#0f172a","accentFrom":"#22d3ee","accentTo":"#3b82f6"} },
];
