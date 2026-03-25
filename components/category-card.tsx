import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { Card } from '@/components/card';
import { ThemedText } from '@/components/themed-text';

export interface Category {
  id: string;
  label: string;
  /** SF Symbol name e.g. "sf:fork.knife" */
  icon: string;
  color: string;
}

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Card
      backgroundColor={category.color}
      href={`/search?category=${category.id}`}
    >
      <Image source={category.icon} style={styles.icon} tintColor="rgba(255,255,255,0.9)" />
      <ThemedText style={styles.label}>{category.label}</ThemedText>
    </Card>
  );
}

const styles = StyleSheet.create({
  icon: { width: 22, height: 22 },
  label: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 22,
  },
});
