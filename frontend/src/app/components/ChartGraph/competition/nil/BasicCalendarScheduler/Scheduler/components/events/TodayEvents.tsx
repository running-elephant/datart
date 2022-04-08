import { differenceInMinutes, setHours } from "date-fns";
import { Fragment } from "react";
import { BORDER_HEIGHT } from "../../helpers/constants";
import { traversCrossingEvents } from "../../helpers/generals";
import { ProcessedEvent } from "../../types";
import EventItem from "./EventItem";

interface TodayEventsProps {
  todayEvents: ProcessedEvent[];
  today: Date;
  startHour: number;
  step: number;
  minuteHeight: number;
  direction: "rtl" | "ltr";
}
const TodayEvents = ({
  todayEvents,
  today,
  startHour,
  step,
  minuteHeight,
  direction,
}: TodayEventsProps) => {
  const crossingIds: Array<number | string> = [];

  return (
    <Fragment>
      {todayEvents.map((event, i) => {
        const height =
          differenceInMinutes(event.end, event.start) * minuteHeight;
        const minituesFromTop = differenceInMinutes(
          event.start,
          setHours(today, startHour)
        );
        const topSpace = minituesFromTop * minuteHeight; //+ headerHeight;
        /**
         * Add border height since grid has a 1px border
         */
        const slotsFromTop = minituesFromTop / step;

        const borderFactor = slotsFromTop + BORDER_HEIGHT;
        const top = topSpace + borderFactor;

        const crossingEvents = traversCrossingEvents(todayEvents, event);
        const alreadyRendered = crossingEvents.filter((e) =>
          crossingIds.includes(e.event_id)
        );
        crossingIds.push(event.event_id);
        console.log(i)
        return (
          <div
            key={event.event_id}
            className="rs__event__item"
            style={{
              height,
              top,
              width: crossingEvents.length
                ? `${100 / (crossingEvents.length + 1)}%`
                : "95%", //Leave some space to click cell
              [direction === "rtl" ? "right" : "left"]:
                alreadyRendered.length > 0
                  ? `${100 / (crossingEvents.length + 1) * i}%`
                  : "",
            }}
          >
            <EventItem event={event} />
          </div>
        );
      })}
    </Fragment>
  );
};

export default TodayEvents;
