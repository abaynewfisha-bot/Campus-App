import { StyleSheet } from "react-native";
import { Marker } from "react-native-maps";
import { colors } from "../../theme/colors";
import { Facility } from "../../types";

interface FacilityMarkerProps {
  facility: Facility;
  onPress?: (facility: Facility) => void;
}

export function FacilityMarker({ facility, onPress }: FacilityMarkerProps) {
  return (
    <Marker
      coordinate={{
        latitude: Number(facility.latitude),
        longitude: Number(facility.longitude),
      }}
      title={facility.name}
      description={facility.description}
      pinColor={colors.primary}
      onCalloutPress={() => onPress?.(facility)}
    />
  );
}

export const markerStyles = StyleSheet.create({});
