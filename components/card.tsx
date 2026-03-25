import { Image, type ImageSource } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import type { ReactNode } from 'react';

export const CARD_WIDTH = 200;
export const CARD_HEIGHT = 280;

export interface CardProps {
  source?: ImageSource;
  backgroundColor?: string;
  elevated?: boolean;
  width?: number;
  height?: number;
  href?: string;
  onPress?: () => void;
  sharedTransitionTag?: string;
  children?: ReactNode;
}

export function Card({
  source,
  backgroundColor = '#111',
  elevated = true,
  width = CARD_WIDTH,
  height = CARD_HEIGHT,
  href,
  onPress,
  sharedTransitionTag,
  children,
}: CardProps) {
  const cardStyle = [
    styles.card,
    !elevated && styles.cardFlat,
    { width, height, backgroundColor },
  ] as any;
  const pressableStyle = ({ pressed }: { pressed: boolean }) => [
    cardStyle,
    pressed && styles.pressed,
  ];

  const inner = (
    <>
      {sharedTransitionTag ? (
        <Animated.View style={{ width, height }} sharedTransitionTag={sharedTransitionTag}>
          {source && <Image source={source} style={StyleSheet.absoluteFill} contentFit="cover" />}
        </Animated.View>
      ) : (
        source && <Image source={source} style={StyleSheet.absoluteFill} contentFit="cover" />
      )}
      <View style={styles.gradient as any} />
      <View style={styles.overlay}>{children}</View>
    </>
  );

  if (href) {
    return (
      <Link href={href as any} asChild style={cardStyle}>
        <Pressable style={pressableStyle}>{inner}</Pressable>
      </Link>
    );
  }

  return (
    <Pressable style={pressableStyle} onPress={onPress}>
      {inner}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderCurve: 'continuous',
    overflow: 'hidden',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
  },
  cardFlat: {
    boxShadow: undefined,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    experimental_backgroundImage:
      'linear-gradient(to bottom, transparent 35%, rgba(0,0,0,0.85) 100%)',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
    gap: 4,
  },
});
