import React from "react";
import { IconProps } from "../Icon";

const ArrowDownIcon: React.FC<IconProps> = ({ color = "primary", width = 24, height = 24, className, ...props }) => {
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
      <path fillRule="evenodd" clipRule="evenodd" d="M2.33563 8.74741L3.66436 7.25259L12 14.662L20.3356 7.25259L21.6644 8.74741L12 17.338L2.33563 8.74741Z" fill={colorValue}/>
    </svg>
  );
};

export default ArrowDownIcon;
