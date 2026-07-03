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
import { StatusDot, StatusBadge } from '@/components/StatusBadge';
import { PlatformIcon } from '@/components/PlatformIcon';
import { platforms } from '@/data/sample';

export default function ContextScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.scroll,
        { paddingBottom: insets.bottom + 32, paddingTop: Platform.OS === 'web' ? 16 : 8 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Lovable Platform */}
      <PlatformPanel
        platform="lovable"
        colors={colors}
        sections={[
          {
            title: 'Routes',
            items: [
              '/ — Dashboard',
              '/activity — Sync Activity',
              '/context — Platform Context',
              '/design — Design Consistency',
              '/mappings — Mapping Rules',
              '/features — Feature Mapping',
              '/review — Human Review',
              '/planner — Sync Planner',
              '/settings — Agent Settings',
            ],
          },
          {
            title: 'Components',
            items: [
              'AppShell, TopBar, Sidebar',
              'StatusBadge, StatusDot',
              'PlatformCard, SyncConnector',
              'AgentProgress, ActivityItem',
              'ChangeBadge, PlatformIcon',
            ],
          },
          {
            title: 'Design System',
            items: [
              'Primary: oklch(0.55 0.19 255)',
              'Radius: 0.75rem cards, 0.5rem controls',
              'Font: System UI stack (Inter)',
              'Background: oklch(0.985 0.003 250)',
            ],
          },
          {
            title: 'Recent Changes',
            items: [
              'Modal component added to /dashboard',
              'Primary button color token updated',
              'Navigation sidebar restructured',
            ],
          },
        ]}
      />

      {/* Replit Platform */}
      <PlatformPanel
        platform="replit"
        colors={colors}
        sections={[
          {
            title: 'Screens',
            items: [
              '(tabs)/index — Dashboard',
              '(tabs)/activity — Sync Activity',
              '(tabs)/review — Human Review',
              '(tabs)/features — Feature Mapping',
              '(tabs)/settings — Agent Settings',
              'context-screen — Platform Context',
              'design-screen — Design Consistency',
            ],
          },
          {
            title: 'Components',
            items: [
              'StatusBadge, StatusDot',
              'PlatformIcon',
              'ActivityRow',
              'AgentStep',
            ],
          },
          {
            title: 'Build Status',
            items: [
              'Metro bundler: Running',
              'TypeScript: No errors',
              'Tests: 12/14 passing',
              'Git: Clean working tree',
            ],
          },
          {
            title: 'Recent Commits',
            items: [
              'feat: Add activity filter chips',
              'fix: Safe area insets on web',
              'chore: Update primary color token',
            ],
          },
        ]}
      />
    </ScrollView>
  );
}

function PlatformPanel({
  platform,
  sections,
  colors,
}: {
  platform: 'lovable' | 'replit';
  sections: { title: string; items: string[] }[];
  colors: ReturnType<typeof useColors>;
}) {
  const data = platforms[platform];

  return (
    <View style={[styles.panel, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Panel header */}
      <View style={[styles.panelHeader, { borderBottomColor: colors.border }]}>
        <View style={styles.panelTitle}>
          <PlatformIcon platform={platform} size={32} />
          <View>
            <Text style={[styles.panelName, { color: colors.foreground }]}>{data.name}</Text>
            <Text style={[styles.panelType, { color: colors.mutedForeground }]}>{data.type}</Text>
          </View>
        </View>
        <View style={styles.mcpIndicator}>
          <StatusDot tone="success" pulse />
          <Text style={[styles.mcpText, { color: colors.success }]}>MCP Connected</Text>
        </View>
      </View>

      {/* Status row */}
      <View style={[styles.statusRow, { backgroundColor: colors.muted }]}>
        <Feather name="clock" size={12} color={colors.mutedForeground} />
        <Text style={[styles.statusText, { color: colors.mutedForeground }]}>
          Last saved {data.lastSaved}
        </Text>
        <StatusBadge tone={data.syncTone} small>{data.syncBadge}</StatusBadge>
      </View>

      {/* Detected change */}
      <View style={styles.changeBox}>
        <Text style={[styles.changeLabel, { color: colors.mutedForeground }]}>
          Current detected change
        </Text>
        <Text style={[styles.changeText, { color: colors.foreground }]}>{data.detectedChange}</Text>
      </View>

      {/* Context rows */}
      <View style={[styles.contextRows, { borderTopColor: colors.border }]}>
        {data.context.map((c) => (
          <View key={c.label} style={[styles.contextRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.contextLabel, { color: colors.mutedForeground }]}>{c.label}</Text>
            <View style={styles.contextValue}>
              <Feather
                name={c.ok ? 'check-circle' : 'alert-circle'}
                size={12}
                color={c.ok ? colors.success : colors.warning}
              />
              <Text style={[styles.contextValueText, { color: colors.foreground }]}>{c.value}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Sections */}
      {sections.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
            {section.title.toUpperCase()}
          </Text>
          {section.items.map((item) => (
            <View key={item} style={[styles.sectionItem, { borderLeftColor: colors.border }]}>
              <Text style={[styles.sectionItemText, { color: colors.foreground }]}>{item}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { padding: 16, gap: 16 },
  panel: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
    flexWrap: 'wrap',
    gap: 8,
  },
  panelTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  panelName: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600' as const,
  },
  panelType: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  mcpIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  mcpText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    fontWeight: '500' as const,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    flex: 1,
  },
  changeBox: {
    padding: 14,
    gap: 4,
  },
  changeLabel: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    fontWeight: '500' as const,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  changeText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    lineHeight: 18,
  },
  contextRows: {
    borderTopWidth: 1,
  },
  contextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  contextLabel: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  contextValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  contextValueText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    fontWeight: '500' as const,
  },
  section: {
    padding: 14,
    paddingTop: 10,
    gap: 4,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    fontWeight: '500' as const,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  sectionItem: {
    paddingLeft: 10,
    paddingVertical: 3,
    borderLeftWidth: 2,
  },
  sectionItemText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    lineHeight: 18,
  },
});
