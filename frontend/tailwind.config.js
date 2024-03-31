/** @type {import('tailwindcss').Config} */
export default {
  content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
      extend: {
        fontSize: {
          'xs': '.75rem',   // Extra Small
          'sm': '.875rem',  // Small
          'base': '1rem',   // Default
          'lg': '1.125rem', // Large
          'xl': '1.25rem',  // Extra Large
          '2xl': '1.5rem',  // 2 Extra Large
          // Add more sizes as needed
        },
      },
    },
  plugins: [],
}

