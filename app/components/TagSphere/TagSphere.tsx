"use client";

import { createRef, useEffect, useRef, useState } from "react";

import { createItem, fetchIconFromText, updateItemPosition } from "./helper";
import { defaultStyles, tagSphereProps } from "./types";
import Image from "next/image";

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

  let radius = props.radius;

  if (!radius) {
    radius = skills.length * 10;
  }

  const depth = 2 * radius;
  const size = 1.5 * radius;
  const itemHooks = skills.map(() => createRef());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [items, setItems]: [any[], any] = useState([]);

  useEffect(() => {
    setItems(() =>
      skills.map((skill, index) => {
        const skillImg = (
          <Image
            width={50}
            height={50}
            src={fetchIconFromText(skill)}
            alt={"Random image"}
          />
        );
        return createItem(
          skillImg,
          index,
          skills.length,
          size,
          itemHooks[index] as React.RefObject<HTMLSpanElement>
        );
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skills]);

  const containerRef = useRef(null);
  const [firstRender, setFirstRender] = useState(true);
  const [lessSpeed, setLessSpeed] = useState(maxSpeed);
  const [active, setActive] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return false;

    const rect = (
      containerRef.current as HTMLDivElement
    ).getBoundingClientRect();

    setMouseX(() => (e.clientX - (rect.left + rect.width / 2)) / 5);
    setMouseY(() => (e.clientY - (rect.top + rect.height / 2)) / 5);
  };

  const checkTouchCoordinates = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return false;

    const rect = (
      containerRef.current as HTMLDivElement
    ).getBoundingClientRect();
    const touchX = e.targetTouches[0].clientX;
    const touchY = e.targetTouches[0].clientY;

    if (
      touchX > rect.left &&
      touchX < rect.right &&
      touchY < rect.bottom &&
      touchY > rect.top
    ) {
      return true;
    }

    return false;
  };
  const next = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setItems((items: any) => {
      if (lessSpeed == 0) return items;

      let a, b;
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

      if (Math.abs(a) <= 0.01 && Math.abs(b) <= 0.01) return items; // pause

      // calculate offset
      const l = Math.PI / 180;
      const sc = [
        Math.sin(a * l),
        Math.cos(a * l),
        Math.sin(b * l),
        Math.cos(b * l),
      ];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return items.map((item: any) => updateItemPosition(item, sc, depth));
    });
  };

  const init = () => {
    setActive(false);
    const mouseX0 = initialSpeed * Math.sin(initialDirection * (Math.PI / 180));
    const mouseY0 =
      -initialSpeed * Math.cos(initialDirection * (Math.PI / 180));

    setMouseX(() => mouseX0);
    setMouseY(() => mouseY0);

    next();
  };

  useEffect(() => {
    init();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setItems((items: any) => [...items]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        setActive(() => true);
        setFirstRender(() => false);
        setLessSpeed(() => maxSpeed);
      }}
      onMouseOut={() => {
        setActive(() => false);
      }}
      onMouseMove={handleMouseMove}
      onTouchStart={() => {
        setActive(true);
        setLessSpeed(() => maxSpeed);
        setFirstRender(() => false);
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
