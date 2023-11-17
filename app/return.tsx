import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  Button,
  Dimensions,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useCallback, useEffect, useMemo, useState } from "react";
import DateTimePicker from "../components/DateTimePicker";

import { FlatList } from "react-native-gesture-handler";
import VerticalSpace from "../components/VerticleSpace";
import {
  FlightDataItem,
  areDatesOnSameDay,
  flightDateToDate,
  getLocationName,
  useFlightData,
} from "../helpers/flightData";

type ListItemProps = {
  item: FlightDataItem;
  onSelected: (flightId: string) => void;
  selectedId: string | undefined;
};

const ListItem = ({ item, onSelected, selectedId }: ListItemProps) => {
  const {
    FlightId,
    FromAirport,
    FromAirportName,
    ToAirport,
    ToAirportName,
    AirlineName,
    ScheduledTimeFull,
  } = item;

  const date = flightDateToDate(ScheduledTimeFull);

  return (
    <TouchableOpacity onPress={() => onSelected(FlightId)}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: selectedId === FlightId ? "red" : undefined,
        }}
      >
        <Text>{FlightId}</Text>
        <Text>{AirlineName}</Text>
        <Text>
          {FromAirportName} ({FromAirport}) ➡️ {ToAirportName} ({ToAirport})
        </Text>
        <Text>{date.toLocaleString()}</Text>
        <VerticalSpace />
      </View>
    </TouchableOpacity>
  );
};

export default function Page() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const flightData = useFlightData();
  const { from, to, fromDate, fromFlight } = params;

  const [isReturn, setIsReturn] = useState<boolean>(false);
  const [returnDate, setReturnDate] = useState(
    flightDateToDate("202309010840")
  );
  const [returnFlight, setReturnFlight] = useState<undefined | string>();

  const listItems = useMemo(() => {
    return flightData.filter((val) => {
      return (
        val.FromAirport === to &&
        val.ToAirport === from &&
        areDatesOnSameDay(flightDateToDate(val.ScheduledTimeFull), returnDate)
      );
    });
  }, [flightData, from, to, returnDate]);

  const onSelected = useCallback(
    (item: string) => {
      setReturnFlight(item);
    },
    [setReturnFlight]
  );

  useEffect(() => {
    setReturnFlight(undefined)
  },[isReturn, returnDate, setReturnFlight]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Stack.Screen
        options={{
          title: "Return Flight",
        }}
      />
      <VerticalSpace />

      <Text>Return flight</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor="#f5dd4b"
        ios_backgroundColor="#3e3e3e"
        onValueChange={(val) => setIsReturn(val)}
        value={isReturn}
      />
      <VerticalSpace />

      {isReturn && (
        <>
          <Text>Return date</Text>
          <DateTimePicker date={returnDate} setDate={setReturnDate} />
          <VerticalSpace />

          <View style={{ height: 400, width: Dimensions.get("screen").width }}>
            <FlatList
              data={listItems}
              renderItem={(props) => (
                <ListItem
                  {...props}
                  onSelected={onSelected}
                  selectedId={returnFlight}
                />
              )}
            />
          </View>
        </>
      )}

      {Boolean(returnFlight) === isReturn && (
        <Button
          title="Continue"
          onPress={() => {
            router.push({
              pathname: "/itinerary",
              params: {
                from,
                to,
                fromDate,
                fromFlight,
                returnDate: isReturn ? returnDate : undefined,
                returnFlight: isReturn ? returnFlight : undefined,
              },
            });
          }}
        />
      )}
    </View>
  );
}
