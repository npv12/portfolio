import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/parts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
};
export default config;
module.exports = {
  ...config,
  daisyui: {
    themes: [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "procyon",
      "solar",
      "joker",
    ],
  },
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            h1: {
              backgroundImage:
                "linear-gradient(to right, oklch(var(--p)), oklch(var(--a)))",
              backgroundClip: "text",
              color: "transparent",
            },
          },
        },
      },
    },
  },
};
