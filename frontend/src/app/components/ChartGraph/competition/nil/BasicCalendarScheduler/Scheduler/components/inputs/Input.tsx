import { TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface EditorInputProps {
  variant?: "standard" | "filled" | "outlined";
  label?: string;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
  email?: boolean;
  decimal?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  value: string;
  name: string;
  onChange(name: string, value: string, isValid: boolean): void;
  touched?: boolean;
  errMsg?: string;
}

const EditorInput = ({
  variant,
  label,
  placeholder,
  value,
  name,
  required,
  min,
  max,
  email,
  decimal,
  onChange,
  disabled,
  multiline,
  rows,
  touched,
  errMsg,
}: EditorInputProps) => {
  const [state, setState] = useState({
    touched: false,
    valid: false,
    errorMsg: errMsg,
  });

  useEffect(() => {
    if (touched) {
      handleChange(value);
    }
    // eslint-disable-next-line
  }, [touched]);
  const handleChange = (value: string) => {
    let val = value;
    let isValid = true;
    let errorMsg = "";
    if (email) {
      const reg =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      isValid = reg.test(val) && isValid;
      errorMsg = "Invalid Email";
    }
    if (decimal) {
      const reg = /^[0-9]+(\.[0-9]*)?$/;
      isValid = reg.test(val) && isValid;
      errorMsg = "Only Numbers Allowed";
    }
    if (min && `${val}`.trim().length < min) {
      isValid = false;
      errorMsg = `Minimum ${min} letters`;
    }
    if (max && `${val}`.trim().length > max) {
      isValid = false;
      errorMsg = `Maximum ${max} letters`;
    }
    if (required && `${val}`.trim().length <= 0) {
      isValid = false;
      errorMsg = "Required";
    }
    setState({ touched: true, valid: isValid, errorMsg: errMsg ? errMsg :errorMsg });
    onChange(name, val, isValid);
  };

  return (
    <TextField
      variant={variant}
      label={
        label && (
          <Typography variant="body2">{`${label} ${
            required ? "*" : ""
          }`}</Typography>
        )
      }
      value={value}
      name={name}
      onChange={(e) => handleChange(e.target.value)}
      disabled={disabled}
      error={state.touched && !state.valid}
      helperText={state.touched && !state.valid && state.errorMsg}
      multiline={multiline}
      rows={rows}
      style={{ width: "100%" }}
      InputProps={{
        placeholder: placeholder || "",
      }}
    />
  );
};

EditorInput.defaultProps = {
  variant: "outlined",
};
export { EditorInput };
