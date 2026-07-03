import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { StatusBadge } from './StatusBadge';
import type { AgentStep as AgentStepT, StepStatus, StatusTone } from '@/data/sample';

const statusTone: Record<StepStatus, StatusTone> = {
  complete: 'success',
  running: 'primary',
  pending: 'neutral',
  blocked: 'warning',
  failed: 'danger',
};

const statusLabel: Record<StepStatus, string> = {
  complete: 'Done',
  running: 'Running',
  pending: 'Pending',
  blocked: 'Blocked',
  failed: 'Failed',
};

type FeatherIconName = React.ComponentProps<typeof Feather>['name'];

const statusIcon: Record<StepStatus, FeatherIconName> = {
  complete: 'check',
  running: 'loader',
  pending: 'circle',
  blocked: 'slash',
  failed: 'alert-octagon',
};

function StepIcon({ status, color, size }: { status: StepStatus; color: string; size: number }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (status !== 'running') return;
    const loop = Animated.loop(
      Animated.timing(anim, { toValue: 1, duration: 1000, useNativeDriver: true })
    );
    loop.start();
    return () => loop.stop();
  }, [status, anim]);

  const rotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.View style={status === 'running' ? { transform: [{ rotate }] } : undefined}>
      <Feather name={statusIcon[status]} size={size} color={color} />
    </Animated.View>
  );
}

function getIconBg(status: StepStatus, colors: ReturnType<typeof useColors>) {
  switch (status) {
    case 'complete': return colors.success;
    case 'running': return colors.primary;
    case 'failed': return colors.danger;
    case 'blocked': return colors.warning;
    default: return colors.muted;
  }
}

function getIconColor(status: StepStatus, colors: ReturnType<typeof useColors>) {
  switch (status) {
    case 'complete': return colors.successForeground;
    case 'running': return colors.primaryForeground;
    case 'failed': return colors.dangerForeground;
    case 'blocked': return colors.warningForeground;
    default: return colors.mutedForeground;
  }
}

export function AgentStep({
  step,
  isLast = false,
  compact = false,
}: {
  step: AgentStepT;
  isLast?: boolean;
  compact?: boolean;
}) {
  const colors = useColors();
  const iconBg = getIconBg(step.status, colors);
  const iconColor = getIconColor(step.status, colors);
  const isRunning = step.status === 'running';

  return (
    <View style={[styles.row, compact && styles.rowCompact]}>
      <View style={styles.iconCol}>
        <View
          style={[
            styles.iconCircle,
            compact && styles.iconCircleCompact,
            {
              backgroundColor: iconBg,
              borderColor: isRunning ? colors.primary + '40' : 'transparent',
            },
          ]}
        >
          <StepIcon
            status={step.status}
            color={iconColor}
            size={compact ? 10 : 12}
          />
        </View>
        {!isLast && (
          <View style={[styles.connector, { backgroundColor: colors.border }]} />
        )}
      </View>

      <View style={[styles.content, !isLast && styles.contentWithConnector]}>
        <View style={styles.labelRow}>
          <Text
            style={[
              styles.label,
              compact && styles.labelCompact,
              { color: isRunning ? colors.primary : colors.foreground },
            ]}
            numberOfLines={1}
          >
            {step.label}
          </Text>
          <StatusBadge tone={statusTone[step.status]} small>
            {statusLabel[step.status]}
          </StatusBadge>
        </View>
        {!compact && step.detail && (
          <Text style={[styles.detail, { color: colors.mutedForeground }]} numberOfLines={1}>
            {step.detail}
          </Text>
        )}
        {isRunning && !compact && (
          <View style={[styles.progressTrack, { backgroundColor: colors.primary + '20' }]}>
            <ProgressBar color={colors.primary} />
          </View>
        )}
      </View>
    </View>
  );
}

function ProgressBar({ color }: { color: string }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 1200, useNativeDriver: false }),
        Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  const width = anim.interpolate({ inputRange: [0, 1], outputRange: ['10%', '70%'] });

  return (
    <Animated.View
      style={[styles.progressBar, { backgroundColor: color, width }]}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  rowCompact: {
    gap: 8,
  },
  iconCol: {
    alignItems: 'center',
    width: 28,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  iconCircleCompact: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  connector: {
    width: 2,
    flex: 1,
    minHeight: 6,
    marginVertical: 2,
  },
  content: {
    flex: 1,
    paddingTop: 4,
    gap: 3,
  },
  contentWithConnector: {
    paddingBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    fontWeight: '500' as const,
    flex: 1,
  },
  labelCompact: {
    fontSize: 12,
  },
  detail: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  progressTrack: {
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
});
