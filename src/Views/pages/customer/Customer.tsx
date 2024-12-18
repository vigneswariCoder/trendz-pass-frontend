import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormModal, { Field } from '../../Components/ui/modal/FormModal';
import { addCustomer, editCustomer, fetchAllCustomers } from '../../../redux/slice/customerSlice';
import { AppDispatch, RootState } from '../../../redux/store';
import CustomerList from './CustomerList';
import { Button } from '@mui/material';
import { fetchMemberships } from '../../../redux/slice/membershipSlice';

interface FormData {
    id?: string;
    name: string;
    mobile: string;
    membershipType: string;
}

const Customer: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const memberships = useSelector((state: RootState) => state.memberships.list);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        mobile: '',
        membershipType: '',
    });
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        const key = name as keyof FormData;

        setFormData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
    };

    const fields: Field[] = [
        {
            id: 'name',
            name: 'name',
            label: 'Name',
            type: 'text',
            value: formData.name,
            required: true,
            gridSize: 12,
            onChange: handleInputChange,
        },
        {
            id: 'mobile',
            name: 'mobile',
            label: 'Mobile Number',
            type: 'text',
            value: formData.mobile,
            required: true,
            gridSize: 12,
            onChange: handleInputChange,
        },
        {
            id: 'membershipType',
            name: 'membershipType',
            label: 'Membership Type',
            type: 'radio',
            value: formData.membershipType,
            options: memberships.map((membership) => ({
                name: membership.name,
                id: membership.id as string,
            })),
            required: true,
            gridSize: 12,
            onChange: handleInputChange,
        },
    ];

    const handleFormSubmit = async (formData: FormData) => {
        if (isEdit) {
            dispatch(editCustomer(formData)).unwrap();
        } else {
            dispatch(addCustomer(formData)).unwrap();
        }
        dispatch(fetchAllCustomers());
    };

    const handleOpenEdit = (customer: FormData) => {
        setFormData(customer);
        setIsEdit(true);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setIsEdit(false);
        setFormData({ name: '', mobile: '', membershipType: '' });
    };

    useEffect(() => {
        dispatch(fetchMemberships());
        dispatch(fetchAllCustomers());
    }, [dispatch]);
    

    return (
        <>
            <div className="d-flex justify-end mb-3">
                <Button color='primary' variant='contained' onClick={() => setOpen(true)}>Add Customer</Button>
            </div>
            <FormModal
                open={open}
                setOpen={setOpen}
                title={isEdit ? "Edit Customer" : "Create Customer"}
                fields={fields}
                onSubmit={handleFormSubmit}
                handleClose={handleClose}
            />
            <CustomerList handleOpenEdit={handleOpenEdit} />
        </>
    );
};

export default Customer;


