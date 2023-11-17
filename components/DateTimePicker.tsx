import { Button, Platform } from "react-native";

import RNDateTimePicker, {
  DateTimePickerEvent,
  DateTimePickerAndroid as RNDateTimePickerAndroid,
} from "@react-native-community/datetimepicker";

type DateTimePickerProps = {
  date: Date;
  setDate: (date: Date) => void;
};

const DateTimePickerAndroid = ({ date, setDate }: DateTimePickerProps) => {
  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const showMode = () => {
    RNDateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: "date",
      is24Hour: true,
    });
  };

  return <Button onPress={showMode} title={date.toLocaleString()} />;
};

const DateTimePicker = (props: DateTimePickerProps) => {
  const { date, setDate } = props;

  if (Platform.OS === "android") {
    return <DateTimePickerAndroid {...props} />;
  }

  const onChange = (event: DateTimePickerEvent, date?: Date) => {
    if (typeof date === "undefined") {
      return;
    }

    setDate(date);
  };

  return <RNDateTimePicker mode="date" onChange={onChange} value={date} />;
};

export default DateTimePicker;
