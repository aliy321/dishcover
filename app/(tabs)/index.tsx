import { Link } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { DishCard } from '@/components/dish-card';
import { StallCard } from '@/components/stall-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  dishes,
  hawkerCenters,
  stalls,
} from '@/lib/mock-data';

const TAB_BAR_HEIGHT = 56;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const trendingDishes = useMemo(() => [...dishes].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5), []);
  const dailySuggestion = useMemo(() => dishes[Math.floor(dishes.length * 0.3)] ?? dishes[0], []);
  const nearbyStalls = useMemo(() => {
    const hcById = new Map(hawkerCenters.map((hc) => [hc.id, hc]));
    return stalls.slice(0, 4).map((s) => ({
      stall: s,
      hawkerCenterName: hcById.get(s.hawkerCenterId)?.name,
    }));
  }, []);

  const scrollContentStyle = [
    styles.scroll,
    { paddingBottom: 32 + TAB_BAR_HEIGHT + insets.bottom },
  ];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={scrollContentStyle}
        showsVerticalScrollIndicator={false}
      >
      <ThemedText type="title" style={styles.title}>
        What should you eat?
      </ThemedText>

      <ThemedText type="subtitle" style={styles.sectionTitle}>
        🔥 Trending nearby
      </ThemedText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontal}
        contentContainerStyle={styles.horizontalContent}
      >
        {trendingDishes.map((dish) => (
          <DishCard key={dish.id} dish={dish} distance={`${200 + Math.floor(Math.random() * 300)}m`} />
        ))}
      </ScrollView>

      <ThemedText type="subtitle" style={styles.sectionTitle}>
        🍜 What should you eat today
      </ThemedText>
      <ThemedView style={styles.suggestionCard}>
        <DishCard dish={dailySuggestion} distance="400m" />
      </ThemedView>

      <ThemedText type="subtitle" style={styles.sectionTitle}>
        🎰 Food roulette
      </ThemedText>
      <Link href="/roulette" asChild>
        <Pressable style={({ pressed }) => [styles.rouletteButton, pressed && styles.pressed]}>
          <ThemedText type="defaultSemiBold">Spin for a random dish</ThemedText>
        </Pressable>
      </Link>

      <ThemedText type="subtitle" style={styles.sectionTitle}>
        📍 Nearby hawkers
      </ThemedText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontal}
        contentContainerStyle={styles.horizontalContent}
      >
        {nearbyStalls.map(({ stall, hawkerCenterName }) => (
          <StallCard
            key={stall.id}
            stall={stall}
            hawkerCenterName={hawkerCenterName}
            distance={`${150 + Math.floor(Math.random() * 400)}m`}
          />
        ))}
      </ScrollView>
      </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32, gap: 16 },
  title: { marginBottom: 8 },
  sectionTitle: { marginBottom: 8 },
  horizontal: { marginHorizontal: -16, paddingHorizontal: 16 },
  horizontalContent: { flexDirection: 'row', gap: 16 },
  suggestionCard: { marginBottom: 8 },
  rouletteButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.3)',
  },
  pressed: { opacity: 0.9 },
});
