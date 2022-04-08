import DatePicker from "@mui/lab/DatePicker";
import DateTimePicker from "@mui/lab/DateTimePicker";
import { TextField } from "@mui/material";
import DateProvider from "../hoc/DateProvider";

interface EditorDatePickerProps {
  type: "date" | "datetime";
  label?: string;
  variant?: "standard" | "filled" | "outlined";
  modalVariant?: "dialog" | "inline" | "static";
  value: Date | string;
  name: string;
  onChange(name: string, date: Date): void;
  error?: boolean;
  errMsg?: string;
}

const EditorDatePicker = ({
  type,
  value,
  label,
  name,
  onChange,
  variant,
  modalVariant,
  error,
  errMsg,
}: EditorDatePickerProps) => {
  const Picker = type === "date" ? DatePicker : DateTimePicker;

  return (
    <DateProvider>
      <Picker
        value={value}
        label={label}
        onChange={(e) => onChange(name, new Date(e || ""))}
        // variant={modalVariant}
        minutesStep={5}
        renderInput={(params) => (
          <TextField
            variant={variant}
            helperText={error ? errMsg : ""}
            error={error}
            style={{ width: "100%" }}
            {...params}
          />
        )}
      />
    </DateProvider>
  );
};

EditorDatePicker.defaultProps = {
  type: "datetime",
  variant: "outlined",
  modalVariant: "inline",
};
export { EditorDatePicker };
