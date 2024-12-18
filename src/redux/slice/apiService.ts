import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const token = localStorage.getItem('token');

export const BASE_URL = 'http://localhost:8090/';
export const API_URL = 'http://localhost:8090/api/';

export const apiService = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : undefined,
    },
});

console.log('API URL:', API_URL, token);

export const formService = axios.create({
    baseURL: API_URL,
    headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
    },
});

// Add axios interceptor to handle token errors
apiService.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.data.error === 'Invalid token. Please log in again.' || error.response.data.error === 'No token found. Please log in again.') {
            toast.error('Session expired. Please log in again.');
            localStorage.clear();
            window.location.href = '/signin';  
        }
        return Promise.reject(error);
    }
);

formService.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.data.error === 'Invalid token. Please log in again.' || error.response.data.error === 'No token found. Please log in again.') {
            toast.error('Session expired. Please log in again.');
            localStorage.clear();
            window.location.href = '/signin';  
        }
        return Promise.reject(error);
    }
);

export const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/signin';
};
