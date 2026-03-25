import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import * as Location from 'expo-location';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

export function HomeLocationHeader() {
  const tint = useThemeColor({}, 'tint');
  const router = useRouter();
  const [locationLabel, setLocationLabel] = useState('Near Maxwell, Singapore');

  useEffect(() => {
    async function resolveLocationLabel() {
      try {
        const existing = await Location.getForegroundPermissionsAsync();
        const permission =
          existing.status === 'granted'
            ? existing
            : await Location.requestForegroundPermissionsAsync();

        if (permission.status !== 'granted') return;

        const coords = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const [address] = await Location.reverseGeocodeAsync(coords.coords);
        if (!address) return;

        const area = address.district ?? address.subregion ?? address.city ?? address.name;
        const country = address.country ?? 'Singapore';
        if (!area) return;

        setLocationLabel(`Near ${area}, ${country}`);
      } catch {
        // Keep fallback location label if geolocation fails.
      }
    }

    void resolveLocationLabel();
  }, []);

  return (
    <View style={styles.topHeader}>
      <View style={styles.topBarRow}>
        <Pressable style={styles.locationRow} onPress={() => router.push('/map')}>
          <Image source="sf:mappin.and.ellipse" style={styles.locationIcon} tintColor={tint} />
          <ThemedText style={styles.locationLabel} numberOfLines={1}>
            {locationLabel}
          </ThemedText>
          <Image source="sf:chevron.down" style={styles.locationChevron} tintColor={tint} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    paddingHorizontal: 16,
  },
  topBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 40,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 6,
    height: 40,
  },
  locationIcon: { width: 14, height: 14 },
  locationLabel: {
    fontSize: 14,
    fontWeight: '700',
    maxWidth: 260,
  },
  locationChevron: { width: 11, height: 11 },
});

