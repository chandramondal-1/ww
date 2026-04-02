import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#2874F0",
          orange: "#FF6A00",
          bg: "#F5F7FA",
          card: "#FFFFFF",
          text: "#1F2937",
          muted: "#6B7280",
          success: "#10B981",
          danger: "#EF4444"
        }
      },
      boxShadow: {
        soft: "0 20px 50px rgba(17, 24, 39, 0.08)",
        card: "0 12px 32px rgba(31, 41, 55, 0.08)"
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(circle at top left, rgba(255,255,255,0.28), transparent 32%), radial-gradient(circle at bottom right, rgba(0,198,255,0.18), transparent 34%)"
      }
    }
  },
  plugins: []
};

export default config;
