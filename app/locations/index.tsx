import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  Button,
  Text,
  View,
} from "react-native";

import VerticalSpace from "../../components/VerticleSpace";
import { getLocationName } from "../../helpers/flightData";


export default function Page() {
  const router = useRouter();
  const params = useLocalSearchParams();
  let { from, to } = params;

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Stack.Screen
        options={{
          title: "Search flights",
        }}
      />
      <VerticalSpace />

      <Button
        title="pick departure"
        onPress={() => {
          router.push({
            pathname: "locations/picker",
            params: { from, to, pickerDirection: "from" },
          });
        }}
      />
      <Text>from {getLocationName(from as string)}</Text>
      <VerticalSpace />

      <Button
        title="pick arrival"
        onPress={() => {
          router.push({
            pathname: "locations/picker",
            params: { from, to, pickerDirection: "to" },
          });
        }}
      />
      <Text>to {getLocationName(to as string)}</Text>
      <VerticalSpace />

      <Button
        title="Continue"
        onPress={() => {
          router.push({
            pathname: "/outgoing",
            params: { from, to },
          });
        }}
      />
    </View>
  );
}
