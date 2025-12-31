/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: '#F4F4F4',
        charcoal: '#333333',
        steel: '#4A5568',
        'steel-light': '#718096',
        'dark-bg': '#121212',
        'dark-surface': '#1E1E1E',
        'brand-hover': '#E6B644',
      },
      fontFamily: {
        sans: ['"Google Sans"', '"Noto Sans TC"', 'sans-serif'],
      },
      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
    },
  },
  plugins: [],
}

