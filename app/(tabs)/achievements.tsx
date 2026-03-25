import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { badges, reviews, visits, CURRENT_USER_ID } from '@/lib/mock-data';
import type { Badge } from '@/types';

function getBadgeProgress(badge: Badge): number {
  switch (badge.category) {
    case 'review':
      return reviews.filter((r) => r.userId === CURRENT_USER_ID).length;
    case 'explorer':
      return new Set(visits.filter((v) => v.userId === CURRENT_USER_ID).map((v) => v.stallId)).size;
    case 'roulette':
      return 0;
    case 'dish':
      return visits.filter((v) => v.userId === CURRENT_USER_ID).length;
    default:
      return 0;
  }
}

export default function AchievementsScreen() {
  const badgesWithProgress = useMemo(
    () => badges.map((b) => ({ ...b, progress: Math.min(getBadgeProgress(b), b.requiredCount) })),
    [],
  );

  const unlockedCount = badgesWithProgress.filter((b) => b.progress >= b.requiredCount).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ThemedText style={styles.header}>
        {unlockedCount} of {badges.length} badges unlocked
      </ThemedText>

      {badgesWithProgress.map((badge) => {
        const unlocked = badge.progress >= badge.requiredCount;
        const pct = badge.requiredCount > 0 ? badge.progress / badge.requiredCount : 0;

        return (
          <View key={badge.id} style={[styles.row, !unlocked && styles.dimmed]}>
            <ThemedText style={styles.icon}>{badge.icon}</ThemedText>
            <View style={styles.info}>
              <View style={styles.nameRow}>
                <ThemedText style={styles.name}>{badge.name}</ThemedText>
                <ThemedText style={styles.count}>
                  {badge.progress}/{badge.requiredCount}
                </ThemedText>
              </View>
              <ThemedText style={styles.description}>{badge.description}</ThemedText>
              <View style={styles.track}>
                <View
                  style={[
                    styles.fill,
                    {
                      width: `${Math.round(pct * 100)}%` as any,
                      backgroundColor: unlocked ? '#FFD700' : '#007AFF',
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 12 },
  header: { fontSize: 13, opacity: 0.5, marginBottom: 4 },
  row: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(128,128,128,0.08)',
  },
  dimmed: { opacity: 0.5 },
  icon: { fontSize: 28 },
  info: { flex: 1, gap: 4 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between' },
  name: { fontWeight: '600', fontSize: 15 },
  count: { fontSize: 13, opacity: 0.5 },
  description: { fontSize: 12, opacity: 0.6 },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(128,128,128,0.2)',
    overflow: 'hidden',
    marginTop: 2,
  },
  fill: { height: 4, borderRadius: 2 },
});
