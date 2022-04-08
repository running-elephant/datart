import { useEffect, useCallback, Fragment } from "react";
import { Typography } from "@mui/material";
import {
  format,
  eachMinuteOfInterval,
  isSameDay,
  differenceInDays,
  isToday,
  isWithinInterval,
  setHours,
  setMinutes,
  isBefore,
  isAfter,
  startOfDay,
  endOfDay,
  addDays,
  addMinutes,
} from "date-fns";
import TodayTypo from "../components/common/TodayTypo";
import EventItem from "../components/events/EventItem";
import { useAppState } from "../hooks/useAppState";
import {
  CellRenderedProps,
  DayHours,
  DefaultRecourse,
  ProcessedEvent,
} from "../types";
import {
  calcCellHeight,
  calcMinuteHeight,
  getResourcedEvents,
} from "../helpers/generals";
import { WithResources } from "../components/common/WithResources";
import { Cell } from "../components/common/Cell";
import TodayEvents from "../components/events/TodayEvents";
import { TableGrid } from "../styles/styles";
import { MULTI_DAY_EVENT_HEIGHT } from "../helpers/constants";

export interface DayProps {
  startHour: DayHours;
  endHour: DayHours;
  step: number;
  cellRenderer?(props: CellRenderedProps): JSX.Element;
}

const Day = () => {
  const {
    day,
    selectedDate,
    events,
    height,
    triggerDialog,
    remoteEvents,
    triggerLoading,
    handleState,
    resources,
    resourceFields,
    fields,
    direction,
    locale,
  } = useAppState();
  const { startHour, endHour, step, cellRenderer } = day!;
  const START_TIME = setMinutes(setHours(selectedDate, startHour), 0);
  const END_TIME = setMinutes(setHours(selectedDate, endHour), 0);
  const hours = eachMinuteOfInterval(
    {
      start: START_TIME,
      end: END_TIME,
    },
    { step: step }
  );
  const CELL_HEIGHT = calcCellHeight(height, hours.length);
  const MINUTE_HEIGHT = calcMinuteHeight(CELL_HEIGHT, step);
  const todayEvents = events.sort((b, a) => a.end.getTime() - b.end.getTime());

  const fetchEvents = useCallback(async () => {
    try {
      triggerLoading(true);
      const start = addDays(START_TIME, -1);
      const end = addDays(END_TIME, 1);
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

  const renderMultiDayEvents = (events: ProcessedEvent[]) => {
    const multiDays = events.filter(
      (e) =>
        differenceInDays(e.end, e.start) > 0 &&
        isWithinInterval(selectedDate, {
          start: startOfDay(e.start),
          end: endOfDay(e.end),
        })
    );

    return (
      <div
        className="rs__block_col"
        style={{ height: MULTI_DAY_EVENT_HEIGHT * multiDays.length }}
      >
        {multiDays.map((event, i) => {
          const hasPrev = isBefore(event.start, startOfDay(selectedDate));
          const hasNext = isAfter(event.end, endOfDay(selectedDate));
          return (
            <div
              key={event.event_id}
              className="rs__multi_day"
              style={{
                top: i * MULTI_DAY_EVENT_HEIGHT,
                width: "100%",
              }}
            >
              <EventItem
                event={event}
                multiday
                hasPrev={hasPrev}
                hasNext={hasNext}
              />
            </div>
          );
        })}
      </div>
    );
  };

  const renderTable = (resource?: DefaultRecourse) => {
    let recousedEvents = todayEvents;
    if (resource) {
      recousedEvents = getResourcedEvents(
        todayEvents,
        resource,
        resourceFields,
        fields
      );
    }

    const allWeekMulti = events.filter(
      (e) =>
        differenceInDays(e.end, e.start) > 0 &&
        isWithinInterval(selectedDate, {
          start: startOfDay(e.start),
          end: endOfDay(e.end),
        })
    );
    // Equalizing multi-day section height
    const headerHeight = MULTI_DAY_EVENT_HEIGHT * allWeekMulti.length + 45;
    return (
      <TableGrid days={1}>
        {/* Header */}
        <span className="rs__cell"></span>
        <span
          className={`rs__cell rs__header ${
            isToday(selectedDate) ? "rs__today_cell" : ""
          }`}
          style={{ height: headerHeight }}
        >
          <TodayTypo date={selectedDate} locale={locale} />
          {renderMultiDayEvents(recousedEvents)}
        </span>

        {/* Body */}
        {hours.map((h, i) => {
          const start = new Date(
            `${format(selectedDate, "yyyy MM dd")} ${format(h, "hh:mm a")}`
          );
          const end = new Date(
            `${format(selectedDate, "yyyy MM dd")} ${format(
              addMinutes(h, step),
              "hh:mm a"
            )}`
          );
          const field = resourceFields.idField;

          return (
            <Fragment key={i}>
              {/* Time Cells */}
              <span
                className="rs__cell rs__header rs__time"
                style={{ height: CELL_HEIGHT }}
              >
                <Typography variant="caption">
                  {format(h, "hh:mm a", { locale: locale })}
                </Typography>
              </span>

              <span
                className={`rs__cell ${
                  isToday(selectedDate) ? "rs__today_cell" : ""
                }`}
              >
                {/* Events of this day - run once on the top hour column */}
                {i === 0 && (
                  <TodayEvents
                    todayEvents={recousedEvents.filter(
                      (e) =>
                        !differenceInDays(e.end, e.start) &&
                        isSameDay(selectedDate, e.start)
                    )}
                    today={selectedDate}
                    minuteHeight={MINUTE_HEIGHT}
                    startHour={startHour}
                    step={step}
                    direction={direction}
                  />
                )}
                {/* Cell */}
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
              </span>
            </Fragment>
          );
        })}
      </TableGrid>
    );
  };

  return resources.length ? (
    <WithResources span={2} renderChildren={renderTable} />
  ) : (
    renderTable()
  );
};

export { Day };
