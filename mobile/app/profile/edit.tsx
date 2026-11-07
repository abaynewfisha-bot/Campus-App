import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../src/components/common/Button";
import { Header } from "../../src/components/common/Header";
import { Input } from "../../src/components/common/Input";
import { useAuth } from "../../src/context/AuthContext";
import { getErrorMessage } from "../../src/services/apiClient";
import { colors } from "../../src/theme/colors";
import { fontSizes } from "../../src/theme/fonts";
import { spacing } from "../../src/theme/spacing";
import { isEmail, validatePassword } from "../../src/utils/validators";

export default function EditProfileScreen() {
  const { user, updateProfile } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSave() {
    if (fullName.trim().length < 2) {
      setError("Enter your full name");
      return;
    }

    if (!isEmail(email)) {
      setError("Enter a valid email address");
      return;
    }

    if (password.length > 0) {
      const passwordError = validatePassword(password);

      if (passwordError) {
        setError(passwordError);
        return;
      }
    }

    setSubmitting(true);
    setError(null);

    try {
      await updateProfile({
        fullName: fullName.trim(),
        email: email.trim(),
        ...(password.length > 0 ? { password } : {}),
      });
      router.back();
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="Edit profile" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <Input
          label="Full name"
          value={fullName}
          onChangeText={setFullName}
          placeholder="Your full name"
        />
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@campus.edu"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          label="New password (optional)"
          value={password}
          onChangeText={setPassword}
          placeholder="Leave blank to keep current password"
          secureTextEntry
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button
          title="Save changes"
          onPress={handleSave}
          loading={submitting}
          icon="save-outline"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  error: {
    color: colors.danger,
    fontSize: fontSizes.sm,
    marginBottom: spacing.md,
  },
});
