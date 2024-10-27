import { CSSProperties, ReactNode } from "react";

export const fetchIconFromText = (text: string) => {
  /**
   * Fetches all logos from https://cdn.svgporn.com
   * Handle special cases like C++
   */

  const baseUrl = "https://cdn.svgporn.com/logos";

  if (text.includes(" ")) {
    text = text.replace(" ", "-");
  }

  switch (text.toLowerCase()) {
    case "c++":
      return `${baseUrl}/c-plusplus.svg`;
    case "mongodb":
      return `${baseUrl}/mongodb-icon.svg`;
    case "rhel":
      return `${baseUrl}/redhat-icon.svg`;
    case "linux":
      return `${baseUrl}/linux-tux.svg`;
    case "vscode":
      return `${baseUrl}/visual-studio-code.svg`;
    case "svelte":
      return `${baseUrl}/svelte-icon.svg`;
    default:
      return `${baseUrl}/${text.toLowerCase()}.svg`;
  }
};

export const computeInitialPosition = (
  index: number,
  textsLength: number,
  size: number
) => {
  const phi = Math.acos(-1 + (2 * index + 1) / textsLength);
  const theta = Math.sqrt((textsLength + 1) * Math.PI) * phi;
  return {
    x: (size * Math.cos(theta) * Math.sin(phi)) / 2,
    y: (size * Math.sin(theta) * Math.sin(phi)) / 2,
    z: (size * Math.cos(phi)) / 2,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateItemPosition = (item: any, sc: number[], depth: number) => {
  const newItem = { ...item, scale: "" };
  const rx1 = item.x;
  const ry1 = item.y * sc[1] + item.z * -sc[0];
  const rz1 = item.y * sc[0] + item.z * sc[1];

  const rx2 = rx1 * sc[3] + rz1 * sc[2];
  const ry2 = ry1;
  const rz2 = rz1 * sc[3] - rx1 * sc[2];

  const per = (2 * depth) / (2 * depth + rz2);
  newItem.x = rx2;
  newItem.y = ry2;
  newItem.z = rz2;

  if (newItem.x === item.x && newItem.y === item.y && newItem.z === item.z) {
    return item;
  }

  newItem.scale = per.toFixed(3);
  let alpha: number = per * per - 0.25;
  alpha = parseFloat((alpha > 1 ? 1 : alpha).toFixed(3));

  const itemEl = newItem.ref.current;
  const left = (newItem.x - itemEl.offsetWidth / 2).toFixed(2);
  const top = (newItem.y - itemEl.offsetHeight / 2).toFixed(2);
  const transform = `translate3d(${left}px, ${top}px, 0) scale(${newItem.scale})`;

  itemEl.style.WebkitTransform = transform;
  itemEl.style.MozTransform = transform;
  itemEl.style.OTransform = transform;
  itemEl.style.transform = transform;
  itemEl.style.filter = `grayscale(${(alpha - 1) * -8}) blur(${
    (alpha - 1) * -5 > 1 ? Math.floor((alpha - 1) * -8) : 0
  }px)`;
  itemEl.style.zIndex = Math.floor(alpha * 1000);
  itemEl.style.opacity = alpha;

  return newItem;
};

export const createItem = (
  item: ReactNode,
  index: number,
  textsLength: number,
  size: number,
  itemRef: React.RefObject<HTMLSpanElement>
) => {
  const transformOrigin = "50% 50%";
  const transform = "translate3d(-50%, -50%, 0) scale(1)";
  const itemStyles = {
    willChange: "transform, opacity, filter",
    position: "absolute",
    top: "50%",
    left: "50%",
    zIndex: index + 1,
    filter: "alpha(opacity=0)",
    opacity: 0,
    WebkitTransformOrigin: transformOrigin,
    MozTransformOrigin: transformOrigin,
    OTransformOrigin: transformOrigin,
    transformOrigin: transformOrigin,
    WebkitTransform: transform,
    MozTransform: transform,
    OTransform: transform,
    transform: transform,
  } as CSSProperties;
  
  const itemEl = (
    <span ref={itemRef} key={index} style={itemStyles}>
      {item}
    </span>
  );

  return {
    ref: itemRef,
    el: itemEl,
    ...computeInitialPosition(index, textsLength, size),
  };
};