import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';
import Slide from '@mui/material/Slide';
import Grid from '@mui/material/Grid';
import { Chip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Select, MenuItem, ListItemText, RadioGroup, Radio, FormControlLabel, Checkbox, Switch, FormHelperText } from '@mui/material';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TransitionProps } from '@mui/material/transitions';
import '../form/form.css';

export interface Field {
  id: string;
  name: string;
  label: string;
  type: string;
  value?: any;
  required?: boolean;
  gridSize?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => void;
  options?: { name: string; id: string }[];
  multiple?: boolean;
  validationMessage?: string;
  disabled?: boolean;
  minLength?: number;
  maxLength?: number;
}

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  fields: Field[];
  contentText?: string;
  onSubmit: (formData: any) => void;
  handleClose: () => void;
  width?: string;
  submitDisabled?: boolean;
  submitText?: string;
  cancelText?: string;
}

const StyledDialog = styled(Dialog)<{ width?: string }>(({ width }) => ({
  '& .MuiPaper-root': {
    minWidth: width || '700px',
    margin: '0 auto',
    position: 'absolute',
    top: '50px',
    left: '50%',
    transform: 'translateX(-50%)',
  },
}));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SuperscriptAsterisk = styled('span')`
  color: red;
  font-size: 0.75rem;
  vertical-align: super;
`;

