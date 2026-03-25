import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { Card } from 'heroui-native/card';

import { CARD_HEIGHT, CARD_WIDTH } from '@/components/card';
import type { Dish } from '@/types';

const FALLBACK_IMAGE = require('@/assets/food.jpg');

interface DishCardProps {
  dish: Dish;
  attribution?: string;
  href?: string;
}

export function DishCard({ dish, attribution, href }: DishCardProps) {
  const source = dish.photoUri ? { uri: dish.photoUri } : FALLBACK_IMAGE;
  const target = href ?? (`/dish/${dish.id}` as const);
  const byline = attribution ? `By ${attribution}` : null;

  return (
    <Link href={target as any} asChild>
      <Pressable
        style={({ pressed }) => [
          styles.pressable,
          pressed && styles.pressed,
        ]}
      >
        <Card
          variant="transparent"
          className="overflow-hidden rounded-[20px] p-0"
          style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
        >
          <Animated.View
            style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
            sharedTransitionTag={`dish-${dish.id}`}
          >
            <Image source={source} style={StyleSheet.absoluteFill} contentFit="cover" />
          </Animated.View>
          <View style={styles.gradient} />
          <Card.Body className="absolute right-0 bottom-0 left-0 gap-1 px-3.5 pb-3.5">
            <View className="mb-1.5 self-start rounded-full bg-white/20 px-2.5 py-1">
              <Card.Title className="text-sm font-bold tracking-wide text-white">
                {dish.price}
              </Card.Title>
            </View>
            <Card.Title className="text-[17px] font-bold leading-[22px] text-white" numberOfLines={2}>
              {dish.name}
            </Card.Title>
            {byline ? (
              <Card.Description className="text-xs text-white/70" numberOfLines={1}>
                {byline}
              </Card.Description>
            ) : null}
            <View className="flex-row items-center gap-1">
              <Image source="sf:star.fill" style={styles.starIcon} tintColor="#FFD700" />
              <Card.Description className="text-xs text-white/70">
                {dish.rating} stars
              </Card.Description>
            </View>
          </Card.Body>
        </Card>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    experimental_backgroundImage:
      'linear-gradient(to bottom, transparent 35%, rgba(0,0,0,0.85) 100%)',
  } as any,
  starIcon: { width: 11, height: 11 },
});
