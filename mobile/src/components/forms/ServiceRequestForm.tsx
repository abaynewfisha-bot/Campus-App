import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { CreateRequestInput } from "../../types";
import { REQUEST_CATEGORIES } from "../../utils/constants";
import { colors } from "../../theme/colors";
import { fontSizes, fontWeights } from "../../theme/fonts";
import { spacing } from "../../theme/spacing";
import { Button } from "../common/Button";
import { FilterChips } from "../common/FilterChips";
import { Input } from "../common/Input";

interface ServiceRequestFormProps {
  onSubmit: (input: CreateRequestInput) => void;
  submitting?: boolean;
}

export function ServiceRequestForm({
  onSubmit,
  submitting = false,
}: ServiceRequestFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(REQUEST_CATEGORIES[0].value);
  const [location, setLocation] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit() {
    const nextErrors: Record<string, string> = {};

    if (title.trim().length < 3) {
      nextErrors.title = "Title must be at least 3 characters";
    }

    if (description.trim().length < 5) {
      nextErrors.description = "Please describe the request in more detail";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      category,
      location: location.trim() || undefined,
    });
  }

  return (
    <View>
      <Input
        label="Title"
        value={title}
        onChangeText={setTitle}
        placeholder="e.g. Broken chair in Room 204"
        error={errors.title}
      />
      <Input
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="Describe the problem or service you need"
        multiline
        error={errors.description}
      />
      <Text style={styles.label}>Category</Text>
      <FilterChips
        options={REQUEST_CATEGORIES}
        selected={category}
        onSelect={setCategory}
      />
      <Input
        label="Location (optional)"
        value={location}
        onChangeText={setLocation}
        placeholder="e.g. Block B, Room 204"
      />
      <Button
        title="Submit request"
        onPress={handleSubmit}
        loading={submitting}
        icon="send"
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
