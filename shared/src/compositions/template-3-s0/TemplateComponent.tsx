import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { TemplateProps } from "../../lib/props";
import { FONT_STACK, seeded } from "../../lib/anim";

/* ---------- 子组件：左上角编号标签 ---------- */
const HeaderTag: React.FC<{
  num: string;
  label: string;
  badge: string;
  accent: string;
}> = ({ num, label, badge, accent }) => {
  const frame = useCurrentFrame();
  const progress = spring({ frame, fps: 30, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      style={{
        position: "absolute",
        top: 60,
        left: 40,
        display: "flex",
        alignItems: "center",
        gap: 12,
        opacity: progress,
        transform: `translateY(${interpolate(progress, [0, 1], [-20, 0])}px)`,
      }}
    >
      <span
        style={{
          color: accent,
          fontSize: 20,
          fontWeight: 500,
          letterSpacing: 1,
          fontFamily: FONT_STACK,
        }}
      >
        {num}
      </span>
      <span
        style={{
          color: "#e8e6e1",
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: 1,
          fontFamily: FONT_STACK,
        }}
      >
        {label}
      </span>
      <div
        style={{
          padding: "4px 10px",
          borderRadius: 4,
          border: `1px solid ${accent}60`,
          background: `${accent}20`,
          color: accent,
          fontSize: 16,
          fontWeight: 500,
          letterSpacing: 0,
          fontFamily: FONT_STACK,
        }}
      >
        {badge}
      </div>
    </div>
  );
};

/* ---------- 子组件：聊天气泡 ---------- */
const ChatBubble: React.FC<{
  text: string;
  isWrong?: boolean;
  isMe?: boolean;
  label?: string;
  delay: number;
  accent: string;
  secondaryText?: string;
}> = ({ text, isWrong = false, isMe = false, label = "TA", delay, accent, secondaryText }) => {
  const frame = useCurrentFrame();
  const s = spring({
    frame: frame - delay,
    fps: 30,
    config: { damping: 15, stiffness: 100, mass: 0.6 },
  });
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame - delay, [0, 15], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });

  // 头像
  const Avatar = (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        border: `1px solid ${isMe ? accent : "#666"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
        color: isMe ? accent : "#999",
        flexShrink: 0,
        background: isMe ? `${accent}15` : "#1a1a1a",
        fontFamily: FONT_STACK,
        marginTop: 4,
      }}
    >
      {label}
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMe ? "row-reverse" : "row",
        alignItems: "flex-start",
        gap: 12,
        opacity,
        transform: `translateY(${y}px) scale(${s})`,
        transformOrigin: isMe ? "right top" : "left top",
        maxWidth: "85%",
        marginBottom: 24,
        alignSelf: isMe ? "flex-end" : "flex-start",
      }}
    >
      {Avatar}
      <div
        style={{
          padding: "12px 20px",
          borderRadius: 16,
          fontSize: 22,
          lineHeight: 1.5,
          fontFamily: FONT_STACK,
          fontWeight: 500,
          position: "relative",
          // 错误问法：深灰底
          // 换个问法：金色描边 + 微光
          background: isWrong
            ? "#2a2a2d"
            : "rgba(212, 175, 55, 0.08)",
          border: isWrong 
            ? "1px solid #3a3a3d" 
            : `1.5px solid ${accent}80`,
          color: isWrong ? "#777" : "#e8e6e1",
          boxShadow: isWrong
            ? "none"
            : `0 0 16px ${accent}25, inset 0 0 12px ${accent}10`,
          textAlign: "left",
          letterSpacing: 0.5,
        }}
      >
        {isWrong && (
          <span style={{ marginRight: 8, fontSize: 18 }}>✕</span>
        )}
        {!isWrong && isMe && (
          <span style={{ marginRight: 8, fontSize: 18, color: accent }}>💡</span>
        )}
        {text}
        {secondaryText && (
          <div style={{ marginTop: 4, fontSize: 20, color: isWrong ? "#666" : "#ccc" }}>
            {secondaryText}
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------- 子组件：标签 ---------- */
const Label: React.FC<{
  text: string;
  isGold?: boolean;
  delay: number;
  accent: string;
}> = ({ text, isGold = false, delay, accent }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        fontSize: 14,
        color: isGold ? accent : "#666",
        fontFamily: FONT_STACK,
        letterSpacing: 1,
        opacity,
        marginBottom: 8,
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      <span style={{ fontSize: 16 }}>{isGold ? "✓" : "✕"}</span>
      {text}
    </div>
  );
};

/* ---------- 子组件：底部解说字幕 ---------- */
const Subtitle: React.FC<{
  text: string;
  delay: number;
  accent: string;
}> = ({ text, delay, accent }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 80,
        left: "50%",
        transform: "translateX(-50%)",
        width: "85%",
        textAlign: "center",
        fontSize: 26,
        color: "#fff",
        fontWeight: 500,
        fontFamily: FONT_STACK,
        lineHeight: 1.6,
        opacity,
        textShadow: "0 2px 8px rgba(0,0,0,0.8)",
        letterSpacing: 0.5,
      }}
    >
      {text}
    </div>
  );
};

/* ---------- 子组件：装饰性背景粒子 ---------- */
const Particles: React.FC<{ accent: string }> = ({ accent }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: 0.3 }}>
      {Array.from({ length: 15 }).map((_, i) => {
        const x = seeded(i * 7) * 100;
        const y = seeded(i * 13) * 100;
        const size = 2 + seeded(i * 3) * 2;
        const speed = 0.3 + seeded(i * 11) * 0.5;
        const offset = frame * speed;
        
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${(y + offset / 15) % 105}%`,
              width: size,
              height: size,
              borderRadius: "50%",
              background: accent,
              opacity: 0.15 + Math.sin(frame / 50 + i) * 0.1,
              filter: "blur(1px)",
            }}
          />
        );
      })}
    </div>
  );
};

