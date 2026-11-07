import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ErrorState } from "../src/components/common/ErrorState";
import { Header } from "../src/components/common/Header";
import { Loader } from "../src/components/common/Loader";
import { CampusMap } from "../src/components/map/CampusMap";
import { getCurrentCoords, type Coords } from "../src/device/location";
import { getErrorMessage } from "../src/services/apiClient";
import { facilityService } from "../src/services/facilityService";
import { colors } from "../src/theme/colors";
import { fontSizes, fontWeights } from "../src/theme/fonts";
import { radius, spacing } from "../src/theme/spacing";
import { Facility } from "../src/types";

export default function MapScreen() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [coords, setCoords] = useState<Coords | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);

  const loadFacilities = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await facilityService.list({ limit: 100 });
      setFacilities(result.data);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

  const locate = useCallback(async () => {
    setLocationMessage(null);

    try {
      const current = await getCurrentCoords();

      if (current) {
        setCoords(current);
      } else {
        setLocationMessage(
          "Location permission denied. You can still browse campus facilities.",
        );
      }
    } catch (locationError) {
      setLocationMessage(getErrorMessage(locationError));
    }
  }, []);

  useEffect(() => {
    void loadFacilities();
    void locate();
  }, [loadFacilities, locate]);

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="Campus map" subtitle="Find your way around" showBack />

      {loading ? (
        <Loader message="Loading campus map..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadFacilities} />
      ) : (
        <View style={styles.mapWrapper}>
          <CampusMap facilities={facilities} userCoords={coords} />

          {locationMessage ? (
            <View style={styles.banner}>
              <Ionicons
                name="information-circle"
                size={18}
                color={colors.white}
              />
              <Text style={styles.bannerText}>{locationMessage}</Text>
            </View>
          ) : null}

          <Pressable style={styles.locateButton} onPress={() => void locate()}>
            <Ionicons name="locate" size={22} color={colors.white} />
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapWrapper: {
    flex: 1,
  },
  banner: {
    position: "absolute",
    top: spacing.md,
    left: spacing.md,
    right: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryDark,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  bannerText: {
    marginLeft: spacing.sm,
    color: colors.white,
    fontSize: fontSizes.xs,
    flex: 1,
  },
  locateButton: {
    position: "absolute",
    right: spacing.lg,
    bottom: spacing.xl,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
