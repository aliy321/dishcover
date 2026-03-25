import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  DynamicColorIOS,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { dishes, getReviewsForStall, getStallsForDish, getUserById, reviews } from '@/lib/mock-data';
import type { Review } from '@/types';

const C_BG = DynamicColorIOS({ dark: Colors.dark.background, light: Colors.light.background });
const C_CARD = DynamicColorIOS({ dark: Colors.dark.card, light: Colors.light.card });
const C_TINT = DynamicColorIOS({ dark: Colors.dark.tint, light: Colors.light.tint });
const C_ICON = DynamicColorIOS({ dark: Colors.dark.icon, light: Colors.light.icon });
const C_TEXT = DynamicColorIOS({ dark: Colors.dark.text, light: Colors.light.text });
const C_ICON_28 = DynamicColorIOS({ dark: Colors.dark.icon + '28', light: Colors.light.icon + '28' });

const PAGE_SIZE = 10;

type ReviewScope = 'dish' | 'stall';

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
          <View style={[s.avatar, { backgroundColor: C_ICON_28 }]}>
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
            numberOfLines={3}
          >
            "{review.comment}"
          </ThemedText>
        ) : null}
      </View>
    </View>
  );
}

export default function DishReviewsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  const dish = useMemo(() => dishes.find((d) => d.id === id), [id]);
  const dishReviews = useMemo(() => reviews.filter((r) => r.dishId === id), [id]);
  const primaryStall = useMemo(() => {
    if (!dish) return undefined;
    const stalls = getStallsForDish(dish.id);
    return stalls[0];
  }, [dish]);
  const stallReviews = useMemo(
    () => (primaryStall ? getReviewsForStall(primaryStall.id) : []),
    [primaryStall]
  );

  const [index, setIndex] = useState(0); // 0 = dish, 1 = stall
  const scope: ReviewScope = index === 0 ? 'dish' : 'stall';
  const pagerRef = useRef<PagerView>(null);
  const [dishPage, setDishPage] = useState(1);
  const [stallPage, setStallPage] = useState(1);

  const visibleDishReviews = useMemo(
    () => dishReviews.slice(0, dishPage * PAGE_SIZE),
    [dishReviews, dishPage]
  );
  const visibleStallReviews = useMemo(
    () => stallReviews.slice(0, stallPage * PAGE_SIZE),
    [stallReviews, stallPage]
  );

  const data = scope === 'dish' ? visibleDishReviews : visibleStallReviews;
  const totalForScope = scope === 'dish' ? dishReviews.length : stallReviews.length;
  const hasMore =
    scope === 'dish'
      ? visibleDishReviews.length < dishReviews.length
      : visibleStallReviews.length < stallReviews.length;

  const handleEndReached = useCallback(() => {
    if (!hasMore) return;
    if (scope === 'dish') {
      setDishPage((p) => p + 1);
    } else {
      setStallPage((p) => p + 1);
    }
  }, [hasMore, scope]);

  const handleScopeChange = useCallback((next: ReviewScope) => {
    const nextIndex = next === 'dish' ? 0 : 1;
    setIndex(nextIndex);
    pagerRef.current?.setPage(nextIndex);
    // reset paging for that scope
    if (next === 'dish') {
      setDishPage(1);
    } else {
      setStallPage(1);
    }
  }, []);

  if (!dish) {
    return (
      <View style={[s.root, { backgroundColor: C_BG }]}>
        <ThemedText type="title">Dish not found</ThemedText>
      </View>
    );
  }

  const averageRating = dish.rating;

  return (
    <View style={[s.root, { backgroundColor: C_BG, paddingTop: insets.top }]}>
      <View style={s.headerRow}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={s.headerBack}>
          <Ionicons name="chevron-back" size={18} color={C_TEXT as unknown as string} />
        </Pressable>
        <View style={s.headerTitleWrap}>
          <ThemedText style={[s.headerTitle, { color: C_TEXT }]} numberOfLines={1}>
            {dish.name}
          </ThemedText>
          <ThemedText style={[s.headerSubtitle, { color: C_ICON }]}>
            {dishReviews.length} dish reviews
          </ThemedText>
        </View>
      </View>

      <View style={s.summaryWrap}>
        <View style={s.summaryRatingRow}>
          <Ionicons name="star" size={18} color="#F5A623" />
          <ThemedText style={[s.summaryRatingValue, { color: C_TEXT }]}>
            {averageRating.toFixed(1)}
          </ThemedText>
          <ThemedText style={[s.summaryRatingCount, { color: C_ICON }]}>
            ({dishReviews.length} reviews)
          </ThemedText>
        </View>

        <View style={[s.scopeTabs, { borderColor: C_ICON_28 }]}>
          {([
            { key: 'dish', label: 'Food reviews' },
            { key: 'stall', label: primaryStall ? 'Stall reviews' : 'Stall reviews (N/A)' },
          ] as const).map(({ key, label }, tabIndex) => {
            const isActive = index === tabIndex;
            return (
              <Pressable
                key={key}
                style={s.scopeTab}
                onPress={() => handleScopeChange(key)}
                disabled={key === 'stall' && !primaryStall}
              >
                <ThemedText
                  style={[
                    s.scopeTabLabel,
                    { color: isActive ? C_TINT : C_TEXT },
                  ]}
                >
                  {label}
                </ThemedText>
                <View
                  style={[
                    s.scopeTabUnderline,
                    { backgroundColor: isActive ? C_TINT : 'transparent' },
                  ]}
                />
              </Pressable>
            );
          })}
        </View>

        <ThemedText style={[s.scopeCount, { color: C_ICON }]}>
          {totalForScope} {scope === 'dish' ? 'food' : 'stall'} review
          {totalForScope === 1 ? '' : 's'}
        </ThemedText>
      </View>

      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={(e) => {
          const nextIndex = e.nativeEvent.position;
          setIndex(nextIndex);
        }}
      >
        {/* Page 0: Food reviews */}
        <View key="dish">
          <FlashList
            data={visibleDishReviews}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ReviewCard review={item} />}
            contentContainerStyle={StyleSheet.flatten([
              s.listContent,
              { backgroundColor: C_BG },
            ])}
            onEndReached={() => {
              if (visibleDishReviews.length < dishReviews.length) {
                setDishPage((p) => p + 1);
              }
            }}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Page 1: Stall reviews */}
        <View key="stall">
          <FlashList
            data={visibleStallReviews}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ReviewCard review={item} />}
            contentContainerStyle={StyleSheet.flatten([
              s.listContent,
              { backgroundColor: C_BG },
            ])}
            onEndReached={() => {
              if (visibleStallReviews.length < stallReviews.length) {
                setStallPage((p) => p + 1);
              }
            }}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </PagerView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingBottom: 24, gap: 8 },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 4,
  },
  headerBack: { paddingRight: 8, paddingVertical: 6 },
  headerTitleWrap: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  headerSubtitle: { fontSize: 13 },

  summaryWrap: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 4,
  },
  summaryRatingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  summaryRatingValue: { fontSize: 18, fontWeight: '700' },
  summaryRatingCount: { fontSize: 13 },

  scopeTabs: {
    flexDirection: 'row',
    marginTop: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  scopeTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  scopeTabLabel: { fontSize: 14, fontWeight: '500' },
  scopeTabUnderline: {
    height: 2,
    borderRadius: 1,
    alignSelf: 'stretch',
    marginHorizontal: 24,
  },
  scopeCount: { marginTop: 8, fontSize: 13 },

  reviewCard: {
    borderRadius: 12,
    gap: 0,
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
});

