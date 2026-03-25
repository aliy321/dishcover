import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import type { Dish } from '@/types';

const FALLBACK_IMAGE = require('@/assets/stall.jpg');
const CARD_HEIGHT = 300;
const CARD_RADIUS = 20;

interface FeaturedDishCardProps {
  dish: Dish;
  contextLine: string;
  width?: number;
  disabled?: boolean;
}

export function FeaturedDishCard({ dish, contextLine, width, disabled }: FeaturedDishCardProps) {
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = width ?? screenWidth - 32;
  const source = dish.photoUri ? { uri: dish.photoUri } : FALLBACK_IMAGE;

  return (
    <Link href={`/dish/${dish.id}`} asChild style={styles.card}>
      <Pressable
        disabled={disabled}
        style={({ pressed }) => [styles.card, { width: cardWidth }, pressed && !disabled && styles.pressed]}
      >
        <Animated.View
          style={{ width: cardWidth, height: CARD_HEIGHT }}
          sharedTransitionTag={`dish-${dish.id}`}
        >
          <Image source={source} style={StyleSheet.absoluteFill} contentFit="cover" />
        </Animated.View>
        <View style={styles.topGradient} />
        <View style={styles.gradient} />
        <View style={styles.overlay}>
          <ThemedText style={styles.name} numberOfLines={2}>{dish.name}</ThemedText>
          <ThemedText style={styles.contextLine} numberOfLines={1}>
            {contextLine}
          </ThemedText>
          <View style={styles.metaRow}>
            <Image source="sf:star.fill" style={styles.starIcon} tintColor="#FFD700" />
            <ThemedText style={styles.meta}>
              {dish.rating.toFixed(1)} · {dish.reviewCount} reviews · {dish.price}
            </ThemedText>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: CARD_HEIGHT,
    borderRadius: CARD_RADIUS,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  pressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
  gradient: {
    ...StyleSheet.absoluteFill,
    experimental_backgroundImage: 'linear-gradient(to bottom, transparent 35%, rgba(0,0,0,0.86) 100%)',
  } as any,
  topGradient: {
    ...StyleSheet.absoluteFill,
    experimental_backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, transparent 32%)',
  } as any,
  topRow: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgePill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  etaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.26)',
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  etaIcon: {
    width: 11,
    height: 11,
  },
  etaText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.95)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 18,
    gap: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 28,
  },
  contextLine: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    // marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  starIcon: {
    width: 13,
    height: 13,
  },
  meta: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
  },
});
