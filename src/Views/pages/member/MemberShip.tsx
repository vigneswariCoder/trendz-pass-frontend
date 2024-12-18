// src/components/Membership.tsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import { fetchMemberships, addMembership, editMembership, deleteMembership, MembershipType, Offer } from '../../../redux/slice/membershipSlice';
import { Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Paper, IconButton, Dialog, styled, DialogTitle, DialogContent, Slide, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import QRCode from 'qrcode';
import FormModal from '../../Components/ui/modal/FormModal';
import { TransitionProps } from '@mui/material/transitions';

const BASE_URL = 'http://localhost:3000/#/member-offers';


const StyledDialog = styled(Dialog)<{ width?: string }>(({ width }) => ({
    '& .MuiPaper-root': {
        minWidth: width || '70vw',
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

const Membership: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const memberships = useSelector((state: RootState) => state.memberships.list);
    const membershipStatus = useSelector((state: RootState) => state.memberships.status);
    const [open, setOpen] = useState(false);

    const [newMembership, setNewMembership] = useState<MembershipType>({
        name: '',
        description: '',
        offers: [{ name: '', price: 0, details: '', description: '' }],
        qrCode: '',
    });

    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        if (membershipStatus === 'idle') {
            dispatch(fetchMemberships());
        }
    }, [dispatch, membershipStatus]);

    const handleAddOffer = () => {
        setNewMembership((prevState) => ({
            ...prevState,
            offers: [...prevState.offers, { name: '', price: 0, details: '', description: '' }],
        }));
    };

    const handleRemoveOffer = (index: number) => {
        setNewMembership((prevState) => ({
            ...prevState,
            offers: prevState.offers.filter((_, i) => i !== index),
        }));
    };

    const handleOfferChange = (index: number, field: keyof Offer, value: any) => {
        const updatedOffers = [...newMembership.offers];
        updatedOffers[index] = { ...updatedOffers[index], [field]: value };
        setNewMembership({ ...newMembership, offers: updatedOffers });
    };

    const handleAddMembership = async () => {
        if (newMembership.name && newMembership.description && newMembership.offers.length > 0) {
            try {
                const membershipWithQrCode: MembershipType = {
                    ...newMembership,
                    qrCode: '', // Initialize without a QR code
                };

                const actionResult = await dispatch(addMembership(membershipWithQrCode));
                const membershipId = actionResult.payload.id;

                const qrCodeUrl = `${BASE_URL}/${membershipId}`;
                const qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl);

                const updatedMembershipWithQrCode: MembershipType = {
                    ...membershipWithQrCode,
                    qrCode: qrCodeDataUrl,
                };

                dispatch(editMembership({ id: membershipId, membership: updatedMembershipWithQrCode }));
                resetForm();
            } catch (error) {
                console.error('Error generating QR code:', error);
            }
        }
    };


    const handleEditMembership = async () => {
        if (editingId && newMembership.name && newMembership.description && newMembership.offers.length > 0) {
            try {
                const qrCodeUrl = `${BASE_URL}/${editingId}`;
                const qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl);

                const membershipWithQrCode: MembershipType = {
                    ...newMembership,
                    qrCode: qrCodeDataUrl,
                };

                dispatch(editMembership({ id: editingId, membership: membershipWithQrCode }));
                resetForm();
            } catch (error) {
                console.error('Error generating QR code:', error);
            }
        }
    };

    const handleDeleteMembership = (id: string) => {
        dispatch(deleteMembership(id));
    };

    const resetForm = () => {
        setNewMembership({
            name: '',
            description: '',
            offers: [{ name: '', price: 0, details: '', description: '' }],
            qrCode: '',
        });
        setEditingId(null);
        setOpen(false); // Close the modal
    };

    const handleEditClick = (membership: MembershipType) => {
        setNewMembership({
            ...membership,
            offers: membership.offers || [{ name: '', price: 0, details: '', description: '' }] // Ensure offers have a default structure
        });
        setEditingId(membership.id || null);
        setOpen(true); // Open the modal when edit is clicked
    };

    const handleClose = () => {
        resetForm(); // Close and reset form when the modal is closed
    };

    return (
        <Box>
            <div className="d-flex justify-end mb-3">
                <Button color='primary' variant='contained' onClick={() => setOpen(true)}>Add Membership</Button>
            </div>
            <h3>Membership List</h3>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>QR Code</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {memberships.map((membership) => (
                            <TableRow key={membership.id}>
                                <TableCell>{membership.name}</TableCell>
                                <TableCell>{membership.description}</TableCell>
                                <TableCell>
                                    <a href={`${BASE_URL}/${membership.id}`} target="_blank">
                                        {membership.qrCode && <img src={membership.qrCode} alt="QR Code" style={{ width: '50px' }} />}
                                    </a>
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEditClick(membership)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteMembership(membership.id as string)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <StyledDialog
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <DialogTitle><h4>{editingId ? 'Edit Membership' : 'Add Membership'}</h4></DialogTitle>
                <DialogContent>
                    <Box mt={4}>
                        <TextField
                            label="Name"
                            value={newMembership.name}
                            onChange={(e) => setNewMembership({ ...newMembership, name: e.target.value })}
                        />
                        <TextField
                            label="Description"
                            value={newMembership.description}
                            onChange={(e) => setNewMembership({ ...newMembership, description: e.target.value })}
                        />
                        <h4>Offers</h4>
                        {newMembership.offers.map((offer, index) => (
                            <Box key={index} mb={2} p={2} borderRadius={2}>
                                <TextField
                                    label="Offer Name"
                                    value={offer.name}
                                    onChange={(e) => handleOfferChange(index, 'name', e.target.value)}
                                />
                                <TextField
                                    label="Price"
                                    type="number"
                                    value={offer.price}
                                    onChange={(e) => handleOfferChange(index, 'price', Number(e.target.value))}
                                />
                                <TextField
                                    label="Details"
                                    value={offer.details}
                                    onChange={(e) => handleOfferChange(index, 'details', e.target.value)}
                                />
                                <TextField
                                    label="Description"
                                    value={offer.description}
                                    onChange={(e) => handleOfferChange(index, 'description', e.target.value)}
                                />
                                <IconButton onClick={() => handleRemoveOffer(index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}
                        <Button onClick={handleAddOffer} startIcon={<AddIcon />} variant="contained"></Button>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={editingId ? handleEditMembership : handleAddMembership}
                        color="primary"
                        variant="contained"
                    >
                        {editingId ? 'Update Membership' : 'Add Membership'}
                    </Button>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </StyledDialog>
        </Box>
    );
};

export default Membership;
