/**
 * Cross-platform secure storage utility.
 * Uses expo-secure-store on native (iOS/Android) and AsyncStorage on web
 * where SecureStore is not available.
 */
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Dynamically import SecureStore only on native platforms
let SecureStore: typeof import('expo-secure-store') | null = null;
if (Platform.OS !== 'web') {
    try {
        SecureStore = require('expo-secure-store');
    } catch {
        SecureStore = null;
    }
}

export const setItem = async (key: string, value: string): Promise<void> => {
    if (SecureStore && Platform.OS !== 'web') {
        await SecureStore.setItemAsync(key, value);
    } else {
        await AsyncStorage.setItem(key, value);
    }
};

export const getItem = async (key: string): Promise<string | null> => {
    if (SecureStore && Platform.OS !== 'web') {
        return await SecureStore.getItemAsync(key);
    } else {
        return await AsyncStorage.getItem(key);
    }
};

export const removeItem = async (key: string): Promise<void> => {
    if (SecureStore && Platform.OS !== 'web') {
        await SecureStore.deleteItemAsync(key);
    } else {
        await AsyncStorage.removeItem(key);
    }
};
