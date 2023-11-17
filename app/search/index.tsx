import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Button, Dimensions, Switch, Text, TouchableOpacity, View } from "react-native";

import flightData from "../../flight-data.json";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DateTimePicker from "../../components/DateTimePicker";

import { FlatList } from "react-native-gesture-handler";

function areDatesOnSameDay(date1: Date, date2: Date) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function flightDateToDate(dateString: string) {
  // ScheduledTimeFull contains no timezone info, assume same as client
  // format 202309010840 = YYYYMMDDHHmm therefore
  // use locale date functions
  const year = parseInt(dateString.substring(0, 4), 10);
  const month = parseInt(dateString.substring(4, 6), 10) - 1; // Months are 0-indexed in JavaScript
  const day = parseInt(dateString.substring(6, 8), 10);
  const hours = parseInt(dateString.substring(8, 10), 10);
  const minutes = parseInt(dateString.substring(10, 12), 10);

  return new Date(year, month, day, hours, minutes);
}

function dateToFlightDate(date: Date) {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed in JavaScript
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return year + month + day + hours + minutes;
}

function getLocationName(locationKey: String) {
  const toAirportName = flightData.find(
    (val) => val.ToAirport === locationKey
  )?.ToAirportName;

  if (toAirportName) return toAirportName;

  const fromAirportName = flightData.find(
    (val) => val.FromAirport === locationKey
  )?.FromAirportName;

  if (fromAirportName) return fromAirportName;

  return undefined;
}

const VerticalSpace = () => <View style={{ height: 20 }} />;

type ListItemProps = {
  item: (typeof flightData)[0];
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
  let { from, to } = params;

  const [fromDate, setFromDate] = useState(flightDateToDate("202309010840"));
  const [tillDate, setTillDate] = useState(flightDateToDate("202309010840"));
  const [isReturn, setIsReturn] = useState<boolean>(false);
  const [selectedFlight, setSelectedFlight] = useState<undefined | string>();

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
      setSelectedFlight(item);
    },
    [setSelectedFlight]
  );

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Stack.Screen
        options={{
          title: "Search flights",
        }}
      />
      <Button
        title="pick departure"
        onPress={() => {
          router.push({
            pathname: "search/pick-location",
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
            pathname: "search/pick-location",
            params: { from, to, pickerDirection: "to" },
          });
        }}
      />
      <Text>to {getLocationName(to as string)}</Text>
      <VerticalSpace />

      <Text>Departure date</Text>
      <DateTimePicker date={fromDate} setDate={setFromDate} />
      <VerticalSpace />

      <Text>Return flight</Text>
      <Switch
        trackColor={{false: '#767577', true: '#81b0ff'}}
        thumbColor='#f5dd4b'
        ios_backgroundColor="#3e3e3e"
        onValueChange={(val) => setIsReturn(val)}
        value={isReturn}
      />
      <VerticalSpace />

      <Text>Return date</Text>
      <DateTimePicker date={tillDate} setDate={setTillDate} />
      <VerticalSpace />

      <View style={{ height: 400, width: Dimensions.get("screen").width }}>
        <FlatList
          data={listItems}
          renderItem={(props) => (
            <ListItem
              {...props}
              onSelected={onSelected}
              selectedId={selectedFlight}
            />
          )}
        />
      </View>
    </View>
  );
}
