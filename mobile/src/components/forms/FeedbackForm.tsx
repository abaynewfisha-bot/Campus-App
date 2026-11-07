import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { CreateFeedbackInput } from "../../types";
import { FEEDBACK_CATEGORIES } from "../../utils/constants";
import { colors } from "../../theme/colors";
import { fontSizes, fontWeights } from "../../theme/fonts";
import { spacing } from "../../theme/spacing";
import { Button } from "../common/Button";
import { FilterChips } from "../common/FilterChips";
import { Input } from "../common/Input";

interface FeedbackFormProps {
  onSubmit: (input: CreateFeedbackInput) => void;
  submitting?: boolean;
}

export function FeedbackForm({
  onSubmit,
  submitting = false,
}: FeedbackFormProps) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(FEEDBACK_CATEGORIES[0].value);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit() {
    const nextErrors: Record<string, string> = {};

    if (subject.trim().length < 3) {
      nextErrors.subject = "Subject must be at least 3 characters";
    }

    if (description.trim().length < 5) {
      nextErrors.description = "Please provide more detail";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSubmit({
      subject: subject.trim(),
      description: description.trim(),
      category,
    });
  }

  return (
    <View>
      <Input
        label="Subject"
        value={subject}
        onChangeText={setSubject}
        placeholder="e.g. Cafeteria food quality"
        error={errors.subject}
      />
      <Input
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="Tell us what you think or what went wrong"
        multiline
        error={errors.description}
      />
      <Text style={styles.label}>Category</Text>
      <FilterChips
        options={FEEDBACK_CATEGORIES}
        selected={category}
        onSelect={setCategory}
      />
      <Button
        title="Submit feedback"
        onPress={handleSubmit}
        loading={submitting}
        icon="chatbubble-ellipses"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.text,
    marginBottom: spacing.sm,
  },
});
