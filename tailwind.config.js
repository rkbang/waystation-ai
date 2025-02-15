/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'border',
    'border-r',
    'border-gray-200',
    'divide-y',
    'divide-gray-200',
    'bg-gray-50',
    'bg-gray-100',
    'bg-white'
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          100: '#f1f5f9',
          400: '#94a3b8',
          500: '#64748b',
          900: '#0f172a',
        }
      }
    },
  },
  plugins: [],
}
