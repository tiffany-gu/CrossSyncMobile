import React from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { StatusBadge, StatusDot } from '@/components/StatusBadge';
import { PlatformIcon } from '@/components/PlatformIcon';
import { ActivityRow } from '@/components/ActivityRow';
import { AgentStep } from '@/components/AgentStep';
import {
  globalStatus,
  quickStats,
  agentSteps,
  activityItems,
  platforms,
  statusPillConfig,
} from '@/data/sample';

const TAB_BAR_HEIGHT = Platform.OS === 'web' ? 84 : 49;

function getHeroStyle(
  state: typeof globalStatus.state,
  colors: ReturnType<typeof useColors>
) {
  switch (state) {
    case 'agent-running':
      return { bg: colors.primary, text: '#FFFFFF', subText: 'rgba(255,255,255,0.75)', dotTone: 'primary' as const };
    case 'in-sync':
      return { bg: colors.successSoft, text: colors.success, subText: colors.success + 'BB', dotTone: 'success' as const };
    case 'review-required':
      return { bg: colors.warningSoft, text: colors.warningForeground, subText: colors.warning, dotTone: 'warning' as const };
    case 'sync-failed':
      return { bg: colors.dangerSoft, text: colors.danger, subText: colors.danger + 'BB', dotTone: 'danger' as const };
    default:
      return { bg: colors.infoSoft, text: colors.info, subText: colors.info + 'BB', dotTone: 'info' as const };
  }
}

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const pill = statusPillConfig[globalStatus.state];
  const hero = getHeroStyle(globalStatus.state, colors);
  const recentItems = activityItems.slice(0, 3);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = TAB_BAR_HEIGHT + insets.bottom + 16;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: topPad + 8, paddingBottom: bottomPad }]}
      >
        {/* App Header */}
        <View style={styles.appHeader}>
          <View style={[styles.logoBox, { backgroundColor: colors.primary }]}>
            <Feather name="zap" size={16} color="#FFFFFF" />
          </View>
          <View style={styles.logoText}>
            <Text style={[styles.appName, { color: colors.foreground }]}>CrossSync Agent</Text>
            <Text style={[styles.appSubtitle, { color: colors.mutedForeground }]}>Lovable × Replit</Text>
          </View>
          <View style={styles.headerActions}>
            <View style={styles.statusPill}>
              <StatusDot tone={pill.tone} pulse={pill.tone === 'primary'} size={6} />
              <Text style={[styles.statusPillText, { color: pill.tone === 'primary' ? colors.primary : colors.success }]}>
                {pill.label}
              </Text>
            </View>
            <Pressable style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="bell" size={16} color={colors.mutedForeground} />
              <View style={[styles.notifDot, { backgroundColor: colors.danger }]} />
            </Pressable>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>AK</Text>
            </View>
          </View>
        </View>

        {/* Status Hero Card */}
        <View style={[styles.heroCard, { backgroundColor: hero.bg }]}>
          <View style={styles.heroTop}>
            <StatusDot tone={hero.dotTone} pulse={globalStatus.state === 'agent-running'} size={10} />
            <Text style={[styles.heroState, { color: hero.text }]}>{pill.label}</Text>
          </View>
          <Text style={[styles.heroEvent, { color: hero.text }]} numberOfLines={2}>
            {globalStatus.lastEvent}
          </Text>
          <View style={styles.heroFooter}>
            <Text style={[styles.heroTime, { color: hero.subText }]}>
              {globalStatus.timestamp}
            </Text>
            <Pressable
              style={[styles.heroLink, { backgroundColor: hero.text + '22' }]}
              onPress={() => router.push('/(tabs)/activity')}
            >
              <Text style={[styles.heroLinkText, { color: hero.text }]}>View Activity</Text>
              <Feather name="arrow-right" size={12} color={hero.text} />
            </Pressable>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <StatCard label="In Sync" value={`${quickStats.inSync}%`} colors={colors} tone="success" />
          <StatCard label="Syncs Today" value={String(quickStats.syncsToday)} colors={colors} tone="primary" />
          <StatCard label="Pending Reviews" value={String(quickStats.pendingReviews)} colors={colors} tone="warning" />
          <StatCard label="Failed Syncs" value={String(quickStats.failedSyncs)} colors={colors} tone="danger" />
        </View>

        {/* Platform Pair */}
        <SectionHeader title="Platform Status" colors={colors} />
        <View style={styles.platformPair}>
          <PlatformCard platform="lovable" colors={colors} />
          <View style={styles.connectorCol}>
            <View style={[styles.connectorLine, { backgroundColor: colors.border }]} />
            <View style={[styles.connectorCircle, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="refresh-cw" size={14} color={colors.primary} />
            </View>
            <View style={[styles.connectorLine, { backgroundColor: colors.border }]} />
          </View>
          <PlatformCard platform="replit" colors={colors} />
        </View>

        {/* Agent Progress */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Agent Progress</Text>
          <Text style={[styles.sectionMeta, { color: colors.mutedForeground }]}>
            {agentSteps.filter((s) => s.status === 'complete').length}/{agentSteps.length} steps
          </Text>
        </View>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {agentSteps.map((step, i) => (
            <AgentStep key={step.label} step={step} isLast={i === agentSteps.length - 1} />
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recent Activity</Text>
          <Pressable onPress={() => router.push('/(tabs)/activity')}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>View all</Text>
          </Pressable>
        </View>
        <View style={styles.activityList}>
          {recentItems.map((item) => (
            <ActivityRow key={item.id} item={item} />
          ))}
        </View>

        {/* Quick Links */}
        <SectionHeader title="More" colors={colors} />
        <View style={styles.quickLinks}>
          <QuickLink
            icon="layers"
            label="Platform Context"
            description="View Lovable & Replit codebase details"
            onPress={() => router.push('/context-screen')}
            colors={colors}
          />
          <QuickLink
            icon="feather"
            label="Design Consistency"
            description="10 checks · 3 warnings"
            onPress={() => router.push('/design-screen')}
            colors={colors}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function StatCard({
  label,
  value,
  colors,
  tone,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useColors>;
  tone: 'success' | 'primary' | 'warning' | 'danger';
}) {
  const bgMap = {
    success: colors.successSoft,
    primary: colors.accent,
    warning: colors.warningSoft,
    danger: colors.dangerSoft,
  };
  const colorMap = {
    success: colors.success,
    primary: colors.primary,
    warning: colors.warningForeground,
    danger: colors.danger,
  };

  return (
    <View
      style={[
        styles.statCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.statValue, { color: colorMap[tone] }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

function PlatformCard({
  platform,
  colors,
}: {
  platform: 'lovable' | 'replit';
  colors: ReturnType<typeof useColors>;
}) {
  const data = platforms[platform];

  return (
    <View style={[styles.platformCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.platformCardHeader}>
        <PlatformIcon platform={platform} size={32} />
        <View style={styles.platformCardInfo}>
          <Text style={[styles.platformName, { color: colors.foreground }]} numberOfLines={1}>
            {platform === 'lovable' ? 'Lovable' : 'Replit'}
          </Text>
          <Text style={[styles.platformType, { color: colors.mutedForeground }]} numberOfLines={1}>
            {data.type}
          </Text>
        </View>
      </View>
      <StatusBadge tone={data.syncTone} small>{data.syncBadge}</StatusBadge>
      <Text style={[styles.platformChange, { color: colors.mutedForeground }]} numberOfLines={2}>
        {data.detectedChange}
      </Text>
    </View>
  );
}

function SectionHeader({
  title,
  colors,
}: {
  title: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <Text style={[styles.sectionTitle, { color: colors.foreground, marginTop: 4, marginBottom: 8 }]}>
      {title}
    </Text>
  );
}

function QuickLink({
  icon,
  label,
  description,
  onPress,
  colors,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  description: string;
  onPress: () => void;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.quickLink,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
      ]}
      onPress={onPress}
    >
      <View style={[styles.quickLinkIcon, { backgroundColor: colors.accent }]}>
        <Feather name={icon} size={18} color={colors.primary} />
      </View>
      <View style={styles.quickLinkText}>
        <Text style={[styles.quickLinkLabel, { color: colors.foreground }]}>{label}</Text>
        <Text style={[styles.quickLinkDesc, { color: colors.mutedForeground }]}>{description}</Text>
      </View>
      <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: 16, gap: 0 },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  logoBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { flex: 1 },
  appName: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600' as const,
    lineHeight: 18,
  },
  appSubtitle: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    lineHeight: 14,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'transparent',
  },
  statusPillText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    fontWeight: '500' as const,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  notifDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  heroCard: {
    borderRadius: 14,
    padding: 16,
    gap: 8,
    marginBottom: 12,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroState: {
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600' as const,
  },
  heroEvent: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    lineHeight: 18,
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  heroTime: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  heroLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  heroLinkText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    fontWeight: '500' as const,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 2,
  },
  statValue: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    fontWeight: '700' as const,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600' as const,
  },
  sectionMeta: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  seeAll: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    fontWeight: '500' as const,
  },
  platformPair: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  connectorCol: {
    alignItems: 'center',
    gap: 0,
    paddingBottom: 20,
  },
  connectorLine: {
    width: 1,
    height: 20,
  },
  connectorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  platformCard: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    gap: 6,
  },
  platformCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  platformCardInfo: { flex: 1 },
  platformName: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600' as const,
  },
  platformType: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
  },
  platformChange: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    lineHeight: 14,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 0,
    marginBottom: 16,
  },
  activityList: {
    gap: 8,
    marginBottom: 16,
  },
  quickLinks: {
    gap: 8,
    marginBottom: 8,
  },
  quickLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  quickLinkIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLinkText: { flex: 1 },
  quickLinkLabel: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    fontWeight: '500' as const,
  },
  quickLinkDesc: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 1,
  },
});
