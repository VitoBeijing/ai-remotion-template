import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { TemplateProps } from "../../lib/props";
import { FONT_STACK, accentText } from "../../lib/anim";


const Background: React.FC<TemplateProps> = ({ bgFrom, bgTo }) => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, ${bgFrom} 0%, ${bgTo} 100%)` }} />
);

const Title: React.FC<TemplateProps> = ({ title, bgFrom }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const translateY = interpolate(frame, [0, fps], [80, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const scale = interpolate(frame, [0, fps], [0.92, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  return <div style={{ opacity, transform: `translateY(${translateY}px) scale(${scale})`, fontFamily: FONT_STACK, fontSize: 140, fontWeight: 800, letterSpacing: -4, textAlign: "center", color: accentText(bgFrom) }}>{title}</div>;
};

const AccentBar: React.FC<TemplateProps> = ({ accentFrom, accentTo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const width = interpolate(frame, [0.5 * fps, 2 * fps], [0, 640], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  return <div style={{ width, height: 10, borderRadius: 999, background: `linear-gradient(90deg, ${accentFrom} 0%, ${accentTo} 100%)` }} />;
};

const Subtitle: React.FC<TemplateProps> = ({ subtitle, bgFrom }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [1.2 * fps, 2.2 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  return <div style={{ opacity, fontFamily: FONT_STACK, fontSize: 48, fontWeight: 500, letterSpacing: 2, textAlign: "center", color: accentText(bgFrom, 0.7) }}>{subtitle}</div>;
};

const ProgressDot: React.FC<{ index: number; total: number; accentFrom?: string }> = ({ index, total, accentFrom }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cycle = fps * 1.5;
  const phase = (frame + (index / total) * cycle) % cycle;
  const opacity = interpolate(phase, [0, cycle / 2, cycle], [0.15, 1, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ width: 16, height: 16, borderRadius: 999, backgroundColor: accentFrom, opacity }} />;
};

export const TemplateComponent: React.FC<TemplateProps> = (props) => {
  const { title, subtitle, bgFrom, bgTo, accentFrom, accentTo } = props;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 48 }}>
      <Background bgFrom={bgFrom} bgTo={bgTo} />
      <Title title={title} bgFrom={bgFrom} />
      <AccentBar accentFrom={accentFrom} accentTo={accentTo} />
      <Subtitle subtitle={subtitle} bgFrom={bgFrom} />
      <div style={{ display: "flex", gap: 20, marginTop: 40 }}>
        {Array.from({ length: 5 }).map((_, i) => <ProgressDot key={i} index={i} total={5} accentFrom={accentFrom} />)}
      </div>
    </AbsoluteFill>
  );
};
