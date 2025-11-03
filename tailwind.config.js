/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Space Grotesk', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'code': ['JetBrains Mono', 'monospace'],
      },
      colors: {
        primary: "#6366F1",
        secondary: "#8B5CF6",
        accent: "#10B981",
        surface: "#1E293B",
        background: "#0F172A",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",
        code: {
          keyword: "#569CD6",
          string: "#CE9178",
          number: "#4EC9B0",
          comment: "#6A9955",
        }
      },
      animation: {
        'pulse-gentle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce 1s ease-in-out infinite',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-out': 'slideOut 0.3s ease-in',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-100%)', opacity: '0' },
        },
      },
      boxShadow: {
        'card': '0 4px 12px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.4)',
        'glow': '0 0 20px rgba(99, 102, 241, 0.3)',
      },
    },
  },
  plugins: [],
}