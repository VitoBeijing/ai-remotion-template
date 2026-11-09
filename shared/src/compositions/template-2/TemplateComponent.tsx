import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { TemplateProps } from "../../lib/props";
import { FONT_STACK, seeded, accentText } from "../../lib/anim";

// 键盘布局：14 个白键（C D E F G A B C D E F G A B）
const WHITE_KEYS = 14;
const WHITE_W = 44;
const WHITE_H = 170;
const BLACK_W = 26;
const BLACK_H = 105;
const KEY_GAP = 4;
const BOARD_PAD = 10;

// 黑键相对白键的位置（白键索引，黑键偏移量）
// C D E F G A B C D E F G A B
// 黑键在 0,1,3,4,5,7,8,10,11,12 上
const BLACK_KEY_MAP: { whiteIndex: number; offset: number }[] = [
  { whiteIndex: 0, offset: 0.65 },
  { whiteIndex: 1, offset: 0.65 },
  { whiteIndex: 3, offset: 0.65 },
  { whiteIndex: 4, offset: 0.65 },
  { whiteIndex: 5, offset: 0.65 },
  { whiteIndex: 7, offset: 0.65 },
  { whiteIndex: 8, offset: 0.65 },
  { whiteIndex: 10, offset: 0.65 },
  { whiteIndex: 11, offset: 0.65 },
  { whiteIndex: 12, offset: 0.65 },
];

// 三个要按下的白键：C(0), G(7), E(12) —— do, sol, 高八度 mi
const PRESSED_KEYS = [0, 7, 12];

interface WaveSpec {
  keyIndex: number;
  startFrame: number;
  duration: number;
  amp: number;
  freq: number;
  phase: number;
}

const WAVES: WaveSpec[] = [
  { keyIndex: 0, startFrame: 20, duration: 55, amp: 14, freq: 0.9, phase: 0 },
  { keyIndex: 7, startFrame: 40, duration: 50, amp: 12, freq: 1.1, phase: 1.2 },
  { keyIndex: 12, startFrame: 70, duration: 45, amp: 10, freq: 1.3, phase: 2.4 },
];

// 生成一条波形 SVG 路径
const buildWavePath = (
  baseX: number,
  baseY: number,
  width: number,
  amp: number,
  freq: number,
  phase: number,
  progress: number
): string => {
  const steps = 64;
  let d = "";
  const visible = Math.floor(steps * Math.min(1, Math.max(0, progress)));
  for (let i = 0; i <= visible; i++) {
    const t = i / steps;
    const x = baseX + width * t;
    const y = baseY - Math.sin(t * Math.PI * 2 * freq + phase) * amp * Math.sin(t * Math.PI);
    d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  }
  return d;
};

const Keyboard: React.FC<{
  frame: number;
  fps: number;
  pressProgress: number[];
  accentFrom: string;
  accentTo: string;
}> = ({ frame, fps, pressProgress, accentFrom, accentTo }) => {
  const totalWhiteW = WHITE_KEYS * (WHITE_W + KEY_GAP) - KEY_GAP;
  const boardW = totalWhiteW + BOARD_PAD * 2;
  const boardH = WHITE_H + BOARD_PAD * 2;

  return (
    <g>
      {/* 白色键床背景 */}
      <rect
        x={-BOARD_PAD}
        y={-BOARD_PAD}
        width={boardW}
        height={boardH}
        rx={8}
        fill="#0a0a0a"
        stroke="#e8e8e8"
        strokeWidth={2.5}
      />
      {/* 白键 */}
      {Array.from({ length: WHITE_KEYS }).map((_, i) => {
        const x = i * (WHITE_W + KEY_GAP);
        const pIdx = PRESSED_KEYS.indexOf(i);
        const p = pIdx >= 0 ? pressProgress[pIdx] : 0;
        const lift = interpolate(p, [0, 1], [0, -6]);
        return (
          <g key={`w-${i}`} transform={`translate(${x}, ${lift})`}>
            <rect
              x={0}
              y={0}
              width={WHITE_W}
              height={WHITE_H}
              rx={6}
              fill={p > 0.01 ? accentFrom : "#0f0f0f"}
              stroke="#e8e8e8"
              strokeWidth={2}
              opacity={p > 0.01 ? 1 : 1}
            />
          </g>
        );
      })}
      {/* 黑键 */}
      {BLACK_KEY_MAP.map((bk, i) => {
        const x = bk.whiteIndex * (WHITE_W + KEY_GAP) + WHITE_W * bk.offset;
        return (
          <rect
            key={`b-${i}`}
            x={x}
            y={-2}
            width={BLACK_W}
            height={BLACK_H}
            rx={5}
            fill="#1a1a1a"
            stroke="#e8e8e8"
            strokeWidth={2}
          />
        );
      })}
      {/* 按下的键发光层 */}
      {PRESSED_KEYS.map((ki, i) => {
        const p = pressProgress[i];
        if (p <= 0.01) return null;
        const x = ki * (WHITE_W + KEY_GAP);
        return (
          <rect
            key={`glow-${i}`}
            x={x - 2}
            y={-8}
            width={WHITE_W + 4}
            height={WHITE_H + 8}
            rx={8}
            fill="none"
            stroke={accentTo}
            strokeWidth={3}
            opacity={0.5 * p}
            filter="url(#glowFilter)"
          />
        );
      })}
    </g>
  );
};

