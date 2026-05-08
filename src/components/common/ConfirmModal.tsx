import React from "react";
import { Modal, View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { Card } from "./Card";
import { Text } from "./Text";
import { Button } from "./Button";

interface Props {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
  confirmDisabled?: boolean;
  children?: React.ReactNode;
}

export const ConfirmModal: React.FC<Props> = ({
  visible,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isDestructive = false,
  confirmDisabled = false,
  children,
}) => {
  const { colors, spacing } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.content}>
              <Card level={4} style={styles.card}>
                <Text variant="titleLg" style={{ marginBottom: spacing.sm }}>
                  {title}
                </Text>
                <Text 
                  variant="bodyMd" 
                  style={{ color: colors.onSurfaceVariant, marginBottom: spacing.xl }}
                >
                  {message}
                </Text>
                {children}
                <View style={[styles.actions, { marginTop: children ? spacing.xl : 0 }]}>
                  <Button 
                    title={cancelLabel} 
                    onPress={onCancel} 
                    variant="ghost" 
                    style={{ flex: 1, marginRight: spacing.md }}
                  />
                  <Button 
                    title={confirmLabel} 
                    onPress={onConfirm} 
                    variant={isDestructive ? "error" : "primary"} 
                    style={{ flex: 1 }}
                    disabled={confirmDisabled}
                  />
                </View>
              </Card>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  content: {
    width: "100%",
    maxWidth: 400,
  },
  card: {
    width: "100%",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
