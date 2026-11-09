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

// 背景：柔和径向渐变
const Background: React.FC<Props> = ({ bgFrom, bgTo }) => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, ${bgFrom} 0%, ${bgTo} 100%)` }} />
);

// 主标题：淡入 + 上滑 + 轻微缩放
const Title: React.FC<Props> = ({ title, bgFrom }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const translateY = interpolate(frame, [0, fps], [80, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const scale = interpolate(frame, [0, fps], [0.92, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  return (
    <div style={{ opacity, transform: `translateY(${translateY}px) scale(${scale})`, fontFamily: FONT_STACK, fontSize: 140, fontWeight: 800, letterSpacing: -4, textAlign: "center", color: accentText(bgFrom) }}>{title}</div>
  );
};

// 渐变强调条：横向展开
const AccentBar: React.FC<Props> = ({ accentFrom, accentTo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const width = interpolate(frame, [0.5 * fps, 2 * fps], [0, 640], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  return <div style={{ width, height: 10, borderRadius: 999, background: `linear-gradient(90deg, ${accentFrom} 0%, ${accentTo} 100%)` }} />;
};

// 副标题：稍后淡入
const Subtitle: React.FC<Props> = ({ subtitle, bgFrom }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [1.2 * fps, 2.2 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  return <div style={{ opacity, fontFamily: FONT_STACK, fontSize: 48, fontWeight: 500, letterSpacing: 2, textAlign: "center", color: accentText(bgFrom, 0.7) }}>{subtitle}</div>;
};

// 底部进度点：循环脉冲
const ProgressDot: React.FC<{ index: number; total: number; accentFrom?: string }> = ({ index, total, accentFrom }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cycle = fps * 1.5;
  const phase = (frame + (index / total) * cycle) % cycle;
  const opacity = interpolate(phase, [0, cycle / 2, cycle], [0.15, 1, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ width: 16, height: 16, borderRadius: 999, backgroundColor: accentFrom, opacity }} />;
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
      durationInFrames={450}
      fps={30}
      width={1920}
      height={1080}
      calculateMetadata={calculateMetadata}
      defaultProps={{ title: "「Vibe知识大赏」看懂了熵增 ，就原谅了生", subtitle: "扁平插画 · 文字排版动画", bgFrom: "#fef3c7", bgTo: "#fde68a", accentFrom: "#f97316", accentTo: "#fbbf24" }}
    />
  );
};

export const TemplateComponent: React.FC<Props> = (props) => {
  const { title, subtitle, bgFrom, bgTo, accentFrom, accentTo } = props;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 48 }}>
      <Background bgFrom={bgFrom} bgTo={bgTo} />
      <Title title={title} bgFrom={bgFrom} />
      <AccentBar accentFrom={accentFrom} accentTo={accentTo} />
      <Subtitle subtitle={subtitle} bgFrom={bgFrom} />
      <div style={{ display: "flex", gap: 20, marginTop: 40 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <ProgressDot key={i} index={i} total={5} accentFrom={accentFrom} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