export const TemplateComponent: React.FC<TemplateProps> = (props) => {
  const {
    title,
    subtitle,
    bgFrom = "#000000",
    bgTo = "#0a0a0a",
    accentFrom = "#2e7d32",
    accentTo = "#4caf50",
  } = props;

  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // 每个键的按下进度：三个键在不同帧开始按下
  const pressStartFrames = [20, 40, 70];
  const pressProgress = pressStartFrames.map((start) =>
    spring({
      frame: frame - start,
      fps,
      config: { damping: 14, stiffness: 160, mass: 0.8 },
    })
  );
  // 限制到 0-1
  const pressClamped = pressProgress.map((v) => Math.min(1, Math.max(0, v)));

  // 键盘整体淡入
  const kbOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const kbScale = interpolate(frame, [0, 18], [0.92, 1], {
    extrapolateRight: "clamp",
  });

  const totalWhiteW = WHITE_KEYS * (WHITE_W + KEY_GAP) - KEY_GAP;
  const boardTotalW = totalWhiteW + BOARD_PAD * 2;
  const boardTotalH = WHITE_H + BOARD_PAD * 2;

  // 居中计算（1920 宽画布，键盘居中偏上）
  const centerX = width / 2;
  const centerY = height * 0.44;
  const svgW = boardTotalW + 40;
  const svgH = boardTotalH + 40 + 120; // 留出波形空间

  // 标题字幕淡入
  const captionOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const captionY = interpolate(frame, [0, 20], [20, 0], {
    extrapolateRight: "clamp",
  });

  // 第二条字幕（后期替换）
  const subOpacity = interpolate(frame, [85, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const firstCaptionFade = interpolate(frame, [80, 92], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const firstCaptionVisible = captionOpacity * firstCaptionFade;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${bgFrom} 0%, ${bgTo} 100%)`,
        fontFamily: FONT_STACK,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* 键盘 SVG 容器 */}
      <div
        style={{
          position: "absolute",
          top: centerY - svgH / 2,
          left: 0,
          width: "100%",
          height: svgH,
          display: "flex",
          justifyContent: "center",
          opacity: kbOpacity,
          transform: `scale(${kbScale})`,
        }}
      >
        <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
          <defs>
            <linearGradient id="keyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accentFrom} stopOpacity="0.9" />
              <stop offset="100%" stopColor={accentTo} stopOpacity="1" />
            </linearGradient>
            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 键盘组，整体略下移 */}
          <g transform={`translate(${20 + BOARD_PAD}, ${20 + BOARD_PAD + 10})`}>
            <Keyboard
              frame={frame}
              fps={fps}
              pressProgress={pressClamped}
              accentFrom={accentFrom}
              accentTo={accentTo}
            />
          </g>

          {/* 波形 */}
          {WAVES.map((w, i) => {
            const local = frame - w.startFrame;
            if (local < 0) return null;
            const prog = Math.min(1, local / w.duration);
            const fadeOut = interpolate(
              local,
              [w.duration, w.duration + 12],
              [1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const baseKeyX =
              20 + BOARD_PAD + (w.keyIndex * (WHITE_W + KEY_GAP) + WHITE_W / 2);
            const waveW = 130;
            const baseX = baseKeyX - waveW / 2;
            const baseY = 20 + BOARD_PAD + 10 + 10; // 键盘顶部上方
            return (
              <g key={`wave-${i}`} opacity={fadeOut}>
                <path
                  d={buildWavePath(baseX, baseY, waveW, w.amp, w.freq, w.phase, prog)}
                  fill="none"
                  stroke={accentTo}
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* 底部字幕 - 第一段 */}
      {firstCaptionVisible > 0.01 && (
        <div
          style={{
            position: "absolute",
            bottom: 130,
            left: 0,
            width: "100%",
            textAlign: "center",
            opacity: firstCaptionVisible,
            transform: `translateY(${captionY}px)`,
          }}
        >
          <span
            style={{
              fontSize: 34,
              fontWeight: 500,
              color: "#e8e8e8",
              letterSpacing: 2,
            }}
          >
            {title ?? "按下钢琴上的三个键"}
          </span>
        </div>
      )}

      {/* 底部字幕 - 第二段 */}
      {subOpacity > 0.01 && (
        <div
          style={{
            position: "absolute",
            bottom: 130,
            left: 0,
            width: "100%",
            textAlign: "center",
            opacity: subOpacity,
          }}
        >
          <span
            style={{
              fontSize: 34,
              fontWeight: 500,
              color: "#e8e8e8",
              letterSpacing: 2,
            }}
          >
            {subtitle ?? "do、sol，再加一个高八度的 mi"}
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};
