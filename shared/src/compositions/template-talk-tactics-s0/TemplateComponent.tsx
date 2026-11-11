import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
} from "remotion";
import { TemplateProps } from "../../lib/props";

const FONT_STACK =
  '"PingFang SC","Microsoft YaHei","Noto Sans CJK SC","Source Han Sans SC",system-ui,sans-serif';

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const CharReveal: React.FC<{
  text: string;
  startFrame: number;
  spacing?: number;
  charDelay?: number;
  charDuration?: number;
  color: string;
  fontSize: number;
  fontWeight?: number;
  letterSpacing?: number;
}> = ({
  text,
  startFrame,
  spacing = 0,
  charDelay = 4,
  charDuration = 16,
  color,
  fontSize,
  fontWeight = 500,
  letterSpacing = 0,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "baseline",
        gap: spacing,
        color,
        fontSize,
        fontWeight,
        fontFamily: FONT_STACK,
        letterSpacing,
        lineHeight: 1.25,
        whiteSpace: "nowrap",
      }}
    >
      {Array.from(text).map((ch, i) => {
        const local = frame - startFrame - i * charDelay;
        const opacity = interpolate(local, [0, charDuration * 0.45], [0, 1], clamp);
        const y = interpolate(local, [0, charDuration], [26, 0], {
          ...clamp,
          easing: (t) => 1 - Math.pow(1 - t, 3),
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity,
              transform: `translateY(${y}px)`,
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};

export const TemplateComponent: React.FC<TemplateProps> = (props) => {
  const frame = useCurrentFrame();

  const title = props.title ?? "话术博弈";
  const subtitle = props.subtitle ?? "如何优雅地套出对方真心话";
  const bgFrom = props.bgFrom ?? "#f7e8c3";
  const bgTo = props.bgTo ?? "#d9c58f";
  const accentFrom = props.accentFrom ?? "#d97b2b";
  const accentTo = props.accentTo ?? "#c25a10";

  const titleSpring = spring({
    frame,
    fps: 30,
    config: { damping: 13, stiffness: 120, mass: 0.9 },
  });
  const titleScale = interpolate(titleSpring, [0, 1], [0.62, 1], clamp);
  const titleOpacity = interpolate(frame, [0, 12], [0, 1], clamp);
  const titleBlur = interpolate(frame, [0, 14], [10, 0], clamp);

  const lineProgress = spring({
    frame: frame - 38,
    fps: 30,
    config: { damping: 22, stiffness: 110, mass: 0.7 },
  });
  const lineWidth = interpolate(lineProgress, [0, 1], [0, 620], clamp);
  const lineOpacity = interpolate(frame, [38, 48], [0, 1], clamp);

  const glowOpacity = interpolate(
    frame,
    [30, 52, 80],
    [0, 0.5, 0.3],
    clamp
  );

  const bgDrift = interpolate(frame, [0, 135], [0, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${bgFrom} 0%, ${bgTo} 58%, #c9b378 100%)`,
        fontFamily: FONT_STACK,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 42%, rgba(255,255,255,0.35), transparent 34%), radial-gradient(circle at 18% 12%, rgba(255,255,255,0.28), transparent 24%), radial-gradient(circle at 84% 84%, rgba(217,123,43,0.12), transparent 26%)`,
          opacity: 0.95,
        }}
      />

      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, opacity: 0.14 }}
      >
        <defs>
          <linearGradient id="gridFade" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8a6a2a" stopOpacity="0.06" />
            <stop offset="55%" stopColor="#8a6a2a" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#8a6a2a" stopOpacity="0" />
          </linearGradient>
        </defs>
        {Array.from({ length: 13 }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={i * 160 + bgDrift * 18}
            y1="0"
            x2={i * 160 - 120 + bgDrift * 18}
            y2="1080"
            stroke="url(#gridFade)"
            strokeWidth="1"
          />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={i * 150 + 40}
            x2="1920"
            y2={i * 150 - 20}
            stroke="url(#gridFade)"
            strokeWidth="1"
          />
        ))}
      </svg>

      <div
        style={{
          position: "absolute",
          left: 120,
          top: 92,
          display: "flex",
          alignItems: "center",
          gap: 18,
          opacity: interpolate(frame, [10, 26], [0, 1], clamp),
          transform: `translateY(${interpolate(frame, [10, 28], [16, 0], clamp)}px)`,
        }}
      >
        <div
          style={{
            width: 46,
            height: 6,
            borderRadius: 999,
            background: `linear-gradient(90deg, ${accentFrom}, ${accentTo})`,
            boxShadow: `0 0 18px rgba(217, 123, 43, 0.3)`,
          }}
        />
        <div
          style={{
            color: "rgba(255,255,255,0.72)",
            fontSize: 22,
            letterSpacing: 6,
            fontWeight: 500,
          }}
        >
          DIALOGUE TACTICS
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 128,
          top: 92,
          display: "flex",
          alignItems: "center",
          gap: 12,
          opacity: interpolate(frame, [16, 32], [0, 1], clamp),
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
            boxShadow: `0 0 16px rgba(194, 90, 16, 0.45)`,
          }}
        />
        <div
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: 20,
            letterSpacing: 4,
          }}
        >
          01 / 02
        </div>
      </div>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "0 180px",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 34,
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 1100,
              height: 420,
              borderRadius: 40,
              background: `radial-gradient(circle, rgba(255,255,255,${glowOpacity}), transparent 68%)`,
              filter: "blur(18px)",
              transform: "translateY(-20px)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              opacity: titleOpacity,
              transform: `scale(${titleScale})`,
              filter: `blur(${titleBlur}px)`,
              textShadow: "0 4px 24px rgba(180, 140, 60, 0.35)",
            }}
          >
            <div
              style={{
                color: "#ffffff",
                fontSize: 148,
                fontWeight: 800,
                letterSpacing: 10,
                lineHeight: 1,
                fontFamily: FONT_STACK,
                textShadow: "0 2px 16px rgba(217, 123, 43, 0.4)",
              }}
            >
              {title}
            </div>
          </div>

          <CharReveal
            text={subtitle}
            startFrame={24}
            charDelay={3}
            charDuration={15}
            color="#ffffff"
            fontSize={46}
            fontWeight={600}
            letterSpacing={4}
          />

          <div
            style={{
              marginTop: 10,
              width: lineWidth,
              height: 3,
              borderRadius: 999,
              opacity: lineOpacity,
              background: `linear-gradient(90deg, transparent, ${accentFrom} 18%, ${accentTo} 82%, transparent)`,
              boxShadow: `0 0 22px rgba(217, 123, 43, 0.4)`,
            }}
          />
        </div>
      </AbsoluteFill>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 92,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(frame, [58, 78], [0, 1], clamp),
          transform: `translateY(${interpolate(frame, [58, 82], [18, 0], clamp)}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            color: "rgba(255,255,255,0.68)",
            fontSize: 24,
            letterSpacing: 3,
          }}
        >
          <span
            style={{
              width: 54,
              height: 1,
              background: "rgba(255,255,255,0.3)",
            }}
          />
          <span>把问题拆开，让答案自己浮出来</span>
          <span
            style={{
              width: 54,
              height: 1,
              background: "rgba(255,255,255,0.3)",
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 44,
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 28,
          pointerEvents: "none",
          opacity: interpolate(frame, [6, 24], [0, 1], clamp),
        }}
      />
    </AbsoluteFill>
  );
};