/* ---------- 主组件 ---------- */
export const TemplateComponent: React.FC<TemplateProps> = ({
  title = "话术博弈",
  subtitle = "如何优雅的套出对方的真心话？",
  bgFrom = "#0f0f12",
  bgTo = "#1a1a1e",
  accentFrom = "#d4af37",
  accentTo = "#f4d03f",
}) => {
  const frame = useCurrentFrame();
  const ACCENT = accentFrom;

  // 场景控制
  const isSecondCase = frame >= 300;
  const caseOpacity = interpolate(
    frame,
    [280, 300],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const case2Opacity = interpolate(
    frame,
    [300, 320],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${bgFrom} 0%, ${bgTo} 100%)`,
        fontFamily: FONT_STACK,
        color: "#fff",
      }}
    >
      <Particles accent={ACCENT} />

      {/* 场景一：01 弱点献祭 */}
      {!isSecondCase && (
        <div style={{ opacity: caseOpacity }}>
          <HeaderTag num="01" label="弱点献祭" badge="熟人篇" accent={ACCENT} />
          
          <div
            style={{
              position: "absolute",
              top: 140,
              left: "50%",
              transform: "translateX(-50%)",
              width: "75%",
              maxWidth: 800,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* 错误问法组 */}
            <div style={{ marginBottom: 8 }}>
              <Label text="错误问法" delay={30} accent={ACCENT} />
              <ChatBubble
                text="你今天怎么回事？脸拉那么长。"
                isWrong={true}
                isMe={true}
                label="我"
                delay={35}
                accent={ACCENT}
              />
            </div>

            <div style={{ marginBottom: 32 }}>
              <ChatBubble
                text="没事，你别管。"
                isWrong={true}
                isMe={false}
                label="TA"
                delay={60}
                accent={ACCENT}
              />
            </div>

            {/* 换个问法组 */}
            <div style={{ marginBottom: 8 }}>
              <Label text="换个问法" isGold={true} delay={120} accent={ACCENT} />
              <ChatBubble
                text="我今天其实挺丧的，被客户怼了一下午。"
                secondaryText="你呢？"
                isWrong={false}
                isMe={true}
                label="我"
                delay={125}
                accent={ACCENT}
              />
            </div>

            <div>
              <ChatBubble
                text="我也是……做了两天的方案，"
                secondaryText="领导一句话就给否了。"
                isWrong={false}
                isMe={false}
                label="TA"
                delay={150}
                accent={ACCENT}
              />
            </div>
          </div>

          <Subtitle
            text="另一半回家一直刷手机，问就是"没什么"。"
            delay={200}
            accent={ACCENT}
          />
        </div>
      )}

      {/* 场景二：02 切口降维 */}
      {isSecondCase && (
        <div style={{ opacity: case2Opacity }}>
          <HeaderTag num="02" label="切口降维" badge="熟人篇" accent={ACCENT} />
          
          <div
            style={{
              position: "absolute",
              top: 140,
              left: "50%",
              transform: "translateX(-50%)",
              width: "75%",
              maxWidth: 800,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ marginBottom: 8 }}>
              <Label text="错误问法" delay={330} accent={ACCENT} />
              <ChatBubble
                text="那你到底想吃什么？"
                isWrong={true}
                isMe={true}
                label="我"
                delay={335}
                accent={ACCENT}
              />
            </div>

            <div style={{ marginBottom: 32 }}>
              <ChatBubble
                text="真的都行，你定吧。"
                isWrong={true}
                isMe={false}
                label="TA"
                delay={360}
                accent={ACCENT}
              />
            </div>

            <div style={{ marginBottom: 8 }}>
              <Label text="换个问法" isGold={true} delay={420} accent={ACCENT} />
              <ChatBubble
                text="那火锅和日料，你更不想吃哪个？"
                isWrong={false}
                isMe={true}
                label="我"
                delay={425}
                accent={ACCENT}
              />
            </div>

            <div>
              <ChatBubble
                text="火锅吧……昨天刚吃过，而且我最近在减肥。"
                isWrong={false}
                isMe={false}
                label="TA"
                delay={450}
                accent={ACCENT}
              />
            </div>
          </div>

          <Subtitle
            text="一句话，漏出两个信息：吃腻了，还在控制饮食。"
            delay={500}
            accent={ACCENT}
          />
        </div>
      )}
    </AbsoluteFill>
  );
};
