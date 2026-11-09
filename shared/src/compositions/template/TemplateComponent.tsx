import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  Sequence,
} from "remotion";
import type { TemplateProps } from "../../lib/props";
import { FONT_STACK, seeded } from "../../lib/anim";

/* ------------------------------------------------------------------ */
/*  deterministic helpers                                              */
/* ------------------------------------------------------------------ */

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

/** dust particle */
const Dust: React.FC<{ i: number; frame: number }> = ({ i, frame }) => {
  const r1 = seeded(i * 3 + 1);
  const r2 = seeded(i * 3 + 2);
  const r3 = seeded(i * 3 + 3);
  const x = 620 + r1 * 680;
  const startY = 300 + r2 * 120;
  const speed = 0.25 + r3 * 0.5;
  const y = startY + ((frame * speed + r1 * 400) % 420);
  const drift = Math.sin(frame * 0.02 + r2 * 6.28) * 14;
  const o = interpolate(y, [300, 720], [0.7, 0], clamp);
  const s = 1.4 + r3 * 2.2;
  return (
    <div
      style={{
        position: "absolute",
        left: x + drift,
        top: y,
        width: s,
        height: s,
        borderRadius: "50%",
        background: "#cbb98a",
        opacity: o,
      }}
    />
  );
};

/** cobweb – corner decoration */
const Web: React.FC<{ x: number; y: number; flip?: boolean }> = ({
  x,
  y,
  flip,
}) => {
  const rays = [0, 30, 60, 90];
  const arcs = [40, 80, 118];
  return (
    <svg
      width={150}
      height={150}
      viewBox="0 0 150 150"
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: flip ? "scaleX(-1)" : undefined,
        opacity: 0.55,
      }}
    >
      {rays.map((a) => (
        <line
          key={a}
          x1={0}
          y1={0}
          x2={150 * Math.cos((a * Math.PI) / 180)}
          y2={150 * Math.sin((a * Math.PI) / 180)}
          stroke="#8a8272"
          strokeWidth={1.2}
        />
      ))}
      {arcs.map((r) => (
        <path
          key={r}
          d={`M ${r} 0 A ${r} ${r} 0 0 1 0 ${r}`}
          fill="none"
          stroke="#8a8272"
          strokeWidth={1}
        />
      ))}
    </svg>
  );
};

