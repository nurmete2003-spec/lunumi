/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FBF6EE", pearl: "#FFFDFB", lavender: { DEFAULT: "#C9B8F0", soft: "#EDE6FA", deep: "#6B4FA8" },
        rose: { dust: "#E8BFCB", soft: "#F7E4EA" }, ink: "#2E2640", mute: "#7A708F"
      },
      fontFamily: { display: ["Fraunces", "Georgia", "serif"], body: ["Nunito", "system-ui", "sans-serif"] },
      borderRadius: { card: "28px", chip: "16px" },
      boxShadow: { soft: "0 10px 30px -12px rgba(107,79,168,.25)", lift: "0 18px 40px -14px rgba(107,79,168,.35)" }
    }
  }
};