const FormModal: React.FC<Props> = ({ open, setOpen, title, fields, contentText, onSubmit, handleClose, width, submitDisabled, submitText, cancelText }) => {
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateFields = (fields: Field[]): Record<string, string> => {
    const errors: Record<string, string> = {};

    fields.forEach(field => {
      if (field.required && (field.type !== 'file' ? !field.value : field.value === null)) {
        errors[field.name] = `${field.label} is required`;
      }

      if (field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        errors[field.name] = 'Invalid email address';
      }

      if (field.type === 'number' && field.value) {
        const value = Number(field.value);
        if (isNaN(value)) {
          errors[field.name] = 'Invalid number';
        } else {
          if (field.minLength && field.value.toString().length < field.minLength) {
            errors[field.name] = `${field.label} must be at least ${field.minLength} digits`;
          }
          if (field.maxLength && field.value.toString().length > field.maxLength) {
            errors[field.name] = `${field.label} must be at most ${field.maxLength} digits`;
          }
        }
      }

      if (field.type === 'text' && field.value) {
        if (field.minLength && field.value.length < field.minLength) {
          errors[field.name] = `${field.label} must be at least ${field.minLength} characters`;
        }
        if (field.maxLength && field.value.length > field.maxLength) {
          errors[field.name] = `${field.label} must be at most ${field.maxLength} characters`;
        }
      }
    });

    return errors;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateFields(fields);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    onSubmit(formJson);
    handleClose();
  };


  const getValidationMessage = (field: Field) => {
    return field.validationMessage || `${field.label} is required`;
  };

  // const handleDelete = (field: Field, value: string) => {
  //   const newValue = (field.value as string[]).filter((v) => v !== value);
  //   field.onChange?.({ target: { name: field.name, value: newValue } } as any);
  // };

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit,
        noValidate: true,
      }}
      width={width}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{contentText}</DialogContentText>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={2}>
            {fields.map(field => (
              <Grid item xs={field.gridSize || 12} key={field.id}>
                {field.type === 'text' || field.type === 'email' || field.type === 'number' ? (
                  <TextField
                    autoFocus={field.id === fields[0].id}
                    margin="dense"
                    id={field.id}
                    name={field.name}
                    label={<>{field.label} {field.required && <SuperscriptAsterisk>*</SuperscriptAsterisk>}</>}
                    type={field.type}
                    value={field.value}
                    onChange={field.onChange}
                    fullWidth
                    error={!!errors[field.name]}
                    helperText={errors[field.name] || getValidationMessage(field)}
                    disabled={field.disabled}
                  />
                ) : field.type === 'file' ? (
                  <TextField
                    autoFocus={field.id === fields[0].id}
                    margin="dense"
                    id={field.id}
                    name={field.name}
                    label={<>{field.label} {field.required && <SuperscriptAsterisk>*</SuperscriptAsterisk>}</>}
                    type="file"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors[field.name]}
                    helperText={errors[field.name] || getValidationMessage(field)}
                    disabled={field.disabled}
                    onChange={field.onChange} // Ensure this is correctly passed and used
                  />
                ) : field.type === 'date' ? (
                  <DatePicker
                    label={<span style={{ position: 'relative', top: '4px' }}>{field.label} {field.required && <SuperscriptAsterisk>*</SuperscriptAsterisk>}</span>}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(newValue) => field.onChange?.({ target: { name: field.name, value: newValue?.toISOString() || '' } } as any)}
                    disabled={field.disabled}
                  />
                ) : field.type === 'time' ? (
                  <TimePicker
                    label={<>{field.label} {field.required && <SuperscriptAsterisk>*</SuperscriptAsterisk>}</>}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(newValue) => field.onChange?.({ target: { name: field.name, value: newValue?.toISOString() || '' } } as any)}
                    disabled={field.disabled}
                  />
                ) : field.type === 'select' ? (
                  <FormControl fullWidth error={!!errors[field.name]}>
                    <InputLabel id={field.label}>
                      {field.label} {field.required && <SuperscriptAsterisk>*</SuperscriptAsterisk>}
                    </InputLabel>
                    <Select
                      labelId={field.label}
                      label={field.label}
                      name={field.name}
                      value={field.value}
                      onChange={(e) => field.onChange?.({ target: { name: field.name, value: e.target.value as string } } as any)}
                      error={!!errors[field.name]}
                      disabled={field.disabled}
                    >
                      {field.options?.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{errors[field.name] || getValidationMessage(field)}</FormHelperText>
                  </FormControl>
                ) : field.type === 'multiselect' ? (
                  <FormControl fullWidth error={!!errors[field.name]}>
                    <InputLabel id={field.label}>
                      {field.label} {field.required && <SuperscriptAsterisk>*</SuperscriptAsterisk>}
                    </InputLabel>
                    <Select
                      multiple
                      value={Array.isArray(field.value) ? field.value : []}
                      onChange={(e) => field.onChange?.({ target: { name: field.name, value: e.target.value as string[] } } as any)}
                      renderValue={(selected) => (
                        <div>
                          {selected.map((value: string) => (
                            <Chip
                              key={value}
                              label={field.options?.find((option) => option.id === value)?.name}
                            />
                          ))}
                        </div>
                      )}
                      error={!!errors[field.name]}
                      disabled={field.disabled}
                    >
                      {field.options?.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          <Checkbox checked={(field.value as string[]).includes(option.id)} />
                          <ListItemText primary={option.name} />
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{errors[field.name] || getValidationMessage(field)}</FormHelperText>
                  </FormControl>
                ) : field.type === 'radio' ? (
                  <FormControl component="fieldset" fullWidth error={!!errors[field.name]}>
                    <RadioGroup
                      name={field.name}
                      value={field.value}
                      onChange={(e) => field.onChange?.({ target: { name: field.name, value: e.target.value } } as any)}
                    >
                      {field.options?.map((option) => (
                        <FormControlLabel
                          key={option.id}
                          control={
                            <Radio
                              disabled={field.disabled}
                            />
                          }
                          label={option.name}
                          value={option.id}
                          disabled={field.disabled}
                        />
                      ))}
                    </RadioGroup>
                    <FormHelperText>{errors[field.name] || getValidationMessage(field)}</FormHelperText>
                  </FormControl>
                ) : field.type === 'checkbox' ? (
                  <FormControl component="fieldset" fullWidth error={!!errors[field.name]}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value || false}
                          onChange={(e) => field.onChange?.({ target: { name: field.name, value: e.target.checked } } as any)}
                          disabled={field.disabled}
                        />
                      }
                      label={field.label}
                    />
                    <FormHelperText>{errors[field.name] || getValidationMessage(field)}</FormHelperText>
                  </FormControl>
                ) : field.type === 'switch' ? (
                  <FormControl component="fieldset" fullWidth error={!!errors[field.name]}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value || false}
                          onChange={(e) => field.onChange?.({ target: { name: field.name, value: e.target.checked } } as any)}
                          disabled={field.disabled}
                        />
                      }
                      label={field.label}
                    />
                    <FormHelperText>{errors[field.name] || getValidationMessage(field)}</FormHelperText>
                  </FormControl>
                ) : null}
              </Grid>
            ))}
          </Grid>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{cancelText || 'Cancel'}</Button>
        <Button type="submit" disabled={submitDisabled}>{submitText || 'Submit'}</Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default FormModal;
