// 模版组件可复用的公共动画工具。

export const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif';

/** 确定性伪随机（帧驱动动画禁用 Math.random，保证可复现渲染）。 */
export function seeded(i: number): number {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** 明暗感知文字色：亮底用深字，暗底用浅字。 */
export function accentText(bg: string | undefined, alpha = 1): string {
  const c = (bg ?? "#0f172a").replace("#", "");
  const n =
    c.length === 3
      ? c.split("").map((x) => parseInt(x + x, 16))
      : [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)];
  const lum = 0.2126 * (n[0] ?? 0) + 0.7152 * (n[1] ?? 0) + 0.0722 * (n[2] ?? 0);
  return lum > 140 ? `rgba(15,23,42,${alpha})` : `rgba(248,250,252,${alpha})`;
}
