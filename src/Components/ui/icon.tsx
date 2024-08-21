import React from 'react';

interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  remixIconClass: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "8xl" | "9xl";
}

const sizeClasses = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-md",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
  "6xl": "text-6xl",
  "7xl": "text-7xl",
  "8xl": "text-8xl",
  "9xl": "text-9xl",
};

const Icon: React.FC<IconProps> = ({ remixIconClass, size = "md", ...props }) => {
  return (
    <div {...props} className="flex items-center justify-center">
      <i className={`${remixIconClass} ${sizeClasses[size]} text-white`} />
    </div>
  );
};

export default Icon;
