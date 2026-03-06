import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function RouletteScreen() {
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
      <ThemedText type="title">Food Roulette</ThemedText>
      <ThemedText type="default" style={{ marginTop: 8 }}>Spin for a random dish (placeholder)</ThemedText>
    </ThemedView>
  );
}
