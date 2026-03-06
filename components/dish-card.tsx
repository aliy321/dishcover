import { Link } from 'expo-router';
import { Image, Pressable, StyleSheet, View } from 'react-native';

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
    <Link href={`/dish/${dish.id}`} asChild>
      <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
        <Image source={source} style={styles.image} resizeMode="cover" />
        <ThemedText type="defaultSemiBold" style={styles.name}>
          {dish.name}
        </ThemedText>
        <View style={styles.row}>
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
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(128,128,128,0.15)',
  },
  pressed: {
    opacity: 0.9,
  },
  image: {
    width: CARD_WIDTH,
    height: 120,
  },
  name: {
    marginTop: 8,
    paddingHorizontal: 10,
  },
  row: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  meta: {
    fontSize: 13,
    opacity: 0.9,
  },
});
