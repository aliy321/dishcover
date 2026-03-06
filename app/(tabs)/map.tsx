import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Link, useRouter } from 'expo-router';
import { Pressable } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { hawkerCenters, locations, stalls } from '@/lib/mock-data';

const SINGAPORE_REGION = {
  latitude: 1.28,
  longitude: 103.845,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

export default function MapScreen() {
  const router = useRouter();
  const locById = useMemo(() => new Map(locations.map((l) => [l.id, l])), []);
  const hcById = useMemo(() => new Map(hawkerCenters.map((hc) => [hc.id, hc])), []);

  const markers = useMemo(() => {
    return stalls.map((stall) => {
      const loc = locById.get(stall.locationId);
      const hc = hcById.get(stall.hawkerCenterId);
      return {
        id: stall.id,
        stall,
        title: stall.name,
        subtitle: hc?.name,
        latitude: loc?.latitude ?? SINGAPORE_REGION.latitude,
        longitude: loc?.longitude ?? SINGAPORE_REGION.longitude,
      };
    });
  }, [locById, hcById]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={SINGAPORE_REGION}
        showsUserLocation
      >
        {markers.map((m) => (
          <Marker
            key={m.id}
            coordinate={{ latitude: m.latitude, longitude: m.longitude }}
            title={m.title}
            description={m.subtitle}
            onCalloutPress={() => router.push(`/stall/${m.stall.id}`)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
});
