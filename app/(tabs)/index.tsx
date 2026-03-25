import { useMemo, useRef, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DishCard } from '@/components/dish-card';
import { FeaturedDishCard } from '@/components/featured-dish-card';
import { StallCard } from '@/components/stall-card';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { dishes, hawkerCenters, stalls } from '@/lib/mock-data';
import type { Dish } from '@/types';

const FOOD_IMAGE = require('@/assets/food.jpg');

const EXPLORE_CATEGORIES = [
  { id: 'laksa', label: 'Laksa' },
  { id: 'chicken-rice', label: 'Chicken Rice' },
  { id: 'char-kway-teow', label: 'Char Kway Teow' },
  { id: 'curry-rice', label: 'Curry Rice' },
  { id: 'bao', label: 'Bao' },
] as const;

function EmptyRow() {
  return (
    <View style={styles.emptyRow}>
      <ThemedText style={styles.emptyText}>Nothing here yet</ThemedText>
    </View>
  );
}

interface FoodTileProps {
  dish: Dish;
  subtitle: string;
}

function FoodTile({ dish, subtitle }: FoodTileProps) {
  const source = dish.photoUri ? { uri: dish.photoUri } : FOOD_IMAGE;

  return (
    <Link href={`/dish/${dish.id}` as any} asChild>
      <Pressable style={({ pressed }) => [styles.foodTile, pressed && styles.foodTilePressed]}>
        <Image source={source} style={styles.foodTileImage} contentFit="cover" />
        <ThemedText style={styles.foodTileTitle} numberOfLines={1}>
          {dish.name}
        </ThemedText>
        <ThemedText style={styles.foodTileMeta} numberOfLines={1}>
          {subtitle}
        </ThemedText>
      </Pressable>
    </Link>
  );
}

