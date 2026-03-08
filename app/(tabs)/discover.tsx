import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNMapView, { Marker } from 'react-native-maps';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { hawkerCenters, locations, stalls } from '@/lib/mock-data';

type DiscoverView = 'feed' | 'map';

export default function DiscoverScreen() {
  const [activeView, setActiveView] = useState<DiscoverView>('feed');
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <ThemedText type="title">Discover</ThemedText>
          <View
            style={[
              styles.segmentedControl,
              { backgroundColor: scheme === 'dark' ? '#2C2C2E' : '#E5E5EA' },
            ]}
          >
            {(['feed', 'map'] as const).map((view) => {
              const isActive = activeView === view;
              return (
                <Pressable
                  key={view}
                  onPress={() => setActiveView(view)}
                  style={[
                    styles.segment,
                    isActive && {
                      backgroundColor: colors.background,
                      shadowColor: '#000',
                      shadowOpacity: 0.12,
                      shadowRadius: 4,
                      shadowOffset: { width: 0, height: 1 },
                      elevation: 2,
                    },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.segmentLabel,
                      { color: isActive ? colors.tint : colors.icon },
                    ]}
                  >
                    {view === 'feed' ? 'Feed' : 'Map'}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>

        {activeView === 'feed' ? <FeedView /> : <MapView />}
      </SafeAreaView>
    </ThemedView>
  );
}

function FeedView() {
  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <ThemedText type="defaultSemiBold">Trending dishes, hidden gems, nearby stalls</ThemedText>
      <ThemedText type="default" style={styles.placeholder}>
        Feed content coming soon.
      </ThemedText>
    </ScrollView>
  );
}

const SINGAPORE_REGION = {
  latitude: 1.28,
  longitude: 103.845,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

function MapView() {
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
    <RNMapView
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
    </RNMapView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 12,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 2,
  },
  segment: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  segmentLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  scroll: {
    padding: 16,
    gap: 8,
  },
  map: {
    flex: 1,
    width: '100%',
  },
  placeholder: {
    opacity: 0.5,
  },
});
