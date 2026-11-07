import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";
import { fontSizes, fontWeights } from "../../theme/fonts";
import { radius, spacing } from "../../theme/spacing";
import { Facility } from "../../types";

const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
  library: "library-outline",
  dining: "restaurant-outline",
  health: "medkit-outline",
  laboratory: "flask-outline",
  administration: "business-outline",
  sports: "football-outline",
  general: "location-outline",
};

export function FacilityCategoryCard({ item }: { item: Facility }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/facilities/${item.id}`)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.iconBox}>
        <Ionicons
          name={icons[item.category] ?? icons.general}
          size={24}
          color={colors.primaryDark}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.category}>{item.category.toUpperCase()}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
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
  pressed: {
    opacity: 0.7,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  category: {
    marginTop: 2,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    color: colors.primary,
  },
  description: {
    marginTop: spacing.xs,
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
});
