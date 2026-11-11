import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { TemplateProps } from "../../lib/props";
import { FONT_STACK } from "../../lib/anim";

/* ---------- 四个步骤图标（SVG） ---------- */
const StepIcon: React.FC<{ index: number; color: string }> = ({ index, color }) => {
  const s = { stroke: color, strokeWidth: 5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  switch (index) {
    case 0: // 放大镜
      return (
        <svg width="64" height="64" viewBox="0 0 64 64">
          <circle cx="27" cy="27" r="14" {...s} />
          <line x1="38" y1="38" x2="50" y2="50" {...s} />
          <line x1="21" y1="27" x2="33" y2="27" {...s} strokeWidth={4} />
        </svg>
      );
    case 1: // 对话框
      return (
        <svg width="64" height="64" viewBox="0 0 64 64">
          <rect x="10" y="12" width="44" height="30" rx="8" {...s} />
          <path d="M24 42 L24 52 L34 42" {...s} />
          <line x1="19" y1="22" x2="45" y2="22" {...s} strokeWidth={4} />
          <line x1="19" y1="30" x2="37" y2="30" {...s} strokeWidth={4} />
        </svg>
      );
    case 2: // 耳朵
      return (
        <svg width="64" height="64" viewBox="0 0 64 64">
          <path d="M22 28 C22 16 42 14 43 28 C43 36 36 38 34 44 C32 50 28 52 24 50" {...s} />
          <path d="M29 27 C29 22 36 22 36 28 C36 33 31 34 30 38" {...s} strokeWidth={4} />
        </svg>
      );
    case 3: // 靶心
      return (
        <svg width="64" height="64" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="22" {...s} />
          <circle cx="32" cy="32" r="13" {...s} strokeWidth={4} />
          <circle cx="32" cy="32" r="4" fill={color} />
          <line x1="32" y1="4" x2="32" y2="12" {...s} strokeWidth={4} />
          <line x1="32" y1="52" x2="32" y2="60" {...s} strokeWidth={4} />
          <line x1="4" y1="32" x2="12" y2="32" {...s} strokeWidth={4} />
          <line x1="52" y1="32" x2="60" y2="32" {...s} strokeWidth={4} />
        </svg>
      );
    default:
      return null;
  }
};

/* ---------- 单个步骤卡片 ---------- */
const StepCard: React.FC<{
  index: number;
  frame: number;
  fps: number;
  appearAt: number;
  selected: boolean;
  label: string;
  sub: string;
  activeColor: string;
  idleColor: string;
  dimBg: string;
}> = ({ index, frame, fps, appearAt, selected, label, sub, activeColor, idleColor, dimBg }) => {
  const local = Math.max(0, frame - appearAt);

  // 弹跳出现
  const pop = spring({
    frame: local,
    fps,
    config: { damping: 11, stiffness: 160, mass: 0.9 },
  });
  const appearScale = interpolate(pop, [0, 1], [0, 1]);
  const opacity = interpolate(local, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 选中放大
  const selScale = spring({
    frame: Math.max(0, frame - appearAt),
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const scale = appearScale * (selected ? interpolate(selScale, [0, 1], [1, 1.14]) : 1);

  const color = selected ? activeColor : idleColor;
  const borderColor = selected ? activeColor : "transparent";
  const glow = selected
    ? `0 0 32px ${activeColor}55, 0 8px 24px rgba(120,72,0,0.35)`
    : "0 6px 18px rgba(120,90,20,0.18)";

  return (
    <div
      style={{
        width: 210,
        height: 240,
        borderRadius: 24,
        background: selected ? dimBg : "rgba(110,122,146,0.28)",
        border: `4px solid ${borderColor}`,
        boxShadow: glow,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        transform: `scale(${scale})`,
        opacity,
        transition: "border-color 0.2s linear",
        position: "relative",
      }}
    >
      {/* 序号角标 */}
      <div
        style={{
          position: "absolute",
          top: -18,
          left: -18,
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: selected ? activeColor : "rgba(100,112,135,0.95)",
          color: selected ? "#fff7e8" : "#f1f5f9",
          fontFamily: FONT_STACK,
          fontWeight: 800,
          fontSize: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 10px rgba(120,90,20,0.25)",
        }}
      >
        {index + 1}
      </div>
      <div
        style={{
          width: 104,
          height: 104,
          borderRadius: "50%",
          background: selected ? `${activeColor}22` : "rgba(255,255,255,0.28)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <StepIcon index={index} color={color} />
      </div>
      <div
        style={{
          fontFamily: FONT_STACK,
          fontSize: 30,
          fontWeight: 700,
          color: selected ? activeColor : "#8b96ab",
          letterSpacing: 2,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: FONT_STACK,
          fontSize: 19,
          fontWeight: 400,
          color: selected ? "#5b4a2e" : "#9aa4b5",
        }}
      >
        {sub}
      </div>
    </div>
  );
};

/* ---------- 橙色虚线连接器（自动生长） ---------- */
const DashConnector: React.FC<{
  frame: number;
  startAt: number;
  color: string;
}> = ({ frame, startAt, color }) => {
  const WIDTH = 130;
  const local = Math.max(0, frame - startAt);
  const progress = interpolate(local, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <svg width={WIDTH} height="40" viewBox={`0 0 ${WIDTH} 40`} style={{ overflow: "visible" }}>
      <line
        x1={6}
        y1={20}
        x2={6 + (WIDTH - 12) * progress}
        y2={20}
        stroke={color}
        strokeWidth={5}
        strokeDasharray="14 12"
        strokeLinecap="round"
        opacity={progress > 0 ? 1 : 0}
      />
      <path
        d={`M ${WIDTH - 16} 12 L ${WIDTH - 4} 20 L ${WIDTH - 16} 28`}
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={progress >= 1 ? 1 : 0}
      />
    </svg>
  );
};

export const TemplateComponent: React.FC<TemplateProps> = (props) => {
  const {
    title = "如何优雅地套出对方的真心话",
    subtitle = "话术博弈 · 四步流程",
    bgFrom = "#fdf3cf",
    bgTo = "#fbe7a8",
    accentFrom = "#f59e0b",
    accentTo = "#f97316",
  } = props;

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const steps = [
    { label: "观察", sub: "捕捉微表情" },
    { label: "试探", sub: "抛出轻话题" },
    { label: "倾听", sub: "示弱换真话" },
    { label: "命中", sub: "锁定真心话" },
  ];

  // 每个步骤依次出现，间隔 20 帧
  const appearAts = [30, 50, 70, 90];
  // 连接线在各步骤出现之间生长
  const connectAts = [42, 62, 82];
  // 选中态轮播：每步高亮约 30 帧，最后全部落定到第 4 步
  const highlightWindows: Array<[number, number]> = [
    [30, 58],
    [58, 88],
    [88, 118],
    [118, 225],
  ];
  const selectedIndex = highlightWindows.findIndex(([a, b]) => frame >= a && frame < b);

  // 标题入场
  const titleOp = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 18], [-28, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const barW = interpolate(frame, [8, 26], [0, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // 结尾提示条
  const tipOp = interpolate(frame, [150, 168], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tipY = interpolate(frame, [150, 168], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${bgFrom} 0%, ${bgTo} 100%)`,
        fontFamily: FONT_STACK,
        overflow: "hidden",
      }}
    >
      {/* 顶部标题区 */}
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: titleOp,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: accentFrom,
            letterSpacing: 8,
            marginBottom: 14,
          }}
        >
          {subtitle}
        </div>
        <div
          style={{
            fontSize: 62,
            fontWeight: 900,
            color: "#3b3324",
            letterSpacing: 4,
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 22,
            width: barW,
            height: 8,
            borderRadius: 4,
            background: `linear-gradient(90deg, ${accentFrom}, ${accentTo})`,
          }}
        />
      </div>

      {/* 步骤流程区 */}
      <div
        style={{
          position: "absolute",
          top: 400,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            <StepCard
              index={i}
              frame={frame}
              fps={fps}
              appearAt={appearAts[i]}
              selected={selectedIndex === i}
              label={s.label}
              sub={s.sub}
              activeColor={accentFrom}
              idleColor="#9aa4b5"
              dimBg="#fffdf4"
            />
            {i < steps.length - 1 && (
              <DashConnector frame={frame} startAt={connectAts[i]} color={accentTo} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* 底部提示条 */}
      <div
        style={{
          position: "absolute",
          bottom: 130,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: tipOp,
          transform: `translateY(${tipY}px)`,
        }}
      >
        <div
          style={{
            padding: "20px 56px",
            borderRadius: 999,
            background: "rgba(255,253,244,0.92)",
            border: `2px solid ${accentFrom}88`,
            display: "flex",
            alignItems: "center",
            gap: 18,
            boxShadow: "0 10px 30px rgba(120,90,20,0.22)",
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
            }}
          />
          <span style={{ fontSize: 30, color: "#5b4a2e", letterSpacing: 3, fontWeight: 600 }}>
            先暴露一点脆弱，再换来一句真心
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
