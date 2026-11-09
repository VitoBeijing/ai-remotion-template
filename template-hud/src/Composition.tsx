import {
  AbsoluteFill,
  Composition,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { CalculateMetadataFunction } from "remotion";

type Props = {
  title?: string;
  subtitle?: string;
  bgFrom?: string;
  bgTo?: string;
  accentFrom?: string;
  accentTo?: string;
};

const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif';

const calculateMetadata: CalculateMetadataFunction<Props> = () => ({});

// HUD 网格背景 + 循环扫描线
const HudGrid: React.FC<{ accentFrom?: string }> = ({ accentFrom }) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const scanY = ((frame % (fps * 3)) / (fps * 3)) * height;
  return (
    <AbsoluteFill
      style={{
        backgroundImage:
          "linear-gradient(rgba(34,211,238,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.12) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: scanY,
          height: 2,
          background: accentFrom,
          opacity: 0.35,
        }}
      />
    </AbsoluteFill>
  );
};

// 多组正弦波叠加（SVG，相位随帧推进）
const WaveForm: React.FC<{ accentFrom?: string; accentTo?: string }> = ({ accentFrom, accentTo }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const N = 240;
  const pts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const x = (i / N) * width;
    const u = x / width;
    const y =
      height / 2 +
      Math.sin(u * Math.PI * 2 * 2 + t * 2.0) * 46 +
      Math.sin(u * Math.PI * 2 * 3 + t * 3.4) * 28 +
      Math.sin(u * Math.PI * 2 * 5 + t * 5.2) * 14;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", inset: 0 }}>
      <polyline points={pts.join(" ")} fill="none" stroke={accentFrom} strokeWidth={3} strokeLinejoin="round" />
      <polyline points={pts.join(" ")} fill="none" stroke={accentTo} strokeWidth={1} opacity={0.4} />
    </svg>
  );
};

// 频谱柱状图（高度随帧 + 频率变化）
const Spectrum: React.FC<{ accentFrom?: string; accentTo?: string }> = ({ accentFrom, accentTo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bars = Array.from({ length: 36 });
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 150 }}>
      {bars.map((_, i) => {
        const h = 36 + Math.abs(Math.sin(frame / (fps * 0.6) + i * 0.45)) * 108;
        return (
          <div
            key={i}
            style={{
              width: 11,
              height: h,
              borderRadius: 4,
              background: `linear-gradient(180deg, ${accentFrom}, ${accentTo})`,
              opacity: 0.85,
            }}
          />
        );
      })}
    </div>
  );
};

// 主标题：淡入上滑
const Title: React.FC<Props> = ({ title, bgFrom }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const translateY = interpolate(frame, [0, fps], [60, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  return (
    <div style={{ opacity, transform: `translateY(${translateY}px)`, fontFamily: FONT_STACK, fontSize: 72, fontWeight: 800, letterSpacing: -2, textAlign: "center", color: accentText(bgFrom), textShadow: "0 0 24px rgba(34,211,238,0.35)" }}>{title}</div>
  );
};

const Subtitle: React.FC<Props> = ({ subtitle, bgFrom }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [1 * fps, 2 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  return <div style={{ opacity, fontFamily: FONT_STACK, fontSize: 26, fontWeight: 500, letterSpacing: 3, textAlign: "center", color: accentText(bgFrom, 0.65) }}>{subtitle}</div>;
};

function accentText(bg: string | undefined, alpha = 1) {
  const c = (bg ?? "#0f172a").replace("#", "");
  const n = c.length === 3 ? c.split("").map((x) => parseInt(x + x, 16)) : [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)];
  const lum = 0.2126 * (n[0] ?? 0) + 0.7152 * (n[1] ?? 0) + 0.0722 * (n[2] ?? 0);
  return lum > 140 ? `rgba(15,23,42,${alpha})` : `rgba(248,250,252,${alpha})`;
}


export const TemplateComposition = () => {
  return (
    <Composition
      id="MainTemplate"
      component={TemplateComponent}
      durationInFrames={180}
      fps={30}
      width={1920}
      height={1080}
      calculateMetadata={calculateMetadata}
      defaultProps={{ title: "【vibe知识大赏】傅立叶变换，终于有人把它讲明白了", subtitle: "科技感 HUD · 数据可视化", bgFrom: "#020617", bgTo: "#0f172a", accentFrom: "#22d3ee", accentTo: "#3b82f6" }}
    />
  );
};

export const TemplateComponent: React.FC<Props> = (props) => {
  const { title, subtitle, bgFrom, bgTo, accentFrom, accentTo } = props;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 30%, ${bgFrom} 0%, ${bgTo} 100%)`,
        justifyContent: "center",
        alignItems: "center",
        gap: 34,
        overflow: "hidden",
      }}
    >
      <HudGrid accentFrom={accentFrom} />
      <Title title={title} bgFrom={bgFrom} />
      <Subtitle subtitle={subtitle} bgFrom={bgFrom} />
      <div style={{ width: "86%", height: 260, position: "relative" }}>
        <WaveForm accentFrom={accentFrom} accentTo={accentTo} />
      </div>
      <Spectrum accentFrom={accentFrom} accentTo={accentTo} />
    </AbsoluteFill>
  );
};
