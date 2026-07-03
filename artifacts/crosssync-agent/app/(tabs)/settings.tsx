import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { StatusDot } from '@/components/StatusBadge';
import { settingsDefaults } from '@/data/sample';

const TAB_BAR_HEIGHT = Platform.OS === 'web' ? 84 : 49;

type SyncDirection = 'lovable-to-replit' | 'replit-to-lovable' | 'bidirectional';
type Level = 'light' | 'standard' | 'strict';
type DesignLevel = 'flexible' | 'balanced' | 'strict';

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [autoSync, setAutoSync] = useState(settingsDefaults.autoSync);
  const [reviewBeforeCode, setReviewBeforeCode] = useState(settingsDefaults.reviewBeforeCode);
  const [reviewBeforeDesign, setReviewBeforeDesign] = useState(settingsDefaults.reviewBeforeDesign);
  const [syncDirection, setSyncDirection] = useState<SyncDirection>(settingsDefaults.syncDirection);
  const [validationLevel, setValidationLevel] = useState<Level>(settingsDefaults.validationLevel);
  const [designLevel, setDesignLevel] = useState<DesignLevel>(settingsDefaults.designEnforcement);
  const [lovableMcp] = useState(settingsDefaults.lovableMcp);
  const [replitMcp] = useState(settingsDefaults.replitMcp);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: topPad + 8, backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Agent Settings</Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
          Configure CrossSync behavior
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 24 },
        ]}
      >
        {/* Automation */}
        <SectionLabel label="Automation" colors={colors} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ToggleRow
            label="Enable auto-sync"
            description="Agent automatically syncs changes without confirmation"
            value={autoSync}
            onChange={setAutoSync}
            colors={colors}
          />
          <Divider colors={colors} />
          <ToggleRow
            label="Review before code changes"
            description="Pause for approval before writing any code"
            value={reviewBeforeCode}
            onChange={setReviewBeforeCode}
            colors={colors}
          />
          <Divider colors={colors} />
          <ToggleRow
            label="Review before design changes"
            description="Pause for approval before applying design tokens"
            value={reviewBeforeDesign}
            onChange={setReviewBeforeDesign}
            colors={colors}
          />
        </View>

        {/* Sync Direction */}
        <SectionLabel label="Sync Direction" colors={colors} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {(
            [
              { value: 'lovable-to-replit' as const, label: 'Lovable → Replit', desc: 'Web changes propagate to mobile' },
              { value: 'replit-to-lovable' as const, label: 'Replit → Lovable', desc: 'Mobile changes propagate to web' },
              { value: 'bidirectional' as const, label: 'Bidirectional', desc: 'Changes sync in both directions' },
            ] as const
          ).map((opt, i, arr) => (
            <React.Fragment key={opt.value}>
              <Pressable
                style={styles.radioRow}
                onPress={() => setSyncDirection(opt.value)}
              >
                <View style={styles.radioContent}>
                  <Text style={[styles.rowLabel, { color: colors.foreground }]}>{opt.label}</Text>
                  <Text style={[styles.rowDesc, { color: colors.mutedForeground }]}>{opt.desc}</Text>
                </View>
                <View
                  style={[
                    styles.radio,
                    {
                      borderColor: syncDirection === opt.value ? colors.primary : colors.border,
                      backgroundColor: syncDirection === opt.value ? colors.primary : 'transparent',
                    },
                  ]}
                >
                  {syncDirection === opt.value && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </Pressable>
              {i < arr.length - 1 && <Divider colors={colors} />}
            </React.Fragment>
          ))}
        </View>

        {/* Validation Level */}
        <SectionLabel label="Validation Level" colors={colors} />
        <SegmentedControl
          options={[
            { value: 'light', label: 'Light' },
            { value: 'standard', label: 'Standard' },
            { value: 'strict', label: 'Strict' },
          ]}
          value={validationLevel}
          onChange={(v) => setValidationLevel(v as Level)}
          colors={colors}
        />

        {/* Design Enforcement */}
        <SectionLabel label="Design Enforcement" colors={colors} />
        <SegmentedControl
          options={[
            { value: 'flexible', label: 'Flexible' },
            { value: 'balanced', label: 'Balanced' },
            { value: 'strict', label: 'Strict' },
          ]}
          value={designLevel}
          onChange={(v) => setDesignLevel(v as DesignLevel)}
          colors={colors}
        />

        {/* MCP Connections */}
        <SectionLabel label="MCP Connections" colors={colors} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <McpRow
            label="Lovable"
            status={lovableMcp}
            icon="globe"
            colors={colors}
          />
          <Divider colors={colors} />
          <McpRow
            label="Replit"
            status={replitMcp}
            icon="smartphone"
            colors={colors}
          />
        </View>

        {/* Version */}
        <Text style={[styles.version, { color: colors.mutedForeground }]}>
          CrossSync Agent v1.0.0 · MCP protocol enabled
        </Text>
      </ScrollView>
    </View>
  );
}

