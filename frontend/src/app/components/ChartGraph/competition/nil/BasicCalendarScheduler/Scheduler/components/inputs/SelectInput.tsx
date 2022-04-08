import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Checkbox,
  Chip,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useTheme
} from '@mui/material';
import { useEffect, useState } from 'react';

export type SelectOption = {
  id: string | number;
  text: string | any;
  value: any;
};
interface EditorSelectProps {
  options: Array<SelectOption>;
  value: string;
  name: string;
  onChange(name: string, value: string, isValid: boolean): void;
  variant?: 'standard' | 'filled' | 'outlined';
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  touched?: boolean;
  loading?: boolean;
  multiple?: 'default' | 'chips';
  errMsg?: string;
}

const EditorSelect = ({
  options,
  value,
  name,
  required,
  onChange,
  label,
  disabled,
  touched,
  variant,
  loading,
  multiple,
  placeholder,
  errMsg,
}: EditorSelectProps) => {
  const theme = useTheme();
  const [state, setState] = useState({
    touched: false,
    valid: !!value,
    errorMsg: errMsg ? errMsg : required ? 'Required' : undefined,
  });

  useEffect(() => {
    if (touched) {
      handleChange(value);
    }
    // eslint-disable-next-line
  }, [touched]);
  const handleTouched = () => {
    if (!state.touched) {
      setState(prev => {
        return { ...prev, touched: true, errorMsg: errMsg || prev.errorMsg };
      });
    }
  };
  const handleChange = (value: string | any) => {
    let val = value;
    let isValid = true;
    let errorMsg = errMsg;
    if (required && (multiple ? !val.length : !val)) {
      isValid = false;
      errorMsg = errMsg;
    }
    setState(prev => {
      return { ...prev, touched: true, valid: isValid, errorMsg: errorMsg };
    });
    onChange(name, val, isValid);
  };
  return (
    <>
      <FormControl
        variant={variant || 'outlined'}
        fullWidth
        error={required && state.touched && !state.valid}
        // style={{ minWidth: 230 }}
        disabled={disabled}
      >
        {label && (
          <InputLabel id={`input_${name}`}>
            <Typography variant="body2">{`${label} ${
              required ? '*' : ''
            }`}</Typography>
          </InputLabel>
        )}
        <Select
          label={label}
          labelId={`input_${name}`}
          value={value}
          onBlur={handleTouched}
          onChange={e => handleChange(e.target.value)}
          IconComponent={
            loading ? () => <CircularProgress size={5} /> : ExpandMoreIcon
          }
          multiple={!!multiple}
          classes={{
            select: multiple === 'chips' ? 'flex__wrap' : undefined,
          }}
          renderValue={(selected: string | Array<any> | any) => {
            if (!selected || selected.length === 0) {
              return <em>{label}</em>;
            }
            let text: any[] = [];
            if (multiple) {
              for (const opt of options) {
                if (selected.includes(opt.value)) {
                  text.push([opt.text]);
                }
              }
              if (multiple === 'chips') {
                return text.map((t, i) => (
                  <Chip
                    key={`${t}_${i}`}
                    label={t}
                    style={{ margin: '0 2px' }}
                    color="primary"
                  />
                ));
              } else {
                return text.join(',');
              }
            } else {
              for (const opt of options) {
                if (selected === opt.value) text.push([opt.text]);
              }
              return text.join(',');
            }
          }}
        >
          {placeholder && (
            <MenuItem value="">
              <em>{placeholder}</em>
            </MenuItem>
          )}
          {options.map(op => (
            <MenuItem value={op.value} key={op.id || op.value}>
              {multiple && (
                <Checkbox
                  checked={value.indexOf(op.value) > -1}
                  color="primary"
                />
              )}
              {op.text}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormHelperText style={{ color: theme.palette.error.main }}>
        {state.touched && !state.valid && state.errorMsg}
      </FormHelperText>
    </>
  );
};

EditorSelect.defaultProps = {
  variant: 'outlined',
};

export { EditorSelect };
