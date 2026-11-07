import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../src/theme/colors";
import { fontSizes, fontWeights } from "../src/theme/fonts";
import { spacing } from "../src/theme/spacing";

export default function NotFoundScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.code}>404</Text>
        <Text style={styles.title}>This screen doesn't exist.</Text>
        <Text style={styles.message}>
          The page you are looking for may have moved or is no longer
          available.
        </Text>
        <Link href="/" style={styles.link}>
          Go to home screen
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  code: {
    fontSize: 64,
    fontWeight: fontWeights.bold,
    color: colors.primary,
  },
  title: {
    marginTop: spacing.md,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.text,
    textAlign: "center",
  },
  message: {
    marginTop: spacing.sm,
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    textAlign: "center",
  },
  link: {
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.white,
    backgroundColor: colors.primary,
    borderRadius: 12,
    overflow: "hidden",
  },
});
