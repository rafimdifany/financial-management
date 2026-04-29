import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../hooks/useTheme";
import { Text } from "../common/Text";
import { StatusBadge } from "../common/StatusBadge";
import { useDashboardStore } from "../../stores/useDashboardStore";
import { formatDate } from "../../utils/formatDate";
import { Task } from "../../types/task";
import { Ionicons } from "@expo/vector-icons";

const TaskItem = ({ item }: { item: Task }) => {
  const { colors, spacing, radius } = useTheme();

  return (
    <View 
      style={[
        styles.item, 
        { 
          marginBottom: spacing.sm, 
          backgroundColor: colors.surfaceContainerLow,
          padding: spacing.md,
          borderRadius: radius.md,
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
  const { colors, spacing } = useTheme();
  const navigation = useNavigation<any>();
  const { pendingTasks } = useDashboardStore();

  if (pendingTasks.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, { paddingHorizontal: spacing.base, marginVertical: spacing.base }]}>
      <View style={[styles.header, { marginBottom: spacing.base }]}>
        <Text variant="headlineSm" style={{ color: colors.onSurface }}>Pending Tasks</Text>
        <Pressable onPress={() => navigation.navigate("TasksTab")}>
          <Text variant="labelMd" style={{ color: colors.primary }}>See All</Text>
        </Pressable>
      </View>

      {pendingTasks.slice(0, 3).map((item) => (
        <TaskItem key={item.id} item={item} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
