// Modern Ant Design Theme Configuration with Premium Aesthetics
export const theme = {
  token: {
    // Primary colors - Using a sophisticated Indigo/Violet palette
    colorPrimary: '#6366f1', // Indigo 500
    colorSuccess: '#22c55e', // Green 500
    colorWarning: '#eab308', // Yellow 500
    colorError: '#ef4444',  // Red 500
    colorInfo: '#3b82f6',   // Blue 500
    colorLink: '#6366f1',
    colorBgLayout: '#f8fafc', // Slate 50

    // Typography
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    fontSize: 14,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,
    colorText: '#1e293b', // Slate 800
    colorTextHeading: '#0f172a', // Slate 900

    // Geometry
    borderRadius: 10,
    borderRadiusLG: 16,
    borderRadiusSM: 6,
    borderRadiusXS: 4,

    // Border
    colorBorder: '#e2e8f0',
    colorBorderSecondary: '#f1f5f9',

    // Shadows - Refined and soft
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    boxShadowSecondary: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    boxShadowTertiary: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      headerHeight: 72,
      headerPadding: '0 24px',
      siderBg: '#0f172a', // Slate 900
      bodyBg: '#f8fafc',
    },
    Card: {
      borderRadiusLG: 16,
      colorBgContainer: '#ffffff',
      boxShadowTertiary: '0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
    },
    Button: {
      borderRadius: 10,
      controlHeight: 40,
      controlHeightLG: 48,
      fontWeight: 600,
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    },
    Input: {
      borderRadius: 10,
      controlHeight: 40,
      colorBorder: '#e2e8f0',
      activeBorderColor: '#6366f1',
    },
    Select: {
      borderRadius: 10,
      controlHeight: 40,
    },
    Table: {
      borderRadius: 12,
      headerBg: '#f1f5f9',
      headerColor: '#475569',
      headerBorderRadius: 10,
    },
    Modal: {
      borderRadiusLG: 16,
      headerBg: '#ffffff',
    },
    Menu: {
      itemBorderRadius: 8,
      itemSelectedBg: 'rgba(99, 102, 241, 0.1)',
      itemSelectedColor: '#6366f1',
    },
    Tag: {
      borderRadiusSM: 6,
    },
  },
};

// Common styles for cards with hover effects
export const cardStyle = {
  borderRadius: 16,
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
  transition: 'all 0.3s ease-in-out',
};

// Common styles for page headers
export const pageHeaderStyle = {
  marginBottom: 24,
  padding: '16px 0',
};

// Common styles for form labels
export const labelStyle = {
  display: 'block',
  marginBottom: 8,
  fontWeight: 600,
  fontSize: 14,
  color: '#334155', // Slate 700
};

// Common styles for sections
export const sectionStyle = {
  marginBottom: 24,
  padding: 24,
  background: '#ffffff',
  borderRadius: 16,
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
  border: '1px solid #f1f5f9',
};