function SectionLabel({ label, colors }: { label: string; colors: ReturnType<typeof useColors> }) {
  return (
    <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{label.toUpperCase()}</Text>
  );
}

function Divider({ colors }: { colors: ReturnType<typeof useColors> }) {
  return <View style={[styles.divider, { backgroundColor: colors.border }]} />;
}

function ToggleRow({
  label,
  description,
  value,
  onChange,
  colors,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleText}>
        <Text style={[styles.rowLabel, { color: colors.foreground }]}>{label}</Text>
        <Text style={[styles.rowDesc, { color: colors.mutedForeground }]}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.border, true: colors.primary + 'AA' }}
        thumbColor={value ? colors.primary : colors.mutedForeground}
      />
    </View>
  );
}

function SegmentedControl({
  options,
  value,
  onChange,
  colors,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={[styles.segmented, { backgroundColor: colors.muted, borderColor: colors.border }]}>
      {options.map((opt) => (
        <Pressable
          key={opt.value}
          style={[
            styles.segment,
            value === opt.value && { backgroundColor: colors.card, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 2 },
          ]}
          onPress={() => onChange(opt.value)}
        >
          <Text
            style={[
              styles.segmentText,
              { color: value === opt.value ? colors.primary : colors.mutedForeground },
              value === opt.value && { fontFamily: 'Inter_600SemiBold', fontWeight: '600' as const },
            ]}
          >
            {opt.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function McpRow({
  label,
  status,
  icon,
  colors,
}: {
  label: string;
  status: 'connected' | 'disconnected';
  icon: React.ComponentProps<typeof Feather>['name'];
  colors: ReturnType<typeof useColors>;
}) {
  const isConnected = status === 'connected';

  return (
    <View style={styles.mcpRow}>
      <View style={[styles.mcpIcon, { backgroundColor: colors.muted }]}>
        <Feather name={icon} size={16} color={colors.mutedForeground} />
      </View>
      <View style={styles.mcpText}>
        <Text style={[styles.rowLabel, { color: colors.foreground }]}>{label}</Text>
        <View style={styles.mcpStatus}>
          <StatusDot tone={isConnected ? 'success' : 'danger'} />
          <Text style={[styles.rowDesc, { color: isConnected ? colors.success : colors.danger }]}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </Text>
        </View>
      </View>
      <Pressable style={[styles.reconnectBtn, { borderColor: colors.border }]}>
        <Text style={[styles.reconnectText, { color: colors.mutedForeground }]}>
          {isConnected ? 'Manage' : 'Reconnect'}
        </Text>
      </Pressable>
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
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  toggleText: { flex: 1 },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  radioContent: { flex: 1 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  rowLabel: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    fontWeight: '500' as const,
  },
  rowDesc: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 1,
  },
  segmented: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    padding: 3,
    gap: 2,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    fontWeight: '500' as const,
  },
  mcpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  mcpIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mcpText: { flex: 1 },
  mcpStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  reconnectBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  reconnectText: {
    fontSize: 12,
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
