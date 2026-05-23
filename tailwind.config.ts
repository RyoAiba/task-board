import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "noto-sans-jp": "var(--font-noto-sans-jp)",
      },
      fontSize: {
        "page-title": ["20px", { fontWeight: "700" }],
        "section-title": ["16px", { fontWeight: "600" }],
        "body": ["14px", { fontWeight: "400" }],
        "caption": ["12px", { fontWeight: "400" }],
        "badge": ["12px", { fontWeight: "500" }],
      },
    },
  },
  plugins: [],
};

export default config;