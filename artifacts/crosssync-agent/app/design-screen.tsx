import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { StatusBadge } from '@/components/StatusBadge';
import { designChecks } from '@/data/sample';
import type { DesignCheck, StatusTone } from '@/data/sample';

type CheckStatus = 'pass' | 'warning' | 'fail';

const statusTone: Record<CheckStatus, StatusTone> = {
  pass: 'success',
  warning: 'warning',
  fail: 'danger',
};

const statusIcon: Record<CheckStatus, React.ComponentProps<typeof Feather>['name']> = {
  pass: 'check-circle',
  warning: 'alert-triangle',
  fail: 'x-circle',
};

const severityTone: Record<string, StatusTone> = {
  Low: 'neutral',
  Medium: 'warning',
  High: 'danger',
};

const COMMON_ISSUES = [
  {
    icon: 'layout' as const,
    title: 'Sidebar → Tab Bar',
    desc: 'Web sidebars become bottom tab bars on mobile. Limit to 5 tabs.',
  },
  {
    icon: 'type' as const,
    title: 'Text size scaling',
    desc: 'Mobile base font is 14-16pt vs 14px web. Headings should be 20-28pt.',
  },
  {
    icon: 'mouse-pointer' as const,
    title: 'Hover states → Press states',
    desc: 'Web hover effects must translate to tap feedback (opacity, scale).',
  },
  {
    icon: 'maximize' as const,
    title: 'Modal → Stack Screen',
    desc: 'Web dialogs become stack screens or bottom sheets on native.',
  },
  {
    icon: 'sliders' as const,
    title: 'CSS tokens → StyleSheet',
    desc: 'CSS variables must be mapped to constants/colors.ts tokens.',
  },
];

function CheckRow({ check, colors }: { check: DesignCheck; colors: ReturnType<typeof useColors> }) {
  const tone = statusTone[check.status];
  const icon = statusIcon[check.status];
  const isIssue = check.status !== 'pass';

  return (
    <View
      style={[
        styles.checkRow,
        {
          backgroundColor: isIssue ? (check.status === 'warning' ? colors.warningSoft : colors.dangerSoft) : colors.card,
          borderColor: isIssue ? (check.status === 'warning' ? colors.warning + '44' : colors.danger + '44') : colors.border,
        },
      ]}
    >
      <View style={styles.checkMain}>
        <View style={styles.checkHeader}>
          <Feather
            name={icon}
            size={14}
            color={tone === 'success' ? colors.success : tone === 'warning' ? colors.warning : colors.danger}
          />
          <Text style={[styles.checkItem, { color: colors.foreground }]}>{check.item}</Text>
          <StatusBadge tone={severityTone[check.severity] ?? 'neutral'} small>
            {check.severity}
          </StatusBadge>
        </View>
        {isIssue && (
          <View style={styles.fixRow}>
            <Feather name="tool" size={11} color={colors.mutedForeground} />
            <Text style={[styles.fixText, { color: colors.mutedForeground }]}>{check.fix}</Text>
          </View>
        )}
      </View>
      <View style={styles.checkMeta}>
        <StatusBadge tone={tone} small>
          {check.status === 'pass' ? 'Pass' : check.status === 'warning' ? 'Warning' : 'Fail'}
        </StatusBadge>
        <Text style={[styles.lastChecked, { color: colors.mutedForeground }]}>{check.lastChecked}</Text>
      </View>
    </View>
  );
}

export default function DesignScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const passCount = designChecks.filter((c) => c.status === 'pass').length;
  const warnCount = designChecks.filter((c) => c.status === 'warning').length;
  const failCount = designChecks.filter((c) => c.status === 'fail').length;

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.scroll,
        { paddingBottom: insets.bottom + 32, paddingTop: Platform.OS === 'web' ? 16 : 8 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Summary */}
      <View style={[styles.summaryRow]}>
        <SummaryStat label="Passing" value={passCount} color={colors.success} bg={colors.successSoft} />
        <SummaryStat label="Warnings" value={warnCount} color={colors.warningForeground} bg={colors.warningSoft} />
        <SummaryStat label="Failing" value={failCount} color={colors.danger} bg={colors.dangerSoft} />
      </View>

      {/* Checklist */}
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Design Checks</Text>
      <View style={styles.checkList}>
        {designChecks.map((check) => (
          <CheckRow key={check.item} check={check} colors={colors} />
        ))}
      </View>

      {/* Common Issues */}
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Common Web-to-Mobile Issues</Text>
      <View style={[styles.issuesCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {COMMON_ISSUES.map((issue, i) => (
          <React.Fragment key={issue.title}>
            <View style={styles.issueRow}>
              <View style={[styles.issueIcon, { backgroundColor: colors.accent }]}>
                <Feather name={issue.icon} size={16} color={colors.primary} />
              </View>
              <View style={styles.issueText}>
                <Text style={[styles.issueTitle, { color: colors.foreground }]}>{issue.title}</Text>
                <Text style={[styles.issueDesc, { color: colors.mutedForeground }]}>{issue.desc}</Text>
              </View>
            </View>
            {i < COMMON_ISSUES.length - 1 && (
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
            )}
          </React.Fragment>
        ))}
      </View>
    </ScrollView>
  );
}

function SummaryStat({
  label,
  value,
  color,
  bg,
}: {
  label: string;
  value: number;
  color: string;
  bg: string;
}) {
  return (
    <View style={[styles.statCard, { backgroundColor: bg }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={[styles.statLabel, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { padding: 16, gap: 12 },
  summaryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  statCard: {
    flex: 1,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    fontWeight: '700' as const,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600' as const,
    marginTop: 4,
    marginBottom: 8,
  },
  checkList: { gap: 6 },
  checkRow: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  checkMain: { flex: 1, gap: 4 },
  checkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  checkItem: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    fontWeight: '500' as const,
    flex: 1,
  },
  fixRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
    paddingLeft: 21,
  },
  fixText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    flex: 1,
    lineHeight: 16,
  },
  checkMeta: {
    alignItems: 'flex-end',
    gap: 4,
  },
  lastChecked: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
  },
  issuesCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  issueRow: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    alignItems: 'flex-start',
  },
  issueIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  issueText: { flex: 1 },
  issueTitle: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600' as const,
  },
  issueDesc: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    lineHeight: 16,
    marginTop: 2,
  },
  divider: { height: 1 },
});
