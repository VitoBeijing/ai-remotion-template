import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import type { TemplateProps } from "../../lib/props";
import { FONT_STACK, seeded } from "../../lib/anim";

/* ---------- 简笔人物侧脸（扁平插画） ---------- */
const Person: React.FC<{
  flip?: boolean;
  color: string;
  bob: number;
}> = ({ flip, color, bob }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 360 + bob,
        width: 280,
        height: 400,
        transform: flip ? "scaleX(-1)" : undefined,
      }}
    >
      <svg viewBox="0 0 280 400" width={280} height={400}>
        <path
          d="M 40 400 C 40 300 100 260 140 260 C 180 260 240 300 240 400 Z"
          fill={color}
          opacity={0.9}
        />
        <circle cx="140" cy="170" r="95" fill={color} />
        <path
          d="M 235 150 Q 255 165 235 185 Q 245 195 232 205"
          fill="none"
          stroke={color}
          strokeWidth={28}
          strokeLinecap="round"
        />
        <circle cx="185" cy="150" r="10" fill="#1a1a2e" />
        <path
          d="M 195 210 Q 215 225 232 212"
          fill="none"
          stroke="#1a1a2e"
          strokeWidth={6}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

/* ---------- 聊天气泡（圆形，含省略号） ---------- */
const Bubble: React.FC<{
  x: number;
  y: number;
  scale: number;
  glowOpacity: number;
  dotPhase: number;
  color: string;
  glowColor: string;
  active: boolean;
}> = ({ x, y, scale, glowOpacity, dotPhase, color, glowColor, active }) => {
  const dots = [0, 1, 2];
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        width: 120,
        height: 120,
        borderRadius: "50%",
        background: active
          ? `linear-gradient(145deg, ${color}, ${color}dd)`
          : `${color}55`,
        border: `3px solid ${active ? glowColor : glowColor + "66"}`,
        boxShadow: active
          ? `0 0 ${40 * glowOpacity}px ${glowColor}${Math.round(glowOpacity * 200).toString(16).padStart(2, "0")}, 0 8px 30px rgba(0,0,0,0.4)`
          : "0 4px 15px rgba(0,0,0,0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
      }}
    >
      {dots.map((d) => {
        const dy = Math.sin(dotPhase + d * 0.9) * 7;
        return (
          <div
            key={d}
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: active ? "#fff" : glowColor,
              opacity: active ? 0.95 : 0.5,
              transform: `translateY(${dy}px)`,
            }}
          />
        );
      })}
    </div>
  );
};

/* ---------- 扩散圆环 ---------- */
const Ripple: React.FC<{
  progress: number;
  color: string;
  maxR: number;
  x: number;
  y: number;
}> = ({ progress, color, maxR, x, y }) => {
  const r = interpolate(progress, [0, 1], [60, maxR]);
  const op = interpolate(progress, [0, 0.7, 1], [0.4, 0.15, 0]);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: r * 2,
        height: r * 2,
        borderRadius: "50%",
        border: `3px solid ${color}`,
        opacity: op,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      }}
    />
  );
};

