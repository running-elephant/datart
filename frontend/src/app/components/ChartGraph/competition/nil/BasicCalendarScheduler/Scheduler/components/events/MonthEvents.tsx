import { Typography } from "@mui/material";
import {
  closestTo,
  differenceInDays, endOfDay,
  isAfter, isBefore, isSameDay,
  isWithinInterval, startOfDay, startOfWeek
} from "date-fns";
import { Fragment } from "react";
import {
  MONTH_NUMBER_HEIGHT,
  MULTI_DAY_EVENT_HEIGHT
} from "../../helpers/constants";
import { ProcessedEvent } from "../../types";
import EventItem from "./EventItem";

interface MonthEventProps {
  events: ProcessedEvent[];
  today: Date;
  eachWeekStart: Date[];
  daysList: Date[];
  onViewMore(day: Date): void;
  cellHeight: number;
}

const MonthEvents = ({
  events,
  today,
  eachWeekStart,
  daysList,
  onViewMore,
  cellHeight,
}: MonthEventProps) => {
  const LIMIT = Math.round(
    (cellHeight - MONTH_NUMBER_HEIGHT) / MULTI_DAY_EVENT_HEIGHT - 1
  );
  const eachFirstDayInCalcRow = eachWeekStart.some((date) =>
    isSameDay(date, today)
  )
    ? today
    : null;

  const todayEvents = events
    .filter((e) =>
      eachFirstDayInCalcRow &&
      isWithinInterval(eachFirstDayInCalcRow, {
        start: startOfDay(e.start),
        end: endOfDay(e.end),
      })
        ? true
        : isSameDay(e.start, today)
    )
    .sort((a, b) => b.end.getTime() - a.end.getTime());

  return (
    <Fragment>
      {todayEvents.map((event, i) => {
        const fromPrevWeek =
          !!eachFirstDayInCalcRow &&
          isBefore(event.start, eachFirstDayInCalcRow);
        const start =
          fromPrevWeek && eachFirstDayInCalcRow
            ? eachFirstDayInCalcRow
            : event.start;

        let eventLength = differenceInDays(event.end, start) + 1;
        const toNextWeek = eventLength >= daysList.length;
        if (toNextWeek) {
          // Rethink it
          const NotAccurateWeekStart = startOfWeek(event.start);
          const closestStart = closestTo(NotAccurateWeekStart, eachWeekStart);
          if (closestStart) {
            eventLength =
              daysList.length -
              (!eachFirstDayInCalcRow
                ? differenceInDays(event.start, closestStart)
                : 0);
          }
        }

        const prevNextEvents = events.filter((e) => {
          return (
            !eachFirstDayInCalcRow &&
            e.event_id !== event.event_id &&
            LIMIT > i &&
            isBefore(e.start, startOfDay(today)) &&
            isAfter(e.end, startOfDay(today))
          );
        });
        let index = i;

        if (prevNextEvents.length) {
          index += prevNextEvents.length;
          // if (index > LIMIT) {
          //   index = LIMIT;
          // }
        }
        const topSpace = index * MULTI_DAY_EVENT_HEIGHT + MONTH_NUMBER_HEIGHT;

        return index > LIMIT ? (
          ""
        ) : index === LIMIT ? (
          <Typography
            key={i}
            width="100%"
            className="rs__multi_day rs__hover__op"
            style={{ top: topSpace, fontSize: 11 }}
            onClick={(e) => {
              e.stopPropagation();
              onViewMore(event.start);
            }}
          >
              {
                `(${Math.abs(todayEvents.length - i)}) 查看更多...`
            }
          </Typography>
        ) : (
          <div
            key={i}
            className="rs__multi_day"
            style={{
              top: topSpace,
              width: `${100 * eventLength}%`,
            }}
          >
            <EventItem
              event={event}
              showdate={false}
              multiday={differenceInDays(event.end, event.start) > 0}
              hasPrev={fromPrevWeek}
              hasNext={toNextWeek}
            />
          </div>
        );
      })}
    </Fragment>
  );
};

export default MonthEvents;
