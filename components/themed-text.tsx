import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

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
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const flattenedStyle = StyleSheet.flatten(style) as TextStyle | undefined;
  const requestedWeight = `${flattenedStyle?.fontWeight ?? ''}`;

  // Gate guarantees Inter fonts are available before first render.
  const typeFontFamily =
    type === 'defaultSemiBold'
      ? 'Inter_600SemiBold'
      : type === 'title' || type === 'subtitle'
        ? 'Inter_700Bold'
        : 'Inter_400Regular';
  const weightFontFamily =
    requestedWeight === '900' || requestedWeight === 'black'
      ? 'Inter_900Black'
      : requestedWeight === '800' || requestedWeight === 'extrabold'
        ? 'Inter_800ExtraBold'
        : requestedWeight === '700' || requestedWeight === 'bold'
          ? 'Inter_700Bold'
          : requestedWeight === '600' || requestedWeight === 'semibold'
            ? 'Inter_600SemiBold'
            : requestedWeight === '500'
              ? 'Inter_600SemiBold'
              : 'Inter_400Regular';
  const fontFamily = flattenedStyle?.fontWeight ? weightFontFamily : typeFontFamily;

  return (
    <Text
      style={[
        { color },
        { fontFamily },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
});
