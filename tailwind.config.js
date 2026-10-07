/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // We will primarily render in pristine light SaaS mode as per design instructions
  theme: {
    extend: {
      colors: {
        devtech: {
          50: '#DBEAFE', // Light blue
          100: '#DDEEFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6', // Info
          600: '#2563EB', // Primary Blue
          700: '#1D4ED8', // Primary Hover
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          light: '#DBEAFE',
        },
        accent: '#0EA5E9',
        main: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E5E7EB',
        },
        content: {
          primary: '#111827',
          secondary: '#6B7280',
          muted: '#94A3B8',
        },
        status: {
          success: '#22C55E',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#3B82F6',
          purple: '#8B5CF6',
          cyan: '#06B6D4',
        }
      },
      borderRadius: {
        'btn': '14px',
        'card': '20px',
        'badge': '12px',
      },
      boxShadow: {
        'saas': '0 4px 20px -2px rgba(17, 24, 39, 0.05)',
        'saas-sm': '0 2px 10px -1px rgba(17, 24, 39, 0.04)',
        'saas-md': '0 8px 30px -4px rgba(17, 24, 39, 0.07)',
        'saas-lg': '0 12px 40px -6px rgba(17, 24, 39, 0.09)',
        'saas-floating': '0 20px 50px -10px rgba(17, 24, 39, 0.12)',
        'saas-hover': '0 12px 32px -4px rgba(37, 99, 235, 0.12)',
      },
      fontFamily: {
        sans: ['Inter', 'Geist', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        shimmer: 'shimmer 2s infinite linear',
      },
    },
  },
  plugins: [],
};