/** single decaying room scene */
const RoomScene: React.FC<{ frame: number; variant: number }> = ({
  frame,
  variant,
}) => {
  const grime = interpolate(variant, [0, 1, 2], [0, 0.55, 1], clamp);
  const flowerWilt = interpolate(variant, [0, 1, 2], [0, 0.7, 1], clamp);
  const beamO = interpolate(variant, [0, 1, 2], [0.5, 0.32, 0.2], clamp);

  const dustCount = Math.round(18 + grime * 85);
  const dust: React.ReactNode[] = [];
  for (let i = 0; i < dustCount; i++) {
    dust.push(<Dust key={i} i={i + variant * 200} frame={frame} />);
  }

  return (
    <>
      {/* back wall */}
      <div
        style={{
          position: "absolute",
          left: 600,
          top: 290,
          width: 720,
          height: 480,
          background: "#1d1a17",
          border: "1px solid #2c2823",
        }}
      />
      {/* side walls */}
      <div
        style={{
          position: "absolute",
          left: 300,
          top: 290,
          width: 300,
          height: 480,
          background: "#151310",
          transform: "skewY(18deg)",
          transformOrigin: "top right",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 1320,
          top: 290,
          width: 300,
          height: 480,
          background: "#151310",
          transform: "skewY(-18deg)",
          transformOrigin: "top left",
        }}
      />
      {/* floor */}
      <div
        style={{
          position: "absolute",
          left: 300,
          top: 770,
          width: 1320,
          height: 310,
          background: "#171410",
          transform: "perspective(900px) rotateX(58deg)",
          transformOrigin: "top center",
        }}
      />

      {/* window */}
      <div
        style={{
          position: "absolute",
          left: 840,
          top: 380,
          width: 240,
          height: 200,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: 8,
          background: "#0d0b09",
          padding: 8,
        }}
      >
        {[0, 1, 2, 3].map((p) => (
          <div
            key={p}
            style={{
              background: `rgba(232,214,164,${0.92 - grime * 0.35})`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* grime speckles */}
            {Array.from({ length: Math.round(grime * 14) }).map((_, k) => {
              const sx = seeded(p * 50 + k) * 100;
              const sy = seeded(p * 50 + k + 99) * 100;
              return (
                <div
                  key={k}
                  style={{
                    position: "absolute",
                    left: `${sx}%`,
                    top: `${sy}%`,
                    width: 3,
                    height: 3,
                    borderRadius: "50%",
                    background: "#4a4234",
                    opacity: 0.8,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* picture frame */}
      <div
        style={{
          position: "absolute",
          left: 1150,
          top: 390,
          width: 110,
          height: 80,
          border: "4px solid #3a342c",
          background: "#12100d",
          transform: `rotate(${3 + grime * 9}deg)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 46,
            height: 30,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(190,160,110,0.5), transparent 70%)",
          }}
        />
      </div>

      {/* cobwebs appear with decay */}
      {grime > 0.25 && (
        <>
          <Web x={610} y={295} />
          <Web x={1170} y={295} flip />
        </>
      )}

      {/* table */}
      <div
        style={{
          position: "absolute",
          left: 800,
          top: 790,
          width: 320,
          height: 16,
          background: "#2a251e",
        }}
      />
      {[0, 1].map((l) => (
        <div
          key={l}
          style={{
            position: "absolute",
            left: 830 + l * 260,
            top: 806,
            width: 12,
            height: 120,
            background: "#241f19",
          }}
        />
      ))}

      {/* flower */}
      <div
        style={{
          position: "absolute",
          left: 948,
          top: 662 + flowerWilt * 26,
          transform: `rotate(${flowerWilt * 38}deg)`,
          transformOrigin: "bottom center",
        }}
      >
        <div
          style={{
            width: 4,
            height: 130,
            background: "#3f5a3a",
            margin: "0 auto",
          }}
        />
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: `rgba(214,110,110,${1 - flowerWilt * 0.55})`,
            margin: "-6px auto 0",
            boxShadow: `0 0 ${14 - flowerWilt * 10}px rgba(214,110,110,0.6)`,
          }}
        />
      </div>
      {/* fallen petals */}
      {variant >= 1 &&
        [0, 1, 2].map((p) => (
          <div
            key={p}
            style={{
              position: "absolute",
              left: 890 + seeded(p + 7) * 160,
              top: 782,
              width: 10,
              height: 6,
              borderRadius: "50%",
              background: "rgba(190,95,95,0.7)",
              transform: `rotate(${seeded(p) * 180}deg)`,
            }}
          />
        ))}

      {/* light beam */}
      <div
        style={{
          position: "absolute",
          left: 640,
          top: 380,
          width: 460,
          height: 560,
          background:
            "linear-gradient(105deg, rgba(232,214,164,0.28), rgba(232,214,164,0.04) 65%, transparent)",
          clipPath: "polygon(42% 0, 58% 0, 100% 100%, 0% 100%)",
          opacity: beamO,
          mixBlendMode: "screen",
        }}
      />

      {dust}
    </>
  );
};

/* ------------------------------------------------------------------ */
/*  city skyline                                                       */
/* ------------------------------------------------------------------ */

const CityScene: React.FC<{ frame: number }> = ({ frame }) => {
  const buildings = 16;
  const els: React.ReactNode[] = [];
  for (let b = 0; b < buildings; b++) {
    const r = seeded(b + 11);
    const bw = 90 + r * 80;
    const bh = 260 + seeded(b + 77) * 420;
    const x = (1920 / buildings) * b - 20;
    const y = 1080 - bh;
    const cols = Math.max(2, Math.floor(bw / 34));
    const rows = Math.max(4, Math.floor(bh / 46));
    const windows: React.ReactNode[] = [];
    for (let c = 0; c < cols; c++) {
      for (let rr = 0; rr < rows; rr++) {
        const lit = seeded(b * 1000 + c * 100 + rr) > 0.42;
        const flick = seeded(b * 500 + c * 31 + rr * 7);
                        const blink =
                  flick > 0.93
                    ? Math.sin(frame * 0.06 + flick * 40) > 0 ? 1 : 0.12
                    : 1;
                windows.push(
          <div
            key={`${c}-${rr}`}
            style={{
              width: 12,
              height: 18,
              background: lit
                ? `rgba(240,205,130,${0.75 * blink})`
                : "rgba(60,58,52,0.5)",
            }}
          />
        );
      }
    }
    els.push(
      <div
        key={b}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: bw,
          height: bh,
          background: "#0c0e13",
          border: "1px solid #171a21",
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: "12px 10px",
          padding: 14,
          alignContent: "start",
        }}
      >
        {windows}
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 30%, #10131c 0%, #05060a 70%)",
        }}
      />
      {/* stars */}
      {Array.from({ length: 60 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: seeded(i + 300) * 1920,
            top: seeded(i + 600) * 380,
            width: 2,
            height: 2,
            borderRadius: "50%",
            background: "#cfd6e4",
            opacity: 0.3 + seeded(i + 900) * 0.5,
          }}
        />
      ))}
      {els}
      {/* ground haze */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 220,
          background:
            "linear-gradient(to top, rgba(4,5,8,0.95), transparent)",
        }}
      />
    </>
  );
};

/* ------------------------------------------------------------------ */
/*  big caption with word-by-word pop + accent highlight               */
/* ------------------------------------------------------------------ */

const Caption: React.FC<{
  frame: number;
  fps: number;
  parts: { text: string; accent?: boolean }[];
  accentFrom: string;
  accentTo: string;
}> = ({ frame, fps, parts, accentFrom, accentTo }) => {
  let wordIndex = 0;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 110,
        display: "flex",
        justifyContent: "center",
        gap: "0.35em",
        fontFamily: FONT_STACK,
        fontWeight: 800,
        fontSize: 64,
        color: "#f3ecdc",
        textShadow: "0 4px 30px rgba(0,0,0,0.85)",
        whiteSpace: "nowrap",
      }}
    >
      {parts.map((p, pi) => {
        const words = p.text.split("");
        const el = (
          <span key={pi} style={{ display: "inline-flex" }}>
            {words.map((ch, ci) => {
              const idx = wordIndex++;
              const sp = spring({
                frame: frame - idx * 2,
                fps,
                config: { damping: 12, stiffness: 170, mass: 0.7 },
              });
              const y = interpolate(sp, [0, 1], [46, 0]);
              const sc = interpolate(sp, [0, 1], [0.4, 1]);
              return (
                <span
                  key={ci}
                  style={{
                    display: "inline-block",
                    transform: `translateY(${y}px) scale(${sc})`,
                    color: p.accent ? accentTo : undefined,
                    background: p.accent
                      ? `linear-gradient(90deg, ${accentFrom}, ${accentTo})`
                      : undefined,
                    WebkitBackgroundClip: p.accent ? "text" : undefined,
                    WebkitTextFillColor: p.accent ? "transparent" : undefined,
                  }}
                >
                  {ch}
                </span>
              );
            })}
          </span>
        );
        return el;
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  main component                                                     */
/* ------------------------------------------------------------------ */

export const TemplateComponent: React.FC<TemplateProps> = ({
  title = "熵增",
  subtitle = "看懂了熵增，就原谅了生活",
  bgFrom = "#0b0a08",
  bgTo = "#050505",
  accentFrom = "#e8c96a",
  accentTo = "#f5e3a8",
}) => {
  const frame = useCurrentFrame();
  const fps = 30;

  /* scene timing */
  const roomLen = 132; // per room variant
  const cityStart = roomLen * 3 + 6;

  const titleIn = spring({ frame: frame - 6, fps, config: { damping: 14, stiffness: 120 } });
  const titleY = interpolate(titleIn, [0, 1], [60, 0]);
  const titleOp = interpolate(frame, [4, 22], [0, 1], clamp);

  const subOp = interpolate(frame, [26, 44], [0, 1], clamp);
  const subY = interpolate(frame, [26, 44], [24, 0], clamp);

  /* concept morph 熵增 → 释然 */
  const morph = interpolate(frame, [cityStart + 40, cityStart + 95], [0, 1], clamp);
  const conceptColor = interpolate(morph, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${bgFrom}, ${bgTo})`,
        fontFamily: FONT_STACK,
      }}
    >
      {/* ambient vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 55%, transparent 40%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      {/* opening title block */}
      {frame < cityStart && (
        <div
          style={{
            position: "absolute",
            top: 90,
            left: 0,
            right: 0,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 96,
              fontWeight: 900,
              letterSpacing: "0.12em",
              color: "#f3ecdc",
              opacity: titleOp,
              transform: `translateY(${titleY}px)`,
              textShadow: `0 0 60px ${accentFrom}55`,
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 30,
              fontWeight: 500,
              letterSpacing: "0.3em",
              color: "#b9b0a0",
              opacity: subOp,
              transform: `translateY(${subY}px)`,
            }}
          >
            {subtitle}
          </div>
          {/* accent underline */}
          <div
            style={{
              margin: "26px auto 0",
              height: 6,
              width: interpolate(frame, [30, 60], [0, 320], clamp),
              background: `linear-gradient(90deg, ${accentFrom}, ${accentTo})`,
              borderRadius: 3,
            }}
          />
        </div>
      )}

      {/* room scenes – three decay states, hard cuts with ghost displacement */}
      {[0, 1, 2].map((v) => {
        const start = v * roomLen;
        const end = start + roomLen;
        if (frame < start || frame >= end) return null;
        const local = frame - start;
        const ghost =
          v > 0 ? interpolate(local, [0, 10], [26, 0], clamp) : 0;
        const ghostOp = v > 0 ? interpolate(local, [0, 10], [0.35, 0], clamp) : 0;
        return (
          <React.Fragment key={v}>
            {v > 0 && (
              <div style={{ position: "absolute", inset: 0, transform: `translateX(${-ghost}px)`, opacity: ghostOp }}>
                <RoomScene frame={frame} variant={v - 1} />
              </div>
            )}
            <div style={{ position: "absolute", inset: 0, transform: `translateX(${ghost * 0.4}px)` }}>
              <RoomScene frame={frame} variant={v} />
            </div>
            <Caption
              frame={local}
              fps={fps}
              parts={[
                { text: "房间不打扫，" },
                { text: "就会落满灰。", accent: true },
              ]}
              accentFrom={accentFrom}
              accentTo={accentTo}
            />
          </React.Fragment>
        );
      })}

      {/* city scene */}
      {frame >= cityStart && (
        <>
          <CityScene frame={frame} />
          <Caption
            frame={frame - cityStart}
            fps={fps}
            parts={[
              { text: "城市没有人，" },
              { text: "就会退回森林。", accent: true },
            ]}
            accentFrom={accentFrom}
            accentTo={accentTo}
          />

          {/* concept morph chip */}
          <div
            style={{
              position: "absolute",
              top: 130,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              gap: 26,
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: 54,
                fontWeight: 900,
                letterSpacing: "0.15em",
                color: `rgba(232,201,106,${1 - conceptColor})`,
                transform: `translateY(${interpolate(morph, [0, 1], [0, -26], clamp)}px)`,
                opacity: 1 - morph,
              }}
            >
              熵增
            </div>
            <div
              style={{
                fontSize: 54,
                fontWeight: 900,
                letterSpacing: "0.15em",
                color: accentTo,
                transform: `translateY(${interpolate(morph, [0, 1], [26, 0], clamp)}px)`,
                opacity: morph,
                textShadow: `0 0 40px ${accentFrom}88`,
              }}
            >
              释然
            </div>
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};
