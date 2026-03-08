import { Link } from 'expo-router';
import { DynamicColorIOS, Image, Platform, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import type { Stall } from '@/types';

const FALLBACK_IMAGE = require('@/assets/food.jpg');

interface StallCardProps {
  stall: Stall;
  hawkerCenterName?: string | null;
  distance: string;
}

export function StallCard({ stall, hawkerCenterName, distance }: StallCardProps) {
  const source = stall.photoUris.length > 0 ? { uri: stall.photoUris[0] } : FALLBACK_IMAGE;

  return (
    <Link href={`/stall/${stall.id}`} asChild style={styles.card}>
      <Pressable style={({ pressed }) => [pressed && styles.pressed]}>
        <View style={styles.imageWrap}>
          <Image source={source} style={styles.image} resizeMode="cover" />
        </View>
        <View style={styles.content}>
          <ThemedText type="defaultSemiBold" style={styles.name} numberOfLines={1}>
            {stall.name}
          </ThemedText>
          <ThemedText type="default" style={styles.meta} numberOfLines={1}>
            {[hawkerCenterName, distance, stall.priceRange].filter(Boolean).join(' · ')}
          </ThemedText>
          <View style={styles.ratingRow}>
            <ThemedText type="default" style={styles.rating}>
              ⭐ {stall.rating.toFixed(1)}
            </ThemedText>
            <View style={[styles.statusDot, { backgroundColor: stall.openStatus === 'open' ? '#4CAF50' : '#F44336' }]} />
            <ThemedText type="default" style={[styles.status, { color: stall.openStatus === 'open' ? '#4CAF50' : '#F44336' }]}>
              {stall.openStatus === 'open' ? 'Open' : 'Closed'}
            </ThemedText>
          </View>
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
    backgroundColor: DynamicColorIOS({
      dark: Colors.dark.card,
      light: Colors.light.card,
    }),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
    }),
  },
  pressed: { opacity: 0.92 },
  imageWrap: {
    width: '100%',
    height: 128,
    overflow: 'hidden',
  },
  image: { width: '100%', height: 128 },
  content: { padding: 12, paddingTop: 10, gap: 3 },
  name: { marginBottom: 2 },
  meta: { fontSize: 12, opacity: 0.75 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  rating: { fontSize: 12 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  status: { fontSize: 12, fontWeight: '600' },
});
