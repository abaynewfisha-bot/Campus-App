import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";
import { fontSizes, fontWeights } from "../../theme/fonts";
import { radius, spacing } from "../../theme/spacing";
import { AppNotification } from "../../types";
import { formatRelative } from "../../utils/formatDate";

interface NotificationItemProps {
  item: AppNotification;
  onPress: (item: AppNotification) => void;
  onDelete: (item: AppNotification) => void;
}

export function NotificationItem({
  item,
  onPress,
  onDelete,
}: NotificationItemProps) {
  return (
    <Pressable
      onPress={() => onPress(item)}
      style={({ pressed }) => [
        styles.card,
        !item.isRead && styles.unread,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.iconBox}>
        <Ionicons
          name={item.isRead ? "notifications-outline" : "notifications"}
          size={20}
          color={item.isRead ? colors.textMuted : colors.primary}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          {!item.isRead ? <View style={styles.dot} /> : null}
        </View>
        <Text style={styles.message} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.time}>{formatRelative(item.createdAt)}</Text>
      </View>
      <Pressable
        onPress={() => onDelete(item)}
        hitSlop={10}
        style={styles.delete}
      >
        <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  unread: {
    borderColor: colors.primary,
    backgroundColor: "#f5f9ff",
  },
  pressed: {
    opacity: 0.7,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    flex: 1,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: spacing.xs,
  },
  message: {
    marginTop: 2,
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
  time: {
    marginTop: spacing.xs,
    fontSize: fontSizes.xs,
    color: colors.textMuted,
  },
  delete: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
});
