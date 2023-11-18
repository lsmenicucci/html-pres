import path from "path"; 
const entryParent = path.dirname(process.env._PRES_VITE_ENTRY);

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    `${entryParent}/**/*.{js,ts,jsx,tsx}`,
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
