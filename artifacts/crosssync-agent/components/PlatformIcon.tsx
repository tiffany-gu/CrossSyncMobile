import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import type { PlatformKey } from '@/data/sample';

export function PlatformIcon({
  platform,
  size = 36,
}: {
  platform: PlatformKey;
  size?: number;
}) {
  const colors = useColors();
  const isLovable = platform === 'lovable';
  const bg = isLovable ? colors.infoSoft : colors.accent;
  const color = isLovable ? colors.info : colors.primary;
  const iconSize = Math.round(size * 0.44);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size * 0.28,
          backgroundColor: bg,
          borderColor: isLovable ? colors.info + '22' : colors.primary + '22',
        },
      ]}
    >
      <Feather
        name={isLovable ? 'globe' : 'smartphone'}
        size={iconSize}
        color={color}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
