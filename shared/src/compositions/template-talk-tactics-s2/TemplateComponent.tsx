import React from "react";
import { useCurrentFrame, interpolate, spring, AbsoluteFill } from "remotion";
import { TemplateProps } from "../../lib/props";
import { FONT_STACK, seeded, accentText } from "../../lib/anim";

const MessageBubble = ({ 
  children, 
  isRight = false, 
  delay = 0, 
  accent = "#D4AF37",
  dim = false
}: { 
  children: React.ReactNode; 
  isRight?: boolean; 
  delay?: number;
  accent?: string;
  dim?: boolean;
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [delay, delay + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(frame, [delay, delay + 20], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  
  const alignSelf = isRight ? "flex-end" : "flex-start";
  const borderColor = isRight ? accent : "#444";
  const bg = isRight ? "rgba(212, 175, 55, 0.08)" : "rgba(255,255,255,0.03)";
  
  return (
    <div
      style={{
        alignSelf,
        maxWidth: "70%",
        marginBottom: 24,
        padding: "16px 24px",
        borderRadius: 12,
        border: `1px solid ${borderColor}`,
        backgroundColor: bg,
        color: dim ? "#666" : "#E5E5E5",
        fontSize: 28,
        lineHeight: 1.6,
        opacity,
        transform: `translateY(${translateY}px)`,
        fontFamily: FONT_STACK,
        position: "relative",
      }}
    >
      {children}
    </div>
  );
};

const Avatar = ({ label, delay = 0, isRight = false }: { label: string; delay?: number; isRight?: boolean }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [delay, delay + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  
  return (
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: "50%",
        border: "1px solid #666",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 20,
        color: "#888",
        marginLeft: isRight ? 16 : 0,
        marginRight: isRight ? 0 : 16,
        opacity,
        fontFamily: FONT_STACK,
        flexShrink: 0,
      }}
    >
      {label}
    </div>
  );
};

const Tag = ({ text, delay = 0, type = "wrong" }: { text: string; delay?: number; type?: "wrong" | "right" }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [delay, delay + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [delay, delay + 15], [0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  
  const color = type === "wrong" ? "#C74B4B" : "#4BC74B";
  const icon = type === "wrong" ? "✕" : "✓";
  
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 18,
        color: color,
        marginBottom: 8,
        opacity,
        transform: `scale(${scale})`,
        fontFamily: FONT_STACK,
      }}
    >
      <span>{icon}</span>
      <span>{text}</span>
    </div>
  );
};

export const TemplateComponent: React.FC<TemplateProps> = ({
  title = "如何优雅的套出对方的真心话？",
  bgFrom = "#0A0A0A",
  bgTo = "#1A1A1A",
  accentFrom = "#D4AF37",
  accentTo = "#C9A227",
}) => {
  const frame = useCurrentFrame();
  
  // Background gradient
  const bgGradient = `linear-gradient(135deg, ${bgFrom} 0%, ${bgTo} 100%)`;
  
  // Section 1: 01 弱点献祭
  const section1Opacity = interpolate(frame, [0, 20, 100, 120], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  
  // Section 2: 02 切口降维
  const section2Opacity = interpolate(frame, [110, 130, 220, 240], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  
  // Header animations
  const header1Opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const header1X = interpolate(frame, [0, 20], [-50, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  const header2Opacity = interpolate(frame, [110, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const header2X = interpolate(frame, [110, 130], [-50, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  return (
    <AbsoluteFill style={{ background: bgGradient, padding: 80 }}>
      {/* Section 1 */}
      <div style={{ opacity: section1Opacity, position: "absolute", inset: 80, display: frame < 120 ? "block" : "none" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 60, opacity: header1Opacity, transform: `translateX(${header1X}px)` }}>
          <span style={{ fontSize: 32, color: accentFrom, fontWeight: 600, fontFamily: FONT_STACK }}>01</span>
          <span style={{ fontSize: 32, color: "#E5E5E5", fontWeight: 600, fontFamily: FONT_STACK }}>弱点献祭</span>
          <span style={{ fontSize: 20, color: "#888", padding: "4px 12px", border: "1px solid #444", borderRadius: 4, fontFamily: FONT_STACK }}>熟人篇</span>
        </div>
        
        {/* Chat container */}
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 900, margin: "0 auto" }}>
          {/* Wrong way */}
          <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 32 }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <Tag text="错误问法" delay={10} type="wrong" />
              <MessageBubble isRight={true} delay={15} accent={accentFrom} dim={true}>
                {"你今天怎么回事？脸拉那么长。"}
              </MessageBubble>
            </div>
            <Avatar label="我" delay={15} isRight={true} />
          </div>
          
          <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 48 }}>
            <Avatar label="TA" delay={25} />
            <MessageBubble isRight={false} delay={25} dim={true}>
              {"没事，你别管。"}
            </MessageBubble>
          </div>
          
          {/* Right way */}
          <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 32 }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <Tag text="换个问法" delay={40} type="right" />
              <MessageBubble isRight={true} delay={45} accent={accentFrom}>
                {"我今天其实挺丧的，被客户怼了一下午。你呢？"}
              </MessageBubble>
            </div>
            <Avatar label="我" delay={45} isRight={true} />
          </div>
          
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <Avatar label="TA" delay={55} />
            <MessageBubble isRight={false} delay={55}>
              {"我也是……做了两天的方案，领导一句话就给否了。"}
            </MessageBubble>
          </div>
        </div>
        
        {/* Bottom text */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, textAlign: "center", opacity: interpolate(frame, [70, 85], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <span style={{ fontSize: 32, color: "#E5E5E5", fontFamily: FONT_STACK, fontWeight: 500 }}>
            {"另一半回家一直刷手机，问就是\"没什么\"。"}
          </span>
        </div>
      </div>
      
      {/* Section 2 */}
      <div style={{ opacity: section2Opacity, position: "absolute", inset: 80, display: frame >= 120 ? "block" : "none" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 60, opacity: header2Opacity, transform: `translateX(${header2X}px)` }}>
          <span style={{ fontSize: 32, color: accentFrom, fontWeight: 600, fontFamily: FONT_STACK }}>02</span>
          <span style={{ fontSize: 32, color: "#E5E5E5", fontWeight: 600, fontFamily: FONT_STACK }}>切口降维</span>
          <span style={{ fontSize: 20, color: "#888", padding: "4px 12px", border: "1px solid #444", borderRadius: 4, fontFamily: FONT_STACK }}>熟人篇</span>
        </div>
        
        {/* Chat container */}
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 900, margin: "0 auto" }}>
          {/* Wrong way - faded */}
          <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 32, opacity: 0.4 }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <Tag text="错误问法" delay={120} type="wrong" />
              <MessageBubble isRight={true} delay={125} accent={accentFrom} dim={true}>
                {"那你到底想吃什么？"}
              </MessageBubble>
            </div>
            <Avatar label="我" delay={125} isRight={true} />
          </div>
          
          <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 48, opacity: 0.4 }}>
            <Avatar label="TA" delay={135} />
            <MessageBubble isRight={false} delay={135} dim={true}>
              {"真的都行，你定吧。"}
            </MessageBubble>
          </div>
          
          {/* Right way */}
          <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 32 }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <Tag text="换个问法" delay={150} type="right" />
              <MessageBubble isRight={true} delay={155} accent={accentFrom}>
                {"那火锅和日料，你更不想吃哪个？"}
              </MessageBubble>
            </div>
            <Avatar label="我" delay={155} isRight={true} />
          </div>
          
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <Avatar label="TA" delay={165} />
            <MessageBubble isRight={false} delay={165}>
              {"火锅吧……昨天刚吃过，而且我最近在减肥。"}
            </MessageBubble>
          </div>
        </div>
        
        {/* Bottom text */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, textAlign: "center", opacity: interpolate(frame, [180, 195], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <span style={{ fontSize: 32, color: "#E5E5E5", fontFamily: FONT_STACK, fontWeight: 500 }}>
            {"一句话，漏出两个信息：吃腻了，还在控制饮食。"}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
