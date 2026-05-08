import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../hooks/useTheme";
import { Text } from "../common/Text";
import { StatusBadge } from "../common/StatusBadge";
import { useDashboardStore } from "../../stores/useDashboardStore";
import { formatDate } from "../../utils/formatDate";
import { Task } from "../../types/task";
import { Ionicons } from "@expo/vector-icons";
import { Surface } from "../common/Surface";
import { SectionHeader } from "../common/SectionHeader";

const TaskItem = ({ item }: { item: Task }) => {
  const { colors, spacing } = useTheme();

  return (
    <View 
      style={[
        styles.item, 
        { 
          paddingVertical: spacing.md,
        }
      ]}
    >
      <View style={styles.itemContent}>
        <Text variant="titleSm" style={{ color: colors.onSurface, marginBottom: 4 }} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.itemFooter}>
          <StatusBadge status={item.status} />
          {item.due_date && (
            <View style={styles.dueDate}>
              <Ionicons name="calendar-outline" size={14} color={colors.onSurfaceVariant} />
              <Text variant="labelSm" style={{ color: colors.onSurfaceVariant }}>
                {formatDate(item.due_date)}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export const PendingTasks = () => {
  const { colors, spacing, radius } = useTheme();
  const navigation = useNavigation<any>();
  const { pendingTasks } = useDashboardStore();


  return (
    <View style={styles.container}>
      <View style={{ marginBottom: spacing.base }}>
        <SectionHeader
          title="Tugas Pending"
          caption="Hal finansial yang perlu ditindaklanjuti."
          actionLabel="Lihat"
          onActionPress={() => navigation.navigate("TasksTab")}
        />
      </View>

      <View>
        <Surface level={1} style={[styles.listPanel, { borderRadius: radius.lg, paddingHorizontal: spacing.base }]}>
          {pendingTasks.length > 0 ? (
            pendingTasks.slice(0, 3).map((item, index) => (
              <View
                key={item.id}
                style={[
                  index > 0 && {
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderTopColor: colors.outlineVariant,
                  },
                ]}
              >
                <TaskItem item={item} />
              </View>
            ))
          ) : (
            <View style={{ paddingVertical: spacing.xl, alignItems: 'center' }}>
              <Text variant="bodyMd" style={{ color: colors.onSurfaceVariant }}>Tidak ada tugas pending</Text>
            </View>
          )}
        </Surface>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  listPanel: {
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemContent: {
    flex: 1,
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  dueDate: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
