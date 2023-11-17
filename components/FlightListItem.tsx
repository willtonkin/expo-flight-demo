import { Text, TouchableOpacity, View } from "react-native";

import React from "react";

import VerticalSpace from "./VerticleSpace";
import { FlightDataItem, flightDateToDate } from "../helpers/flightData";

export type ListItemProps = {
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

export default ListItem;
