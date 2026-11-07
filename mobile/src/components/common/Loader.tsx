import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";
import { fontSizes } from "../../theme/fonts";
import { spacing } from "../../theme/spacing";

export function Loader({ message = "Loading..." }: { message?: string }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  message: {
    marginTop: spacing.md,
    color: colors.textMuted,
    fontSize: fontSizes.sm,
  },
});
