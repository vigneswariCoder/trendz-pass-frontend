import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#000',
        },
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    borderRadius: '10px',
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '6px',
                    boxShadow: 'unset',
                    '&:hover': {
                        boxShadow: 'unset',
                    },
                },
            },
        },
    },
});

export default theme;
