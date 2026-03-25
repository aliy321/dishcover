import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  DynamicColorIOS,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { AnimatedFlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import {
  dishes,
  getHawkerCenterById,
  getStallsForDish,
  getUserById,
  reviews,
} from '@/lib/mock-data';
import type { Award, Review, Stall } from '@/types';
import { ThemedView } from '@/components/themed-view';

// ── Theme-aware colors ─────────────────────────────────────────────────────
const C_BG = DynamicColorIOS({ dark: Colors.dark.background, light: Colors.light.background });
const C_CARD = DynamicColorIOS({ dark: Colors.dark.card, light: Colors.light.card });
const C_TINT = DynamicColorIOS({ dark: Colors.dark.tint, light: Colors.light.tint });
const C_ICON = DynamicColorIOS({ dark: Colors.dark.icon, light: Colors.light.icon });
const C_TEXT = DynamicColorIOS({ dark: Colors.dark.text, light: Colors.light.text });
const C_TINT_18 = DynamicColorIOS({ dark: Colors.dark.tint + '18', light: Colors.light.tint + '18' });
const C_TINT_22 = DynamicColorIOS({ dark: Colors.dark.tint + '22', light: Colors.light.tint + '22' });
const C_ICON_28 = DynamicColorIOS({ dark: Colors.dark.icon + '28', light: Colors.light.icon + '28' });
const C_ICON_33 = DynamicColorIOS({ dark: Colors.dark.icon + '33', light: Colors.light.icon + '33' });
// ──────────────────────────────────────────────────────────────────────────

const FALLBACK_DISH_IMAGE = require('@/assets/food.jpg');
const FALLBACK_STALL_IMAGE = require('@/assets/stall.jpg');
const HERO_HEIGHT = 320;
const HIGHLIGHT_REVIEW_COUNT = 5;

type Tab = 'reviews' | 'stalls' | 'awards';

// ── Small sub-components ───────────────────────────────────────────────────
function StarRow({ rating, size = 12 }: { rating: number; size?: number }) {
  const rounded = Math.round(rating);
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= rounded ? 'star' : 'star-outline'}
          size={size}
          color="#F5A623"
        />
      ))}
    </View>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const user = getUserById(review.userId);
  const date = new Date(review.createdAt).toLocaleDateString('en-SG', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
  const byline = `${user?.displayName ?? 'Anonymous'} · ${date}`;
  const overallRating =
    (review.tasteRating + review.valueRating + review.queueRating) / 3;
  return (
    <View style={[s.reviewCard, { backgroundColor: C_CARD }]}>
      <View style={s.reviewCardInner}>
        <View style={s.reviewHeader}>
          <View style={[s.avatar, { backgroundColor: C_TINT_22 }]}>
            <ThemedText style={[s.avatarLetter, { color: C_TINT }]}>
              {(user?.displayName ?? '?')[0].toUpperCase()}
            </ThemedText>
          </View>
          <View style={s.reviewHeaderText}>
            <ThemedText style={[s.reviewByline, { color: C_TEXT }]} numberOfLines={1}>
              {byline}
            </ThemedText>
            <View style={s.reviewRatingRow}>
              <StarRow rating={overallRating} size={11} />
              <ThemedText style={[s.reviewRatingValue, { color: C_TEXT }]}>
                {overallRating.toFixed(1)}
              </ThemedText>
            </View>
          </View>
        </View>
        {review.comment ? (
          <ThemedText
            style={[s.reviewComment, { color: C_TEXT }]}
            numberOfLines={2}
          >
            "{review.comment}"
          </ThemedText>
        ) : null}
      </View>
    </View>
  );
}

