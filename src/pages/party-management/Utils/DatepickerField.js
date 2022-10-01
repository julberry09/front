import Datepicker from "react-datepicker";
import * as React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
const DatepickerField = ({
  field,
  form,
  ...props
}) => (
  // OR const { setFieldValue } = form;
  // OR const { value, name } = field;

    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
      //dateFormat="dd/MM/yyyy"
      renderInput={(props) => <TextField {...props} />}
      {...field}
      selected={field.value}
      onChange={(val) => form.setFieldValue(field.name, val)}
    />
    </LocalizationProvider>

);
export default DatepickerField;
