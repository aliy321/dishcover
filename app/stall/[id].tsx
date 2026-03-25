import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  DynamicColorIOS,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import {
  getDishesForStall,
  getHawkerCenterById,
  getReviewsForStall,
  getStallById,
  getUserById,
} from '@/lib/mock-data';
import type { Dish, Review, Stall } from '@/types';

// ── Theme-aware colors ─────────────────────────────────────────────────────
const C_BG      = DynamicColorIOS({ dark: Colors.dark.background, light: Colors.light.background });
const C_CARD    = DynamicColorIOS({ dark: Colors.dark.card,       light: Colors.light.card });
const C_TINT    = DynamicColorIOS({ dark: Colors.dark.tint,       light: Colors.light.tint });
const C_ICON    = DynamicColorIOS({ dark: Colors.dark.icon,       light: Colors.light.icon });
const C_TEXT    = DynamicColorIOS({ dark: Colors.dark.text,       light: Colors.light.text });
const C_TINT_18 = DynamicColorIOS({ dark: Colors.dark.tint + '18', light: Colors.light.tint + '18' });
const C_TINT_22 = DynamicColorIOS({ dark: Colors.dark.tint + '22', light: Colors.light.tint + '22' });
const C_ICON_28 = DynamicColorIOS({ dark: Colors.dark.icon + '28', light: Colors.light.icon + '28' });
const C_ICON_33 = DynamicColorIOS({ dark: Colors.dark.icon + '33', light: Colors.light.icon + '33' });
// ──────────────────────────────────────────────────────────────────────────

const FALLBACK_STALL_IMAGE = require('@/assets/stall.jpg');
const FALLBACK_DISH_IMAGE  = require('@/assets/food.jpg');
const HERO_HEIGHT = 300;
const PAGE_SIZE   = 5;

type Tab = 'menu' | 'reviews' | 'info';

const VENUE_LABELS: Record<string, string> = {
  hawker: 'Hawker',
  cafe: 'Café',
  buffet: 'Buffet',
  restaurant: 'Restaurant',
  'food-court': 'Food Court',
};

// ── Sub-components ─────────────────────────────────────────────────────────

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

function DishRow({ dish }: { dish: Dish }) {
  const source = dish.photoUri ? { uri: dish.photoUri } : FALLBACK_DISH_IMAGE;
  return (
    <Pressable
      onPress={() => router.push(`/dish/${dish.id}`)}
      style={({ pressed }) => [s.dishCard, { backgroundColor: C_CARD }, pressed && { opacity: 0.75 }]}
    >
      <Image source={source} style={s.dishThumb} contentFit="cover" />
      <View style={s.dishInfo}>
        <ThemedText style={[s.dishName, { color: C_TEXT }]} numberOfLines={1}>{dish.name}</ThemedText>
        {dish.description ? (
          <ThemedText style={[s.dishDesc, { color: C_ICON }]} numberOfLines={2}>{dish.description}</ThemedText>
        ) : null}
        <View style={s.dishMeta}>
          <Ionicons name="star" size={11} color="#F5A623" />
          <ThemedText style={[s.dishMetaText, { color: C_ICON }]}>{dish.rating.toFixed(1)}</ThemedText>
          <View style={[s.pricePill, { backgroundColor: C_TINT_18 }]}>
            <ThemedText style={[s.priceText, { color: C_TINT }]}>{dish.price}</ThemedText>
          </View>
        </View>
        {dish.tags && dish.tags.length > 0 && (
          <View style={s.tagRow}>
            {dish.tags.slice(0, 3).map((tag) => (
              <View key={tag} style={[s.tag, { backgroundColor: C_ICON_28 }]}>
                <ThemedText style={[s.tagText, { color: C_ICON }]}>{tag}</ThemedText>
              </View>
            ))}
          </View>
        )}
      </View>
      <Ionicons name="chevron-forward" size={16} color={C_ICON as unknown as string} style={{ alignSelf: 'center' }} />
    </Pressable>
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
          <ThemedText style={[s.reviewComment, { color: C_TEXT }]} numberOfLines={2}>
            "{review.comment}"
          </ThemedText>
        ) : null}
      </View>
    </View>
  );
}

