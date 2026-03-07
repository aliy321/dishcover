import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { DishCard } from '@/components/dish-card';
import { StallCard } from '@/components/stall-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { dishes, hawkerCenters, stalls } from '@/lib/mock-data';


export default function HomeScreen() {
  const iconColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const trendingDishes = useMemo(() => [...dishes].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5), []);
  const dailySuggestion = useMemo(() => dishes[Math.floor(dishes.length * 0.3)] ?? dishes[0], []);
  const nearbyStalls = useMemo(() => {
    const hcById = new Map(hawkerCenters.map((hc) => [hc.id, hc]));
    return stalls.slice(0, 4).map((s) => ({
      stall: s,
      hawkerCenterName: hcById.get(s.hawkerCenterId)?.name,
    }));
  }, []);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={{ backgroundColor }}
    >
      <ThemedView style={styles.contentWrap}>

        <View style={styles.sectionContainer}>
          <ThemedText type="title" style={styles.title}>
            What should you eat?
          </ThemedText>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="flame" size={22} color={iconColor} />
            <ThemedText type="subtitle" style={styles.sectionTitle}>Trending nearby</ThemedText>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalContent}
          >
            {trendingDishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} distance={`${200 + Math.floor(Math.random() * 300)}m`} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="restaurant" size={22} color={iconColor} />
            <ThemedText type="subtitle" style={styles.sectionTitle}>What should you eat today</ThemedText>
          </View>
          <ThemedView style={styles.suggestionCard}>
            <DishCard dish={dailySuggestion} distance="400m" />
          </ThemedView>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location" size={22} color={iconColor} />
            <ThemedText type="subtitle" style={styles.sectionTitle}>Nearby hawkers</ThemedText>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
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
        </View>
        
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location" size={22} color={iconColor} />
            <ThemedText type="subtitle" style={styles.sectionTitle}>Nearby hawkers</ThemedText>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
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
        </View>
        
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location" size={22} color={iconColor} />
            <ThemedText type="subtitle" style={styles.sectionTitle}>Nearby hawkers</ThemedText>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
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
        </View>

      </ThemedView >
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  contentWrap: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
  },
  title: { marginBottom: 8 },
  sectionContainer: { flexDirection: 'column', gap: 6 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 6 },
  sectionTitle: { marginBottom: 0 },
  horizontalContent: { flexDirection: 'row', columnGap: 16 },
  suggestionCard: { marginBottom: 8 },
});
