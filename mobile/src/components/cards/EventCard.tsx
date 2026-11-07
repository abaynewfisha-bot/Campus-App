import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";
import { fontSizes, fontWeights } from "../../theme/fonts";
import { radius, spacing } from "../../theme/spacing";
import { EventItem } from "../../types";
import { formatDateTime } from "../../utils/formatDate";

export function EventCard({ item }: { item: EventItem }) {
  const router = useRouter();
  const start = new Date(item.startDate);

  return (
    <Pressable
      onPress={() => router.push(`/events/${item.id}`)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.dateBox}>
        <Text style={styles.day}>
          {Number.isNaN(start.getTime()) ? "--" : start.getDate()}
        </Text>
        <Text style={styles.month}>
          {Number.isNaN(start.getTime())
            ? ""
            : start
                .toLocaleString(undefined, { month: "short" })
                .toUpperCase()}
        </Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.row}>
          <Ionicons name="location-outline" size={14} color={colors.textMuted} />
          <Text style={styles.meta} numberOfLines={1}>
            {item.location}
          </Text>
        </View>
        <View style={styles.row}>
          <Ionicons name="time-outline" size={14} color={colors.textMuted} />
          <Text style={styles.meta}>{formatDateTime(item.startDate)}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.7,
  },
  dateBox: {
    width: 54,
    height: 60,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  day: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.primaryDark,
  },
  month: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    color: colors.primaryDark,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  meta: {
    marginLeft: spacing.xs,
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    flex: 1,
  },
});
