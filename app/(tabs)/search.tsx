import { useState, useMemo } from 'react';
import { ScrollView, StyleSheet, TextInput, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { DishCard } from '@/components/dish-card';
import { StallCard } from '@/components/stall-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { dishes, hawkerCenters, stalls } from '@/lib/mock-data';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const scheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme];

  const trimmed = query.trim().toLowerCase();

  const matchedDishes = useMemo(
    () => (!trimmed ? dishes : dishes.filter((d) => d.name.toLowerCase().includes(trimmed))),
    [trimmed],
  );

  const matchedStalls = useMemo(() => {
    const hcById = new Map(hawkerCenters.map((hc) => [hc.id, hc]));
    const list = !trimmed
      ? stalls
      : stalls.filter(
          (s) =>
            s.name.toLowerCase().includes(trimmed) ||
            (hcById.get(s.hawkerCenterId)?.name ?? '').toLowerCase().includes(trimmed),
        );
    return list.map((s) => ({ stall: s, hawkerCenterName: hcById.get(s.hawkerCenterId)?.name }));
  }, [trimmed]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <ThemedText type="title">Search</ThemedText>
          <View
            style={[
              styles.inputWrap,
              { backgroundColor: scheme === 'dark' ? '#2C2C2E' : '#E5E5EA' },
            ]}
          >
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Dishes, stalls, hawker centres…"
              placeholderTextColor={colors.icon}
              value={query}
              onChangeText={setQuery}
              autoCorrect={false}
              clearButtonMode="while-editing"
            />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {!trimmed && (
            <ThemedText type="default" style={styles.hint}>
              Start typing to find dishes, stalls, or hawker centres.
            </ThemedText>
          )}

          {trimmed && matchedDishes.length === 0 && matchedStalls.length === 0 && (
            <ThemedText type="default" style={styles.hint}>
              No results for "{query}".
            </ThemedText>
          )}

          {matchedDishes.length > 0 && (
            <View style={styles.section}>
              <ThemedText type="defaultSemiBold" style={styles.sectionLabel}>Dishes</ThemedText>
              {matchedDishes.map((dish) => (
                <DishCard key={dish.id} dish={dish} distance="—" />
              ))}
            </View>
          )}

          {matchedStalls.length > 0 && (
            <View style={styles.section}>
              <ThemedText type="defaultSemiBold" style={styles.sectionLabel}>Stalls</ThemedText>
              {matchedStalls.map(({ stall, hawkerCenterName }) => (
                <StallCard
                  key={stall.id}
                  stall={stall}
                  hawkerCenterName={hawkerCenterName}
                  distance={`${stall.driveTimeMinutes} min`}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12, gap: 12 },
  inputWrap: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  input: { fontSize: 16 },
  scroll: { padding: 16, gap: 12 },
  hint: { opacity: 0.5, marginTop: 8 },
  section: { gap: 12 },
  sectionLabel: { marginBottom: 4 },
});