function StallRow({ stall }: { stall: Stall }) {
  const hawkerCenter = getHawkerCenterById(stall.hawkerCenterId);
  const stallSource = stall.photoUris.length > 0 ? { uri: stall.photoUris[0] } : FALLBACK_STALL_IMAGE;
  const hours =
    stall.openingTime && stall.closingTime
      ? `${stall.openingTime} – ${stall.closingTime}`
      : stall.closingTime
        ? `Closes ${stall.closingTime}`
        : null;

  return (
    <Pressable
      onPress={() => router.push(`/stall/${stall.id}`)}
      style={({ pressed }) => [s.stallCard, { backgroundColor: C_CARD }, pressed && { opacity: 0.75 }]}
    >
      <Image source={stallSource} style={s.stallThumb} contentFit="cover" />
      <View style={s.stallInfo}>
        <ThemedText style={[s.stallName, { color: C_TEXT }]} numberOfLines={1}>{stall.name}</ThemedText>
        <View style={s.stallMeta}>
          {hawkerCenter && (
            <ThemedText style={[s.stallMetaText, { color: C_ICON }]}>{hawkerCenter.name}</ThemedText>
          )}
          {stall.driveTimeMinutes != null && (
            <ThemedText style={[s.stallMetaText, { color: C_ICON }]}>· {stall.driveTimeMinutes} min</ThemedText>
          )}
        </View>
        {hours && (
          <View style={s.hoursRow}>
            <Ionicons name="time-outline" size={11} color={C_ICON as unknown as string} />
            <ThemedText style={[s.stallMetaText, { color: C_ICON }]}>{hours}</ThemedText>
          </View>
        )}
        {stall.awards && stall.awards.length > 0 && (
          <View style={s.awardPills}>
            {stall.awards.map((award, i) => (
              <View key={i} style={[s.awardPill, { backgroundColor: '#F5A62318' }]}>
                <ThemedText style={s.awardPillText}>{award.icon} {award.name}</ThemedText>
              </View>
            ))}
          </View>
        )}
      </View>
      <Ionicons name="chevron-forward" size={16} color={C_ICON as unknown as string} style={{ alignSelf: 'center' }} />
    </Pressable>
  );
}

function AwardCard({ award }: { award: Award }) {
  return (
    <View style={[s.awardCard, { backgroundColor: C_CARD }]}>
      <View style={s.awardIconWrap}>
        <ThemedText style={s.awardEmoji}>{award.icon ?? '🏅'}</ThemedText>
      </View>
      <View style={{ flex: 1 }}>
        <ThemedText style={[s.awardName, { color: C_TEXT }]}>{award.name}</ThemedText>
        {award.year ? (
          <ThemedText style={[s.awardYear, { color: C_ICON }]}>{award.year}</ThemedText>
        ) : null}
      </View>
    </View>
  );
}

function EmptyTab({ icon, text, subtext }: { icon: string; text: string; subtext?: string }) {
  return (
    <View style={[s.emptyCard, { backgroundColor: C_CARD }]}>
      <Ionicons name={icon as any} size={28} color={C_ICON as unknown as string} />
      <ThemedText style={[s.emptyText, { color: C_ICON }]}>{text}</ThemedText>
      {subtext ? (
        <ThemedText style={[s.emptySubText, { color: C_ICON }]}>{subtext}</ThemedText>
      ) : null}
    </View>
  );
}

// ── Main screen ────────────────────────────────────────────────────────────
const ESTIMATED_ITEM_HEIGHT = 120;

