export type ColorScheme = 'purple' | 'blue' | 'green';

export interface ThemeColors {
  background: [string, string]; // LinearGradient colors
  workColors: [string, string]; // Work phase colors
  restColors: [string, string]; // Rest phase colors
  warningColors: [string, string]; // Warning/alert colors
  accent: string; // Accent color for UI elements
}

export const themeColors: Record<ColorScheme, ThemeColors> = {
  purple: {
    background: ['#667eea', '#764ba2'],
    workColors: ['#10B981', '#059669'],
    restColors: ['#3B82F6', '#1E40AF'],
    warningColors: ['#EF4444', '#DC2626'],
    accent: '#EC4899',
  },
  blue: {
    background: ['#2563eb', '#1e40af'],
    workColors: ['#10B981', '#059669'],
    restColors: ['#8B5CF6', '#7C3AED'],
    warningColors: ['#EF4444', '#DC2626'],
    accent: '#3B82F6',
  },
  green: {
    background: ['#059669', '#047857'],
    workColors: ['#F59E0B', '#D97706'],
    restColors: ['#3B82F6', '#1E40AF'],
    warningColors: ['#EF4444', '#DC2626'],
    accent: '#10B981',
  },
};

export const getThemeColors = (colorScheme: ColorScheme): ThemeColors => {
  return themeColors[colorScheme];
};