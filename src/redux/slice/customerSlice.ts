import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from './apiService';

export interface CustomerTypes {
    id?: string;
    name: string;
    mobile: string;
    membershipType: string;
}

export const addCustomer = createAsyncThunk('customers/addCustomer', async (customerData: CustomerTypes) => {
    const response = await apiService.post('customers/add', customerData);
    return response.data as CustomerTypes;
});

// New thunk for fetching all customers
export const fetchAllCustomers = createAsyncThunk('customers/fetchAllCustomers', async () => {
    const response = await apiService.get('customers/all');
    return response.data as CustomerTypes[];
});

// New thunk for fetching customer by ID
export const fetchCustomerById = createAsyncThunk('customers/fetchCustomerById', async (id: string) => {
    const response = await apiService.get(`customers/get/${id}`);
    return response.data as CustomerTypes;
});

// New thunk for editing a customer
export const editCustomer = createAsyncThunk('customers/editCustomer', async (customerData: CustomerTypes) => {
    const response = await apiService.put(`customers/edit/${customerData.id}`, customerData);
    return response.data as CustomerTypes;
});

// New thunk for deleting a customer
export const deleteCustomer = createAsyncThunk('customers/deleteCustomer', async (id: string) => {
    await apiService.delete(`customers/delete/${id}`);
    return id; // return id to remove it from the state
});

interface CustomerState {
    customers: CustomerTypes[];
    loading: boolean;
}

const initialState: CustomerState = {
    customers: [],
    loading: false,
};

const customerSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addCustomer.pending, (state) => {
                state.loading = true;
            })
            .addCase(addCustomer.fulfilled, (state, action) => {
                state.customers.push(action.payload);
                state.loading = false;
            })
            .addCase(addCustomer.rejected, (state) => {
                state.loading = false;
            })
            .addCase(fetchAllCustomers.fulfilled, (state, action) => {
                state.customers = action.payload;
            })
            .addCase(fetchCustomerById.fulfilled, (state, action) => {
                const index = state.customers.findIndex(customer => customer.id === action.payload.id);
                if (index !== -1) {
                    state.customers[index] = action.payload;
                }
            })
            .addCase(editCustomer.fulfilled, (state, action) => {
                const index = state.customers.findIndex(customer => customer.id === action.payload.id);
                if (index !== -1) {
                    state.customers[index] = action.payload;
                }
            })
            .addCase(deleteCustomer.fulfilled, (state, action) => {
                state.customers = state.customers.filter(customer => customer.id !== action.payload);
            });
    }
});

export default customerSlice.reducer;
