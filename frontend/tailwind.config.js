// @ignore eslint
/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1600px",
        "3xl": "1600px",
      },
    },

    extend: {
      colors: {
        background: "var(--background)",
        border: "var(--border)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        "green-foreground": "var(--green-foreground)",
        "green-background": "var(--green-background)",
        "blue-foreground": "var(--blue-foreground)",
        "blue-background": "var(--blue-background)",
        "orange-foreground": "var(--orange-foreground)",
        "orange-background": "var(--orange-background)",
        text: "var(--text)",
        muted: "var(--muted)",
        "primary-button-text": "var(--primary-button-text)",
        "scrollbar-thumb": "var(--scrollbar-thumb)",
        input: "var(--input)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        slideIn: {
          "0%": { opacity: 0, transform: "translateY(3%)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        slideIn: "slideIn 300ms ease-in-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
