import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import type { StatusTone } from '@/data/sample';

function useToneColors(tone: StatusTone) {
  const colors = useColors();
  switch (tone) {
    case 'success':
      return { bg: colors.successSoft, text: colors.success, border: colors.success + '33' };
    case 'warning':
      return { bg: colors.warningSoft, text: colors.warningForeground, border: colors.warning + '4D' };
    case 'danger':
      return { bg: colors.dangerSoft, text: colors.danger, border: colors.danger + '33' };
    case 'info':
      return { bg: colors.infoSoft, text: colors.info, border: colors.info + '33' };
    case 'primary':
      return { bg: colors.accent, text: colors.primary, border: colors.primary + '33' };
    default:
      return { bg: colors.muted, text: colors.mutedForeground, border: colors.border };
  }
}

export function StatusBadge({
  tone = 'neutral',
  children,
  small = false,
}: {
  tone?: StatusTone;
  children: React.ReactNode;
  small?: boolean;
}) {
  const { bg, text, border } = useToneColors(tone);

  return (
    <View
      style={[
        styles.badge,
        small && styles.badgeSmall,
        { backgroundColor: bg, borderColor: border },
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          small && styles.badgeTextSmall,
          { color: text },
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

export function StatusDot({
  tone = 'neutral',
  pulse = false,
  size = 8,
}: {
  tone?: StatusTone;
  pulse?: boolean;
  size?: number;
}) {
  const { text: color } = useToneColors(tone);
  const anim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!pulse) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 0.3, duration: 800, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, anim]);

  return (
    <View style={{ width: size, height: size }}>
      {pulse && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { borderRadius: size / 2, backgroundColor: color, opacity: anim },
          ]}
        />
      )}
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500' as const,
    fontFamily: 'Inter_500Medium',
  },
  badgeTextSmall: {
    fontSize: 10,
  },
});
