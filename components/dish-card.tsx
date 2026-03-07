import { Link } from 'expo-router';
import { Image, Platform, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { Dish } from '@/types';

const FALLBACK_IMAGE = require('@/assets/food.jpg');

interface DishCardProps {
  dish: Dish;
  distance: string;
}

export function DishCard({ dish, distance }: DishCardProps) {
  const source = dish.photoUri ? { uri: dish.photoUri } : FALLBACK_IMAGE;

  return (
    <Link href={`/dish/${dish.id}`} asChild style={styles.card}>
      <Pressable style={({ pressed }) => [pressed && styles.pressed]}>
        <View style={styles.imageWrap}>
          <Image source={source} style={styles.image} resizeMode="cover" />
        </View>
        <View style={styles.content}>
          <ThemedText type="defaultSemiBold" style={styles.name} numberOfLines={2}>
            {dish.name}
          </ThemedText>
          <ThemedText type="default" style={styles.meta}>
            {dish.rating} · {dish.reviewCount} reviews · {distance} · {dish.price}
          </ThemedText>
        </View>
      </Pressable>
    </Link>
  );
}

const CARD_WIDTH = 200;

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(128,128,128,0.2)',
    // Depth: shadow (iOS) + elevation (Android)
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  pressed: {
    opacity: 0.92,
  },
  imageWrap: {
    width: '100%',
    height: 128,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 128,
  },
  content: {
    padding: 12,
    paddingTop: 10,
  },
  name: {
    marginBottom: 4,
  },
  meta: {
    fontSize: 13,
    opacity: 0.85,
  },
});
