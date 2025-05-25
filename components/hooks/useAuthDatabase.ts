// hooks/useAuthDatabase.js
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('user.db');

export const useAuthDatabase = () => {
    const initializeDatabase = async () => {
        try {
            await db.execAsync(`
        CREATE TABLE IF NOT EXISTS user (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          token TEXT NOT NULL
        );
      `);
        } catch (error) {
            console.error('DB Init Error:', error);
        }
    };

    const saveTokenToDB = async (token) => {
        try {
            await db.runAsync('DELETE FROM user');
            await db.runAsync('INSERT INTO user (token) VALUES (?)', [token]);
        } catch (error) {
            console.error('Save Token Error:', error);
        }
    };

    const getSavedToken = async () => {
        try {
            const result = await db.getFirstAsync('SELECT token FROM user LIMIT 1');
            return result?.token || null;
        } catch (error) {
            console.error('Get Token Error:', error);
            return null;
        }
    };

    const clearToken = async () => {
        try {
            await db.runAsync('DELETE FROM user');
        } catch (error) {
            console.error('Error clearing token from DB:', error);
        }
    };

    const checkExistingToken = async () => {
        try {
            const result = await db.getFirstAsync('SELECT token FROM user LIMIT 1');
            if (result && result.token) {
                await AsyncStorage.setItem("_token", result.token);
                router.replace("/dashboard"); // ⛔ this assumes the token is valid!
            }
        } catch (error) {
            console.error('Error checking existing token:', error);
        }
    };

    return {
        initializeDatabase,
        saveTokenToDB,
        getSavedToken,
        clearToken,
    };
};
