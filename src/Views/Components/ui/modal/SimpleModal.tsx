import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    handleClose: () => void;
    title: string;
    children: React.ReactNode;
    width?: string;
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

const SimpleModal: React.FC<Props> = ({ open, setOpen, title, children, handleClose, width }) => {

    return (
        <StyledDialog
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
            width={width}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </StyledDialog>
    );
};

export default SimpleModal;
