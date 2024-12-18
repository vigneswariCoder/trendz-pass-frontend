import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BaseUrl } from '../../App';

interface DataOneState {
    accessToken: string | null;
    refreshToken: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}
const initialState: DataOneState = {
    accessToken: null,
    refreshToken: null,
    status: 'idle',
    error: null,
};

interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
}

export const refreshToken = createAsyncThunk<RefreshTokenResponse, void>(
    'auth/refreshToken',
    async (_, { rejectWithValue }) => {
        const apiUrl = `${BaseUrl}auth/refresh_token`;
        const refreshToken = localStorage.getItem("refreshToken");
        
        if (!refreshToken) {
            throw new Error('Refresh token not available');
        }
        
        try {
            const response = await axios.post(apiUrl, { refreshToken }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (response.status === 200) {
                localStorage.setItem("token", response.data.accessToken);
                localStorage.setItem("refreshToken", response.data.refreshToken);
                return response.data;
            }else{
                return response;
            }
        } catch (error) {
            return rejectWithValue('Failed to refresh token');
        }
    }
);

const dataOneSlice = createSlice({
    name: 'dataOne',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(refreshToken.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
            })
            .addCase(refreshToken.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export default dataOneSlice.reducer;
