import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { Stall } from '@/types';

interface StallCardProps {
  stall: Stall;
  hawkerCenterName?: string | null;
  distance: string;
}

export function StallCard({ stall, hawkerCenterName, distance }: StallCardProps) {
  return (
    <View style={styles.card}>
      <ThemedText type="defaultSemiBold" style={styles.name} numberOfLines={1}>
        {stall.name}
      </ThemedText>
      {hawkerCenterName ? (
        <ThemedText type="default" style={styles.subtitle} numberOfLines={1}>
          {hawkerCenterName}
        </ThemedText>
      ) : null}
      <ThemedText type="default" style={styles.distance}>
        {distance}
      </ThemedText>
    </View>
  );
}

const CARD_WIDTH = 180;

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(128,128,128,0.15)',
  },
  name: {
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    opacity: 0.9,
    marginBottom: 4,
  },
  distance: {
    fontSize: 13,
    opacity: 0.8,
  },
});
