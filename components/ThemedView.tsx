import { View, type ViewProps } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/Colors';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const { theme } = useTheme();
  const backgroundColor = theme === 'light' ? lightColor : darkColor;
  const themeColors = Colors[theme];

  return <View style={[{ backgroundColor: backgroundColor || themeColors.background }, style]} {...otherProps} />;
}
