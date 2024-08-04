/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        custom: "0 4px 6px -1px rgba(255, 0, 0, 0.5)",
      },
    },
  },
  plugins: [],
};
