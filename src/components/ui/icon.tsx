import React from 'react';

interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  remixIconClass: string;
  size?:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "8xl"
    | "9xl";
  color?:
    | "white"
    | "black"
    | "gray"
    | "red"
    | "yellow"
    | "green"
    | "blue"
    | "indigo"
    | "purple"
    | "pink"
    | "atomic-50"
    | "atomic-100"
    | "atomic-200"
    | "atomic-300"
    | "atomic-400"
    | "atomic-500"
    | "atomic-600"
    | "atomic-700"
    | "atomic-800"
    | "atomic-900"
    | "atomic-950";
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

const colors: { [key: string]: string } = {
  white: "text-white",
  black: "text-black",
  gray: "text-gray-500",
  red: "text-red-500",
  yellow: "text-yellow-500",
  green: "text-green-500",
  blue: "text-blue-500",
  indigo: "text-indigo-500",
  purple: "text-purple-500",
  pink: "text-pink-500",
  "atomic-50": "text-atomic-tangerine-50",
  "atomic-100": "text-atomic-tangerine-100",
  "atomic-200": "text-atomic-tangerine-200",
  "atomic-300": "text-atomic-tangerine-300",
  "atomic-400": "text-atomic-tangerine-400",
  "atomic-500": "text-atomic-tangerine-500",
  "atomic-600": "text-atomic-tangerine-600",
  "atomic-700": "text-atomic-tangerine-700",
  "atomic-800": "text-atomic-tangerine-800",
  "atomic-900": "text-atomic-tangerine-900",
  "atomic-950": "text-atomic-tangerine-950",
};

const Icon: React.FC<IconProps> = ({ remixIconClass, size = "md", color = "black", ...props }) => {
  return (
    <div {...props}>
      <i className={`${remixIconClass} ${sizeClasses[size]} ${colors[color]} `} />
    </div>
  );
};

export default Icon;
