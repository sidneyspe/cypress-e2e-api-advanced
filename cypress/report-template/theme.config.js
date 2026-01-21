/**
 * Theme Configuration for Cypress Test Report
 *
 * Customize colors, fonts, spacing, and more using Tailwind CSS conventions.
 * All values support CSS variables for dynamic theming.
 */

module.exports = {
  // Project branding
  branding: {
    name: 'Hacker Stories',
    logo: null, // URL or base64 encoded image
    favicon: null,
  },

  // Font configuration
  fonts: {
    // Google Fonts to load
    googleFonts: [
      'Inter:wght@300;400;500;600;700;800',
      'JetBrains+Mono:wght@400;500;600',
      'Poppins:wght@400;500;600;700',
    ],
    // Font families
    families: {
      sans: "'Inter', 'Poppins', system-ui, -apple-system, sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace",
      display: "'Poppins', 'Inter', sans-serif",
    },
  },

  // Color palette - supports both light and dark themes
  colors: {
    // Primary brand colors
    primary: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1', // Main primary
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
      950: '#1e1b4b',
    },
    // Secondary/Accent
    secondary: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f5d0fe',
      300: '#f0abfc',
      400: '#e879f9',
      500: '#d946ef', // Main secondary
      600: '#c026d3',
      700: '#a21caf',
      800: '#86198f',
      900: '#701a75',
      950: '#4a044e',
    },
    // Success/Passed
    success: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981', // Main success
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
      950: '#022c22',
    },
    // Danger/Failed
    danger: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444', // Main danger
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a',
    },
    // Warning/Pending
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b', // Main warning
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#451a03',
    },
    // Info
    info: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6', // Main info
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
    // Neutral/Gray
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617',
    },
  },

  // Theme-specific overrides
  themes: {
    dark: {
      background: {
        primary: '#0f172a',
        secondary: '#1e293b',
        tertiary: '#334155',
        elevated: '#1e293b',
      },
      text: {
        primary: '#f1f5f9',
        secondary: '#94a3b8',
        muted: '#64748b',
        inverse: '#0f172a',
      },
      border: '#334155',
      shadow: 'rgba(0, 0, 0, 0.5)',
    },
    light: {
      background: {
        primary: '#ffffff',
        secondary: '#f8fafc',
        tertiary: '#f1f5f9',
        elevated: '#ffffff',
      },
      text: {
        primary: '#0f172a',
        secondary: '#475569',
        muted: '#94a3b8',
        inverse: '#f1f5f9',
      },
      border: '#e2e8f0',
      shadow: 'rgba(0, 0, 0, 0.1)',
    },
  },

  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    default: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    full: '9999px',
  },

  // Spacing scale
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    11: '2.75rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem',
  },

  // Box shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    default: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    glow: {
      primary: '0 0 20px rgba(99, 102, 241, 0.4)',
      success: '0 0 20px rgba(16, 185, 129, 0.4)',
      danger: '0 0 20px rgba(239, 68, 68, 0.4)',
      warning: '0 0 20px rgba(245, 158, 11, 0.4)',
    },
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: 'none',
  },

  // Transitions
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    default: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: '500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Animations
  animations: {
    fadeIn: {
      from: { opacity: 0, transform: 'translateY(10px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
      duration: '0.5s',
      easing: 'ease-out',
    },
    slideIn: {
      from: { opacity: 0, transform: 'translateX(-20px)' },
      to: { opacity: 1, transform: 'translateX(0)' },
      duration: '0.4s',
      easing: 'ease-out',
    },
    scaleIn: {
      from: { opacity: 0, transform: 'scale(0.95)' },
      to: { opacity: 1, transform: 'scale(1)' },
      duration: '0.3s',
      easing: 'ease-out',
    },
    pulse: {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.5 },
      duration: '2s',
      easing: 'ease-in-out',
      iteration: 'infinite',
    },
    shimmer: {
      from: { backgroundPosition: '-200% 0' },
      to: { backgroundPosition: '200% 0' },
      duration: '1.5s',
      easing: 'linear',
      iteration: 'infinite',
    },
  },

  // Chart colors
  charts: {
    passed: '#10b981',
    failed: '#ef4444',
    pending: '#f59e0b',
    skipped: '#64748b',

    // Additional chart colors for variety
    palette: [
      '#6366f1', // indigo
      '#8b5cf6', // violet
      '#ec4899', // pink
      '#14b8a6', // teal
      '#f97316', // orange
      '#06b6d4', // cyan
      '#84cc16', // lime
      '#f43f5e', // rose
    ],
  },

  // Layout configuration
  layout: {
    sidebar: {
      width: '280px',
      collapsedWidth: '80px',
    },
    header: {
      height: '64px',
    },
    container: {
      maxWidth: '1440px',
      padding: '2rem',
    },
  },

  // Component-specific styles
  components: {
    card: {
      padding: '1.5rem',
      borderRadius: '1rem',
      shadow: 'lg',
    },
    button: {
      padding: {
        sm: '0.5rem 1rem',
        md: '0.75rem 1.5rem',
        lg: '1rem 2rem',
      },
      borderRadius: '0.5rem',
    },
    badge: {
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
    },
    progressBar: {
      height: '0.5rem',
      borderRadius: '9999px',
    },
  },
};
