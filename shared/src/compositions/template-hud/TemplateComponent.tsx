import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { TemplateProps } from "../../lib/props";
import { FONT_STACK, accentText } from "../../lib/anim";


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
      <div style={{ position: "absolute", left: 0, right: 0, top: scanY, height: 2, background: accentFrom, opacity: 0.35 }} />
    </AbsoluteFill>
  );
};

const WaveForm: React.FC<{ accentFrom?: string; accentTo?: string }> = ({ accentFrom, accentTo }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const N = 240;
  const pts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const x = (i / N) * width;
    const u = x / width;
    const y = height / 2 + Math.sin(u * Math.PI * 2 * 2 + t * 2.0) * 46 + Math.sin(u * Math.PI * 2 * 3 + t * 3.4) * 28 + Math.sin(u * Math.PI * 2 * 5 + t * 5.2) * 14;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", inset: 0 }}>
      <polyline points={pts.join(" ")} fill="none" stroke={accentFrom} strokeWidth={3} strokeLinejoin="round" />
      <polyline points={pts.join(" ")} fill="none" stroke={accentTo} strokeWidth={1} opacity={0.4} />
    </svg>
  );
};

const Spectrum: React.FC<{ accentFrom?: string; accentTo?: string }> = ({ accentFrom, accentTo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 150 }}>
      {Array.from({ length: 36 }).map((_, i) => {
        const h = 36 + Math.abs(Math.sin(frame / (fps * 0.6) + i * 0.45)) * 108;
        return <div key={i} style={{ width: 11, height: h, borderRadius: 4, background: `linear-gradient(180deg, ${accentFrom}, ${accentTo})`, opacity: 0.85 }} />;
      })}
    </div>
  );
};

const Title: React.FC<TemplateProps> = ({ title, bgFrom }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const translateY = interpolate(frame, [0, fps], [60, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  return <div style={{ opacity, transform: `translateY(${translateY}px)`, fontFamily: FONT_STACK, fontSize: 72, fontWeight: 800, letterSpacing: -2, textAlign: "center", color: accentText(bgFrom), textShadow: "0 0 24px rgba(34,211,238,0.35)" }}>{title}</div>;
};

const Subtitle: React.FC<TemplateProps> = ({ subtitle, bgFrom }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [1 * fps, 2 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  return <div style={{ opacity, fontFamily: FONT_STACK, fontSize: 26, fontWeight: 500, letterSpacing: 3, textAlign: "center", color: accentText(bgFrom, 0.65) }}>{subtitle}</div>;
};

export const TemplateComponent: React.FC<TemplateProps> = (props) => {
  const { title, subtitle, bgFrom, bgTo, accentFrom, accentTo } = props;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 30%, ${bgFrom} 0%, ${bgTo} 100%)`, justifyContent: "center", alignItems: "center", gap: 34, overflow: "hidden" }}>
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
