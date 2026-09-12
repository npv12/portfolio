"use client";

import { createRef, useEffect, useRef, useState } from "react";

import { createItem, SphereItem, updateItemPosition } from "./helper";
import { defaultStyles, tagSphereProps } from "./types";

const buildItems = (skills: tagSphereProps["skills"], size: number): SphereItem[] =>
  skills.map((skill, index) =>
    createItem(
      <span title={skill.name} className="inline-flex text-base-content">
        <skill.Icon size={36} aria-label={skill.name} />
      </span>,
      index,
      skills.length,
      size,
      createRef<HTMLSpanElement>()
    )
  );

export default function TagSphere(props: tagSphereProps) {
  const {
    maxSpeed,
    initialSpeed,
    skills,
    initialDirection,
    keepRollingAfterMouseOut,
    fullHeight,
    fullWidth,
    style,
    useContainerInlineStyles,
  }: tagSphereProps = props;

  const radius = props.radius ?? skills.length * 10;
  const depth = 2 * radius;
  const size = 1.5 * radius;

  const [items, setItems] = useState<SphereItem[]>(() =>
    buildItems(skills, size)
  );
  const [firstRender, setFirstRender] = useState(true);
  const [lessSpeed, setLessSpeed] = useState(maxSpeed);
  const [active, setActive] = useState(false);
  const [mouseX, setMouseX] = useState(
    () => initialSpeed * Math.sin(initialDirection * (Math.PI / 180))
  );
  const [mouseY, setMouseY] = useState(
    () => -initialSpeed * Math.cos(initialDirection * (Math.PI / 180))
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMouseX((e.clientX - (rect.left + rect.width / 2)) / 5);
    setMouseY((e.clientY - (rect.top + rect.height / 2)) / 5);
  };

  const checkTouchCoordinates = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return false;
    const rect = containerRef.current.getBoundingClientRect();
    const touchX = e.targetTouches[0].clientX;
    const touchY = e.targetTouches[0].clientY;
    return (
      touchX > rect.left &&
      touchX < rect.right &&
      touchY < rect.bottom &&
      touchY > rect.top
    );
  };

  const next = () => {
    setItems((current) => {
      if (lessSpeed == 0) return current;

      let a: number;
      let b: number;
      if (!keepRollingAfterMouseOut && !active && !firstRender) {
        setLessSpeed((lessSpeedCurrent) => {
          const lessConstant = lessSpeed * (maxSpeed / 200);
          return lessSpeedCurrent - lessConstant > 0.01
            ? lessSpeedCurrent - lessConstant
            : 0;
        });
        a = -(Math.min(Math.max(-mouseY, -size), size) / radius) * lessSpeed;
        b = (Math.min(Math.max(-mouseX, -size), size) / radius) * lessSpeed;
      } else if (!active && !firstRender && keepRollingAfterMouseOut) {
        a =
          -(Math.min(Math.max(-mouseY, -size), size) / radius) *
          (maxSpeed * 0.5);
        b =
          (Math.min(Math.max(-mouseX, -size), size) / radius) *
          (maxSpeed * 0.5);
      } else {
        a = -(Math.min(Math.max(-mouseY, -size), size) / radius) * maxSpeed;
        b = (Math.min(Math.max(-mouseX, -size), size) / radius) * maxSpeed;
      }

      if (Math.abs(a) <= 0.01 && Math.abs(b) <= 0.01) return current;

      const l = Math.PI / 180;
      const sc = [
        Math.sin(a * l),
        Math.cos(a * l),
        Math.sin(b * l),
        Math.cos(b * l),
      ];

      return current.map((item) => updateItemPosition(item, sc, depth));
    });
  };

  useEffect(() => {
    const animationFrame = requestAnimationFrame(next);
    return () => cancelAnimationFrame(animationFrame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mouseX, mouseY, lessSpeed, active, items, props.radius]);

  return (
    <div
      className={props.className}
      ref={containerRef}
      onMouseOver={() => {
        setActive(true);
        setFirstRender(false);
        setLessSpeed(maxSpeed);
      }}
      onMouseOut={() => {
        setActive(false);
      }}
      onMouseMove={handleMouseMove}
      onTouchStart={() => {
        setActive(true);
        setLessSpeed(maxSpeed);
        setFirstRender(false);
      }}
      onTouchMove={(e: React.TouchEvent<HTMLDivElement>) => {
        if (checkTouchCoordinates(e)) {
          const touch = e.targetTouches[0];
          handleMouseMove({
            clientX: touch.clientX,
            clientY: touch.clientY,
          } as React.MouseEvent<HTMLDivElement>);
        } else {
          setActive(false);
        }
      }}
      style={
        useContainerInlineStyles
          ? style || defaultStyles.getContainer(radius, fullWidth, fullHeight)
          : undefined
      }
    >
      {items.map((item) => item.el)}
    </div>
  );
}
