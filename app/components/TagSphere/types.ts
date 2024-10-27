import { CSSProperties } from "react";

export type tagSphereProps = {
  skills: string[];
  radius?: number;
  maxSpeed: number;
  initialSpeed: number;
  initialDirection: 135;
  keepRollingAfterMouseOut: boolean;
  className?: string;
  style?: CSSProperties;
  useContainerInlineStyles: boolean;
  fullWidth: boolean;
  fullHeight: boolean;
};

export const defaultState: tagSphereProps = {
  skills: ["python", "java", "C++", "C", "mongoDB", "go", "rust"],
  maxSpeed: 4,
  initialSpeed: 32,
  initialDirection: 135,
  keepRollingAfterMouseOut: false,
  useContainerInlineStyles: true,
  fullWidth: false,
  fullHeight: false,
};

export const defaultStyles = {
  getContainer: (radius: number, fullWidth: boolean, fullHeight: boolean) =>
    ({
      position: "relative",
      width: fullWidth ? "100%" : `${2 * radius}px`,
      maxWidth: "100%",
      minHeight: `${2 * radius}px`,
      height: fullHeight ? "100%" : `${2 * radius}px`,
      touchAction: "none",
      zIndex: -1,
    } as CSSProperties),
};
