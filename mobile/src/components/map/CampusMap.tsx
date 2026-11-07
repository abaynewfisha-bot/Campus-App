import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { colors } from "../../theme/colors";
import { Facility } from "../../types";
import { CAMPUS_REGION } from "../../utils/constants";
import { Coords } from "../../device/location";
import { FacilityMarker } from "./FacilityMarker";

interface CampusMapProps {
  facilities: Facility[];
  userCoords: Coords | null;
  onSelectFacility?: (facility: Facility) => void;
}

export function CampusMap({
  facilities,
  userCoords,
  onSelectFacility,
}: CampusMapProps) {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={CAMPUS_REGION}
        showsUserLocation={Boolean(userCoords)}
        showsMyLocationButton={Boolean(userCoords)}
      >
        {facilities.map((facility) => (
          <FacilityMarker
            key={facility.id}
            facility={facility}
            onPress={onSelectFacility}
          />
        ))}
        {userCoords ? (
          <Marker
            coordinate={userCoords}
            title="You are here"
            pinColor={colors.danger}
          />
        ) : null}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
});
