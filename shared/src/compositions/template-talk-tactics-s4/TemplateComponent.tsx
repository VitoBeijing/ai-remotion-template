import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring } from "remotion";
import { TemplateProps } from "../../lib/props";
import { FONT_STACK } from "../../lib/anim";

export const TemplateComponent: React.FC<TemplateProps> = ({
  title = "真正的博弈，是先让对方感到安全",
  bgFrom = "#141a24",
  bgTo = "#0c1017",
  accentFrom = "#d8b46a",
  accentTo = "#f0d9a0",
}) => {
  const frame = useCurrentFrame();

  /* ---------- 场景一：深色 (0 - 55) ---------- */
  const scene1Opacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ---------- 圆形遮罩转场 (55 - 120) ---------- */
  const circleRadius = interpolate(frame, [55, 110], [0, 2200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => t * t * (3 - 2 * t), // smoothstep
  });
  const scene2Visible = frame >= 55;

  /* ---------- 金句模糊 -> 清晰 (105 - 160) ---------- */
  const quoteBlur = interpolate(frame, [105, 150], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const quoteOpacity = interpolate(frame, [105, 140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const quoteY = interpolate(frame, [105, 155], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  /* ---------- 装饰线 ---------- */
  const lineWidth = interpolate(frame, [130, 160], [0, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ---------- 关注按钮 (165 - 195) ---------- */
  const btnSpring = spring({
    frame: Math.max(0, frame - 165),
    fps: 30,
    config: { damping: 14, stiffness: 120, mass: 0.9 },
  });
  const btnScale = frame < 165 ? 0 : btnSpring;
  const btnOpacity = interpolate(frame, [165, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* 按钮呼吸光圈 */
  const pulse = interpolate(frame % 40, [0, 20, 40], [1, 1.06, 1]);

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK, overflow: "hidden" }}>
      {/* ============ 场景一：金色暗调聊天氛围背景 ============ */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 40%, #2a2416 0%, #14100a 55%, #0a0805 100%)`,
          opacity: scene1Opacity,
        }}
      >
        {/* 微弱装饰粒子 */}
        {Array.from({ length: 24 }).map((_, i) => {
          const x = ((i * 431) % 1920) + ((i * 97) % 100);
          const y = (i * 293) % 1080;
          const s = 1.5 + ((i * 37) % 3);
          const tw = interpolate(
            (frame + i * 7) % 60,
            [0, 30, 60],
            [0.15, 0.5, 0.15]
          );
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: s,
                height: s,
                borderRadius: "50%",
                background: accentFrom,
                opacity: tw,
              }}
            />
          );
        })}

        {/* 顶部装饰横线 */}
        <div
          style={{
            position: "absolute",
            top: 90,
            left: 110,
            display: "flex",
            gap: 14,
            alignItems: "center",
          }}
        >
          <div style={{ width: 34, height: 3, background: accentFrom, borderRadius: 2 }} />
          <div style={{ width: 90, height: 2, background: "rgba(216,180,106,0.4)", borderRadius: 2 }} />
          <div style={{ width: 50, height: 2, background: "rgba(216,180,106,0.25)", borderRadius: 2 }} />
        </div>

        {/* 聊天气泡（呼应关键帧风格） */}
        <div
          style={{
            position: "absolute",
            top: 260,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 44,
          }}
        >
          <div
            style={{
              padding: "26px 48px",
              borderRadius: 16,
              border: `1px solid rgba(216,180,106,0.5)`,
              background: "rgba(216,180,106,0.06)",
              color: "#e8dcc0",
              fontSize: 38,
              letterSpacing: 2,
              boxShadow: "0 0 40px rgba(216,180,106,0.12)",
              opacity: interpolate(frame, [6, 20], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              transform: `translateY(${interpolate(frame, [6, 20], [24, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}px)`,
            }}
          >
            {"追问，只会换来一句\u201c没什么\u201d"}
          </div>
          <div
            style={{
              padding: "26px 48px",
              borderRadius: 16,
              border: `1px solid rgba(216,180,106,0.35)`,
              background: "rgba(0,0,0,0.35)",
              color: "rgba(232,220,192,0.75)",
              fontSize: 38,
              letterSpacing: 2,
              opacity: interpolate(frame, [18, 34], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              transform: `translateY(${interpolate(frame, [18, 34], [24, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}px)`,
            }}
          >
            {"而安全感，才能让真心话自己走出来"}
          </div>
        </div>

        {/* 场景一中心收缩前的淡出 */}
        <AbsoluteFill
          style={{
            background: "transparent",
            opacity: interpolate(frame, [45, 58], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            pointerEvents: "none",
          }}
        />
      </AbsoluteFill>

      {/* ============ 场景二：深灰蓝 + 圆形遮罩展开 ============ */}
      {scene2Visible && (
        <AbsoluteFill
          style={{
            background: `linear-gradient(160deg, ${bgFrom} 0%, ${bgTo} 100%)`,
            clipPath: `circle(${circleRadius}px at 50% 50%)`,
          }}
        >
          {/* 细腻噪点感（确定性伪随机点） */}
          {Array.from({ length: 30 }).map((_, i) => {
            const x = (i * 613) % 1920;
            const y = (i * 389) % 1080;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  width: 2,
                  height: 2,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.06)",
                }}
              />
            );
          })}

          {/* 顶部小标签 */}
          <div
            style={{
              position: "absolute",
              top: 120,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              opacity: interpolate(frame, [120, 140], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <div
              style={{
                padding: "8px 28px",
                border: `1px solid rgba(216,180,106,0.5)`,
                borderRadius: 999,
                color: accentFrom,
                fontSize: 22,
                letterSpacing: 6,
              }}
            >
              {"话术博弈 · 核心心法"}
            </div>
          </div>

          {/* ============ 金句（模糊 -> 清晰） ============ */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 120,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: 84,
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: 6,
                textAlign: "center",
                filter: `blur(${quoteBlur}px)`,
                opacity: quoteOpacity,
                transform: `translateY(${quoteY}px)`,
                textShadow: "0 4px 40px rgba(0,0,0,0.5)",
                lineHeight: 1.5,
                maxWidth: 1500,
              }}
            >
              {title}
            </div>

            {/* 金色装饰线 */}
            <div
              style={{
                marginTop: 48,
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: lineWidth,
                  height: 2,
                  background: `linear-gradient(to right, transparent, ${accentFrom})`,
                }}
              />
              <div
                style={{
                  width: 10,
                  height: 10,
                  transform: "rotate(45deg)",
                  background: accentFrom,
                  opacity: interpolate(frame, [140, 155], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              />
              <div
                style={{
                  width: lineWidth,
                  height: 2,
                  background: `linear-gradient(to left, transparent, ${accentTo})`,
                }}
              />
            </div>
          </div>

          {/* ============ 引导关注按钮 ============ */}
          <div
            style={{
              position: "absolute",
              bottom: 130,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              opacity: btnOpacity,
            }}
          >
            <div
              style={{
                transform: `scale(${btnScale * pulse})`,
                display: "flex",
                alignItems: "center",
                gap: 18,
                padding: "20px 56px",
                borderRadius: 999,
                background: `linear-gradient(120deg, ${accentFrom}, ${accentTo})`,
                boxShadow: `0 8px 40px rgba(216,180,106,0.35)`,
              }}
            >
              {/* 加号图标 */}
              <svg width={30} height={30} viewBox="0 0 24 24" fill="none">
                <circle cx={12} cy={12} r={10} stroke="#1a1408" strokeWidth={2} />
                <path d="M12 8v8M8 12h8" stroke="#1a1408" strokeWidth={2} strokeLinecap="round" />
              </svg>
              <span
                style={{
                  fontSize: 34,
                  fontWeight: 700,
                  color: "#1a1408",
                  letterSpacing: 4,
                }}
              >
                {"关注 解锁更多话术"}
              </span>
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
