import React, { useState } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { ActivityRow } from '@/components/ActivityRow';
import { activityItems } from '@/data/sample';
import type { ActivityItem } from '@/data/sample';

const TAB_BAR_HEIGHT = Platform.OS === 'web' ? 84 : 49;

type FilterKey = 'all' | 'lovable' | 'replit' | 'failed' | 'review';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'lovable', label: 'Lovable → Replit' },
  { key: 'replit', label: 'Replit → Lovable' },
  { key: 'review', label: 'Needs Review' },
  { key: 'failed', label: 'Failed' },
];

function filterItems(items: ActivityItem[], key: FilterKey): ActivityItem[] {
  switch (key) {
    case 'lovable': return items.filter((i) => i.source === 'lovable');
    case 'replit': return items.filter((i) => i.source === 'replit');
    case 'failed': return items.filter((i) => i.result === 'Failed');
    case 'review': return items.filter((i) => i.result === 'Review required');
    default: return items;
  }
}

export default function ActivityScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const filtered = filterItems(activityItems, activeFilter);

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
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Sync Activity</Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
          {filtered.length} event{filtered.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Filter chips */}
      <FlatList
        horizontal
        data={FILTERS}
        keyExtractor={(f) => f.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.filterList, { backgroundColor: colors.card }]}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.filterChip,
              {
                backgroundColor: activeFilter === item.key ? colors.primary : colors.muted,
                borderColor: activeFilter === item.key ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setActiveFilter(item.key)}
          >
            <Text
              style={[
                styles.filterText,
                { color: activeFilter === item.key ? colors.primaryForeground : colors.mutedForeground },
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        )}
      />

      {/* Activity list */}
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
        renderItem={({ item }) => <ActivityRow item={item} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No activity matches this filter
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
  filterList: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: 6,
  },
  filterText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    fontWeight: '500' as const,
  },
  list: { padding: 16, paddingTop: 8 },
  empty: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
});
