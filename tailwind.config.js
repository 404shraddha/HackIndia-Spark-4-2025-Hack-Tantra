/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "press-start": ['"Press Start 2P"', "cursive"],
        orbitron: ["Orbitron", "sans-serif"],
        rajdhani: ["Rajdhani", "sans-serif"],
      },
      animation: {
        glow: "glow 2s ease-in-out infinite alternate",
        float: "float 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        glitch: "glitch 2s infinite",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: '0 0 10px theme("colors.purple.500/50")' },
          "100%": { boxShadow: '0 0 20px theme("colors.purple.500/80")' },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": {
            opacity: 1,
            boxShadow: '0 0 20px theme("colors.purple.500/50")',
          },
          "50%": {
            opacity: 0.7,
            boxShadow: '0 0 40px theme("colors.purple.500/70")',
          },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
