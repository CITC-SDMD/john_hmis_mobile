import APIError from './APIError';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_API_URL } from '@env';

class BaseApiService {
    async request(
        url: string,
        method: 'GET' | 'POST' | 'PUT' | 'DELETE',
        params: object = {}
    ): Promise<any> {
        const token = await AsyncStorage.getItem('_token');
        const baseURL = BASE_API_URL;

        const headers: HeadersInit = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
        };

        let fullUrl = `${baseURL}${url}`;
        let fetchOptions: RequestInit = {
            method,
            headers,
        };

        if (method === 'GET') {
            const query = new URLSearchParams(params as Record<string, string>).toString();
            fullUrl += query ? `?${query}` : '';
        } else {
            fetchOptions.body = JSON.stringify(params);
        }

        try {
            const response = await fetch(fullUrl, fetchOptions);
            const data = await response.json();

            if (!response.ok) {
                switch (response.status) {
                    case 400:
                    case 404:
                    case 422:
                    case 429:
                        throw new APIError(data);
                    case 401:
                        await this.revokeAccess();
                        break;
                    case 500:
                        throw new APIError({
                            message: 'Server error. Please try again. If the problem persists, contact your system administrator',
                        });
                    default:
                        throw new APIError({
                            message: 'Something went wrong. Please try again. If the problem persists, contact your system administrator',
                        });
                }
            }

            return data;
        } catch (err: any) {
            if (err instanceof APIError) throw err;
            throw new APIError({ message: err.message || 'Unknown error occurred' });
        }
    }

    async revokeAccess() {
        await AsyncStorage.removeItem('_token');
        Alert.alert('Session expired', 'You have been logged out.');
    }
}

export default BaseApiService;