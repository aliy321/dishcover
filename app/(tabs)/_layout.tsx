import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { DynamicColorIOS, Platform } from 'react-native';

import { Colors } from '@/constants/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function TabLayout() {
  return (
    <SafeAreaProvider style={{
      backgroundColor: DynamicColorIOS({
        dark: Colors.dark.background,
        light: Colors.light.background,
      }),
    }}>
      <NativeTabs
        minimizeBehavior="automatic"
        disableTransparentOnScrollEdge
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
          <NativeTabs.Trigger.Label>Dishcover</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf={{ default: 'fork.knife', selected: 'fork.knife' }} />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="map">
          <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf={{ default: 'map', selected: 'map.fill' }} />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="roulette">
          <NativeTabs.Trigger.Label>Surprise</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf={{ default: 'dice', selected: 'dice.fill' }} />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="search" role='search'>
          <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf={{ default: 'magnifyingglass', selected: 'magnifyingglass' }} />
        </NativeTabs.Trigger>

      </NativeTabs>
    </SafeAreaProvider >
  );
}