function InfoPanel({ stall }: { stall: Stall }) {
  const hawkerCenter = getHawkerCenterById(stall.hawkerCenterId);
  const hours =
    stall.openingTime && stall.closingTime
      ? `${stall.openingTime} – ${stall.closingTime}`
      : stall.openingTime ?? stall.closingTime ?? null;

  return (
    <View style={s.infoPanelWrap}>
      {/* Vibe summary */}
      {stall.vibeSummary ? (
        <View style={[s.infoSection, { backgroundColor: C_CARD }]}>
          <ThemedText style={[s.infoSectionTitle, { color: C_TINT }]}>✦ Vibe</ThemedText>
          <ThemedText style={[s.infoText, { color: C_TEXT }]}>{stall.vibeSummary}</ThemedText>
        </View>
      ) : null}

      {/* Location & Hours */}
      <View style={[s.infoSection, { backgroundColor: C_CARD }]}>
        <ThemedText style={[s.infoSectionTitle, { color: C_TINT }]}>Location & Hours</ThemedText>
        {hawkerCenter && (
          <View style={s.infoRow}>
            <Ionicons name="location-outline" size={15} color={C_ICON as unknown as string} />
            <ThemedText style={[s.infoText, { color: C_TEXT }]}>{hawkerCenter.name}</ThemedText>
          </View>
        )}
        {stall.address ? (
          <View style={s.infoRow}>
            <Ionicons name="map-outline" size={15} color={C_ICON as unknown as string} />
            <ThemedText style={[s.infoText, { color: C_ICON }]}>{stall.address}</ThemedText>
          </View>
        ) : null}
        {hours ? (
          <View style={s.infoRow}>
            <Ionicons name="time-outline" size={15} color={C_ICON as unknown as string} />
            <ThemedText style={[s.infoText, { color: C_TEXT }]}>{hours}</ThemedText>
          </View>
        ) : null}
        {stall.driveTimeMinutes != null && (
          <View style={s.infoRow}>
            <Ionicons name="car-outline" size={15} color={C_ICON as unknown as string} />
            <ThemedText style={[s.infoText, { color: C_TEXT }]}>{stall.driveTimeMinutes} min drive</ThemedText>
          </View>
        )}
      </View>

      {/* Awards */}
      {stall.awards && stall.awards.length > 0 && (
        <View style={[s.infoSection, { backgroundColor: C_CARD }]}>
          <ThemedText style={[s.infoSectionTitle, { color: C_TINT }]}>Awards</ThemedText>
          {stall.awards.map((award, i) => (
            <View key={i} style={s.awardRow}>
              <View style={[s.awardIconWrap, { backgroundColor: '#F5A62318' }]}>
                <ThemedText style={s.awardEmoji}>{award.icon ?? '🏅'}</ThemedText>
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText style={[s.awardName, { color: C_TEXT }]}>{award.name}</ThemedText>
                {award.year ? (
                  <ThemedText style={[s.awardYear, { color: C_ICON }]}>{award.year}</ThemedText>
                ) : null}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Quick actions */}
      <View style={s.actionsRow}>
        {([
          { icon: 'navigate-outline', label: 'Directions' },
          { icon: 'globe-outline', label: 'Website' },
          { icon: 'call-outline', label: 'Call' },
        ] as const).map(({ icon, label }) => (
          <Pressable
            key={label}
            style={({ pressed }) => [s.actionBtn, { backgroundColor: C_CARD }, pressed && { opacity: 0.7 }]}
          >
            <Ionicons name={icon} size={20} color={C_TEXT as unknown as string} />
            <ThemedText style={[s.actionLabel, { color: C_TEXT }]}>{label}</ThemedText>
          </Pressable>
        ))}
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

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<any>);

export default function StallDetailScreen() {
  const { id }  = useLocalSearchParams<{ id: string }>();
  const insets  = useSafeAreaInsets();

  const [activeTab, setActiveTab]       = useState<Tab>('menu');
  const [page, setPage]                 = useState(1);
  const [loadingMore, setLoadingMore]   = useState(false);
  const listRef = useRef<FlatList>(null);

  const scrollOffset = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => { scrollOffset.value = e.contentOffset.y; },
  });

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

  const stall        = useMemo(() => getStallById(id), [id]);
  const menuDishes   = useMemo(() => (stall ? getDishesForStall(stall.id) : []), [stall]);
  const stallReviews = useMemo(() => getReviewsForStall(id), [id]);

  const visibleReviews = useMemo(
    () => stallReviews.slice(0, page * PAGE_SIZE),
    [stallReviews, page]
  );
  const hasMoreReviews = visibleReviews.length < stallReviews.length;

  const listData: any[] = useMemo(() => {
    if (activeTab === 'menu')    return menuDishes;
    if (activeTab === 'reviews') return visibleReviews;
    return stall ? [stall] : [];
  }, [activeTab, menuDishes, visibleReviews, stall]);

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab);
    setPage(1);
  }, []);

  const handleEndReached = useCallback(() => {
    if (activeTab !== 'reviews' || !hasMoreReviews || loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setPage((p) => p + 1);
      setLoadingMore(false);
    }, 600);
  }, [activeTab, hasMoreReviews, loadingMore]);

  const renderItem = useCallback(({ item }: { item: any }) => {
    if (activeTab === 'menu')    return <DishRow dish={item as Dish} />;
    if (activeTab === 'reviews') return <ReviewCard review={item as Review} />;
    return <InfoPanel stall={item as Stall} />;
  }, [activeTab]);

  const keyExtractor = useCallback((item: any, idx: number) => {
    if (activeTab === 'menu')    return (item as Dish).id;
    if (activeTab === 'reviews') return (item as Review).id;
    return `info-${idx}`;
  }, [activeTab]);

  if (!stall) {
    return (
      <View style={[s.errorContainer, { backgroundColor: C_BG, paddingTop: insets.top }]}>
        <ThemedText type="title">Stall not found</ThemedText>
      </View>
    );
  }

  const stallSource  = stall.photoUris.length > 0 ? { uri: stall.photoUris[0] } : FALLBACK_STALL_IMAGE;
  const venueLabel   = VENUE_LABELS[stall.venueType] ?? stall.venueType;
  const hawkerCenter = getHawkerCenterById(stall.hawkerCenterId);

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'menu',    label: 'Menu',    count: menuDishes.length },
    { key: 'reviews', label: 'Reviews', count: stallReviews.length },
    { key: 'info',    label: 'Info',    count: 0 },
  ];

  const ListHeader = (
    <View>
      {/* Hero */}
      <Animated.View style={[s.hero, heroAnimatedStyle]}>
        <Image source={stallSource} style={StyleSheet.absoluteFill} contentFit="cover" />
        <View style={s.heroGradient} />
      </Animated.View>

      {/* Info block */}
      <View style={[s.infoBlock, { backgroundColor: C_BG }]}>
        <View style={s.nameRow}>
          <ThemedText type="title" style={[s.stallName, { flex: 1 }]}>{stall.name}</ThemedText>
          <View style={[s.venueBadge, { backgroundColor: C_TINT_18 }]}>
            <ThemedText style={[s.venueText, { color: C_TINT }]}>{venueLabel}</ThemedText>
          </View>
        </View>

        <View style={s.metaRow}>
          <Ionicons name="star" size={14} color="#F5A623" />
          <ThemedText style={[s.ratingValue, { color: C_TEXT }]}>{stall.rating.toFixed(1)}</ThemedText>
          <ThemedText style={[s.ratingCount, { color: C_ICON }]}>({stall.reviewCount} reviews)</ThemedText>
          <View style={[s.pricePill, { backgroundColor: C_ICON_28 }]}>
            <ThemedText style={[s.priceText, { color: C_ICON }]}>{stall.priceRange}</ThemedText>
          </View>
        </View>

        <ThemedText style={[s.vibeDesc, { color: C_ICON }]}>{stall.vibeDescription}</ThemedText>

        {hawkerCenter && (
          <View style={s.locationRow}>
            <Ionicons name="location-outline" size={13} color={C_ICON as unknown as string} />
            <ThemedText style={[s.locationText, { color: C_ICON }]}>{hawkerCenter.name}</ThemedText>
            {stall.driveTimeMinutes != null && (
              <ThemedText style={[s.locationText, { color: C_ICON }]}>· {stall.driveTimeMinutes} min</ThemedText>
            )}
          </View>
        )}

        {/* Open/close status */}
        <View style={s.statusRow}>
          <View style={[s.statusDot, { backgroundColor: stall.openStatus === 'open' ? '#4CAF50' : '#F44336' }]} />
          <ThemedText style={[s.statusText, { color: stall.openStatus === 'open' ? '#4CAF50' : '#F44336' }]}>
            {stall.openStatus === 'open' ? 'Open now' : 'Closed'}
          </ThemedText>
          {stall.closingTime ? (
            <ThemedText style={[s.locationText, { color: C_ICON }]}>· closes {stall.closingTime}</ThemedText>
          ) : null}
        </View>
      </View>

      {/* Tab bar */}
      <View style={[s.tabBar, { backgroundColor: C_BG, borderBottomColor: C_ICON_28 }]}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <Pressable key={tab.key} style={s.tabItem} onPress={() => handleTabChange(tab.key)}>
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

      <View style={{ height: 20, backgroundColor: C_BG }} />
    </View>
  );

  const ListEmpty = activeTab !== 'info' ? (
    <View>
      {activeTab === 'menu' && (
        <EmptyTab icon="fast-food-outline" text="No dishes listed yet" />
      )}
      {activeTab === 'reviews' && (
        <EmptyTab
          icon="chatbubble-outline"
          text="No reviews yet"
          subtext="Be the first to leave a review"
        />
      )}
    </View>
  ) : null;

  const ListFooter = loadingMore ? (
    <View style={s.loadingFooter}>
      <ActivityIndicator color={C_TINT as unknown as string} />
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

      <AnimatedFlatList
        ref={listRef}
        key={activeTab}
        data={listData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        ListFooterComponent={ListFooter}
        style={[s.list, { backgroundColor: C_BG }]}
        contentContainerStyle={[s.listContent, { backgroundColor: C_BG }]}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        contentInsetAdjustmentBehavior="automatic"
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  errorContainer: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  list: { flex: 1 },
  listContent: { paddingBottom: 40, flexGrow: 1 },

  // ── Hero ──
  hero: { height: HERO_HEIGHT },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    experimental_backgroundImage: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.6) 100%)',
  } as any,
  circleBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroBtnGroup: { position: 'absolute', flexDirection: 'row', gap: 8 },

  // ── Info block ──
  infoBlock: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 20, gap: 10 },
  nameRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  stallName: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  venueBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginTop: 4 },
  venueText: { fontSize: 12, fontWeight: '600' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ratingValue: { fontSize: 15, fontWeight: '700' },
  ratingCount: { fontSize: 13, flex: 1 },
  pricePill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  priceText: { fontSize: 13, fontWeight: '700' },
  vibeDesc: { fontSize: 14, lineHeight: 21, fontStyle: 'italic' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { fontSize: 13 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 13, fontWeight: '600' },

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

  // ── Dish rows (menu tab) ──
  dishCard: {
    borderRadius: 16, overflow: 'hidden',
    flexDirection: 'row', alignItems: 'stretch',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  } as any,
  dishThumb: { width: 90, height: 90 },
  dishInfo: { flex: 1, padding: 12, gap: 4, justifyContent: 'center' },
  dishName: { fontSize: 15, fontWeight: '700' },
  dishDesc: { fontSize: 12, lineHeight: 17 },
  dishMeta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dishMetaText: { fontSize: 12, flex: 1 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  tag: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10 },
  tagText: { fontSize: 11, fontWeight: '500' },

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

  // ── Info panel ──
  infoPanelWrap: { gap: 12 },
  infoSection: {
    borderRadius: 16, padding: 16, gap: 12,
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  } as any,
  infoSectionTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  infoText: { fontSize: 14, lineHeight: 20, flex: 1 },
  awardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  awardIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  awardEmoji: { fontSize: 18 },
  awardName: { fontSize: 14, fontWeight: '600' },
  awardYear: { fontSize: 12, marginTop: 1 },
  actionsRow: { flexDirection: 'row', gap: 10 },
  actionBtn: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 12, borderRadius: 14,
  },
  actionLabel: { fontSize: 12, fontWeight: '500' },

  // ── Misc ──
  loadingFooter: { paddingVertical: 20, alignItems: 'center' },
  emptyCard: { borderRadius: 16, padding: 24, alignItems: 'center', gap: 8 },
  emptyText: { fontSize: 15, fontWeight: '600', marginTop: 4 },
  emptySubText: { fontSize: 13, textAlign: 'center', lineHeight: 18 },
});
