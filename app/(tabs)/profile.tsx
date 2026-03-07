import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const MOCK_BADGES = [
  { id: '1', name: 'Laksa Hunter', icon: '🍜', progress: 7, total: 10 },
  { id: '2', name: 'Hawker Explorer', icon: '🏪', progress: 3, total: 15 },
  { id: '3', name: 'Roulette Adventurer', icon: '🎲', progress: 5, total: 5, unlocked: true },
  { id: '4', name: 'Review King', icon: '⭐', progress: 12, total: 20 },
];

export default function ProfileScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.userSection}>
            <View style={styles.avatar}>
              <ThemedText style={styles.avatarText}>A</ThemedText>
            </View>
            <ThemedText type="title">Ali</ThemedText>
            <ThemedText type="default" style={styles.subtitle}>
              Hawker enthusiast
            </ThemedText>
            <View style={styles.statsRow}>
              <Stat label="Reviews" value="0" />
              <View style={styles.statDivider} />
              <Stat label="Photos" value="0" />
              <View style={styles.statDivider} />
              <Stat label="Badges" value={String(MOCK_BADGES.filter((b) => b.unlocked).length)} />
            </View>
          </View>

          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Achievements
          </ThemedText>

          {MOCK_BADGES.map((badge) => (
            <BadgeRow key={badge.id} badge={badge} />
          ))}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <ThemedText type="defaultSemiBold" style={styles.statValue}>
        {value}
      </ThemedText>
      <ThemedText type="default" style={styles.statLabel}>
        {label}
      </ThemedText>
    </View>
  );
}

function BadgeRow({
  badge,
}: {
  badge: { id: string; name: string; icon: string; progress: number; total: number; unlocked?: boolean };
}) {
  const pct = Math.min(badge.progress / badge.total, 1);
  return (
    <View style={[styles.badgeRow, badge.unlocked && styles.badgeRowUnlocked]}>
      <ThemedText style={styles.badgeIcon}>{badge.icon}</ThemedText>
      <View style={styles.badgeInfo}>
        <View style={styles.badgeHeader}>
          <ThemedText type="defaultSemiBold">{badge.name}</ThemedText>
          <ThemedText type="default" style={styles.badgeCount}>
            {badge.progress}/{badge.total}
          </ThemedText>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${pct * 100}%` }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scroll: { padding: 16, gap: 12 },
  userSection: { alignItems: 'center', gap: 6, marginBottom: 8 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#0a7ea4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  avatarText: { fontSize: 28, color: '#fff', fontWeight: '700' },
  subtitle: { opacity: 0.5 },
  statsRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 16,
    alignItems: 'center',
  },
  stat: { alignItems: 'center', gap: 2 },
  statValue: { fontSize: 18 },
  statLabel: { fontSize: 12, opacity: 0.5 },
  statDivider: { width: 1, height: 24, backgroundColor: '#ccc', opacity: 0.4 },
  sectionTitle: { fontSize: 16, marginTop: 8 },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.15)',
    opacity: 0.6,
  },
  badgeRowUnlocked: { opacity: 1 },
  badgeIcon: { fontSize: 28 },
  badgeInfo: { flex: 1, gap: 6 },
  badgeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badgeCount: { fontSize: 12, opacity: 0.5 },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(128,128,128,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#0a7ea4', borderRadius: 2 },
});
