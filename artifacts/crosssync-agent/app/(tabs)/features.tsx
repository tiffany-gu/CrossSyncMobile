import React, { useState } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { StatusBadge } from '@/components/StatusBadge';
import { featureItems } from '@/data/sample';
import type { FeatureItem, StatusTone } from '@/data/sample';

const TAB_BAR_HEIGHT = Platform.OS === 'web' ? 84 : 49;

type SyncStatus = 'synced' | 'missing' | 'outdated' | 'needs-review';

const statusTone: Record<SyncStatus, StatusTone> = {
  synced: 'success',
  missing: 'danger',
  outdated: 'warning',
  'needs-review': 'info',
};

const statusLabel: Record<SyncStatus, string> = {
  synced: 'Synced',
  missing: 'Missing',
  outdated: 'Outdated',
  'needs-review': 'Review',
};

type FilterKey = 'all' | 'synced' | 'issues';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'synced', label: 'Synced' },
  { key: 'issues', label: 'Has Issues' },
];

function filterFeatures(items: FeatureItem[], query: string, filter: FilterKey): FeatureItem[] {
  let result = items;
  if (query.trim()) {
    const q = query.toLowerCase();
    result = result.filter((i) => i.name.toLowerCase().includes(q));
  }
  switch (filter) {
    case 'synced':
      return result.filter((i) => i.lovable === 'synced' && i.replit === 'synced');
    case 'issues':
      return result.filter((i) => i.lovable !== 'synced' || i.replit !== 'synced');
    default:
      return result;
  }
}

function FeatureRow({ item, colors }: { item: FeatureItem; colors: ReturnType<typeof useColors> }) {
  const hasIssue = item.lovable !== 'synced' || item.replit !== 'synced';

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: colors.card,
          borderColor: hasIssue ? colors.warning + '66' : colors.border,
        },
      ]}
    >
      <View style={styles.rowMain}>
        <Text style={[styles.featureName, { color: colors.foreground }]}>{item.name}</Text>
        {item.action !== 'None' && (
          <Text style={[styles.action, { color: colors.primary }]} numberOfLines={1}>
            {item.action}
          </Text>
        )}
      </View>

      <View style={styles.platformBadges}>
        <View style={styles.platformBadge}>
          <Feather name="globe" size={10} color={colors.info} />
          <StatusBadge tone={statusTone[item.lovable]} small>
            {statusLabel[item.lovable]}
          </StatusBadge>
        </View>
        <View style={styles.platformBadge}>
          <Feather name="smartphone" size={10} color={colors.primary} />
          <StatusBadge tone={statusTone[item.replit]} small>
            {statusLabel[item.replit]}
          </StatusBadge>
        </View>
      </View>

      <Text style={[styles.updated, { color: colors.mutedForeground }]}>
        {item.lastUpdated}
      </Text>
    </View>
  );
}

export default function FeaturesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const filtered = filterFeatures(featureItems, query, activeFilter);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const syncedCount = featureItems.filter((i) => i.lovable === 'synced' && i.replit === 'synced').length;

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
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Feature Mapping</Text>
          <StatusBadge tone="success">{syncedCount}/{featureItems.length} synced</StatusBadge>
        </View>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
          Web ↔ Mobile feature coverage
        </Text>

        {/* Search */}
        <View style={[styles.searchBox, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          <Feather name="search" size={14} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="Search features…"
            placeholderTextColor={colors.mutedForeground}
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')}>
              <Feather name="x" size={14} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Filter chips */}
      <View style={[styles.filterRow, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        {FILTERS.map((f) => (
          <Pressable
            key={f.key}
            style={[
              styles.filterChip,
              {
                backgroundColor: activeFilter === f.key ? colors.primary : colors.muted,
                borderColor: activeFilter === f.key ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setActiveFilter(f.key)}
          >
            <Text
              style={[
                styles.filterText,
                { color: activeFilter === f.key ? '#FFFFFF' : colors.mutedForeground },
              ]}
            >
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 16 },
        ]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={filtered.length > 0}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => <FeatureRow item={item} colors={colors} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No features match your search
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 6,
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
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    padding: 0,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    fontWeight: '500' as const,
  },
  list: { padding: 16, paddingTop: 12 },
  row: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  rowMain: { gap: 2 },
  featureName: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    fontWeight: '500' as const,
  },
  action: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  platformBadges: {
    flexDirection: 'row',
    gap: 12,
  },
  platformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  updated: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
});
