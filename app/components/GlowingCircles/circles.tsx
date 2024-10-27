import Image from "next/image";
import { FC } from "react";

import { GlowingCirclesProps } from "./type";

/**
 * GlowingCircles
 *
 * A component that renders a set of glowing circles. The component takes in a few
 * props:
 *
 * - `maxRadius`: The maximum radius of the circles. Defaults to 1414.
 * - `position`: A string indicating the position of the circles. Can be either
 *   "middle", "left", or "right". Defaults to "middle".
 *
 * The component renders a set of circles of decreasing radius, with the largest
 * circle at the specified `maxRadius`. The circles are positioned according to
 * the `position` prop. The component uses the `Image` component from Next.js to
 * render the circles.
 *
 * The circles are rendered with the `invert` CSS filter, which makes them appear
 * as white circles. The `dark:invert-0` class is also applied, which makes the
 * circles appear as black circles in dark mode.
 */
const GlowingCircles: FC<GlowingCirclesProps> = ({
  maxRadius = 1200,
  position = "left",
}) => {
  const calculatePosition = () => {
    if (position === "left")
      return {
        left: -maxRadius / 2,
      };
    if (position === "middle")
      return {
        margin: "auto",
      };
    return {
      left: `${position}%`,
    };
  };
  return (
    <div className="absolute inset-0 z-[-1]">
      <Image
        alt="Circles"
        height={maxRadius}
        src="/circles.svg"
        width={maxRadius}
        style={{
          position: "absolute",
          ...calculatePosition(),
        }}
      />
    </div>
  );
};

export default GlowingCircles;