export default function DishDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<Tab>('reviews');

  const listRef = useRef<any>(null);

  const scrollOffset = useSharedValue(0);
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollOffset.value = event.nativeEvent.contentOffset.y;
    },
    []
  );

  const heroAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollOffset.value,
          [-HERO_HEIGHT, 0, HERO_HEIGHT],
          [-HERO_HEIGHT / 2, 0, HERO_HEIGHT * 0.75]
        ),
      },
      { scale: interpolate(scrollOffset.value, [-HERO_HEIGHT, 0, HERO_HEIGHT], [2, 1, 1]) },
    ],
  }));

  const dish = useMemo(() => dishes.find((d) => d.id === id), [id]);
  const topStalls = useMemo(() => (dish ? getStallsForDish(dish.id) : []), [dish]);
  const dishReviews = useMemo(() => reviews.filter((r) => r.dishId === id), [id]);

  // Show a small set of highlight reviews on the detail screen
  const visibleReviews = useMemo(
    () => dishReviews.slice(0, HIGHLIGHT_REVIEW_COUNT),
    [dishReviews]
  );

  // List data based on active tab
  const listData: any[] = useMemo(() => {
    if (activeTab === 'reviews') return visibleReviews;
    if (activeTab === 'stalls') return topStalls;
    return dish?.awards ?? [];
  }, [activeTab, visibleReviews, topStalls, dish]);

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab);
  }, []);

  const renderItem = useCallback(({ item }: { item: any }) => {
    const content =
      activeTab === 'reviews' ? <ReviewCard review={item} /> :
        activeTab === 'stalls' ? <StallRow stall={item} /> :
          <AwardCard award={item} />;
    return <View style={s.tabContentItemWrap}>{content}</View>;
  }, [activeTab]);

  const keyExtractor = useCallback((item: any, idx: number) => {
    if (activeTab === 'reviews') return item.id;
    if (activeTab === 'stalls') return item.id;
    return `award-${idx}`;
  }, [activeTab]);

  if (!dish) {
    return (
      <View style={[s.errorContainer, { backgroundColor: C_BG, paddingTop: insets.top }]}>
        <ThemedText type="title">Dish not found</ThemedText>
      </View>
    );
  }

  const dishSource = dish.photoUri ? { uri: dish.photoUri } : FALLBACK_DISH_IMAGE;

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'reviews', label: 'Reviews', count: dishReviews.length },
    { key: 'stalls', label: 'Stalls', count: topStalls.length },
    { key: 'awards', label: 'Awards', count: dish.awards?.length ?? 0 },
  ];

  const ListHeader = (
    <View >
      {/* Hero */}
      <Animated.View style={[s.hero, heroAnimatedStyle]}>
        <Animated.View style={StyleSheet.absoluteFill} sharedTransitionTag={`dish-${id}`}>
          <Image source={dishSource} style={StyleSheet.absoluteFill} contentFit="cover" />
        </Animated.View>
        <View style={s.heroGradient} />
      </Animated.View>

      {/* Info block */}
      <View style={[s.infoBlock, { backgroundColor: C_BG }]}>
        <ThemedText type="title" style={s.dishName}>{dish.name}</ThemedText>

        <View style={s.metaRow}>
          <View style={s.ratingGroup}>
            <Ionicons name="star" size={15} color="#F5A623" />
            <ThemedText style={[s.ratingValue, { color: C_TEXT }]}>{dish.rating.toFixed(1)}</ThemedText>
            <ThemedText style={[s.ratingCount, { color: C_ICON }]}>({dish.reviewCount} reviews)</ThemedText>
          </View>
          <View style={[s.priceBadge, { backgroundColor: C_TINT_18 }]}>
            <ThemedText style={[s.priceText, { color: C_TINT }]}>{dish.price}</ThemedText>
          </View>
        </View>

        {dish.description ? (
          <ThemedText style={[s.description, { color: C_ICON }]}>{dish.description}</ThemedText>
        ) : null}

        {dish.tags && dish.tags.length > 0 && (
          <View style={s.badgeRow}>
            {dish.tags.map((tag) => (
              <View key={tag} style={[s.tag, { backgroundColor: C_CARD }]}>
                <ThemedText style={[s.tagText, { color: C_ICON }]}>{tag}</ThemedText>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Tab bar */}
      <View style={[s.tabBar, { backgroundColor: C_BG, borderBottomColor: C_ICON_28 }]}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              style={s.tabItem}
              onPress={() => handleTabChange(tab.key)}
            >
              <View style={s.tabLabelRow}>
                <ThemedText
                  style={[
                    s.tabLabel,
                    { color: isActive ? C_TINT : C_ICON },
                    isActive && s.tabLabelActive,
                  ]}
                >
                  {tab.label}
                </ThemedText>
                {tab.count > 0 && (
                  <View style={[s.tabBadge, { backgroundColor: isActive ? C_TINT : C_ICON_33 }]}>
                    <ThemedText style={[s.tabBadgeText, { color: isActive ? C_BG : C_ICON }]}>
                      {tab.count}
                    </ThemedText>
                  </View>
                )}
              </View>
              <View style={[s.tabUnderline, { backgroundColor: isActive ? C_TINT : 'transparent' }]} />
            </Pressable>
          );
        })}
      </View>

      {/* Tab content starts here — red for debug (remove later) */}
      <View style={s.tabContentWrap}>
        <View style={{ height: 12 }} />
      </View>
    </View>
  );

  const ListEmpty = (
    <View>
      {activeTab === 'reviews' && (
        <EmptyTab
          icon="chatbubble-outline"
          text="No reviews yet"
          subtext="Visit a stall and leave a review there"
        />
      )}
      {activeTab === 'stalls' && (
        <EmptyTab icon="storefront-outline" text="No stalls found" />
      )}
      {activeTab === 'awards' && (
        <EmptyTab icon="ribbon-outline" text="No awards yet" />
      )}
    </View>
  );

  const showViewAllReviews =
    activeTab === 'reviews' && dishReviews.length > HIGHLIGHT_REVIEW_COUNT;

  const ListFooter = showViewAllReviews ? (
    <View style={s.viewAllFooter}>
      <Pressable
        style={[s.viewAllButton, { borderColor: C_ICON_28 }]}
        onPress={() => router.push(`/dish/${id}/reviews`)}
        hitSlop={8}
      >
        <ThemedText style={[s.viewAllLabel, { color: C_TINT }]}>
          View all {dishReviews.length} reviews
        </ThemedText>
        <Ionicons name="chevron-forward" size={16} color={C_TINT as unknown as string} />
      </Pressable>
    </View>
  ) : null;

  return (
    <View style={[s.root, { backgroundColor: C_BG }]}>
      {/* Overlay buttons */}
      <Pressable
        style={[s.circleBtn, { position: 'absolute', top: insets.top + 8, left: 16, zIndex: 20 }]}
        onPress={() => router.back()}
        hitSlop={8}
      >
        <Ionicons name="chevron-down" size={18} color="#fff" />
      </Pressable>

      <View style={[s.heroBtnGroup, { position: 'absolute', top: insets.top + 8, right: 16, zIndex: 20 }]}>
        <Pressable style={s.circleBtn} hitSlop={8}>
          <Ionicons name="bookmark-outline" size={18} color="#fff" />
        </Pressable>
        <Pressable style={s.circleBtn} hitSlop={8}>
          <Ionicons name="share-outline" size={18} color="#fff" />
        </Pressable>
      </View>

      <AnimatedFlashList
        ref={listRef}
        key={activeTab}
        data={listData}
        // @ts-expect-error AnimatedFlashList wraps FlashList; estimatedItemSize is supported at runtime
        estimatedItemSize={ESTIMATED_ITEM_HEIGHT}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        ListFooterComponent={ListFooter}
        style={StyleSheet.flatten([s.list, { backgroundColor: C_BG }])}
        contentContainerStyle={StyleSheet.flatten([
          s.listContent,
          { backgroundColor: C_BG },
        ])}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      />
    </View>
  );
}

