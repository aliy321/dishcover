import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  interpolate,
  scrollTo,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  useSharedValue,
  runOnUI,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import {
  getDishesForStall,
  getHawkerCenterById,
  getReviewsForStall,
  getUserById,
  stalls,
} from '@/lib/mock-data';
import type { Dish, Review, Stall } from '@/types';

const FALLBACK_IMAGE = require('@/assets/food.jpg');
const HERO_HEIGHT = 260;
const TAB_BAR_HEIGHT = 46;

type Tab = 'menu' | 'vibe' | 'reviews';
const ROUTES: { key: Tab; title: string }[] = [
  { key: 'menu', title: 'Menu' },
  { key: 'vibe', title: 'Vibe' },
  { key: 'reviews', title: 'Reviews' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function StarRow({ rating, color }: { rating: number; color: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= Math.round(rating) ? 'star' : 'star-outline'}
          size={12}
          color={color}
        />
      ))}
    </View>
  );
}

// ─── Tab content ─────────────────────────────────────────────────────────────

function MenuContent({
  dishes, cardColor, iconColor, accentColor,
}: { dishes: Dish[]; cardColor: string; iconColor: string; accentColor: string }) {
  if (dishes.length === 0) {
    return (
      <View style={t.empty}>
        <Ionicons name="restaurant-outline" size={40} color={iconColor} />
        <ThemedText type="default" style={{ color: iconColor }}>No dishes listed yet</ThemedText>
      </View>
    );
  }
  return (
    <View style={t.list}>
      {dishes.map((dish) => (
        <View key={dish.id} style={[t.dishRow, { backgroundColor: cardColor }]}>
          <View style={t.thumb}>
            <Image source={FALLBACK_IMAGE} style={t.thumbImg} resizeMode="cover" />
          </View>
          <View style={t.dishBody}>
            <ThemedText type="defaultSemiBold" numberOfLines={1}>{dish.name}</ThemedText>
            {dish.description ? (
              <ThemedText type="default" numberOfLines={2} style={[t.desc, { color: iconColor }]}>
                {dish.description}
              </ThemedText>
            ) : null}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <StarRow rating={dish.rating} color="#F5A623" />
              <ThemedText type="default" style={{ fontSize: 11, color: iconColor }}>
                {dish.reviewCount} reviews
              </ThemedText>
            </View>
          </View>
          <ThemedText type="defaultSemiBold" style={{ fontSize: 15, color: accentColor }}>
            {dish.price}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

function VibeContent({ stall, cardColor, iconColor }: { stall: Stall; cardColor: string; iconColor: string }) {
  return (
    <View style={t.section}>
      <ThemedText type="subtitle">What's the vibe?</ThemedText>
      <ThemedText type="default" style={{ color: iconColor, lineHeight: 22 }}>
        {stall.vibeDescription}
      </ThemedText>
      <View style={t.photoGrid}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[t.photoSlot, { backgroundColor: cardColor }]}>
            <Image source={FALLBACK_IMAGE} style={t.photoImg} resizeMode="cover" />
          </View>
        ))}
      </View>
      {stall.vibeSummary ? (
        <>
          <ThemedText type="subtitle" style={{ marginTop: 8 }}>What people are saying</ThemedText>
          <ThemedText type="default" style={{ color: iconColor, lineHeight: 22 }}>{stall.vibeSummary}</ThemedText>
        </>
      ) : null}
    </View>
  );
}

function ReviewsContent({ reviews, cardColor, iconColor }: { reviews: Review[]; cardColor: string; iconColor: string }) {
  if (reviews.length === 0) {
    return (
      <View style={t.empty}>
        <Ionicons name="chatbubble-outline" size={40} color={iconColor} />
        <ThemedText type="default" style={{ color: iconColor }}>No reviews yet — be the first!</ThemedText>
      </View>
    );
  }
  return (
    <View style={t.list}>
      {reviews.map((review) => {
        const user = getUserById(review.userId);
        const date = new Date(review.createdAt).toLocaleDateString('en-SG', {
          day: 'numeric', month: 'short', year: 'numeric',
        });
        return (
          <View key={review.id} style={[t.reviewCard, { backgroundColor: cardColor }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={[t.avatar, { backgroundColor: iconColor + '33' }]}>
                <ThemedText type="defaultSemiBold" style={{ fontSize: 15 }}>
                  {(user?.displayName ?? '?')[0].toUpperCase()}
                </ThemedText>
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText type="defaultSemiBold">{user?.displayName ?? 'Anonymous'}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 12, color: iconColor }}>{date}</ThemedText>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              {[
                { label: 'Taste', value: review.tasteRating },
                { label: 'Value', value: review.valueRating },
                { label: 'Queue', value: review.queueRating },
              ].map(({ label, value }) => (
                <View key={label} style={{ gap: 3 }}>
                  <ThemedText type="default" style={{ fontSize: 11, color: iconColor }}>{label}</ThemedText>
                  <StarRow rating={value} color="#F5A623" />
                </View>
              ))}
            </View>
            {review.comment ? (
              <ThemedText type="default" style={{ lineHeight: 20 }}>{review.comment}</ThemedText>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function StallDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  // Shared value so useAnimatedStyle worklet can read it
  const headerHeight = useSharedValue(0);
  const [activeTab, setActiveTab] = useState<Tab>('menu');

  const bgColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const cardColor = useThemeColor({}, 'card');
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');

  const stall = useMemo(() => stalls.find((s) => s.id === id), [id]);
  const hawkerCenter = useMemo(() => (stall ? getHawkerCenterById(stall.hawkerCenterId) : null), [stall]);
  const menuDishes = useMemo(() => (stall ? getDishesForStall(stall.id) : []), [stall]);
  const stallReviews = useMemo(() => (stall ? getReviewsForStall(stall.id) : []), [stall]);

  // Parallax: image translates & scales with scroll
  const heroAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollOffset.value,
          [-HERO_HEIGHT, 0, HERO_HEIGHT],
          [-HERO_HEIGHT / 2, 0, HERO_HEIGHT * 0.75]
        ),
      },
      {
        scale: interpolate(scrollOffset.value, [-HERO_HEIGHT, 0, HERO_HEIGHT], [2, 1, 1]),
      },
    ],
  }));

  // Floating tab bar: starts at headerHeight, sticks at top once scroll reaches it
  const floatingTabStyle = useAnimatedStyle(() => {
    const translateY = Math.max(0, headerHeight.value - scrollOffset.value);
    return { transform: [{ translateY }] };
  });

  if (!stall) {
    return (
      <View style={[s.errorContainer, { backgroundColor: bgColor, paddingTop: insets.top }]}>
        <ThemedText type="title">Stall not found</ThemedText>
      </View>
    );
  }

  const handleTabPress = (tab: Tab) => {
    setActiveTab(tab);
    runOnUI(() => {
      'worklet';
      scrollTo(scrollRef, 0, headerHeight.value, true);
    })();
  };

  const TabBarContent = () => (
    <View style={s.tabRow}>
      {ROUTES.map((route) => {
        const isActive = activeTab === route.key;
        return (
          <Pressable
            key={route.key}
            style={s.tabItem}
            onPress={() => handleTabPress(route.key)}
          >
            <ThemedText
              type={isActive ? 'defaultSemiBold' : 'default'}
              style={{ color: isActive ? tintColor : iconColor, fontSize: 14 }}
            >
              {route.title}
            </ThemedText>
            {isActive && <View style={[s.tabIndicator, { backgroundColor: tintColor }]} />}
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <View style={[s.root, { backgroundColor: bgColor }]}>
      {/* ── Overlay buttons — outside ScrollView so they don't move ─── */}
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

      {/* ── Scrollable content ───────────────────────────────────────── */}
      <Animated.ScrollView
        ref={scrollRef}
        style={{ flex: 1, backgroundColor: bgColor }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        {/* Hero + Info — measure height for the floating tab bar */}
        <View onLayout={(e) => { headerHeight.value = e.nativeEvent.layout.height; }}>
          {/* Hero — overflow:hidden + transforms on the SAME Animated.View (like ParallaxScrollView) */}
          <Animated.View style={[s.hero, heroAnimatedStyle]}>
            <Image source={FALLBACK_IMAGE} style={s.heroImage} resizeMode="cover" />
            <View style={s.heroGradient} />
          </Animated.View>

          {/* Info block */}
          <View style={[s.infoBlock, { backgroundColor: bgColor }]}>
            <ThemedText type="title">{stall.name}</ThemedText>

            <View style={s.metaRow}>
              {hawkerCenter && (
                <ThemedText type="default" style={[s.smallText, { color: iconColor }]}>
                  {hawkerCenter.name}
                </ThemedText>
              )}
              {stall.driveTimeMinutes != null && (
                <ThemedText type="default" style={[s.smallText, { color: iconColor }]}>
                  {' · '}
                  <Ionicons name="car-outline" size={12} color={iconColor} />
                  {` ${stall.driveTimeMinutes} min`}
                </ThemedText>
              )}
              <ThemedText type="default" style={[s.smallText, { color: iconColor }]}>
                {' · '}{stall.priceRange}
              </ThemedText>
            </View>

            <View style={s.openRow}>
              <View style={[s.openDot, { backgroundColor: stall.openStatus === 'open' ? '#4CAF50' : '#F44336' }]} />
              <ThemedText
                type="defaultSemiBold"
                style={{ color: stall.openStatus === 'open' ? '#4CAF50' : '#F44336', fontSize: 13 }}
              >
                {stall.openStatus === 'open' ? 'Open' : 'Closed'}
              </ThemedText>
              {stall.closingTime ? (
                <ThemedText type="default" style={[s.smallText, { color: iconColor }]}>
                  {' · '}Closes at {stall.closingTime}
                </ThemedText>
              ) : null}
            </View>

            <View style={s.ratingRow}>
              <View style={[s.ratingPill, { backgroundColor: cardColor }]}>
                <Ionicons name="star" size={13} color="#F5A623" />
                <ThemedText type="defaultSemiBold" style={{ fontSize: 13 }}>
                  {stall.rating.toFixed(1)}
                </ThemedText>
                <ThemedText type="default" style={{ fontSize: 12, color: iconColor }}>
                  ({stall.reviewCount})
                </ThemedText>
              </View>
            </View>

            <ThemedText type="default" style={[s.vibeTeaser, { color: iconColor }]}>
              {stall.vibeDescription}
            </ThemedText>

            <View style={s.actionsRow}>
              {([
                { icon: 'navigate-outline', label: 'Directions' },
                { icon: 'globe-outline', label: 'Website' },
                { icon: 'time-outline', label: 'Hours' },
              ] as const).map(({ icon, label }) => (
                <Pressable
                  key={label}
                  style={({ pressed }) => [s.actionBtn, { backgroundColor: cardColor }, pressed && { opacity: 0.7 }]}
                >
                  <Ionicons name={icon} size={22} color={textColor} />
                  <ThemedText type="default" style={{ fontSize: 12 }}>{label}</ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* Spacer so tab content doesn't hide under the floating tab bar */}
        <View style={{ height: TAB_BAR_HEIGHT }} />

        {/* Tab content — inline, outer scroll handles everything */}
        <View style={{ backgroundColor: bgColor }}>
          {activeTab === 'menu' && (
            <MenuContent dishes={menuDishes} cardColor={cardColor} iconColor={iconColor} accentColor={tintColor} />
          )}
          {activeTab === 'vibe' && (
            <VibeContent stall={stall} cardColor={cardColor} iconColor={iconColor} />
          )}
          {activeTab === 'reviews' && (
            <ReviewsContent reviews={stallReviews} cardColor={cardColor} iconColor={iconColor} />
          )}
        </View>
      </Animated.ScrollView>

      {/* ── Floating tab bar (outside ScrollView — no flex collapse issues) ── */}
      {/* Starts below the header, slides to top as you scroll */}
      <Animated.View
        style={[s.floatingTab, { backgroundColor: bgColor }, floatingTabStyle]}
        pointerEvents="box-none"
      >
        <TabBarContent />
      </Animated.View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1 },
  errorContainer: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },

  // overflow + transform on same element — matches ParallaxScrollView exactly
  hero: { height: HERO_HEIGHT, overflow: 'hidden' },
  heroImage: { width: '100%', height: '100%' },
  heroGradient: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.22)' },
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBtnGroup: { position: 'absolute', flexDirection: 'row', gap: 8 },

  infoBlock: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 12, gap: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  smallText: { fontSize: 13 },
  openRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  openDot: { width: 7, height: 7, borderRadius: 4 },
  ratingRow: { flexDirection: 'row' },
  ratingPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  vibeTeaser: { fontSize: 14, fontStyle: 'italic', lineHeight: 20 },
  actionsRow: { flexDirection: 'row', gap: 10 },
  actionBtn: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 12, borderRadius: 14,
  },

  // Floating tab bar — lives outside the ScrollView so flex always works
  floatingTab: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: TAB_BAR_HEIGHT,
    zIndex: 10,
  },
  tabRow: {
    flexDirection: 'row',
    flex: 1,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: TAB_BAR_HEIGHT,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 2,
    borderRadius: 1,
  },
});

const t = StyleSheet.create({
  list: { padding: 16, gap: 10 },
  section: { padding: 16, gap: 12 },
  empty: { alignItems: 'center', paddingVertical: 48, gap: 12 },

  dishRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: 14, padding: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 2 },
    }),
  },
  thumb: { width: 68, height: 68, borderRadius: 10, overflow: 'hidden' },
  thumbImg: { width: '100%', height: '100%' },
  dishBody: { flex: 1, gap: 3 },
  desc: { fontSize: 12, lineHeight: 16 },

  reviewCard: {
    borderRadius: 14, padding: 14, gap: 10,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 2 },
    }),
  },
  avatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },

  photoGrid: { flexDirection: 'row', gap: 6, height: 110 },
  photoSlot: { flex: 1, borderRadius: 10, overflow: 'hidden' },
  photoImg: { width: '100%', height: '100%' },
});
