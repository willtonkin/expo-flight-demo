import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  Text,
  View,
} from "react-native";

import { useMemo, } from "react";

import VerticalSpace from "../components/VerticleSpace";

import { getLocationName } from "../helpers/flightData";

export default function Page() {
  const params = useLocalSearchParams();
  let { from, to, fromDate, fromFlight, returnDate, returnFlight } = params;

  const fromName = useMemo(() => typeof from === "string" ? getLocationName(from) : "", [from]);
  const toName = useMemo(() => typeof to === "string" ? getLocationName(to) : "", [to]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Stack.Screen
        options={{
          title: "Flight Itinerary",
        }}
      />
      <VerticalSpace />

      <Text>{toName} ({to})</Text>
      <Text>{fromName} ({from})</Text>


      <Text>Departure flight</Text>
      <Text>{fromDate?.toLocaleString()}</Text>
      <Text>{fromFlight}</Text>
      <VerticalSpace />
      
      <Text>Return flight</Text>
      <Text>{returnDate?.toLocaleString()}</Text>
      <Text>{returnFlight}</Text>


    </View>
  );
}
