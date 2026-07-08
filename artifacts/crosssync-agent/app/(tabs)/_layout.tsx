import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, View, useColorScheme } from "react-native";

import { useColors } from "@/hooks/useColors";

// Bottom tabs reflect the Lovable web app's primary navigation.
// The web sidebar/top-nav routes (/mcp, /.well-known/oauth-protected-resource)
// map to the mobile MCP tab, keeping information architecture consistent
// while respecting the 5-item bottom-tab limit.
function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "house", selected: "house.fill" }} />
        <Label>Dashboard</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="activity">
        <Icon sf={{ default: "arrow.triangle.2.circlepath", selected: "arrow.triangle.2.circlepath.circle.fill" }} />
        <Label>Activity</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="review">
        <Icon sf={{ default: "checkmark.shield", selected: "checkmark.shield.fill" }} />
        <Label>Review</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="mcp">
        <Icon sf={{ default: "point.3.connected.trianglepath.dotted", selected: "point.3.filled.connected.trianglepath.dotted" }} />
        <Label>MCP</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Icon sf={{ default: "gearshape", selected: "gearshape.fill" }} />
        <Label>Settings</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : colors.card,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          elevation: 0,
          ...(isWeb ? { height: 84 } : {}),
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={100}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : isWeb ? (
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: colors.card },
              ]}
            />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="house.fill" tintColor={color} size={22} />
            ) : (
              <Feather name="home" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: "Activity",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="arrow.triangle.2.circlepath" tintColor={color} size={22} />
            ) : (
              <Feather name="refresh-cw" size={21} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="review"
        options={{
          title: "Review",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="checkmark.shield.fill" tintColor={color} size={22} />
            ) : (
              <Feather name="shield" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="mcp"
        options={{
          title: "MCP",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="point.3.connected.trianglepath.dotted" tintColor={color} size={22} />
            ) : (
              <Feather name="share-2" size={21} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="gearshape.fill" tintColor={color} size={22} />
            ) : (
              <Feather name="settings" size={21} color={color} />
            ),
        }}
      />
      {/* Features moved out of bottom tabs (5-item limit) — reachable from Dashboard quick links */}
      <Tabs.Screen name="features" options={{ href: null, title: "Features" }} />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}
