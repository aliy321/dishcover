import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';
import MapView, { Marker, type MapViewProps } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { hawkerCenters, locations, stalls } from '@/lib/mock-data';
import type { Stall } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 48;
const CARD_GAP = 12;
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;

const SINGAPORE_REGION = {
  latitude: 1.2868,
  longitude: 103.845,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};

const FALLBACK_IMAGE = require('@/assets/food.jpg');

interface MarkerData {
  id: string;
  stall: Stall;
  title: string;
  hawkerCenterName?: string;
  latitude: number;
  longitude: number;
}

export default function MapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme];

  const mapRef = useRef<MapView>(null);
  const listRef = useRef<FlatList<MarkerData>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const locById = useMemo(() => new Map(locations.map((l) => [l.id, l])), []);
  const hcById = useMemo(() => new Map(hawkerCenters.map((hc) => [hc.id, hc])), []);

  const markers: MarkerData[] = useMemo(() =>
    stalls.map((stall) => {
      const loc = locById.get(stall.locationId);
      const hc = hcById.get(stall.hawkerCenterId);
      return {
        id: stall.id,
        stall,
        title: stall.name,
        hawkerCenterName: hc?.name,
        latitude: loc?.latitude ?? SINGAPORE_REGION.latitude,
        longitude: loc?.longitude ?? SINGAPORE_REGION.longitude,
      };
    }),
  [locById, hcById]);

  const animateMapTo = useCallback((index: number) => {
    const m = markers[index];
    if (!m) return;
    mapRef.current?.animateToRegion(
      {
        latitude: m.latitude - 0.005,
        longitude: m.longitude,
        latitudeDelta: 0.018,
        longitudeDelta: 0.018,
      },
      350,
    );
  }, [markers]);

  const handleMarkerPress = useCallback((index: number) => {
    setActiveIndex(index);
    listRef.current?.scrollToIndex({ index, animated: true });
    animateMapTo(index);
  }, [animateMapTo]);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      const first = viewableItems[0];
      if (first?.index != null && first.index !== activeIndex) {
        setActiveIndex(first.index);
        animateMapTo(first.index);
      }
    },
    [activeIndex, animateMapTo],
  );

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={SINGAPORE_REGION}
        showsUserLocation
      >
        {markers.map((m, index) => {
          const isActive = index === activeIndex;
          return (
            <Marker
              key={m.id}
              coordinate={{ latitude: m.latitude, longitude: m.longitude }}
              onPress={() => handleMarkerPress(index)}
            >
              <View style={[styles.pin, isActive && styles.pinActive]}>
                <ThemedText style={[styles.pinIcon]}>🍴</ThemedText>
                {isActive && (
                  <ThemedText style={styles.pinLabel} numberOfLines={1}>
                    {m.stall.name.split(' ').slice(0, 2).join(' ')}
                  </ThemedText>
                )}
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* Floating carousel */}
      <View style={[styles.carouselWrap, { paddingBottom: insets.bottom + 8 }]}>
        <FlatList
          ref={listRef}
          data={markers}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={SNAP_INTERVAL}
          decelerationRate="fast"
          contentContainerStyle={styles.listContent}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={(_, index) => ({
            length: SNAP_INTERVAL,
            offset: SNAP_INTERVAL * index,
            index,
          })}
          renderItem={({ item, index }) => (
            <MapCard
              marker={item}
              isActive={index === activeIndex}
              onPress={() => router.push(`/stall/${item.stall.id}`)}
              scheme={scheme}
            />
          )}
        />

        {/* Dot indicators */}
        <View style={styles.dots}>
          {markers.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i === activeIndex
                      ? colors.tint
                      : scheme === 'dark'
                      ? '#444'
                      : '#ccc',
                  width: i === activeIndex ? 16 : 6,
                },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

interface MapCardProps {
  marker: MarkerData;
  isActive: boolean;
  onPress: () => void;
  scheme: 'light' | 'dark';
}

function MapCard({ marker, isActive, onPress, scheme }: MapCardProps) {
  const colors = Colors[scheme];
  const { stall, hawkerCenterName } = marker;
  const source = stall.photoUris.length > 0 ? { uri: stall.photoUris[0] } : FALLBACK_IMAGE;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.background },
        isActive && styles.cardActive,
        pressed && styles.cardPressed,
      ]}
    >
      <Image source={source} style={styles.cardImage} resizeMode="cover" />

      <View style={styles.cardBody}>
        <ThemedText type="defaultSemiBold" style={styles.cardName} numberOfLines={1}>
          {stall.name}
        </ThemedText>

        <ThemedText type="default" style={styles.cardMeta} numberOfLines={1}>
          {[hawkerCenterName, `${stall.driveTimeMinutes} min`, stall.priceRange]
            .filter(Boolean)
            .join('  ·  ')}
        </ThemedText>

        <View style={styles.cardStatusRow}>
          <ThemedText
            style={[
              styles.cardStatus,
              { color: stall.openStatus === 'open' ? '#34C759' : '#FF3B30' },
            ]}
          >
            {stall.openStatus === 'open' ? 'Open' : 'Closed'}
          </ThemedText>
          {stall.closingTime ? (
            <ThemedText type="default" style={styles.cardClosing}>
              · Closes at {stall.closingTime}
            </ThemedText>
          ) : null}
          <View style={styles.ratingPill}>
            <ThemedText style={styles.ratingText}>⭐ {stall.rating.toFixed(1)}</ThemedText>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },

  // Marker pin
  pin: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 5,
    gap: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: { elevation: 4 },
    }),
  },
  pinActive: {
    backgroundColor: '#0a7ea4',
  },
  pinIcon: { fontSize: 14 },
  pinLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
    maxWidth: 80,
  },

  // Carousel
  carouselWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    gap: 10,
  },
  listContent: {
    paddingHorizontal: 24,
    gap: CARD_GAP,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    paddingBottom: 4,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },

  // Card
  card: {
    width: CARD_WIDTH,
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 16,
      },
      android: { elevation: 8 },
    }),
  },
  cardActive: {
    ...Platform.select({
      ios: { shadowOpacity: 0.28 },
      android: { elevation: 12 },
    }),
  },
  cardPressed: { opacity: 0.93 },
  cardImage: { width: '100%', height: 160 },
  cardBody: {
    padding: 14,
    gap: 4,
  },
  cardName: { fontSize: 17 },
  cardMeta: { fontSize: 13, opacity: 0.65 },
  cardStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  cardStatus: { fontSize: 13, fontWeight: '600' },
  cardClosing: { fontSize: 13, opacity: 0.6 },
  ratingPill: {
    marginLeft: 'auto',
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  ratingText: { fontSize: 12, fontWeight: '600' },
});
