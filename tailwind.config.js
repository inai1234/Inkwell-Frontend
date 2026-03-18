/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          50: '#EDEEFF',
          100: '#D8D9FF',
          500: '#4F46E5',
          600: '#3730C9',
        },
        secondary: '#6366F1',
        accent: '#22C55E',
        background: '#F9FAFB',
        textPrimary: '#111827',
        textSecondary: '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.06)',
        'card-hover': '0 12px 40px rgba(79,70,229,0.15)',
        nav: '0 2px 20px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};
