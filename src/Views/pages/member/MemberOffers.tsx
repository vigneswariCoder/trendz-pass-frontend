import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMembershipById } from '../../../redux/slice/membershipSlice';
import { AppDispatch, RootState } from '../../../redux/store';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';

const MemberOffers: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const membership = useSelector((state: RootState) => state.memberships.selectedMembership);
    const status = useSelector((state: RootState) => state.memberships.status);

    useEffect(() => {
        if (id) {
            dispatch(fetchMembershipById(id));
        }
    }, [dispatch, id]);

    if (status === 'loading') {
        return <CircularProgress />;
    }

    if (!membership) {
        return <Typography variant="h6">Membership not found</Typography>;
    }

    return (
        <Paper>
            <Box p={3}>
                <Typography variant="h4">{membership.name}</Typography>
                <Typography variant="body1">{membership.description}</Typography>
                <Box mt={2}>
                    <Typography variant="h6">Offers:</Typography>
                    {membership.offers.map((offer, index) => (
                        <Box key={index} mb={1}>
                            <Typography variant="subtitle1">{offer.name}</Typography>
                            <Typography variant="body2">Price: {offer.price}</Typography>
                            <Typography variant="body2">{offer.details}</Typography>
                            <Typography variant="body2">{offer.description}</Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Paper>
    );
};

export default MemberOffers;
