import { TextField } from '@mui/material'

export default function Input({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  error = false,
  helperText,
  multiline = false,
  rows = 3,
  fullWidth = true,
  disabled = false,
  InputProps,
  inputProps,
  sx = {},
  ...props
}) {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      required={required}
      error={error}
      helperText={helperText}
      multiline={multiline}
      rows={rows}
      fullWidth={fullWidth}
      disabled={disabled}
      InputProps={InputProps}
      inputProps={inputProps}
      variant="outlined"
      sx={{
        '& .MuiOutlinedInput-root': {
          '&:hover fieldset': {
            borderColor: 'primary.main'
          },
          '&.Mui-focused fieldset': {
            borderColor: 'primary.main',
            borderWidth: 2
          }
        },
        ...sx
      }}
      {...props}
    />
  )
}