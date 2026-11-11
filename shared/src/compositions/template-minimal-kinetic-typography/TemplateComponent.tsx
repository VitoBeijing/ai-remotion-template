import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { TemplateProps } from "../../lib/props";
import { FONT_STACK } from "../../lib/anim";

// 15 white keys, black keys between certain whites (pattern per octave: after 0,1,3,4,5)
const WHITE_COUNT = 15;
const BLACK_AFTER = new Set([0, 1, 3, 4, 5, 7, 8, 10, 11, 12]);

// Pressed white key indices: 0 (do), 4 (mi), 7 (sol), 14 (high mi)
const PRESS_ORDER = [0, 4, 7, 14];
const PRESS_FRAMES = [18, 40, 62, 84];

const Wave: React.FC<{
  x: number;
  width: number;
  freq: number;
  startFrame: number;
  color: string;
  baseY: number;
  drift: number;
}> = ({ x, width, freq, startFrame, color, baseY, drift }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startFrame;
  if (local < 0) return null;

  const appear = spring({ frame: local, fps, config: { damping: 14, stiffness: 160 } });
  const amp = 16 * appear;
  const phase = local * 0.35;
  const points: string[] = [];
  const N = 40;
  for (let i = 0; i <= N; i++) {
    const px = (i / N) * width;
    const py = Math.sin((i / N) * Math.PI * 2 * freq + phase) * amp * Math.sin((i / N) * Math.PI);
    points.push(`${px.toFixed(1)},${py.toFixed(1)}`);
  }
  const driftX = drift * local * 0.4;

  return (
    <g transform={`translate(${x + driftX}, ${baseY})`} opacity={Math.min(1, appear * 1.2)}>
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
};

export const TemplateComponent: React.FC<TemplateProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Light background (original reference frames are white/light gradient)
  const bgFrom = props.bgFrom ?? "#fdfdfd";
  const bgTo = props.bgTo ?? "#eef1f4";
  // Dark blue-navy key color, matching current render
  const accent = props.accentFrom ?? "#1f2c3d";
  const accentDeep = props.accentTo ?? "#16202d";
  // Ink color for strokes/waves
  const ink = "#222222";

  // Keyboard layout — compact abstract keyboard like the render
  const kbWidth = width * 0.4;
  const whiteW = kbWidth / WHITE_COUNT;
  const kbHeight = height * 0.085;
  const blackW = whiteW * 0.55;
  const blackH = kbHeight * 0.6;
  const kbX = (width - kbWidth) / 2;
  const kbY = height * 0.46;

  const keyboardIn = spring({ frame, fps, config: { damping: 16, stiffness: 120 } });
  const kbOpacity = interpolate(keyboardIn, [0, 1], [0, 1]);
  const kbScale = interpolate(keyboardIn, [0, 1], [0.92, 1]);

  const pressAmount = (idx: number) => {
    const k = PRESS_ORDER.indexOf(idx);
    if (k < 0) return 0;
    const local = frame - PRESS_FRAMES[k];
    if (local <= 0) return 0;
    return spring({ frame: local, fps, config: { damping: 12, stiffness: 260 } });
  };

  const subtitle = props.subtitle ?? "";
  const subOpacity = interpolate(frame, [6, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Wave specs: above each pressed key, increasing frequency; later waves drift left & merge
  const waveFreqs = [2, 3.5, 5.5, 8];
  const waves = PRESS_ORDER.map((keyIdx, i) => ({
    keyIdx,
    start: PRESS_FRAMES[i] + 6,
    freq: waveFreqs[i],
    drift: i < 2 ? -0.6 - i * 0.4 : i === 2 ? -0.9 : 0,
  }));

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${bgFrom} 0%, ${bgTo} 100%)`,
        fontFamily: FONT_STACK,
      }}
    >
      {/* Title (top, subtle) */}
      {props.title ? (
        <div
          style={{
            position: "absolute",
            top: height * 0.07,
            width: "100%",
            textAlign: "center",
            color: "rgba(30,30,30,0.85)",
            fontSize: 30,
            letterSpacing: 2,
            opacity: interpolate(frame, [0, 12], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {props.title}
        </div>
      ) : null}

      {/* Keyboard */}
      <div
        style={{
          position: "absolute",
          left: kbX,
          top: kbY,
          width: kbWidth,
          height: kbHeight,
          opacity: kbOpacity,
          transform: `scale(${kbScale})`,
          transformOrigin: "center center",
        }}
      >
        {/* White keys */}
        {Array.from({ length: WHITE_COUNT }).map((_, i) => {
          const p = pressAmount(i);
          return (
            <div
              key={`w-${i}`}
              style={{
                position: "absolute",
                left: i * whiteW,
                top: 0,
                width: whiteW - 2,
                height: kbHeight,
                background:
                  p > 0
                    ? `linear-gradient(180deg, ${accentDeep}, ${accent})`
                    : "#ffffff",
                border: `1.5px solid ${p > 0 ? accentDeep : "#cccccc"}`,
                borderRadius: "0 0 3px 3px",
                boxSizing: "border-box",
                transform: `translateY(${p * 3}px)`,
                boxShadow: p > 0 ? `0 4px 10px rgba(31,44,61,0.25)` : "0 1px 2px rgba(0,0,0,0.06)",
              }}
            />
          );
        })}
        {/* Black keys */}
        {Array.from({ length: WHITE_COUNT - 1 }).map((_, i) => {
          if (!BLACK_AFTER.has(i)) return null;
          return (
            <div
              key={`b-${i}`}
              style={{
                position: "absolute",
                left: (i + 1) * whiteW - blackW / 2,
                top: 0,
                width: blackW,
                height: blackH,
                background: "#111",
                border: "1px solid #333",
                borderRadius: "0 0 2px 2px",
                boxSizing: "border-box",
                zIndex: 2,
              }}
            />
          );
        })}

        {/* Waves above pressed keys */}
        <svg
          style={{
            position: "absolute",
            left: -kbWidth * 0.15,
            top: -kbHeight * 1.6,
            overflow: "visible",
          }}
          width={kbWidth * 1.3}
          height={kbHeight * 1.7}
        >
          {waves.map((w, i) => (
            <Wave
              key={i}
              x={kbWidth * 0.15 + w.keyIdx * whiteW - whiteW * 0.8}
              width={whiteW * 2.6}
              freq={w.freq}
              startFrame={w.start}
              color={ink}
              baseY={kbHeight * 0.75}
              drift={w.drift}
            />
          ))}
        </svg>
      </div>

      {/* Subtitle */}
      {subtitle ? (
        <div
          style={{
            position: "absolute",
            bottom: height * 0.08,
            width: "100%",
            textAlign: "center",
            color: "#333333",
            fontSize: 30,
            fontWeight: 600,
            letterSpacing: 1,
            opacity: subOpacity,
          }}
        >
          {subtitle}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
