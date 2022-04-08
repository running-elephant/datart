import { addMinutes, differenceInMinutes, isEqual } from 'date-fns';
import { ReactChild, useEffect, useReducer } from 'react';
import {
  arraytizeFieldVal,
  getAvailableViews,
  getOneView
} from '../../helpers/generals';
import { EventActions, ProcessedEvent, SchedulerProps } from '../../types';
import {
  defaultProps,
  SchedulerState,
  SelectedRange,
  StateContext
} from './stateContext';
import { stateReducer } from './stateReducer';

interface AppProps {
  children: ReactChild;
  initial: Partial<SchedulerProps>;
}

const initialState = (initial: Partial<SchedulerProps>): SchedulerState => {
  const initialView =
    initial.view && initial[initial.view] ? initial.view : getOneView(initial);
  return {
    ...initial,
    view: initialView,
    dialog: false,
    mounted: false,
    selectedRange: undefined,
    fields: [...defaultProps.fields, ...(initial.fields || [])],
  } as SchedulerState;
};

const AppState = ({ initial, children }: AppProps) => {
  const {
    events,
    resources,
    resourceViewMode,
    resourceFields,
    month,
    week,
    day,
    fields,
    locale,
    direction,
    loading,
    onEventDrop,
  } = initial;
  const [state, dispatch] = useReducer(stateReducer, initialState(initial));

  const handleState = (
    value: SchedulerState[keyof SchedulerState],
    name: keyof SchedulerState,
  ) => {
    dispatch({ type: 'set', payload: { name, value } });
  };

  const updateProps = (updatedProps: any) => {
    console.log('updatedProps', updatedProps);
    dispatch({ type: 'updateProps', payload: updatedProps });
  };
  useEffect(() => {
    if (state.mounted) {
      updateProps({
        events,
        resources,
        resourceViewMode,
        resourceFields,
        month,
        week,
        day,
        fields,
        locale,
        direction,
        loading,
      });
    } else {
      handleState(true, 'mounted');
    }
    //eslint-disable-next-line
  }, [
    events,
    resources,
    resourceViewMode,
    month,
    week,
    day,
    fields,
    locale,
    direction,
    loading,
  ]);

  const confirmEvent = (event: ProcessedEvent, action: EventActions) => {
    let updatedEvents: ProcessedEvent[];
    if (action === 'edit') {
      updatedEvents = state.events.map(e =>
        e.event_id === event.event_id ? event : e,
      );
    } else {
      console.log(state, event);
      updatedEvents = [...state.events, event];
    }
    handleState(updatedEvents, 'events');
  };

  const getViews = () => getAvailableViews(state);

  const triggerDialog = (
    status: boolean | undefined,
    selected: SelectedRange | ProcessedEvent,
  ) => {
    dispatch({ type: 'triggerDialog', payload: { status, selected } });
  };
  const triggerLoading = (status: boolean) => {
    // Trigger if not out-sourced by props
    if (typeof loading === 'undefined') {
      dispatch({ type: 'triggerLoading', payload: status });
    }
  };
  const handleGotoDay = (day: Date) => {
    const views = getViews();
    if (views.includes('day')) {
      handleState('day', 'view');
      handleState(day, 'selectedDate');
    } else if (views.includes('week')) {
      handleState('week', 'view');
      handleState(day, 'selectedDate');
    } else {
      console.warn('No Day/Week views available');
    }
  };
  const onDrop = async (
    eventId: string,
    startTime: Date,
    resKey: string,
    resVal: string | number,
  ) => {
    // Get dropped event
    const droppedEvent = state.events.find(e => {
      if (typeof e.event_id === 'number') {
        return e.event_id === +eventId;
      }
      return e.event_id === eventId;
    }) as ProcessedEvent;

    // Check if has resource and if is multiple
    const resField = state.fields.find(f => f.name === resKey);
    const isMultiple = !!resField?.config?.multiple;
    let newResource = resVal as string | number | string[] | number[];
    if (resField) {
      const eResource = droppedEvent[resKey];
      const currentRes = arraytizeFieldVal(
        resField,
        eResource,
        droppedEvent,
      ).value;
      if (isMultiple) {
        // if dropped on already owned resource
        if (currentRes.includes(resVal)) {
          // Omit if dropped on same time slot for multiple event
          if (isEqual(droppedEvent.start, startTime)) {
            return;
          }
          newResource = currentRes;
        } else {
          // if have multiple resource ? add other : move to other
          newResource =
            currentRes.length > 1 ? [...currentRes, resVal] : [resVal];
        }
      }
    }

    // Omit if dropped on same time slot for non multiple events
    if (isEqual(droppedEvent.start, startTime)) {
      if (
        !newResource ||
        (!isMultiple && newResource === droppedEvent[resKey])
      ) {
        return;
      }
    }

    // Update event time according to original duration & update resources/owners
    const diff = differenceInMinutes(droppedEvent.end, droppedEvent.start);
    const updatedEvent: ProcessedEvent = {
      ...droppedEvent,
      start: startTime,
      end: addMinutes(startTime, diff),
      [resKey]: newResource || '',
    };

    // Local
    if (!onEventDrop || typeof onEventDrop !== 'function') {
      return confirmEvent(updatedEvent, 'edit');
    }
    // Remote
    try {
      triggerLoading(true);
      const _event = await onEventDrop(startTime, updatedEvent, droppedEvent);
      if (_event) {
        confirmEvent(_event, 'edit');
      }
    } finally {
      triggerLoading(false);
    }
  };

  return (
    <StateContext.Provider
      value={{
        ...state,
        handleState,
        getViews,
        triggerDialog,
        triggerLoading,
        handleGotoDay,
        confirmEvent,
        onDrop,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export { AppState };
