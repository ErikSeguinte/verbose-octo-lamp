import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "node_modules/preline/dist/*.js",
  ],
  theme: {
    extend: {
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("preline/plugin"),
    require("@tailwindcss/typography"),
  ],
};
export default config;
