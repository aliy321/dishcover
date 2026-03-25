import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/card';
import { ThemedText } from '@/components/themed-text';
import type { Stall } from '@/types';

const FALLBACK_IMAGE = require('@/assets/stall.jpg');

interface StallCardProps {
  stall: Stall;
  hawkerCenterName?: string | null;
  distance: string;
}

export function StallCard({ stall, hawkerCenterName, distance }: StallCardProps) {
  const source = stall.photoUris.length > 0 ? { uri: stall.photoUris[0] } : FALLBACK_IMAGE;

  return (
    <Card source={source} href={`/stall/${stall.id}`}>
      <View style={styles.inner}>
        <ThemedText style={styles.name} numberOfLines={1}>
          {stall.name}
        </ThemedText>
        <ThemedText style={styles.meta} numberOfLines={1}>
          {[hawkerCenterName, distance, stall.priceRange].filter(Boolean).join(' · ')}
        </ThemedText>
        <View style={styles.ratingRow}>
          <Image source="sf:star.fill" style={styles.starIcon} tintColor="#FFD700" />
          <ThemedText style={styles.rating}>{stall.rating.toFixed(1)}</ThemedText>
          <ThemedText style={styles.reviewCount}>· {stall.reviewCount} reviews</ThemedText>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  inner: {
    paddingVertical: 2,
    gap: 4,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 22,
    marginBottom: 4,
  },
  meta: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  starIcon: { width: 11, height: 11 },
  rating: { fontSize: 12, color: 'rgba(255,255,255,0.85)' },
  reviewCount: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
});
