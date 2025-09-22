import React from "react";
import { IconProps } from "../Icon";


const CheckIcon: React.FC<IconProps> = ({ color = "primary", width = 24, height = 24, className, ...props }) => {
  const colorMap: Record<string, string> = {
    primary: "#000000",
    secondary: "#afadb5",
    accent: "#518581",
  };

  const colorValue = colorMap[color] || colorMap.primary;

  return (
    <svg
      className={className}
      data-testid={props["data-testid"]}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M4 11.6129L9.87755 18L20 7" stroke={colorValue} strokeWidth="2"/>
    </svg>
  );
};

export default CheckIcon;
