import DatePicker from "@mui/lab/DatePicker";
import { Button } from "@mui/material";
import { addDays, endOfWeek, format, startOfWeek } from "date-fns";
import { useState } from "react";
import { useAppState } from "../../hooks/useAppState";
import { WeekProps } from "../../views/Week";
import { LocaleArrow } from "../common/LocaleArrow";
import DateProvider from "../hoc/DateProvider";

interface WeekDateBtnProps {
  selectedDate: Date;
  onChange(value: Date, key: "selectedDate"): void;
  weekProps: WeekProps;
}

const WeekDateBtn = ({
  selectedDate,
  onChange,
  weekProps,
}: WeekDateBtnProps) => {
  const { locale } = useAppState();
  const [open, setOpen] = useState(false);
  const { weekStartOn } = weekProps;
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: weekStartOn });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: weekStartOn });

  const toggleDialog = () => setOpen(!open);

  const handleChange = (e: Date | null, k?: string) => {
    onChange(e || new Date(), "selectedDate");
  };

  const handlePrev = () => {
    const ladtDayPrevWeek = addDays(weekStart, -1);
    onChange(ladtDayPrevWeek, "selectedDate");
  };
  const handleNext = () => {
    const firstDayNextWeek = addDays(weekEnd, 1);
    onChange(firstDayNextWeek, "selectedDate");
  };
  return (
    <div>
      <LocaleArrow type="prev" onClick={handlePrev} />
      <DateProvider>
        <DatePicker
          open={open}
          onClose={toggleDialog}
          openTo="day"
          views={["month", "day"]}
          value={selectedDate}
          onChange={handleChange}
          renderInput={(params) => (
            <Button
              ref={params.inputRef}
              style={{ padding: 4 }}
              onClick={toggleDialog}
            >{`${format(
              weekEnd,
              "yyyy/MM/dd",
              {
                locale: locale,
              }
            )}`}</Button>
          )}
        />
      </DateProvider>
      <LocaleArrow type="next" onClick={handleNext} />
    </div>
  );
};

export { WeekDateBtn };
