// 模版注册表：由沉淀流程（ds-remotion-dashboard）自动重写，请勿手改。
import type { ComponentType } from "react";
import type { TemplateProps } from "../lib/props";


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
];
