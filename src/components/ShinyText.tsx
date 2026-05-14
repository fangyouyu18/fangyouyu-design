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

  return (
    <span
      className={`shiny-text${disabled ? " is-disabled" : ""}${yoyo ? " is-yoyo" : ""} ${className}`.trim()}
      data-direction={direction}
      data-text={text}
      style={style}
    >
      {text}
    </span>
  );
}
