import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { StatusBadge } from '@/components/StatusBadge';
import { PlatformIcon } from '@/components/PlatformIcon';
import { reviewItems } from '@/data/sample';
import type { ReviewItem, StatusTone } from '@/data/sample';

const TAB_BAR_HEIGHT = Platform.OS === 'web' ? 84 : 49;

const riskTone: Record<string, StatusTone> = {
  Low: 'neutral',
  Medium: 'warning',
  High: 'danger',
};

function ReviewCard({
  item,
  onApprove,
  onReject,
}: {
  item: ReviewItem;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const colors = useColors();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.platformFlow}>
          <PlatformIcon platform={item.source} size={28} />
          <Feather name="arrow-right" size={12} color={colors.mutedForeground} />
          <PlatformIcon platform={item.target} size={28} />
        </View>
        <View style={styles.badges}>
          <StatusBadge tone={riskTone[item.risk] ?? 'neutral'} small>
            Risk · {item.risk}
          </StatusBadge>
          <StatusBadge tone="warning" small>{item.changeType}</StatusBadge>
        </View>
      </View>

      {/* Summary */}
      <Text style={[styles.summary, { color: colors.foreground }]}>{item.summary}</Text>
      <Text style={[styles.timestamp, { color: colors.mutedForeground }]}>{item.timestamp}</Text>

      {/* Reason */}
      <View style={[styles.reasonBox, { backgroundColor: colors.warningSoft, borderColor: colors.warning + '33' }]}>
        <Feather name="alert-triangle" size={12} color={colors.warning} />
        <Text style={[styles.reasonText, { color: colors.warningForeground }]}>{item.reason}</Text>
      </View>

      {/* Suggested Action */}
      <View style={[styles.actionBox, { backgroundColor: colors.muted }]}>
        <Text style={[styles.actionLabel, { color: colors.mutedForeground }]}>Suggested action</Text>
        <Text style={[styles.actionText, { color: colors.foreground }]}>{item.suggestedAction}</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <Pressable
          style={({ pressed }) => [
            styles.btn,
            styles.btnReject,
            { borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={() => onReject(item.id)}
        >
          <Feather name="x" size={14} color={colors.danger} />
          <Text style={[styles.btnText, { color: colors.danger }]}>Reject</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.btn,
            styles.btnApprove,
            { backgroundColor: colors.success, opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={() => onApprove(item.id)}
        >
          <Feather name="check" size={14} color="#FFFFFF" />
          <Text style={[styles.btnTextWhite]}>Approve</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function ReviewScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState(reviewItems);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const handleApprove = (id: string) => {
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setItems((prev) => prev.filter((i) => i.id !== id));
    Alert.alert('Approved', 'Agent will apply the change automatically.');
  };

  const handleReject = (id: string) => {
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setItems((prev) => prev.filter((i) => i.id !== id));
    Alert.alert('Rejected', 'Change has been dismissed from the queue.');
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
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Human Review</Text>
          {items.length > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.warningSoft }]}>
              <Text style={[styles.badgeText, { color: colors.warningForeground }]}>{items.length}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
          Changes requiring your decision
        </Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 16 },
        ]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={items.length > 0}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <ReviewCard item={item} onApprove={handleApprove} onReject={handleReject} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="check-circle" size={40} color={colors.success} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>All clear</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No items awaiting your review
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    fontWeight: '700' as const,
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600' as const,
  },
  headerSub: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  list: { padding: 16, paddingTop: 12 },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  platformFlow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  summary: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: -4,
  },
  reasonBox: {
    flexDirection: 'row',
    gap: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'flex-start',
  },
  reasonText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    flex: 1,
    lineHeight: 16,
  },
  actionBox: {
    padding: 10,
    borderRadius: 8,
    gap: 3,
  },
  actionLabel: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    fontWeight: '500' as const,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    lineHeight: 18,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  btnReject: {
    borderWidth: 1,
  },
  btnApprove: {
    borderWidth: 0,
  },
  btnText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600' as const,
  },
  btnTextWhite: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600' as const,
    marginTop: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
});
