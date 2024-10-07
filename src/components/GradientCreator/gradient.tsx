"use client";

import { useEffect, useState } from "react";

import { Gradient, props } from "./types";

const defaultProps = {
  maxGradients: 3,
  heightMultiplier: 1,
};

/**
 * Creates a set of random gradient artifacts to be used in the background of
 * the page.
 *
 * The artifacts are generated randomly and are placed on the page in a
 * non-overlapping manner. The size, position, and type of the artifacts are
 * determined by chance.
 *
 * @param {Object} [options]
 * @param {number} [options.maxGradients=3] The maximum number of gradient
 * artifacts to generate.
 * @returns {JSX.Element[]} The generated gradient artifacts.
 */
function useGradientArtifacts({
  maxGradients,
  heightMultiplier,
}: props = defaultProps) {
  const [gradients, setGradients] = useState<Gradient[]>([]);

  useEffect(() => {
    const numGradients = Math.min(
      Math.floor(Math.random() * 5) + 1,
      maxGradients
    );
    const gradients: Gradient[] = [];
    const occupied = new Set<number>();

    for (let i = 0; i < numGradients; i++) {
      let top: number;
      let left: number;

      do {
        top = Math.floor(Math.random() * 80) + 10;
        left = Math.floor(Math.random() * 80) + 10;
      } while (occupied.has(top * 100 + left));

      occupied.add(top * 100 + left);

      const size = Math.floor(Math.random() * 150) + 50;
      const conic = Math.random() < 0.5;
      const small = Math.random() < 0.5;

      top = Math.min(top, (window.innerHeight / window.innerWidth) * window.innerWidth);
      // multiple the innerheight by heightMultiplier - 1 and add it to the top;
      top = (window.innerHeight * (heightMultiplier - 1)) + top;
      left = Math.min(left, 100);

      gradients.push({
        top,
        left,
        size,
        conic,
        small,
      });
    }

    setGradients(gradients);
  }, []);

  return gradients.map((gradient, index) => (
    <div
      key={index}
      className="absolute bg-gradient-to-r from-primary to-accent rounded-full blur-[90px] z-[-1]"
      style={{
        top: `${gradient.top}px`,
        left: `${gradient.left}%`,
        width: `${gradient.size}px`,
        height: `${gradient.size}px`,
      }}
    />
  ));
}

export default useGradientArtifacts;
