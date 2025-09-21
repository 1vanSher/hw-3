import React from "react";
import clsx from "clsx";
import "./Icon.css";

export interface IconProps extends React.SVGAttributes<SVGElement> {
  className?: string;
  color?: "primary" | "secondary" | "accent";
  width?: number;
  height?: number;
  "data-testid"?: string; 
}

const Icon: React.FC<IconProps> = ({
  className,
  color = "primary",
  width = 24,
  height = 24,
  ...props
}) => {
  const colorMap: Record<string, string> = {
    primary: "#000000",
    secondary: "#afadb5",
    accent: "#518581",
  };

  const colorValue = colorMap[color] || colorMap.primary;

  return React.cloneElement(props.children as React.ReactElement, {
    ...props,
    className: clsx(className),
    width,
    height,
    stroke: colorValue,
    fill: colorValue,
  });
};

export default Icon;