/* ---------- 主组件 ---------- */
export const TemplateComponent: React.FC<TemplateProps> = (props) => {
  const frame = useCurrentFrame();
  const {
    title = "话术博弈",
    bgFrom = "#fff3c4",
    bgTo = "#ffe9a8",
    accentFrom = "#ff8c1a",
    accentTo = "#ffb347",
  } = props;

  /* 标题入场 */
  const titleOp = interpolate(frame, [5, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [5, 25], [-30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* 人物入场 & 呼吸浮动 */
  const personIn = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bobL = Math.sin(frame * 0.06) * 8;
  const bobR = Math.sin(frame * 0.06 + Math.PI) * 8;
  const slideL = interpolate(personIn, [0, 1], [-120, 260]);
  const slideR = interpolate(personIn, [0, 1], [120, 0]);

  /* 三个气泡交替弹跳：周期 90 帧，每 30 帧切换主导气泡 */
  const cycle = frame % 90;
  const activeIdx = Math.floor(cycle / 30);
  const bubbleData = [
    { x: 820, y: 300 },
    { x: 960, y: 240 },
    { x: 1100, y: 300 },
  ];

  /* 扩散圆环：三层相位错开 */
  const ripplePhase = (frame % 70) / 70;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${bgFrom} 0%, ${bgTo} 100%)`,
        fontFamily: FONT_STACK,
        overflow: "hidden",
      }}
    >
      {/* 背景圆点装饰 */}
      {Array.from({ length: 24 }).map((_, i) => {
        const sx = seeded(i * 7 + 1) * 1920;
        const sy = seeded(i * 13 + 5) * 1080;
        const tw = Math.sin(frame * 0.05 + i) * 0.5 + 0.5;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: sx,
              top: sy,
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: accentFrom,
              opacity: 0.15 + tw * 0.25,
            }}
          />
        );
      })}

      {/* 顶部标题区 */}
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 0,
          width: "100%",
          textAlign: "center",
          opacity: titleOp,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "6px 26px",
            borderRadius: 30,
            border: `2px solid ${accentFrom}`,
            color: accentFrom,
            fontSize: 26,
            letterSpacing: 6,
            marginBottom: 18,
          }}
        >
          试探性对话
        </div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            color: "#fff",
            letterSpacing: 4,
            textShadow: `0 0 40px ${accentFrom}55`,
          }}
        >
          {title}
        </div>
      </div>

      {/* 中央扩散圆环（两个人物之间） */}
      {[0, 1, 2].map((i) => {
        const p = (ripplePhase + i / 3) % 1;
        return (
          <Ripple
            key={i}
            progress={p}
            color={accentFrom}
            maxR={420}
            x={960}
            y={500}
          />
        );
      })}

      {/* 左人物 */}
      <div style={{ position: "absolute", left: slideL + 140 }}>
        <Person color={accentFrom} bob={bobL} />
      </div>
      {/* 右人物（镜像朝向） */}
      <div style={{ position: "absolute", right: slideR + 140 }}>
        <Person color={accentTo} bob={bobR} flip />
      </div>

      {/* 三个聊天气泡 */}
      {bubbleData.map((b, i) => {
        const isActive = i === activeIdx;
        const enter = interpolate(frame, [20 + i * 6, 40 + i * 6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const bounce = isActive ? Math.abs(Math.sin(frame * 0.18)) * 0.18 : 0;
        const scale = enter * (0.85 + bounce + (isActive ? 0.12 : 0));
        const glow = isActive
          ? 0.6 + Math.sin(frame * 0.15) * 0.3
          : 0.15;
        return (
          <Bubble
            key={i}
            x={b.x}
            y={b.y + (isActive ? Math.sin(frame * 0.18) * -12 : 0)}
            scale={scale}
            glowOpacity={glow}
            dotPhase={frame * 0.22}
            color={i === 1 ? accentTo : accentFrom}
            glowColor={i === 1 ? accentTo : accentFrom}
            active={isActive}
          />
        );
      })}

      {/* 对话连接线（气泡之间虚线） */}
      <svg
        width="1920"
        height="1080"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <path
          d={`M 700 520 Q 960 ${340 + Math.sin(frame * 0.05) * 20} 1220 520`}
          fill="none"
          stroke={accentFrom}
          strokeWidth={2.5}
          strokeDasharray="10 14"
          strokeDashoffset={-frame * 1.5}
          opacity={0.35}
        />
      </svg>

      {/* 底部字幕条 */}
      <div
        style={{
          position: "absolute",
          bottom: 90,
          left: 0,
          width: "100%",
          textAlign: "center",
          opacity: titleOp,
        }}
      >
        <span
          style={{
            fontSize: 34,
            color: "#fff",
            letterSpacing: 3,
            background: "rgba(60,50,20,0.55)",
            padding: "14px 44px",
            borderRadius: 14,
            border: `1px solid ${accentFrom}44`,
            backdropFilter: "blur(6px)",
          }}
        >
          {"问就是\"没什么\"—— 一句话，漏出两个信息"}
        </span>
      </div>

      {/* 底部进度装饰线 */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 6,
          width: `${(frame / 210) * 100}%`,
          background: `linear-gradient(90deg, ${accentFrom}, ${accentTo})`,
        }}
      />
    </AbsoluteFill>
  );
};

export default TemplateComponent;
