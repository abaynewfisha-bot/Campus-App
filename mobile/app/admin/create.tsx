import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../src/components/common/Button";
import { EmptyState } from "../../src/components/common/EmptyState";
import { FilterChips } from "../../src/components/common/FilterChips";
import { Header } from "../../src/components/common/Header";
import { Input } from "../../src/components/common/Input";
import { useAuth } from "../../src/context/AuthContext";
import { announcementService } from "../../src/services/announcementService";
import { getErrorMessage } from "../../src/services/apiClient";
import { eventService } from "../../src/services/eventService";
import { colors } from "../../src/theme/colors";
import { fontSizes, fontWeights } from "../../src/theme/fonts";
import { spacing } from "../../src/theme/spacing";
import {
  ANNOUNCEMENT_CATEGORIES,
  EVENT_CATEGORIES,
} from "../../src/utils/constants";

type Kind = "announcement" | "event";

const kindOptions = [
  { label: "Announcement", value: "announcement" },
  { label: "Event", value: "event" },
];

function parseDateInput(value: string): string | null {
  const normalized = value.trim().replace(" ", "T");
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export default function AdminCreateScreen() {
  const params = useLocalSearchParams<{ type?: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [kind, setKind] = useState<Kind>(
    params.type === "event" ? "event" : "announcement",
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState(
    ANNOUNCEMENT_CATEGORIES[1]?.value ?? "general",
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (user?.role !== "admin") {
    return (
      <SafeAreaView style={styles.safe}>
        <Header title="Create content" showBack />
        <EmptyState
          title="Admin access required"
          message="Only administrators can publish announcements and events."
          icon="lock-closed-outline"
        />
      </SafeAreaView>
    );
  }

  const categories = (
    kind === "announcement" ? ANNOUNCEMENT_CATEGORIES : EVENT_CATEGORIES
  ).slice(1);

  function handleKindChange(next: string) {
    const value = next as Kind;
    setKind(value);
    setCategory(
      (value === "announcement"
        ? ANNOUNCEMENT_CATEGORIES
        : EVENT_CATEGORIES)[1]?.value ?? "general",
    );
    setErrors({});
  }

  async function handleSubmit() {
    const nextErrors: Record<string, string> = {};

    if (title.trim().length < 3) {
      nextErrors.title = "Title must be at least 3 characters";
    }

    if (description.trim().length < 5) {
      nextErrors.description = "Please add a longer description";
    }

    let startIso = "";
    let endIso = "";

    if (kind === "event") {
      if (!location.trim()) {
        nextErrors.location = "Location is required";
      }

      startIso = parseDateInput(startDate) ?? "";
      endIso = parseDateInput(endDate) ?? "";

      if (!startIso) {
        nextErrors.startDate = "Use a valid date, e.g. 2026-12-01 09:00";
      }

      if (!endIso) {
        nextErrors.endDate = "Use a valid date, e.g. 2026-12-01 11:00";
      }

      if (startIso && endIso && new Date(endIso) <= new Date(startIso)) {
        nextErrors.endDate = "End date must be after the start date";
      }
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      if (kind === "announcement") {
        await announcementService.create({
          title: title.trim(),
          description: description.trim(),
          category,
        });
      } else {
        await eventService.create({
          title: title.trim(),
          description: description.trim(),
          location: location.trim(),
          category,
          startDate: startIso,
          endDate: endIso,
        });
      }

      Alert.alert("Published", `${kind === "event" ? "Event" : "Announcement"} created.`);
      router.back();
    } catch (submitError) {
      Alert.alert("Could not publish", getErrorMessage(submitError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="Create content" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Type</Text>
        <FilterChips
          options={kindOptions}
          selected={kind}
          onSelect={handleKindChange}
        />

        <Input
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder={
            kind === "event" ? "e.g. Tech Innovation Fair" : "e.g. Exam schedule update"
          }
          error={errors.title}
        />
        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Write the details students need to know"
          multiline
          error={errors.description}
        />

        {kind === "event" ? (
          <Input
            label="Location"
            value={location}
            onChangeText={setLocation}
            placeholder="e.g. Main Auditorium"
            error={errors.location}
          />
        ) : null}

        <Text style={styles.label}>Category</Text>
        <FilterChips
          options={categories}
          selected={category}
          onSelect={setCategory}
        />

        {kind === "event" ? (
          <View style={styles.dates}>
            <Input
              label="Start date & time"
              value={startDate}
              onChangeText={setStartDate}
              placeholder="2026-12-01 09:00"
              error={errors.startDate}
            />
            <Input
              label="End date & time"
              value={endDate}
              onChangeText={setEndDate}
              placeholder="2026-12-01 11:00"
              error={errors.endDate}
            />
          </View>
        ) : null}

        <Button
          title={kind === "event" ? "Publish event" : "Publish announcement"}
          onPress={() => void handleSubmit()}
          loading={submitting}
          icon="cloud-upload-outline"
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
  label: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  dates: {
    marginTop: spacing.sm,
  },
});
