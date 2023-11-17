import { Picker } from "@react-native-picker/picker";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

import flightData from "../../flight-data.json";
import { useMemo, useState } from "react";

function isDirection(test: any): test is "to" | "from" {
  return typeof test === "string" && ["from", "to"].includes(test);
}

export default function Page() {
  const router = useRouter();
  const params = useLocalSearchParams();
  let { from, to, pickerDirection } = params;

  if (!isDirection(pickerDirection)) {
    pickerDirection = "from";
  }

  const [country, setCountry] = useState(pickerDirection === "from" ? from : to);

  const locations = useMemo(() => {
    return flightData.reduce<{ [key: string]: string }>((acc, item) => {
      acc[item.ToAirport] = item.ToAirportName;
      return acc;
    }, {});
  }, [flightData]);


  const directionString = { from: "departure", to: "arrival" }[pickerDirection];

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Stack.Screen
        options={{
          title: `Pick ${directionString} location`,
        }}
      />
      <Text>Pick your {directionString} location</Text>

      <Picker
        selectedValue={country}
        onValueChange={(value, index) => setCountry(value)}
        mode="dropdown" // Android only
        style={{ width: 300 }}
      >
        <Picker.Item label="Please select your country" value="Unknown" />
        {Object.keys(locations).map((key) => (
          <Picker.Item label={locations[key]} value={key} key={key} />
        ))}
      </Picker>

      <Button
        title="select"
        onPress={() => {
          router.push({
            pathname: "search",
            params: {
              ...params,
              [pickerDirection as string]: country,
              pickerDirection: undefined,
            },
          });
        }}
      />
    </View>
  );
}
