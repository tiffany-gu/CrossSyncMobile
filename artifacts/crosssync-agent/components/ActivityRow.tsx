import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { PlatformIcon } from './PlatformIcon';
import { StatusBadge } from './StatusBadge';
import type { ActivityItem, ChangeType, RiskLevel, ActivityResult, StatusTone } from '@/data/sample';

const changeTypeTone: Record<ChangeType, StatusTone> = {
  'UI Layout': 'info',
  Feature: 'primary',
  Navigation: 'info',
  Content: 'neutral',
  'Design System': 'primary',
  'Data/API': 'warning',
  'Bug Fix': 'danger',
};

const riskTone: Record<RiskLevel, StatusTone> = {
  Low: 'neutral',
  Medium: 'warning',
  High: 'danger',
};

const resultTone: Record<ActivityResult, StatusTone> = {
  Applied: 'success',
  'Review required': 'warning',
  Failed: 'danger',
  'In progress': 'info',
};

export function ActivityRow({ item }: { item: ActivityItem }) {
  const colors = useColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.platformRow}>
        <PlatformIcon platform={item.source} size={28} />
        <Feather name="arrow-right" size={12} color={colors.mutedForeground} style={styles.arrow} />
        <PlatformIcon platform={item.target} size={28} />
        <View style={styles.badgesRow}>
          <StatusBadge tone={changeTypeTone[item.changeType]} small>{item.changeType}</StatusBadge>
          {item.risk !== 'Low' && (
            <StatusBadge tone={riskTone[item.risk]} small>Risk · {item.risk}</StatusBadge>
          )}
        </View>
        <StatusBadge tone={resultTone[item.result]} small>{item.result}</StatusBadge>
      </View>

      <Text style={[styles.summary, { color: colors.foreground }]} numberOfLines={2}>
        {item.summary}
      </Text>

      <Text style={[styles.action, { color: colors.mutedForeground }]} numberOfLines={2}>
        {item.action}
      </Text>

      <View style={styles.footer}>
        {item.mappingRule !== '—' && (
          <View style={styles.mappingRow}>
            <Feather name="git-branch" size={10} color={colors.mutedForeground} />
            <Text style={[styles.mapping, { color: colors.mutedForeground }]}>
              {item.mappingRule}
            </Text>
          </View>
        )}
        <Text style={[styles.timestamp, { color: colors.mutedForeground }]}>
          {item.timestamp}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  platformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  arrow: {
    marginHorizontal: 0,
  },
  badgesRow: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  summary: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    fontWeight: '500' as const,
    lineHeight: 18,
  },
  action: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  mappingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  mapping: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    flex: 1,
  },
  timestamp: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
});
