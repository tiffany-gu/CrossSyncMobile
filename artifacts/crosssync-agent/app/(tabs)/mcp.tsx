import React, { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { StatusBadge, StatusDot } from '@/components/StatusBadge';
import { settingsDefaults } from '@/data/sample';

const TAB_BAR_HEIGHT = Platform.OS === 'web' ? 84 : 49;

// Mirrors the Lovable web routes:
//   /mcp                                    -> MCP server connections
//   /.well-known/oauth-protected-resource   -> OAuth protected resource metadata
type ConnStatus = 'connected' | 'disconnected';

function ConnectionRow({
  label,
  type,
  status,
  icon,
  colors,
  onManage,
}: {
  label: string;
  type: string;
  status: ConnStatus;
  icon: React.ComponentProps<typeof Feather>['name'];
  colors: ReturnType<typeof useColors>;
  onManage: () => void;
}) {
  const isConnected = status === 'connected';

  return (
    <View style={styles.connRow}>
      <View style={[styles.connIcon, { backgroundColor: colors.muted }]}>
        <Feather name={icon} size={16} color={colors.mutedForeground} />
      </View>
      <View style={styles.connText}>
        <Text style={[styles.rowLabel, { color: colors.foreground }]}>{label}</Text>
        <View style={styles.connStatus}>
          <StatusDot tone={isConnected ? 'success' : 'danger'} />
          <Text style={[styles.rowDesc, { color: isConnected ? colors.success : colors.danger }]}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </Text>
          <Text style={[styles.connType, { color: colors.mutedForeground }]}>· {type}</Text>
        </View>
      </View>
      <Pressable
        style={[styles.manageBtn, { borderColor: colors.border }]}
        onPress={onManage}
      >
        <Text style={[styles.manageText, { color: colors.mutedForeground }]}>
          {isConnected ? 'Manage' : 'Reconnect'}
        </Text>
      </Pressable>
    </View>
  );
}

function Divider({ colors }: { colors: ReturnType<typeof useColors> }) {
  return <View style={[styles.divider, { backgroundColor: colors.border }]} />;
}

function SectionLabel({ label, colors }: { label: string; colors: ReturnType<typeof useColors> }) {
  return (
    <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{label.toUpperCase()}</Text>
  );
}

export default function McpScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [lovableMcp] = useState<ConnStatus>(settingsDefaults.lovableMcp);
  const [replitMcp] = useState<ConnStatus>(settingsDefaults.replitMcp);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const handleManage = (label: string) => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    Alert.alert(label, 'Managing MCP connection over the model context protocol.');
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: topPad + 8, backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <View style={styles.headerRow}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>MCP</Text>
          <StatusBadge tone="success">Protocol enabled</StatusBadge>
        </View>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
          Model context protocol servers &amp; access
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 24 },
        ]}
      >
        {/* MCP Servers  ( /mcp ) */}
        <SectionLabel label="MCP Servers" colors={colors} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ConnectionRow
            label="Lovable"
            type="Web · SSE"
            status={lovableMcp}
            icon="globe"
            colors={colors}
            onManage={() => handleManage('Lovable')}
          />
          <Divider colors={colors} />
          <ConnectionRow
            label="Replit"
            type="Mobile · SSE"
            status={replitMcp}
            icon="smartphone"
            colors={colors}
            onManage={() => handleManage('Replit')}
          />
        </View>

        {/* OAuth Protected Resource  ( /.well-known/oauth-protected-resource ) */}
        <SectionLabel label="OAuth Protected Resource" colors={colors} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.metaRow}>
            <Text style={[styles.metaKey, { color: colors.mutedForeground }]}>Resource</Text>
            <Text style={[styles.metaVal, { color: colors.foreground }]} numberOfLines={1}>
              crosssync-agent
            </Text>
          </View>
          <Divider colors={colors} />
          <View style={styles.metaRow}>
            <Text style={[styles.metaKey, { color: colors.mutedForeground }]}>Discovery</Text>
            <Text style={[styles.metaVal, { color: colors.foreground }]} numberOfLines={1}>
              /.well-known/oauth-protected-resource
            </Text>
          </View>
          <Divider colors={colors} />
          <View style={styles.metaRow}>
            <Text style={[styles.metaKey, { color: colors.mutedForeground }]}>Bearer tokens</Text>
            <StatusBadge tone="success" small>Required</StatusBadge>
          </View>
        </View>

        <Pressable
          style={[styles.docsBtn, { backgroundColor: colors.accent }]}
          onPress={() => handleManage('MCP Documentation')}
        >
          <Feather name="book-open" size={16} color={colors.primary} />
          <Text style={[styles.docsText, { color: colors.primary }]}>View protocol documentation</Text>
          <Feather name="arrow-right" size={14} color={colors.primary} />
        </Pressable>

        <Text style={[styles.version, { color: colors.mutedForeground }]}>
          MCP endpoints synced from Lovable · /mcp
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    fontWeight: '700' as const,
  },
  headerSub: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  scroll: { paddingHorizontal: 16, paddingTop: 8 },
  sectionLabel: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    fontWeight: '500' as const,
    letterSpacing: 0.8,
    marginTop: 20,
    marginBottom: 6,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  divider: { height: 1 },
  connRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  connIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connText: { flex: 1 },
  connStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  connType: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  rowLabel: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    fontWeight: '500' as const,
  },
  rowDesc: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  manageBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  manageText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    fontWeight: '500' as const,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    gap: 12,
  },
  metaKey: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  metaVal: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    fontWeight: '500' as const,
    flexShrink: 1,
    textAlign: 'right',
  },
  docsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
    marginTop: 16,
  },
  docsText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    fontWeight: '500' as const,
  },
  version: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginTop: 24,
  },
});
