import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from './apiService';

export interface Offer {
    name: string;
    price: number;
    details: string;
    description: string;
}

export interface MembershipType {
    id?: string;
    name: string;
    description: string;
    offers: Offer[];
    qrCode: string;
}

interface MembershipState {
    list: MembershipType[];
    selectedMembership?: MembershipType;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Initial state
const initialState: MembershipState = {
    list: [],
    status: 'idle',
    error: null,
};

// Thunks for API calls

export const fetchMemberships = createAsyncThunk('memberships/fetchMemberships', async () => {
    const response = await apiService.get('/memberships');  // Ensure the API endpoint is correct
    return response.data;
});

export const fetchMembershipById = createAsyncThunk('memberships/fetchMembershipById', async (id: string) => {
    const response = await apiService.get(`/memberships/${id}`);
    return response.data;
});

export const addMembership = createAsyncThunk('memberships/addMembership', async (membership: MembershipType) => {
    const response = await apiService.post('/memberships/add', membership);
    return response.data;
});

export const editMembership = createAsyncThunk('memberships/editMembership', async ({ id, membership }: { id: string; membership: MembershipType }) => {
    const response = await apiService.put(`/memberships/edit/${id}`, membership);  // Corrected to use PUT
    return response.data;
});

export const deleteMembership = createAsyncThunk('memberships/deleteMembership', async (id: string) => {
    await apiService.delete(`/memberships/${id}`);
    return id;
});

const membershipSlice = createSlice({
    name: 'memberships',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMemberships.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMemberships.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload;
            })
            .addCase(fetchMemberships.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            .addCase(addMembership.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            .addCase(editMembership.fulfilled, (state, action) => {
                const index = state.list.findIndex((membership) => membership.id === action.payload.id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            })
            .addCase(deleteMembership.fulfilled, (state, action) => {
                state.list = state.list.filter((membership) => membership.id !== action.payload);
            })
            .addCase(fetchMembershipById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMembershipById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.selectedMembership = action.payload; 
            })
            .addCase(fetchMembershipById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });
    },
});

export default membershipSlice.reducer;
