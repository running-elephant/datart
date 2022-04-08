import { AppState } from "./context/state/State";
import { defaultProps } from "./context/state/stateContext";
import { SchedulerComponent } from "./SchedulerComponent";
import { Scheduler as SchedulerProps } from "./types";

const Scheduler = (props: SchedulerProps) => {
  return (
    <AppState initial={props}>
      <SchedulerComponent />
    </AppState>
  );
};

Scheduler.defaultProps = defaultProps;

export { Scheduler };
