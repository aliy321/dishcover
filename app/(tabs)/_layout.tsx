import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import { DynamicColorIOS } from 'react-native';

import { Colors } from '@/constants/theme';

export default function TabLayout() {
  return (
    <NativeTabs
      minimizeBehavior="onScrollDown"
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
        <Label>Home</Label>
        <Icon sf="house.fill" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="discover">
        <Label>Discover</Label>
        <Icon sf="safari" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="map">
        <Label>Map</Label>
        <Icon sf="map" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="achievements">
        <Label>Achievements</Label>
        <Icon sf="trophy.fill" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Label>Profile</Label>
        <Icon sf="person.fill" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
