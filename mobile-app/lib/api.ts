import axios from 'axios';
import { Platform } from 'react-native';
import { getItem, removeItem } from './storage';
import { sessionEvents } from './sessionEvents';

// Platform-aware API URL:
// - Android Emulator: 10.0.2.2 maps to host machine's localhost
// - iOS Simulator / Web: use localhost directly
// - Physical device: set EXPO_PUBLIC_API_URL in .env to your machine's LAN IP (e.g. http://192.168.1.x:5000/api/v1)
const getBaseUrl = () => {
    if (process.env.EXPO_PUBLIC_API_URL) {
        return process.env.EXPO_PUBLIC_API_URL;
    }
    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:5000/api/v1';
    }
    // iOS simulator or web browser
    return 'http://localhost:5000/api/v1';
};

const API_URL = getBaseUrl();

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000, // 15 second timeout so errors surface faster
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await getItem('userToken');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error fetching token from storage', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Track whether we've already triggered a session expiry to avoid repeated events
let isHandlingExpiry = false;

// Response interceptor to handle global 401 Unauthorized
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401 && !isHandlingExpiry) {
            isHandlingExpiry = true;
            try {
                await removeItem('userToken');
                await removeItem('userData');
                await removeItem('userBranch');
                console.warn('Session expired — redirecting to login');
                // Notify root layout to navigate to /login
                sessionEvents.emit();
            } catch (clearError) {
                console.error('Error clearing storage', clearError);
            } finally {
                // Reset the flag after a delay so future logins work correctly
                setTimeout(() => { isHandlingExpiry = false; }, 3000);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
