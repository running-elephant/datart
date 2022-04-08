import { Typography } from '@mui/material';
import {
  addDays,
  addMinutes,
  differenceInDays,
  eachMinuteOfInterval,
  endOfDay,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isToday,
  isWithinInterval,
  setHours,
  setMinutes,
  startOfDay,
  startOfWeek
} from 'date-fns';
import { Fragment, useCallback, useEffect } from 'react';
import { Cell } from '../components/common/Cell';
import TodayTypo from '../components/common/TodayTypo';
import { WithResources } from '../components/common/WithResources';
import EventItem from '../components/events/EventItem';
import TodayEvents from '../components/events/TodayEvents';
import { MULTI_DAY_EVENT_HEIGHT } from '../helpers/constants';
import {
  calcCellHeight,
  calcMinuteHeight,
  getResourcedEvents
} from '../helpers/generals';
import { useAppState } from '../hooks/useAppState';
import { TableGrid } from '../styles/styles';
import {
  CellRenderedProps,
  DayHours,
  DefaultRecourse,
  ProcessedEvent
} from '../types';
import { WeekDays } from './Month';

export interface WeekProps {
  weekDays: WeekDays[];
  weekStartOn: WeekDays;
  startHour: DayHours;
  endHour: DayHours;
  step: number;
  cellRenderer?(props: CellRenderedProps): JSX.Element;
}

const Week = () => {
  const {
    week,
    selectedDate,
    height,
    events,
    triggerDialog,
    handleGotoDay,
    remoteEvents,
    triggerLoading,
    handleState,
    resources,
    resourceFields,
    fields,
    direction,
    locale,
  } = useAppState();

  const { weekStartOn, weekDays, startHour, endHour, step, cellRenderer } =
    week!;
  const _weekStart = startOfWeek(selectedDate, { weekStartsOn: weekStartOn });
  const daysList = weekDays.map(d => addDays(_weekStart, d));
  const weekStart = startOfDay(daysList[0]);
  const weekEnd = endOfDay(daysList[daysList.length - 1]);
  const START_TIME = setMinutes(setHours(selectedDate, startHour), 0);
  const END_TIME = setMinutes(setHours(selectedDate, endHour), 0);
  const hours = eachMinuteOfInterval(
    {
      start: START_TIME,
      end: END_TIME,
    },
    { step: step },
  );
  const CELL_HEIGHT = calcCellHeight(height, hours.length);
  const MINUTE_HEIGHT = calcMinuteHeight(CELL_HEIGHT, step);
  const MULTI_SPACE = MULTI_DAY_EVENT_HEIGHT;

  const fetchEvents = useCallback(async () => {
    try {
      triggerLoading(true);
      const query = `?start=${weekStart}&end=${weekEnd}`;
      const events = await remoteEvents!(query);
      if (Array.isArray(events)) {
        handleState(events, 'events');
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

  const renderMultiDayEvents = (events: ProcessedEvent[], today: Date) => {
    const isFirstDayInWeek = isSameDay(weekStart, today);
    const allWeekMulti = events.filter(
      e =>
        differenceInDays(e.end, e.start) > 0 &&
        daysList.some(weekday =>
          isWithinInterval(weekday, {
            start: startOfDay(e.start),
            end: endOfDay(e.end),
          }),
        ),
    );

    const multiDays = allWeekMulti
      .filter(e =>
        isBefore(e.start, weekStart)
          ? isFirstDayInWeek
          : isSameDay(e.start, today),
      )
      .sort((a, b) => b.end.getTime() - a.end.getTime());
    return multiDays.map((event, i) => {
      const hasPrev = isBefore(startOfDay(event.start), weekStart);
      const hasNext = isAfter(endOfDay(event.end), weekEnd);
      const eventLength =
        differenceInDays(
          hasNext ? weekEnd : event.end,
          hasPrev ? weekStart : event.start,
        ) + 1;
      const prevNextEvents = events.filter(e =>
        isFirstDayInWeek
          ? false
          : e.event_id !== event.event_id && //Exclude it's self
            isWithinInterval(today, { start: e.start, end: e.end }),
      );

      let index = i;
      if (prevNextEvents.length) {
        index += prevNextEvents.length;
      }

      return (
        <div
          key={event.event_id}
          className="rs__multi_day"
          style={{
            top: index * MULTI_SPACE + 45,
            width: `${100 * eventLength}%`,
          }}
        >
          <EventItem
            event={event}
            hasPrev={hasPrev}
            hasNext={hasNext}
            multiday
          />
        </div>
      );
    });
  };

  const renderTable = (resource?: DefaultRecourse) => {
    let recousedEvents = events;
    if (resource) {
      recousedEvents = getResourcedEvents(
        events,
        resource,
        resourceFields,
        fields,
      );
    }
    const allWeekMulti = events.filter(
      e =>
        differenceInDays(e.end, e.start) > 0 &&
        daysList.some(weekday =>
          isWithinInterval(weekday, {
            start: startOfDay(e.start),
            end: endOfDay(e.end),
          }),
        ),
    );
    // Equalizing multi-day section height
    const headerHeight = MULTI_SPACE * allWeekMulti.length + 45;
    return (
      <TableGrid days={daysList.length}>
        {/* Header days */}
        <span className="rs__cell"></span>
        {daysList.map((date, i) => (
          <span
            key={i}
            className={`rs__cell rs__header ${
              isToday(date) ? 'rs__today_cell' : ''
            }`}
            style={{ height: headerHeight }}
          >
            <TodayTypo date={date} onClick={handleGotoDay} locale={locale} />
            {renderMultiDayEvents(recousedEvents, date)}
          </span>
        ))}

        {/* Time Cells */}
        {hours.map((h, i) => (
          <Fragment key={i}>
            <span
              style={{ height: CELL_HEIGHT }}
              className="rs__cell rs__header rs__time"
            >
              <Typography variant="caption">
                {format(h, 'hh:mm a', { locale: locale })}
              </Typography>
            </span>
            {daysList.map((date, ii) => {
              const start = new Date(
                `${format(date, 'yyyy MM dd')} ${format(h, 'hh:mm a')}`,
              );
              const end = new Date(
                `${format(date, 'yyyy MM dd')} ${format(
                  addMinutes(h, step),
                  'hh:mm a',
                )}`,
              );
              const field = resourceFields.idField;
              return (
                <span
                  key={ii}
                  className={`rs__cell ${
                    isToday(date) ? 'rs__today_cell' : ''
                  }`}
                >
                  {/* Events of each day - run once on the top hour column */}
                  {i === 0 && (
                    <TodayEvents
                      todayEvents={recousedEvents
                        .filter(
                          e =>
                            isSameDay(date, e.start) &&
                            !differenceInDays(e.end, e.start),
                        )
                        .sort((a, b) => a.end.getTime() - b.end.getTime())}
                      today={date}
                      minuteHeight={MINUTE_HEIGHT}
                      startHour={startHour}
                      step={step}
                      direction={direction}
                    />
                  )}
                  {cellRenderer ? (
                    cellRenderer({
                      day: date,
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
              );
            })}
          </Fragment>
        ))}
      </TableGrid>
    );
  };
  return resources.length ? (
    <WithResources renderChildren={renderTable} />
  ) : (
    renderTable()
  );
};

export { Week };
