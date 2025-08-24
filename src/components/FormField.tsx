import React from 'react';
import {
  TextField,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Box,
  Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';

interface FormFieldProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'select' | 'checkbox' | 'textarea';
  value: any;
  onChange: (name: string, value: any) => void;
  onBlur: (name: string) => void;
  error?: string;
  touched?: boolean;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
  options?: { value: any; label: string }[];
  placeholder?: string;
  helperText?: string;
  inputProps?: any;
  sx?: any;
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  disabled = false,
  fullWidth = true,
  multiline = false,
  rows = 4,
  options = [],
  placeholder,
  helperText,
  inputProps,
  sx
}) => {
  const showError = touched && error;
  const hasError = !!showError;

  const handleChange = (newValue: any) => {
    onChange(name, newValue);
  };

  const handleBlur = () => {
    onBlur(name);
  };

  const renderField = () => {
    switch (type) {
      case 'select':
        return (
          <Select
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            error={hasError}
            disabled={disabled}
            fullWidth={fullWidth}
            inputProps={inputProps}
            sx={sx}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        );

      case 'checkbox':
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={!!value}
                onChange={(e) => handleChange(e.target.checked)}
                onBlur={handleBlur}
                disabled={disabled}
                inputProps={inputProps}
              />
            }
            label={label}
            sx={sx}
          />
        );

      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
            <DatePicker
              value={value || null}
              onChange={(newValue) => handleChange(newValue)}
              onBlur={handleBlur}
              disabled={disabled}
              slotProps={{
                textField: {
                  fullWidth,
                  error: hasError,
                  helperText: showError || helperText,
                  inputProps: inputProps,
                  sx: sx
                }
              }}
            />
          </LocalizationProvider>
        );

      case 'textarea':
        return (
          <TextField
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            error={hasError}
            disabled={disabled}
            fullWidth={fullWidth}
            multiline
            rows={rows}
            placeholder={placeholder}
            helperText={showError || helperText}
            inputProps={inputProps}
            sx={sx}
          />
        );

      default:
        return (
          <TextField
            type={type}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            error={hasError}
            disabled={disabled}
            fullWidth={fullWidth}
            multiline={multiline}
            rows={multiline ? rows : undefined}
            placeholder={placeholder}
            helperText={showError || helperText}
            inputProps={inputProps}
            sx={sx}
          />
        );
    }
  };

  if (type === 'checkbox') {
    return (
      <Box sx={{ mb: 2 }}>
        {renderField()}
        {showError && (
          <FormHelperText error sx={{ ml: 0 }}>
            {error}
          </FormHelperText>
        )}
      </Box>
    );
  }

  if (type === 'date') {
    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          {label} {required && '*'}
        </Typography>
        {renderField()}
      </Box>
    );
  }

  return (
    <FormControl fullWidth={fullWidth} error={hasError} sx={{ mb: 2 }}>
      {type === 'select' && (
        <InputLabel id={`${name}-label`}>
          {label} {required && '*'}
        </InputLabel>
      )}
      
      {type !== 'select' && type !== 'date' && (
        <TextField
          label={`${label} ${required ? '*' : ''}`}
          {...(type === 'select' ? {} : { label: `${label} ${required ? '*' : ''}` })}
        />
      )}
      
      {renderField()}
      
      {type === 'select' && showError && (
        <FormHelperText>{error}</FormHelperText>
      )}
    </FormControl>
  );
};
