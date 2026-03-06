import { useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function StallDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <ThemedText type="title">Stall</ThemedText>
      <ThemedText type="default" style={{ marginTop: 8 }}>ID: {id ?? '—'}</ThemedText>
    </ThemedView>
  );
}