export default function HomeScreen() {
  const tint = useThemeColor({}, 'tint');
  const background = useThemeColor({}, 'background');
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const heroCardWidth = Math.max(280, screenWidth - 32);
  const heroSnapInterval = heroCardWidth + 12;
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [isHeroDragging, setIsHeroDragging] = useState(false);
  const lastHeroIndexRef = useRef(0);

  const featuredDishes = useMemo(
    () => [...dishes].sort((a, b) => b.rating - a.rating).slice(0, 4),
    [],
  );
  const stallById = useMemo(() => new Map(stalls.map((stall) => [stall.id, stall])), []);
  const hawkerById = useMemo(
    () => new Map(hawkerCenters.map((hawkerCenter) => [hawkerCenter.id, hawkerCenter])),
    [],
  );
  const featuredCarouselItems = useMemo(
    () =>
      featuredDishes.map((dish) => {
        const primaryStall = dish.stallIds[0] ? stallById.get(dish.stallIds[0]) : undefined;
        const hawkerCenter = primaryStall ? hawkerById.get(primaryStall.hawkerCenterId) : undefined;
        const contextLine =
          [primaryStall?.name, hawkerCenter?.name].filter(Boolean).join(' · ') || 'Top-rated near you';
        return { dish, contextLine };
      }),
    [featuredDishes, hawkerById, stallById],
  );
  const recommendedDishes = useMemo(
    () =>
      [...dishes]
        .sort((a, b) => b.rating - a.rating)
        .filter((dish) => !featuredDishes.some((featured) => featured.id === dish.id))
        .slice(0, 6),
    [featuredDishes],
  );
  const trendingDishes = useMemo(
    () => [...dishes].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 6),
    [],
  );
  const featuredStalls = useMemo(
    () =>
      [...stalls]
        .sort((a, b) => b.reviewCount - a.reviewCount || b.rating - a.rating)
        .slice(0, 4),
    [],
  );

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      style={{ backgroundColor: background }}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior='automatic'
    >
      <View style={styles.topHeader}>
        <View style={styles.topBarRow}>
          <Pressable style={styles.locationRow} onPress={() => router.push('/map')}>
            <Image source="sf:mappin.and.ellipse" style={styles.locationIcon} tintColor={tint} />
            <ThemedText style={styles.locationLabel}>Near Maxwell, Singapore</ThemedText>
            <Image source="sf:chevron.down" style={styles.locationChevron} tintColor={tint} />
          </Pressable>
          {/* <Pressable style={styles.profileButton} onPress={() => router.push('/profile')}>
            <Image source="sf:person.crop.circle.fill" style={styles.profileIcon} tintColor={tint} />
          </Pressable> */}
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitleStandalone}>Dish picks today</ThemedText>
        {featuredCarouselItems.length > 0 ? (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredCarouselContent}
              decelerationRate="fast"
              snapToInterval={heroSnapInterval}
              snapToAlignment="start"
              onScrollBeginDrag={() => setIsHeroDragging(true)}
              onScrollEndDrag={() => setIsHeroDragging(false)}
              scrollEventThrottle={16}
              onScroll={(event) => {
                const x = event.nativeEvent.contentOffset.x;
                const nextIndex = Math.round(x / heroSnapInterval);
                const clamped = Math.max(
                  0,
                  Math.min(nextIndex, featuredCarouselItems.length - 1),
                );

                if (clamped !== lastHeroIndexRef.current) {
                  lastHeroIndexRef.current = clamped;
                  setActiveHeroIndex(clamped);
                }
              }}
              onMomentumScrollEnd={(event) => {
                const x = event.nativeEvent.contentOffset.x;
                const nextIndex = Math.round(x / heroSnapInterval);
                setActiveHeroIndex(
                  Math.max(0, Math.min(nextIndex, featuredCarouselItems.length - 1)),
                );
              }}
            >
              {featuredCarouselItems.map((item) => (
                <View
                  key={item.dish.id}
                  style={[styles.featuredCarouselSlide, { width: heroCardWidth }]}
                >
                  <FeaturedDishCard
                    dish={item.dish}
                    contextLine={item.contextLine}
                    width={heroCardWidth}
                    disabled={isHeroDragging}
                  />
                </View>
              ))}
            </ScrollView>

            <View style={styles.carouselDotsRow}>
              {featuredCarouselItems.map((item, index) => (
                <View
                  key={item.dish.id}
                  style={[styles.carouselDot, index === activeHeroIndex && styles.carouselDotActive]}
                />
              ))}
            </View>
          </>
        ) : (
          <EmptyRow />
        )}
      </View>

      <View style={styles.section}>
        <Pressable style={styles.sectionHeader} onPress={() => router.push('/search')}>
          <Image source="sf:square.grid.2x2.fill" style={styles.sectionIcon} tintColor={tint} />
          <ThemedText style={styles.sectionTitle}>Explore categories</ThemedText>
          <View style={styles.spacer} />
          <Image source="sf:chevron.right" style={styles.chevron} tintColor={tint} />
        </Pressable>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {EXPLORE_CATEGORIES.map((category) => (
            <Pressable
              key={category.id}
              style={styles.categoryChip}
              onPress={() => router.push('/search')}
            >
              <Image source={FOOD_IMAGE} style={styles.categoryThumb} contentFit="cover" />
              <ThemedText style={styles.categoryLabel} numberOfLines={1}>
                {category.label}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Pressable style={styles.sectionHeader} onPress={() => router.push('/search')}>
          <Image source="sf:storefront.fill" style={styles.sectionIcon} tintColor={tint} />
          <ThemedText style={styles.sectionTitle}>Featured stalls nearby</ThemedText>
          <View style={styles.spacer} />
          <Image source="sf:chevron.right" style={styles.chevron} tintColor={tint} />
        </Pressable>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardRow}>
          {featuredStalls.map((stall) => (
            <StallCard
              key={stall.id}
              stall={stall}
              hawkerCenterName={hawkerById.get(stall.hawkerCenterId)?.name}
              distance={stall.driveTimeMinutes ? `${stall.driveTimeMinutes} min away` : 'Nearby'}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Pressable style={styles.sectionHeader} onPress={() => router.push('/search')}>
          <Image source="sf:heart.fill" style={styles.sectionIcon} tintColor={tint} />
          <ThemedText style={styles.sectionTitle}>Recommended for you</ThemedText>
          <View style={styles.spacer} />
          <Image source="sf:chevron.right" style={styles.chevron} tintColor={tint} />
        </Pressable>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardRow}>
          {recommendedDishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Pressable style={styles.sectionHeader} onPress={() => router.push('/search')}>
          <Image source="sf:flame.fill" style={styles.sectionIcon} tintColor={tint} />
          <ThemedText style={styles.sectionTitle}>Trending this week</ThemedText>
          <View style={styles.spacer} />
          <Image source="sf:chevron.right" style={styles.chevron} tintColor={tint} />
        </Pressable>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.foodTileRow}>
          {trendingDishes.map((dish) => (
            <FoodTile key={dish.id} dish={dish} subtitle={`${dish.rating.toFixed(1)} stars`} />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24,
    gap: 24,
  },
  topHeader: {
    paddingHorizontal: 16,
  },
  topBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 0,
  },
  locationIcon: { width: 14, height: 14 },
  locationLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  locationChevron: { width: 11, height: 11 },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(120,120,128,0.14)',
  },
  profileIcon: { width: 21, height: 21 },
  section: { gap: 10 },
  sectionTitleStandalone: {
    fontSize: 24,
    fontWeight: '800',
    paddingHorizontal: 16,
    lineHeight: 30,
  },
  featuredCarouselContent: {
    paddingHorizontal: 16,
  },
  featuredCarouselSlide: {
    marginRight: 12,
  },
  carouselDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
  },
  carouselDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(120,120,128,0.34)',
  },
  carouselDotActive: {
    width: 18,
    backgroundColor: 'rgba(0,122,255,0.9)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
  },
  sectionIcon: { width: 17, height: 17 },
  sectionTitle: { fontSize: 17, fontWeight: '600' },
  spacer: { flex: 1 },
  chevron: { width: 13, height: 13 },
  cardRow: { gap: 16, paddingHorizontal: 16 },
  chipRow: { gap: 10, paddingHorizontal: 16 },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(120,120,128,0.12)',
  },
  categoryThumb: {
    width: 34,
    height: 34,
    borderRadius: 999,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  foodTileRow: { gap: 12, paddingHorizontal: 16 },
  foodTile: {
    width: 132,
    gap: 8,
  },
  foodTilePressed: { opacity: 0.85 },
  foodTileImage: {
    width: 150,
    height: 132,
    borderRadius: 16,
  },
  foodTileTitle: {
    fontSize: 15,
    fontWeight: '700',
    // lineHeight: 18,
  },
  foodTileMeta: {
    fontSize: 12,
    opacity: 0.6,
    lineHeight: 16,
    marginTop: 0,
  },
  emptyRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.4,
  },
});
