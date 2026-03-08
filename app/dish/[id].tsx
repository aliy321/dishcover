import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
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
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { dishes, getHawkerCenterById, getStallsForDish } from '@/lib/mock-data';

const FALLBACK_IMAGE = require('@/assets/food.jpg');
const HERO_HEIGHT = 280;

export default function DishDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const bgColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');

  const dish = useMemo(() => dishes.find((d) => d.id === id), [id]);
  const topStalls = useMemo(() => (dish ? getStallsForDish(dish.id) : []), [dish]);

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

  if (!dish) {
    return (
      <View style={[s.errorContainer, { backgroundColor: bgColor, paddingTop: insets.top }]}>
        <ThemedText type="title">Dish not found</ThemedText>
      </View>
    );
  }

  const source = dish.photoUri ? { uri: dish.photoUri } : FALLBACK_IMAGE;

  return (
    <View style={[s.root, { backgroundColor: bgColor }]}>
      {/* Overlay buttons — outside ScrollView so they never move */}
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

      <Animated.ScrollView
        ref={scrollRef}
        style={{ flex: 1, backgroundColor: bgColor }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        {/* Hero — overflow:hidden + transforms on SAME Animated.View */}
        <Animated.View style={[s.hero, heroAnimatedStyle]}>
          <Image source={source} style={s.heroImage} resizeMode="cover" />
          <View style={s.heroGradient} />
        </Animated.View>

        {/* Info */}
        <View style={[s.infoBlock, { backgroundColor: bgColor }]}>
          <ThemedText type="title">{dish.name}</ThemedText>

          {/* Rating row */}
          <View style={s.ratingRow}>
            <View style={[s.ratingPill, { backgroundColor: cardColor }]}>
              <Ionicons name="star" size={13} color="#F5A623" />
              <ThemedText type="defaultSemiBold" style={{ fontSize: 13 }}>
                {dish.rating.toFixed(1)}
              </ThemedText>
              <ThemedText type="default" style={{ fontSize: 12, color: iconColor }}>
                ({dish.reviewCount} reviews)
              </ThemedText>
            </View>
            <View style={[s.pricePill, { backgroundColor: cardColor }]}>
              <ThemedText type="defaultSemiBold" style={{ fontSize: 13, color: tintColor }}>
                {dish.price}
              </ThemedText>
            </View>
          </View>

          {/* Description */}
          {dish.description ? (
            <ThemedText type="default" style={[s.description, { color: iconColor }]}>
              {dish.description}
            </ThemedText>
          ) : null}
        </View>

        {/* Available at */}
        {topStalls.length > 0 && (
          <View style={s.stallsSection}>
            <ThemedText type="subtitle" style={s.sectionTitle}>
              Available at
            </ThemedText>

            {topStalls.map((stall) => {
              const hawkerCenter = getHawkerCenterById(stall.hawkerCenterId);
              return (
                <Pressable
                  key={stall.id}
                  onPress={() => router.push(`/stall/${stall.id}`)}
                  style={({ pressed }) => [
                    s.stallRow,
                    { backgroundColor: cardColor },
                    pressed && { opacity: 0.75 },
                  ]}
                >
                  <View style={s.stallThumb}>
                    <Image source={FALLBACK_IMAGE} style={s.stallThumbImg} resizeMode="cover" />
                  </View>
                  <View style={{ flex: 1, gap: 3 }}>
                    <ThemedText type="defaultSemiBold" numberOfLines={1}>
                      {stall.name}
                    </ThemedText>
                    {hawkerCenter && (
                      <ThemedText type="default" style={{ fontSize: 12, color: iconColor }}>
                        {hawkerCenter.name}
                      </ThemedText>
                    )}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Ionicons name="star" size={11} color="#F5A623" />
                      <ThemedText type="default" style={{ fontSize: 12 }}>
                        {stall.rating.toFixed(1)}
                      </ThemedText>
                      {stall.driveTimeMinutes != null && (
                        <ThemedText type="default" style={{ fontSize: 12, color: iconColor }}>
                          · {stall.driveTimeMinutes} min
                        </ThemedText>
                      )}
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 4 }}>
                    <View style={[
                      s.openBadge,
                      { backgroundColor: stall.openStatus === 'open' ? '#4CAF5022' : '#F4433622' },
                    ]}>
                      <ThemedText
                        type="default"
                        style={{ fontSize: 11, color: stall.openStatus === 'open' ? '#4CAF50' : '#F44336' }}
                      >
                        {stall.openStatus === 'open' ? 'Open' : 'Closed'}
                      </ThemedText>
                    </View>
                    <ThemedText type="default" style={{ fontSize: 12, color: iconColor }}>
                      {stall.priceRange}
                    </ThemedText>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={iconColor} />
                </Pressable>
              );
            })}
          </View>
        )}
      </Animated.ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  errorContainer: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },

  // overflow + transform on same element — matches ParallaxScrollView exactly
  hero: { height: HERO_HEIGHT, overflow: 'hidden' },
  heroImage: { width: '100%', height: '100%' },
  heroGradient: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)' },
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBtnGroup: { position: 'absolute', flexDirection: 'row', gap: 8 },

  infoBlock: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, gap: 10 },
  ratingRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  ratingPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  pricePill: {
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
    justifyContent: 'center',
  },
  description: { fontSize: 14, lineHeight: 22 },

  stallsSection: { paddingHorizontal: 16, paddingTop: 8, gap: 10 },
  sectionTitle: { marginBottom: 4 },
  stallRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    padding: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 2 },
    }),
  },
  stallThumb: { width: 56, height: 56, borderRadius: 10, overflow: 'hidden' },
  stallThumbImg: { width: '100%', height: '100%' },
  openBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8 },
});
