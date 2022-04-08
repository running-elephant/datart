import { Avatar, Typography, useTheme } from "@mui/material";
import {
  addDays,
  eachWeekOfInterval, endOfMonth, format,
  isSameMonth,
  isToday,
  setHours, startOfMonth
} from "date-fns";
import { Fragment, useCallback, useEffect } from "react";
import { Cell } from "../components/common/Cell";
import { WithResources } from "../components/common/WithResources";
import MonthEvents from "../components/events/MonthEvents";
import { getResourcedEvents } from "../helpers/generals";
import { useAppState } from "../hooks/useAppState";
import { TableGrid } from "../styles/styles";
import { CellRenderedProps, DayHours, DefaultRecourse } from "../types";

export type WeekDays = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export interface MonthProps {
  weekDays: WeekDays[];
  weekStartOn: WeekDays;
  startHour: DayHours;
  endHour: DayHours;
  cellRenderer?(props: CellRenderedProps): JSX.Element;
}

const Month = () => {
  const {
    month,
    selectedDate,
    height,
    events,
    handleGotoDay,
    remoteEvents,
    triggerLoading,
    triggerDialog,
    handleState,
    resources,
    resourceFields,
    fields,
    locale
  } = useAppState();

  const { weekStartOn, weekDays, startHour, endHour, cellRenderer } = month!;
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const eachWeekStart = eachWeekOfInterval(
    {
      start: monthStart,
      end: monthEnd,
    },
    { weekStartsOn: weekStartOn }
  );
  const daysList = weekDays.map((d) => addDays(eachWeekStart[0], d));
  const CELL_HEIGHT = height / eachWeekStart.length;
  const theme = useTheme();

  const fetchEvents = useCallback(async () => {
    try {
      triggerLoading(true);
      const start = eachWeekStart[0];
      const end = addDays(
        eachWeekStart[eachWeekStart.length - 1],
        daysList.length
      );
      const query = `?start=${start}&end=${end}`;
      const events = await remoteEvents!(query);
      if (events && events?.length) {
        handleState(events, "events");
      }
    } catch (error) {
      throw error;
    } finally {
      triggerLoading(false);
    }
    // eslint-disable-next-line
  }, [selectedDate]);

  useEffect(() => {
    if (remoteEvents instanceof Function) {
      fetchEvents();
    }
    // eslint-disable-next-line
  }, [fetchEvents]);

  const renderCells = (resource?: DefaultRecourse) => {
    let recousedEvents = events;
    if (resource) {
      recousedEvents = getResourcedEvents(
        events,
        resource,
        resourceFields,
        fields
      );
    }
    const rows: JSX.Element[] = [];

    for (const startDay of eachWeekStart) {
      const cells = weekDays.map((d) => {
        const today = addDays(startDay, d);
        const start = new Date(
          `${format(setHours(today, startHour), "yyyy MM dd hh:mm a")}`
        );
        const end = new Date(
          `${format(setHours(today, endHour), "yyyy MM dd hh:mm a")}`
        );
        const field = resourceFields.idField;
        return (
          <span
            style={{ height: CELL_HEIGHT }}
            key={d.toString()}
            className="rs__cell"
          >
            {cellRenderer ? (
              cellRenderer({
                day: selectedDate,
                start,
                end,
                height: CELL_HEIGHT,
                onClick: () =>
                  triggerDialog(true, {
                    start,
                    end,
                    [field]: resource ? resource[field] : null,
                  }),
                [field]: resource ? resource[field] : null,
              })
            ) : (
              <Cell
                start={start}
                end={end}
                resourceKey={field}
                resourceVal={resource ? resource[field] : null}
              />
            )}

            <Fragment>
              <Avatar
                style={{
                  width: 27,
                  height: 27,
                  position: "absolute",
                  top: 0,
                  background: isToday(today)
                    ? theme.palette.secondary.main
                    : "transparent",
                  color: isToday(today)
                    ? theme.palette.secondary.contrastText
                    : "",
                  marginBottom: 2,
                }}
              >
                <Typography
                  color={
                    !isSameMonth(today, monthStart) ? "#ccc" : "textPrimary"
                  }
                  className="rs__hover__op"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGotoDay(today);
                  }}
                >
                  {format(today, "dd")}
                </Typography>
              </Avatar>
              <MonthEvents
                events={recousedEvents}
                today={today}
                eachWeekStart={eachWeekStart}
                daysList={daysList}
                onViewMore={handleGotoDay}
                cellHeight={CELL_HEIGHT}
              />
            </Fragment>
          </span>
        );
      });

      rows.push(<Fragment key={startDay.toString()}>{cells}</Fragment>);
    }
    return rows;
  };

  const renderTable = (resource?: DefaultRecourse) => {
    return (
      <TableGrid days={daysList.length} indent="0">
        {/* Header Days */}
        {daysList.map((date, i) => (
          <span key={i} className="rs__cell rs__header">
            <Typography align="center" variant="body2">
              {format(date, "EE", { locale})}
            </Typography>
          </span>
        ))}

        {renderCells(resource)}
      </TableGrid>
    );
  };

  return resources.length ? (
    <WithResources renderChildren={renderTable} />
  ) : (
    renderTable()
  );
};

export { Month };
