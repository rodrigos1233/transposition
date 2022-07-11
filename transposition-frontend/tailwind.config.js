/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: [
    "./src/pages/**/*.tsx",
    "./src/components/**/*.tsx",
    "./src/header/*.tsx",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
