import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { Chip } from '@mui/material';
import { Select, MenuItem, ListItemText, FormControl, InputLabel, RadioGroup, Radio, FormControlLabel, Checkbox, Switch } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { styled } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

interface Field {
    id: string;
    name: string;
    label: string;
    type: string;
    required: boolean;
    options: { value: string; label: string }[];
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => void;
    gridSize: number;
    value?: any;
}


interface Props {
    title: string;
    fields: Field[];
    contentText?: string;
    onSubmit: (formData: Record<string, string | File | string[] | boolean>) => void;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const StyledForm = styled('form')({
    margin: '0 auto',
    padding: '20px',
    width: '100%',
    maxWidth: '700px',
});

const Form: React.FC<Props> = ({ title, fields, contentText, onSubmit, handleSubmit }) => {

    const handleDelete = (field: Field, value: string) => {
        const newValue = (field.value as string[]).filter((v) => v !== value);
        field.onChange?.({ target: { name: field.name, value: newValue } } as any);
    };

    return (
        <StyledForm onSubmit={handleSubmit}>
            <h2>{title}</h2>
            {contentText && <p>{contentText}</p>}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid container spacing={2}>
                    {fields.map(field => (
                        <Grid item xs={field.gridSize || 12} key={field.id}>
                            {field.type === 'text' || field.type === 'email' ? (
                                <TextField
                                    autoFocus={field.id === fields[0].id}
                                    required={field.required}
                                    margin="dense"
                                    id={field.id}
                                    name={field.name}
                                    label={field.label}
                                    type={field.type}
                                    value={field.value}
                                    onChange={field.onChange}
                                    fullWidth
                                    variant="standard"
                                />
                            ) : field.type === 'file' ? (
                                <TextField
                                    autoFocus={field.id === fields[0].id}
                                    required={field.required}
                                    margin="dense"
                                    id={field.id}
                                    name={field.name}
                                    label={field.label}
                                    type="file"
                                    fullWidth
                                    variant="standard"
                                    InputLabelProps={{ shrink: true }}
                                />
                            ) : field.type === 'date' ? (
                                <DatePicker
                                    label={field.label}
                                    value={field.value || null}
                                    onChange={(newValue) => field.onChange?.({ target: { name: field.name, value: newValue?.toISOString() || '' } } as any)}
                                />
                            ) : field.type === 'time' ? (
                                <TimePicker
                                    label={field.label}
                                    value={field.value || null}
                                    onChange={(newValue) => field.onChange?.({ target: { name: field.name, value: newValue?.toISOString() || '' } } as any)}
                                />
                            ) : field.type === 'select' ? (
                                <FormControl variant="standard" fullWidth>
                                    <InputLabel id={field.label}>{field.label}</InputLabel>
                                    <Select
                                        labelId={field.label}
                                        label={field.label}
                                        name={field.name}
                                        value={field.value}
                                        onChange={(e) => field.onChange?.({ target: { name: field.name, value: e.target.value as string } } as any)}
                                    >
                                        {field.options?.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            ) : field.type === 'multiselect' ? (
                                <FormControl variant="standard" fullWidth>
                                    <InputLabel id={field.label}>{field.label}</InputLabel>
                                    <Select
                                        multiple
                                        value={Array.isArray(field.value) ? field.value : []}
                                        onChange={(e) => field.onChange?.({ target: { name: field.name, value: e.target.value as string[] } } as any)}
                                        renderValue={(selected) => (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                                {(selected as string[]).map((value) => {
                                                    const option = field.options?.find((opt) => opt.value === value);
                                                    return option ? (
                                                        <Chip
                                                            key={value}
                                                            label={option.label}
                                                            onDelete={() => handleDelete(field, value)}
                                                            style={{ backgroundColor: '#e0e0e0', borderRadius: 16 }}
                                                        />
                                                    ) : null;
                                                })}
                                            </div>
                                        )}
                                        fullWidth
                                        variant="standard"
                                    >
                                        {field.options?.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                <ListItemText primary={option.label} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            ) : field.type === 'radio' ? (
                                <FormControl component="fieldset" fullWidth>
                                    <InputLabel id={field.label}>{field.label}</InputLabel>
                                    <RadioGroup
                                        aria-labelledby={field.label}
                                        name={field.name}
                                        value={field.value}
                                        onChange={(e) => field.onChange?.({ target: { name: field.name, value: e.target.value as string } } as any)}
                                    >
                                        {field.options?.map((option) => (
                                            <FormControlLabel
                                                key={option.value}
                                                value={option.value}
                                                control={<Radio />}
                                                label={option.label}
                                            />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            ) : field.type === 'checkbox' ? (
                                <FormControl component="fieldset" fullWidth>
                                    <InputLabel id={field.label}>{field.label}</InputLabel>
                                    <Checkbox
                                        checked={field.value || false}
                                        onChange={(e) => field.onChange?.({ target: { name: field.name, value: e.target.checked } } as any)}
                                        color="primary"
                                    />
                                </FormControl>
                            ) : field.type === 'switch' ? (
                                <FormControl component="fieldset" fullWidth>
                                    <InputLabel id={field.label}>{field.label}</InputLabel>
                                    <Switch
                                        checked={field.value || false}
                                        onChange={(e) => field.onChange?.({ target: { name: field.name, value: e.target.checked } } as any)}
                                        color="primary"
                                    />
                                </FormControl>
                            ) : null
                            }
                        </Grid>
                    ))}
                </Grid>
            </LocalizationProvider>
            <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
                Submit
            </Button>
        </StyledForm>
    );
};

export default Form;
