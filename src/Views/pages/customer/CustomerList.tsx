import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteCustomer, CustomerTypes, fetchAllCustomers } from '../../../redux/slice/customerSlice';
import { MembershipType } from '../../../redux/slice/membershipSlice';
import { AppDispatch, RootState } from '../../../redux/store';
import { FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';

interface CustomerListProps {
    handleOpenEdit: (customer: CustomerTypes) => void;
}

const CustomerList: React.FC<CustomerListProps> = ({ handleOpenEdit }) => {
    const dispatch = useDispatch<AppDispatch>();
    const customers = useSelector((state: RootState) => state.customers.customers);
    const memberships = useSelector((state: RootState) => state.memberships.list);
    const navigate = useNavigate();

    const handleViewCard = (customer: CustomerTypes) => {
        const selectedMembership = memberships.find(membership => membership.id === customer.membershipType);
        if (selectedMembership) {
            navigate(`/membership-card/${customer.id}`, {
                state: { customer, membership: selectedMembership }
            });
        }
    };

    const handleDelete = async (id: string) => {
        dispatch(deleteCustomer(id)).unwrap();
        dispatch(fetchAllCustomers());
    };

    return (
        <div>
            <h3>Customer List</h3>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Mobile</TableCell>
                            <TableCell>Membership Type</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {customers.map((customer, index) => (
                            <TableRow key={customer.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{customer.name}</TableCell>
                                <TableCell>{customer.mobile}</TableCell>
                                <TableCell>{customer.membershipType}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleViewCard(customer)}><FaEye color="grey" /></IconButton>
                                    <IconButton onClick={() => handleOpenEdit(customer)}><FaEdit color="grey" /></IconButton>
                                    <IconButton onClick={() => handleDelete(customer.id!)}><FaTrashAlt color="grey" /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default CustomerList;
