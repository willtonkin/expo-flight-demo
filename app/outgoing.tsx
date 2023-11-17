import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Button, Dimensions, Text, View } from "react-native";

import { useCallback, useEffect, useMemo, useState } from "react";
import DateTimePicker from "../components/DateTimePicker";

import { FlatList } from "react-native-gesture-handler";
import VerticalSpace from "../components/VerticleSpace";
import {
  areDatesOnSameDay,
  flightDateToDate,
  getLocationName,
  useFlightData,
} from "../helpers/flightData";
import FlightListItem from "../components/FlightListItem";

export default function Page() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const flightData = useFlightData();
  let { from, to } = params;

  const [fromDate, setFromDate] = useState(flightDateToDate("202309010840"));
  const [fromFlight, setFromFlight] = useState<undefined | string>();

  const listItems = useMemo(() => {
    return flightData.filter((val) => {
      return (
        val.FromAirport === from &&
        val.ToAirport === to &&
        areDatesOnSameDay(flightDateToDate(val.ScheduledTimeFull), fromDate)
      );
    });
  }, [flightData, from, to, fromDate]);

  const onSelected = useCallback(
    (item: string) => {
      setFromFlight(item);
    },
    [setFromFlight]
  );

  useEffect(() => {
    setFromFlight(undefined)
  },[fromDate, setFromFlight]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Stack.Screen
        options={{
          title: "Outgoing Flight",
        }}
      />
      <VerticalSpace />

      <Text>
        from {getLocationName(from as string)} to{" "}
        {getLocationName(to as string)}
      </Text>
      <VerticalSpace />

      <Text>Departure date</Text>
      <DateTimePicker date={fromDate} setDate={setFromDate} />
      <VerticalSpace />

      <View style={{ height: 400, width: Dimensions.get("screen").width }}>
        <FlatList
          data={listItems}
          renderItem={(props) => (
            <FlightListItem
              {...props}
              onSelected={onSelected}
              selectedId={fromFlight}
            />
          )}
        />
      </View>

      {fromFlight && (
        <Button
          title="Continue"
          onPress={() => {
            router.push({
              pathname: "/return",
              params: { from, to, fromDate, fromFlight },
            });
          }}
        />
      )}
    </View>
  );
}
