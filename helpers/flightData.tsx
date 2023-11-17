import flightData from "./flight-data.json";
import { useMemo } from "react";

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

const useFlightData = (): FlightData => {
    return useMemo(() => flightData, [flightData]);
}

export type FlightData = FlightDataItem[];

export type FlightDataItem = (typeof flightData)[0];

export {
    useFlightData,
    getLocationName,
    dateToFlightDate,
    flightDateToDate,
    areDatesOnSameDay
}