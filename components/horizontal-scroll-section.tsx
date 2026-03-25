import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

interface HorizontalScrollSectionProps {
  title: string;
  icon: string;
  subtitle?: string;
  onPress?: () => void;
  contentContainerStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
}

export function HorizontalScrollSection({
  title,
  icon,
  subtitle,
  onPress,
  contentContainerStyle,
  children,
}: HorizontalScrollSectionProps) {
  const tint = useThemeColor({}, 'tint');

  return (
    <View style={styles.section}>
      <View style={styles.headerWrap}>
        <Pressable style={styles.sectionHeader} onPress={onPress}>
          <Image source={icon} style={styles.sectionIcon} tintColor={tint} />
          <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
          <View style={styles.spacer} />
          <Image source="sf:chevron.right" style={styles.chevron} tintColor={tint} />
        </Pressable>
        {subtitle ? <ThemedText style={styles.subtitle}>{subtitle}</ThemedText> : null}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={contentContainerStyle}
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 10 },
  headerWrap: { gap: 2 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
  },
  sectionIcon: { width: 17, height: 17 },
  sectionTitle: { fontSize: 17, fontWeight: '600' },
  spacer: { flex: 1 },
  chevron: { width: 13, height: 13 },
  subtitle: {
    fontSize: 12,
    opacity: 0.55,
    paddingHorizontal: 39,
  },
});

