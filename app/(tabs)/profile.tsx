import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { badges, reviews, visits, users, CURRENT_USER_ID } from '@/lib/mock-data';
import type { Badge } from '@/types';

function getBadgeProgress(badge: Badge): number {
  switch (badge.category) {
    case 'review':
      return reviews.filter((r) => r.userId === CURRENT_USER_ID).length;
    case 'explorer':
      return new Set(visits.filter((v) => v.userId === CURRENT_USER_ID).map((v) => v.stallId))
        .size;
    case 'roulette':
      return 0;
    case 'dish':
      return visits.filter((v) => v.userId === CURRENT_USER_ID).length;
    default:
      return 0;
  }
}

export default function ProfileScreen() {
  const tint = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');

  const user = users.find((u) => u.id === CURRENT_USER_ID)!;

  const badgesWithProgress = useMemo(
    () => badges.map((b) => ({ ...b, progress: Math.min(getBadgeProgress(b), b.requiredCount) })),
    [],
  );

  const unlockedCount = badgesWithProgress.filter((b) => b.progress >= b.requiredCount).length;
  const reviewCount = reviews.filter((r) => r.userId === CURRENT_USER_ID).length;
  const visitCount = visits.filter((v) => v.userId === CURRENT_USER_ID).length;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Avatar + name */}
          <View style={styles.userSection}>
            <View style={[styles.avatar, { backgroundColor: tint }]}>
              <ThemedText style={styles.avatarText}>
                {user.displayName.charAt(0).toUpperCase()}
              </ThemedText>
            </View>
            <ThemedText type="title">{user.displayName}</ThemedText>
            <ThemedText type="default" style={[styles.subtitle, { color: iconColor }]}>
              Hawker enthusiast
            </ThemedText>
            <View style={styles.statsRow}>
              <StatItem label="Reviews" value={String(reviewCount)} />
              <View style={styles.divider} />
              <StatItem label="Visits" value={String(visitCount)} />
              <View style={styles.divider} />
              <StatItem label="Badges" value={String(unlockedCount)} />
            </View>
          </View>

          {/* Badges */}
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Achievements
          </ThemedText>

          <View style={styles.list}>
            {badgesWithProgress.map((badge) => {
              const unlocked = badge.progress >= badge.requiredCount;
              const pct = badge.progress / badge.requiredCount;
              return (
                <View key={badge.id} style={[styles.card, { opacity: unlocked ? 1 : 0.65 }]}>
                  <ThemedText style={styles.icon}>{badge.icon}</ThemedText>
                  <View style={styles.info}>
                    <View style={styles.row}>
                      <ThemedText type="defaultSemiBold">{badge.name}</ThemedText>
                      <ThemedText style={[styles.count, { color: iconColor }]}>
                        {badge.progress}/{badge.requiredCount}
                      </ThemedText>
                    </View>
                    <View style={styles.track}>
                      <View
                        style={[
                          styles.fill,
                          {
                            width: `${pct * 100}%` as `${number}%`,
                            backgroundColor: unlocked ? '#FFD700' : tint,
                          },
                        ]}
                      />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <ThemedText type="defaultSemiBold" style={styles.statValue}>{value}</ThemedText>
      <ThemedText type="default" style={styles.statLabel}>{label}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scroll: { padding: 16, gap: 12 },
  userSection: { alignItems: 'center', gap: 4, marginBottom: 8 },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  avatarText: { fontSize: 28, color: '#fff', fontWeight: '700' },
  subtitle: { fontSize: 14 },
  statsRow: { flexDirection: 'row', marginTop: 12, gap: 20, alignItems: 'center' },
  stat: { alignItems: 'center', gap: 2 },
  statValue: { fontSize: 18 },
  statLabel: { fontSize: 12, opacity: 0.5 },
  divider: { width: 1, height: 24, backgroundColor: '#ccc', opacity: 0.4 },
  sectionTitle: { fontSize: 16, marginTop: 4, marginBottom: 4 },
  list: { gap: 10 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 12, borderRadius: 14,
    borderWidth: 1, borderColor: 'rgba(128,128,128,0.15)',
  },
  icon: { fontSize: 28 },
  info: { flex: 1, gap: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  count: { fontSize: 12 },
  track: {
    height: 4, borderRadius: 2,
    backgroundColor: 'rgba(128,128,128,0.2)', overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 2 },
});
