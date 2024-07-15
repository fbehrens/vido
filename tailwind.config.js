/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  safelist: [
    {
      pattern: /min\-h\-.+/,
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
