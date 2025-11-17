import { Text, type TextProps } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/Colors';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const { theme } = useTheme();
  const color = theme === 'light' ? lightColor : darkColor;
  const themeColors = Colors[theme];

  return (
    <Text
      style={[
        { color: color || themeColors.text },
        type === 'default' ? { fontSize: 16, lineHeight: 24 } : undefined,
        type === 'title' ? { fontSize: 32, fontWeight: 'bold', lineHeight: 40 } : undefined,
        type === 'defaultSemiBold' ? { fontSize: 16, lineHeight: 24, fontWeight: '600' } : undefined,
        type === 'subtitle' ? { fontSize: 20, fontWeight: 'bold' } : undefined,
        type === 'link' ? { fontSize: 16, lineHeight: 30, color: themeColors.tint } : undefined,
        style,
      ]}
      {...rest}
    />
  );
}
