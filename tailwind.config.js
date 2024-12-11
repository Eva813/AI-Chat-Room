/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        olive: {
          DEFAULT: '#4B5945', // Base color
          light: '#66785F',  // Slightly lighter
          lighter: '#91AC8F', // Even lighter
          lightest: '#E9EFEC', // Lightest shade
        }
      },
    },
  },
  plugins: [],
};
