/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern Teal/Turkuaz Ana Renk Paleti
        primary: {
          50: '#f0fdfa',   // En açık teal
          100: '#ccfbf1',  // Çok açık teal
          200: '#99f6e4',  // Açık teal
          300: '#5eead4',  // Orta açık teal
          400: '#2dd4bf',  // Ana teal
          500: '#14b8a6',  // Koyu teal (ana renk)
          600: '#0d9488',  // Daha koyu teal
          700: '#0f766e',  // Çok koyu teal
          800: '#115e59',  // Koyu yeşil-teal
          900: '#134e4a',  // En koyu teal
          950: '#042f2e',  // Neredeyse siyah teal
        },
        // Gradient ve Accent Renkleri
        accent: {
          50: '#ecfeff',   // Cyan açık
          100: '#cffafe',  // Cyan orta açık
          200: '#a5f3fc',  // Cyan orta
          300: '#67e8f9',  // Cyan parlak
          400: '#22d3ee',  // Cyan ana
          500: '#06b6d4',  // Cyan koyu
          600: '#0891b2',  // Cyan daha koyu
          700: '#0e7490',  // Cyan en koyu
          800: '#155e75',  // Koyu mavi-cyan
          900: '#164e63',  // En koyu cyan
        },
        // Karanlık Tema için Navy/Koyu Renkler
        dark: {
          50: '#f8fafc',   // En açık gri
          100: '#f1f5f9',  // Açık gri
          200: '#e2e8f0',  // Orta açık gri
          300: '#cbd5e1',  // Orta gri
          400: '#94a3b8',  // Koyu gri
          500: '#64748b',  // Ana koyu gri
          600: '#475569',  // Daha koyu gri
          700: '#334155',  // Çok koyu gri
          800: '#1e293b',  // Navy koyu
          900: '#0f172a',  // En koyu navy
          950: '#020617',  // Neredeyse siyah
        },
        // Gradient Renkleri
        gradient: {
          from: '#14b8a6',    // Teal 500
          via: '#06b6d4',     // Cyan 500
          to: '#3b82f6',      // Blue 500
        },
        // Başarı, Hata, Uyarı Renkleri (modern)
        success: {
          50: '#f0fdf4',
          500: '#10b981',
          600: '#059669',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'gradient': 'gradient 6s ease infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(20, 184, 166, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(20, 184, 166, 0.6)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-modern': 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 50%, #3b82f6 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      },
    },
  },
  plugins: [],
} 