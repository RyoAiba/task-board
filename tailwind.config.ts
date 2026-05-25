import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FA6218",
      },
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