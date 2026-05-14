import type { CSSProperties } from "react";

type ShinyTextProps = {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  color?: string;
  shineColor?: string;
  spread?: number;
  yoyo?: boolean;
  direction?: "left" | "right";
  delay?: number;
};

type ShinyStyle = CSSProperties & {
  "--shine-angle": string;
  "--shine-base": string;
  "--shine-color": string;
  "--shine-speed": string;
  "--shine-delay": string;
};

type ShinyCharStyle = CSSProperties & {
  "--scatter-x": string;
  "--scatter-y": string;
  "--scatter-r": string;
  "--scatter-delay": string;
};

export default function ShinyText({
  text,
  disabled = false,
  speed = 3.8,
  className = "",
  color = "rgba(255, 250, 241, 0.82)",
  shineColor = "#ffffff",
  spread = 116,
  yoyo = false,
  direction = "left",
  delay = 0,
}: ShinyTextProps) {
  const style: ShinyStyle = {
    "--shine-angle": `${spread}deg`,
    "--shine-base": color,
    "--shine-color": shineColor,
    "--shine-speed": `${speed}s`,
    "--shine-delay": `${delay}s`,
  };
  const characters = Array.from(text);

  return (
    <span
      className={`shiny-text${disabled ? " is-disabled" : ""}${yoyo ? " is-yoyo" : ""} ${className}`.trim()}
      data-direction={direction}
      data-text={text}
      style={style}
    >
      {characters.map((character, index) => {
        const directionMultiplier = index % 2 === 0 ? 1 : -1;
        const spreadX = ((index % 7) - 3) * 14 + directionMultiplier * 18;
        const spreadY = ((index % 5) - 2) * 13 - 16;
        const rotate = ((index % 7) - 3) * 5.4;
        const charStyle: ShinyCharStyle = {
          "--scatter-x": `${spreadX}px`,
          "--scatter-y": `${spreadY}px`,
          "--scatter-r": `${rotate}deg`,
          "--scatter-delay": `${index * 0.035}s`,
        };

        return (
          <span className="shiny-char" key={`${character}-${index}`} style={charStyle}>
            {character === " " ? "\u00A0" : character}
          </span>
        );
      })}
    </span>
  );
}
