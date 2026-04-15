// KREIS Assessment Platform Design System
// Based on reference designs - consistent colors, typography, and spacing

export const colors = {
  // Primary Colors
  primary: {
    main: '#3b82f6',      // Blue - primary buttons, active states
    light: '#60a5fa',     // Light blue
    dark: '#2563eb',      // Dark blue
    bg: '#eff6ff',        // Very light blue background
  },
  
  // Cyan/Turquoise (for highlights and secondary actions)
  cyan: {
    main: '#06b6d4',      // Cyan
    light: '#22d3ee',     // Light cyan
    dark: '#0891b2',      // Dark cyan
    bg: '#ecfeff',        // Very light cyan background
  },
  
  // Neutral/Gray Scale
  neutral: {
    50: '#f8fafc',        // Background
    100: '#f1f5f9',       // Light background
    200: '#e2e8f0',       // Borders
    300: '#cbd5e1',       // Disabled
    400: '#94a3b8',       // Placeholder
    500: '#64748b',       // Secondary text
    600: '#475569',       // Body text
    700: '#334155',       // Headings
    800: '#1e293b',       // Dark headings
    900: '#0f172a',       // Darkest
  },
  
  // Semantic Colors
  success: {
    main: '#10b981',      // Green
    light: '#34d399',
    dark: '#059669',
    bg: '#d1fae5',
  },
  
  warning: {
    main: '#f59e0b',      // Orange/Amber
    light: '#fbbf24',
    dark: '#d97706',
    bg: '#fef3c7',
  },
  
  error: {
    main: '#ef4444',      // Red
    light: '#f87171',
    dark: '#dc2626',
    bg: '#fee2e2',
  },
  
  info: {
    main: '#3b82f6',      // Blue
    light: '#60a5fa',
    dark: '#2563eb',
    bg: '#dbeafe',
  },
  
  // Sidebar
  sidebar: {
    bg: '#0f172a',        // Dark navy
    text: '#94a3b8',      // Light gray
    active: '#3b82f6',    // Blue
    hover: 'rgba(59, 130, 246, 0.1)',
  },
  
  // Gradient backgrounds
  gradient: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    blue: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    cyan: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
  },
};

export const typography = {
  fontFamily: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    mono: "'Fira Code', 'Courier New', monospace",
  },
  
  fontSize: {
    xs: '11px',
    sm: '13px',
    base: '14px',
    md: '15px',
    lg: '16px',
    xl: '18px',
    '2xl': '20px',
    '3xl': '24px',
    '4xl': '28px',
    '5xl': '32px',
  },
  
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  base: '16px',
  lg: '20px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '40px',
  '4xl': '48px',
  '5xl': '64px',
};

export const borderRadius = {
  sm: '6px',
  base: '8px',
  md: '10px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

// Component-specific styles
export const components = {
  card: {
    background: '#ffffff',
    border: `1px solid ${colors.neutral[200]}`,
    borderRadius: borderRadius.lg,
    boxShadow: shadows.base,
    padding: spacing.xl,
  },
  
  button: {
    primary: {
      background: colors.primary.main,
      color: '#ffffff',
      borderRadius: borderRadius.base,
      padding: `${spacing.sm} ${spacing.base}`,
      fontWeight: typography.fontWeight.medium,
    },
    secondary: {
      background: colors.neutral[100],
      color: colors.neutral[700],
      borderRadius: borderRadius.base,
      padding: `${spacing.sm} ${spacing.base}`,
      fontWeight: typography.fontWeight.medium,
    },
  },
  
  input: {
    background: '#ffffff',
    border: `1px solid ${colors.neutral[200]}`,
    borderRadius: borderRadius.base,
    padding: `${spacing.sm} ${spacing.md}`,
    fontSize: typography.fontSize.base,
    color: colors.neutral[800],
  },
  
  table: {
    headerBg: colors.neutral[50],
    headerText: colors.neutral[500],
    borderColor: colors.neutral[200],
    hoverBg: colors.neutral[50],
  },
  
  badge: {
    success: {
      background: colors.success.bg,
      color: colors.success.dark,
    },
    warning: {
      background: colors.warning.bg,
      color: colors.warning.dark,
    },
    error: {
      background: colors.error.bg,
      color: colors.error.dark,
    },
    info: {
      background: colors.info.bg,
      color: colors.info.dark,
    },
  },
};

// Page-specific styles
export const pageStyles = {
  container: {
    background: colors.neutral[50],
    minHeight: 'calc(100vh - 64px)',
    padding: spacing.xl,
  },
  
  header: {
    title: {
      fontSize: typography.fontSize['4xl'],
      fontWeight: typography.fontWeight.bold,
      color: colors.neutral[800],
      marginBottom: spacing.sm,
    },
    subtitle: {
      fontSize: typography.fontSize.md,
      color: colors.neutral[500],
      marginBottom: spacing['2xl'],
    },
  },
  
  filterCard: {
    background: '#ffffff',
    border: `1px solid ${colors.neutral[200]}`,
    borderRadius: borderRadius.lg,
    boxShadow: shadows.base,
    padding: spacing.xl,
    marginBottom: spacing['2xl'],
  },
  
  statCard: {
    background: '#ffffff',
    border: `1px solid ${colors.neutral[200]}`,
    borderRadius: borderRadius.lg,
    boxShadow: shadows.base,
    padding: spacing.lg,
  },
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  components,
  pageStyles,
};
