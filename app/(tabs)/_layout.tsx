import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import { DynamicColorIOS } from 'react-native';

import { Colors } from '@/constants/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';

export default function TabLayout() {
  return (
    <SafeAreaProvider style={{
      backgroundColor: DynamicColorIOS({
        dark: Colors.dark.background,
        light: Colors.light.background,
      })
    }}>
      <NativeTabs
        minimizeBehavior="automatic"
        backgroundColor={DynamicColorIOS({
          dark: Colors.dark.background,
          light: Colors.light.background,
        })}
        labelStyle={{
          color: DynamicColorIOS({
            dark: Colors.dark.text,
            light: Colors.light.text,
          }),
        }}
        tintColor={DynamicColorIOS({
          dark: Colors.dark.tint,
          light: Colors.light.tint,
        })}
      >
        <NativeTabs.Trigger name="index">
          <Label>Dishcover</Label>
          <Icon sf={{ default: 'fork.knife', selected: 'fork.knife' }} />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="discover">
          <Label>Explore</Label>
          <Icon sf={{ default: 'map', selected: 'map.fill' }} />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="profile">
          <Label>Profile</Label>
          <Icon sf={{ default: 'person', selected: 'person.fill' }} />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="roulette" role="search">
          <Label>Roulette</Label>
          <Icon sf={{ default: 'dice', selected: 'dice.fill' }} />
        </NativeTabs.Trigger>

      </NativeTabs>
    </SafeAreaProvider>
  );
}
