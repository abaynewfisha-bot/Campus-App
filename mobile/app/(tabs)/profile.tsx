import { Ionicons } from "@expo/vector-icons";
import { type Href, useRouter } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../src/components/common/Button";
import { useAuth } from "../../src/context/AuthContext";
import { colors } from "../../src/theme/colors";
import { fontSizes, fontWeights } from "../../src/theme/fonts";
import { radius, spacing } from "../../src/theme/spacing";

interface MenuItem {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: Href;
  adminOnly?: boolean;
}

const menuItems: MenuItem[] = [
  { label: "My service requests", icon: "construct-outline", route: "/requests" },
  { label: "My feedback", icon: "chatbubble-ellipses-outline", route: "/feedback" },
  { label: "Notifications", icon: "notifications-outline", route: "/notifications" },
  { label: "Emergency contacts", icon: "call-outline", route: "/emergency-contacts" },
  { label: "Campus map", icon: "map-outline", route: "/map" },
  {
    label: "Admin dashboard",
    icon: "shield-checkmark-outline",
    route: "/admin/dashboard",
    adminOnly: true,
  },
];

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  function confirmLogout() {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: () => {
          void logout();
        },
      },
    ]);
  }

  const items = menuItems.filter(
    (item) => !item.adminOnly || user?.role === "admin",
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user ? initials(user.fullName) : "?"}
            </Text>
          </View>
          <Text style={styles.name}>{user?.fullName ?? "Guest"}</Text>
          <Text style={styles.email}>{user?.email ?? ""}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>
              {(user?.role ?? "student").toUpperCase()}
            </Text>
          </View>
          <Button
            title="Edit profile"
            onPress={() => router.push("/profile/edit")}
            variant="secondary"
            icon="create-outline"
            style={styles.editButton}
          />
        </View>

        <View style={styles.menu}>
          {items.map((item, index) => (
            <Pressable
              key={item.label}
              onPress={() => router.push(item.route)}
              style={({ pressed }) => [
                styles.menuItem,
                index === items.length - 1 && styles.menuItemLast,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name={item.icon} size={22} color={colors.primary} />
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textMuted}
              />
            </Pressable>
          ))}
        </View>

        <Button
          title="Log out"
          onPress={confirmLogout}
          variant="danger"
          icon="log-out-outline"
          style={styles.logout}
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
    paddingBottom: spacing.xxl,
  },
  card: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.white,
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
  },
  name: {
    marginTop: spacing.md,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  email: {
    marginTop: spacing.xs,
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
  roleBadge: {
    marginTop: spacing.md,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  roleText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    color: colors.primaryDark,
  },
  editButton: {
    marginTop: spacing.lg,
    alignSelf: "stretch",
  },
  menu: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  pressed: {
    backgroundColor: colors.surfaceAlt,
  },
  menuLabel: {
    flex: 1,
    marginLeft: spacing.md,
    fontSize: fontSizes.md,
    color: colors.text,
  },
  logout: {
    marginTop: spacing.lg,
  },
});
