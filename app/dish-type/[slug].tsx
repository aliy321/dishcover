import { useMemo, useState } from 'react';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import {
  getDishTypeBySlug,
  getHawkerCenterById,
  getListingsForDishType,
  getStallById,
} from '@/lib/mock-data';

const FALLBACK_IMAGE = require('@/assets/food.jpg');
type SortMode = 'top' | 'nearby' | 'value';

function parsePriceToNumber(price: string): number {
  const match = price.match(/[\d.]+/);
  return match ? Number(match[0]) : 999;
}

export default function DishTypeScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const insets = useSafeAreaInsets();
  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const tint = useThemeColor({}, 'tint');
  const [sortMode, setSortMode] = useState<SortMode>('top');

  const dishType = useMemo(() => (slug ? getDishTypeBySlug(slug) : undefined), [slug]);
  const listings = useMemo(() => {
    if (!dishType) return [];
    const base = getListingsForDishType(dishType.id);

    if (sortMode === 'nearby') {
      return [...base].sort((a, b) => {
        const stallA = getStallById(a.stallId);
        const stallB = getStallById(b.stallId);
        const etaA = stallA?.driveTimeMinutes ?? 999;
        const etaB = stallB?.driveTimeMinutes ?? 999;
        return etaA - etaB || b.rating - a.rating;
      });
    }

    if (sortMode === 'value') {
      return [...base].sort((a, b) => {
        const scoreA = a.rating / Math.max(parsePriceToNumber(a.price), 0.1);
        const scoreB = b.rating / Math.max(parsePriceToNumber(b.price), 0.1);
        return scoreB - scoreA || b.reviewCount - a.reviewCount;
      });
    }

    // "Top": weighted blend of rating + trust (review count) + proximity.
    return [...base].sort((a, b) => {
      const stallA = getStallById(a.stallId);
      const stallB = getStallById(b.stallId);
      const etaA = stallA?.driveTimeMinutes ?? 18;
      const etaB = stallB?.driveTimeMinutes ?? 18;
      const scoreA = a.rating * 20 + Math.log10(a.reviewCount + 1) * 9 - etaA * 0.35;
      const scoreB = b.rating * 20 + Math.log10(b.reviewCount + 1) * 9 - etaB * 0.35;
      return scoreB - scoreA;
    });
  }, [dishType, sortMode]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/(tabs)');
  };

  if (!dishType) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: background }]}>
        <ThemedText type="title">Dish type not found</ThemedText>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: background }}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 8 }]}
    >
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton} hitSlop={10}>
          <Image source="sf:chevron.left" style={styles.backIcon} tintColor={tint} />
        </Pressable>
        <ThemedText style={styles.title}>Best {dishType.name}</ThemedText>
        <ThemedText style={styles.subtitle}>
          {listings.length} {listings.length === 1 ? 'listing' : 'listings'} nearby
        </ThemedText>
      </View>

      <View style={styles.filterRow}>
        <SortChip
          label="Top"
          active={sortMode === 'top'}
          onPress={() => setSortMode('top')}
          tint={tint}
        />
        <SortChip
          label="Nearby"
          active={sortMode === 'nearby'}
          onPress={() => setSortMode('nearby')}
          tint={tint}
        />
        <SortChip
          label="Best value"
          active={sortMode === 'value'}
          onPress={() => setSortMode('value')}
          tint={tint}
        />
      </View>
      <ThemedText style={styles.rankHint}>
        {sortMode === 'top'
          ? 'Top ranks by rating, review confidence, and distance.'
          : sortMode === 'nearby'
            ? 'Nearby ranks by shortest travel time first.'
            : 'Best value ranks by rating relative to price.'}
      </ThemedText>

      {listings.map((listing, index) => {
        const stall = getStallById(listing.stallId);
        if (!stall) return null;
        const hawker = getHawkerCenterById(stall.hawkerCenterId);
        const source = listing.photoUri ? { uri: listing.photoUri } : FALLBACK_IMAGE;

        return (
          <Link key={listing.id} href={`/stall/${stall.id}` as any} asChild>
            <Pressable style={StyleSheet.flatten([styles.row, { backgroundColor: card }])}>
              <Image source={source} style={styles.thumb} contentFit="cover" />
              <View style={styles.info}>
                <ThemedText style={styles.rank}>#{index + 1}</ThemedText>
                <ThemedText style={styles.name} numberOfLines={1}>
                  {stall.name}
                </ThemedText>
                <ThemedText style={styles.meta} numberOfLines={1}>
                  {hawker?.name ?? 'Nearby'} · {listing.price}
                </ThemedText>
                <ThemedText style={styles.meta}>
                  {listing.rating.toFixed(1)} stars · {listing.reviewCount} reviews
                </ThemedText>
              </View>
              <Image source="sf:chevron.right" style={styles.chevron} tintColor={tint} />
            </Pressable>
          </Link>
        );
      })}
    </ScrollView>
  );
}

function SortChip({
  label,
  active,
  onPress,
  tint,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  tint: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        active ? { backgroundColor: `${tint}20`, borderColor: `${tint}55` } : styles.chipInactive,
      ]}
    >
      <ThemedText style={[styles.chipText, active ? { color: tint } : styles.chipTextInactive]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    gap: 4,
    marginBottom: 12,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(120,120,128,0.15)',
    marginBottom: 6,
  },
  backIcon: { width: 14, height: 14 },
  title: {
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 2,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
  },
  chipInactive: {
    borderColor: 'rgba(120,120,128,0.22)',
    backgroundColor: 'rgba(120,120,128,0.08)',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  chipTextInactive: {
    opacity: 0.75,
  },
  rankHint: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  row: {
    borderRadius: 16,
    flexDirection: 'row',
    gap: 12,
    padding: 10,
    alignItems: 'center',
  },
  thumb: {
    width: 86,
    height: 86,
    borderRadius: 12,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  rank: {
    fontSize: 12,
    opacity: 0.6,
    fontWeight: '700',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
  },
  meta: {
    fontSize: 13,
    opacity: 0.65,
  },
  chevron: {
    width: 14,
    height: 14,
    opacity: 0.6,
  },
});

