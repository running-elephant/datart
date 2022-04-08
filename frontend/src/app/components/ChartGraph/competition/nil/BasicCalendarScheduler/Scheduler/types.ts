import { DialogProps, GridSize } from "@mui/material";
import { Locale } from "date-fns";
import { SelectOption } from "./components/inputs/SelectInput";
import { View } from "./components/nav/Navigation";
import { DayProps } from "./views/Day";
import { StateItem } from "./views/Editor";
import { MonthProps } from "./views/Month";
import { WeekProps } from "./views/Week";

export type DayHours =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23;
export interface CellRenderedProps {
  day: Date;
  start: Date;
  end: Date;
  height: number;
  onClick(): void;
}
interface CalendarEvent {
  event_id: number | string;
  title: string;
  start: Date;
  end: Date;
  // description?: string;
}

export type InputTypes = "input" | "date" | "select" | "hidden";
export interface FieldInputProps {
  /** Available to all InputTypes */
  label?: string;
  /** Available to all InputTypes */
  placeholder?: string;
  /** Available to all InputTypes
   * @defaul false
   */
  required?: boolean;
  /** Available to all InputTypes
   * @default "outline"
   */
  variant?: "standard" | "filled" | "outlined";
  /** Available to all InputTypes */
  disabled?: boolean;

  /** Available when @input="text" ONLY - Minimum length */
  min?: number;
  /** Available when @input="text" ONLY - Maximum length */
  max?: number;
  /** Available when @input="text" ONLY - Apply email Regex */
  email?: boolean;
  /** Available when @input="text" ONLY - Only numbers(int/float) allowed */
  decimal?: boolean;
  /** Available when @input="text" ONLY - Allow Multiline input. Use @rows property to set initial rows height */
  multiline?: boolean;
  /** Available when @input="text" ONLY - initial rows height*/
  rows?: number;
  /** Available when @input="date" ONLY
   * @default "datetime"
   */
  type?: "date" | "datetime";
  /** Available when @input="date" ONLY. Picker types
   * @default "inline"
   */
  modalVariant?: "dialog" | "inline" | "static";

  /** Available when @input="select" ONLY - Multi-Select input style.
   * if you use "default" property with this, make sure your "default" property is an instance of Array
   */
  multiple?: "chips" | "default";
  /** Available when @input="select" ONLY - display loading spinner instead of expand arrow */
  loading?: boolean;
  /** Available when @input="select" ONLY - Custom error message */
  errMsg?: string;

  /* Used for Grid alignment in a single row md | sm | xs */
  md?: GridSize;
  /* Used for Grid alignment in a single row md | sm | xs */
  sm?: GridSize;
  /* Used for Grid alignment in a single row md | sm | xs */
  xs?: GridSize;
}
export interface FieldProps {
  name: string;
  type: InputTypes;
  /** Required for type="select" */
  options?: Array<SelectOption>;
  default?: string | number | Date | any;
  config?: FieldInputProps;
}
export type ProcessedEvent = CalendarEvent & Record<string, any>;
export type EventActions = "create" | "edit";
export type DefaultRecourse = {
  assignee?: string | number;
  text?: string;
  subtext?: string;
  avatar?: string;
  color?: string;
} & Record<string, any>;
export type ResourceFields = {
  idField: string;
  textField: string;
  subTextField?: string;
  avatarField?: string;
  colorField?: string;
} & Record<string, string>;

export interface SchedulerHelpers {
  state: Record<string, StateItem>;
  close(): void;
  loading(status: boolean): void;
  edited?: ProcessedEvent;
  onConfirm(event: ProcessedEvent, action: EventActions): void;
}
export interface SchedulerProps {
  /**Min height of table
   * @default 600
   */
  height: number;
  /** Initial view to load */
  view: View;
  /**Month view settings */
  month: MonthProps | null;
  /**Week view settings */
  week: WeekProps | null;
  /**Day view settings */
  day: DayProps | null;
  /**Initial date selected */
  selectedDate: Date;
  /**Events to display */
  events: ProcessedEvent[];
  /**Async function to load remote data */
  remoteEvents?(query: string): Promise<ProcessedEvent[] | void>;
  /**Custom additional fields with it's settings */
  fields: FieldProps[];
  /**Table loading state */
  loading?: boolean;
  /**Async function triggered when add/edit event */
  onConfirm?(
    event: ProcessedEvent,
    action: EventActions
  ): Promise<ProcessedEvent>;
  /**Async function triggered when delete event */
  onDelete?(deletedId: string | number): Promise<string | number | void>;
  /**Override editor modal */
  customEditor?(scheduler: SchedulerHelpers): JSX.Element;
  /**Additional component in event viewer popper */
  viewerExtraComponent?:
    | JSX.Element
    | ((fields: FieldProps[], event: ProcessedEvent) => JSX.Element);
  /**Override viewer title component */
  viewerTitleComponent?(event: ProcessedEvent): JSX.Element;
  /**Resources array to split event views with resources */
  resources: DefaultRecourse[];
  /**Map resources fields */
  resourceFields: ResourceFields;
  /**Override header component of resource */
  recourseHeaderComponent?(resource: DefaultRecourse): JSX.Element;
  /**Resource header view mode
   * @default "default"
   */
  resourceViewMode: "default" | "tabs";
  /**Direction of table */
  direction: "rtl" | "ltr";
  /**Edito dialog maxWith
   * @default "md"
   */
  dialogMaxWidth: DialogProps["maxWidth"];
  /**
   * date-fns Locale object
   */
  locale: Locale;
  /**
   * Triggerd when event is dropped on time slot.
   */
  onEventDrop?(
    droppedOn: Date,
    updatedEvent: ProcessedEvent,
    originalEvent: ProcessedEvent
  ): Promise<ProcessedEvent | void>;
}
export interface Scheduler extends Partial<SchedulerProps> {}
