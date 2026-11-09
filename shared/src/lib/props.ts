// 所有模版组件统一接收的 Props。沉淀流程生成的 TemplateComponent 都遵守此契约。
export type TemplateProps = {
  title?: string;
  subtitle?: string;
  bgFrom?: string;
  bgTo?: string;
  accentFrom?: string;
  accentTo?: string;
};
