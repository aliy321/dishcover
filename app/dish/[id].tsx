import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Image, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { dishes } from '@/lib/mock-data';

const FALLBACK_IMAGE = require('@/assets/food.jpg');

export default function DishDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dish = useMemo(() => dishes.find((d) => d.id === id), [id]);

  if (!dish) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title">Dish not found</ThemedText>
        <ThemedText type="default" style={styles.meta}>ID: {id ?? '—'}</ThemedText>
      </ThemedView>
    );
  }

  const source = dish.photoUri ? { uri: dish.photoUri } : FALLBACK_IMAGE;

  return (
    <ParallaxScrollView
      headerImage={
        <Image source={source} style={styles.headerImage} resizeMode="cover" />
      }
      headerBackgroundColor={{ light: Colors.light.background, dark: Colors.dark.background }}
    >
      <ThemedText type="title">{dish.name}</ThemedText>
      <ThemedText type="default" style={styles.meta}>
        {dish.rating} · {dish.reviewCount} reviews · {dish.price}
      </ThemedText>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  meta: {
    opacity: 0.9,
  },
});