const GOLD = '#B8860B';

const s = StyleSheet.create({
  root: { flex: 1 },
  errorContainer: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  list: { flex: 1 },
  listContent: { paddingBottom: 40, flexGrow: 1 },
  // Debug: red = tab content area (remove when done)
  tabContentWrap: { backgroundColor: DynamicColorIOS({ dark: Colors.dark.background, light: Colors.light.background }), minHeight: 1, paddingHorizontal: 16 },
  tabContentItemWrap: { backgroundColor: DynamicColorIOS({ dark: Colors.dark.background, light: Colors.light.background }), paddingVertical: 4, paddingHorizontal: 14 },

  hero: { height: HERO_HEIGHT },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    experimental_backgroundImage: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.55) 100%)',
  } as any,
  circleBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroBtnGroup: { position: 'absolute', flexDirection: 'row', gap: 8 },

  // ── Info block ──
  infoBlock: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 18, gap: 8 },
  dishName: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ratingGroup: { flexDirection: 'row', alignItems: 'center', gap: 5, flex: 1 },
  ratingValue: { fontSize: 15, fontWeight: '700' },
  ratingCount: { fontSize: 13 },
  priceBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  priceText: { fontSize: 14, fontWeight: '700' },
  description: { fontSize: 14, lineHeight: 20, marginBottom: 4 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  tagText: { fontSize: 13, fontWeight: '500' },

  // ── Tab bar ──
  tabBar: { flexDirection: 'row', borderBottomWidth: StyleSheet.hairlineWidth },
  tabItem: { flex: 1, paddingTop: 12, paddingBottom: 0 },
  tabLabelRow: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingBottom: 10,
  },
  tabLabel: { fontSize: 14, fontWeight: '500', textAlign: 'center' },
  tabLabelActive: { fontWeight: '700' },
  tabBadge: {
    minWidth: 18, height: 18, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5,
  },
  tabBadgeText: { fontSize: 11, fontWeight: '700', lineHeight: 14, textAlign: 'center' },
  tabUnderline: { height: 2, borderRadius: 1, alignSelf: 'stretch', marginHorizontal: 12 },

  // ── View all reviews footer ──
  viewAllFooter: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 28 },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  viewAllLabel: { fontSize: 14, fontWeight: '600' },

  // ── List item wrapper ──

  // ── Empty state ──
  emptyCard: { borderRadius: 16, padding: 24, alignItems: 'center', gap: 8 },
  emptyText: { fontSize: 15, fontWeight: '600', marginTop: 4 },
  emptySubText: { fontSize: 13, textAlign: 'center', lineHeight: 18 },

  // ── Review cards ──
  reviewCard: {
    borderRadius: 12, gap: 0,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  } as any,
  reviewCardInner: { padding: 12 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  reviewHeaderText: { flex: 1, minWidth: 0 },
  avatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  avatarLetter: { fontSize: 13, fontWeight: '700' },
  reviewByline: { fontSize: 13, fontWeight: '500' },
  reviewRatingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  reviewRatingValue: { fontSize: 12, fontWeight: '700' },
  reviewComment: { fontSize: 13, lineHeight: 18, fontStyle: 'italic', marginTop: 8 },

  // ── Stall cards ──
  stallCard: {
    borderRadius: 16, overflow: 'hidden',
    flexDirection: 'row', alignItems: 'stretch',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  } as any,
  stallThumb: { width: 90, height: 90 },
  stallInfo: { flex: 1, padding: 12, gap: 4, justifyContent: 'center' },
  stallName: { fontSize: 15, fontWeight: '700' },
  stallMeta: { flexDirection: 'row', gap: 4 },
  stallMetaText: { fontSize: 12 },
  hoursRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  awardPills: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 2 },
  awardPill: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10 },
  awardPillText: { fontSize: 11, color: GOLD, fontWeight: '500' },

  // ── Award cards ──
  awardCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: 16, padding: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  } as any,
  awardIconWrap: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#F5A62318',
    alignItems: 'center', justifyContent: 'center',
  },
  awardEmoji: { fontSize: 20 },
  awardName: { fontSize: 14, fontWeight: '600' },
  awardYear: { fontSize: 12, marginTop: 1 },
});
