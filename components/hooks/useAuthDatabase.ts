import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

let db = null;

export const useAuthDatabase = () => {
    const [isDbInitialized, setIsDbInitialized] = useState(false);

    useEffect(() => {
        initializeDatabase();
    }, []);

    useEffect(() => {
        if (isDbInitialized) {
            checkExistingToken();
        }
    }, [isDbInitialized]);

    const initializeDatabase = async () => {
        try {
            if (!db) {
                db = await SQLite.openDatabaseAsync('user.db');
            }
            await db.execAsync(`
        CREATE TABLE IF NOT EXISTS user (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          token TEXT NOT NULL
        );
      `);

            setIsDbInitialized(true);
        } catch (error) {
            console.error('Error initializing database:', error);
            checkAsyncStorageToken();
        }
    };

    const checkAsyncStorageToken = async () => {
        try {
            const token = await AsyncStorage.getItem("_token");
            if (token) {
                router.replace("/dashboard/housing-applicants/individual");
            }
        } catch (error) {
            console.error('Error checking AsyncStorage token:', error);
        }
    };

    const checkExistingToken = async () => {
        try {
            if (!db) {
                await checkAsyncStorageToken();
                return;
            }

            const result = await db.getFirstAsync('SELECT token FROM user ORDER BY id DESC LIMIT 1');

            if (result && result.token) {
                await AsyncStorage.setItem("_token", result.token);
                router.replace("/dashboard");
            } else {
                await checkAsyncStorageToken();
            }
        } catch (error) {
            console.error('Error checking existing token:', error);
            await checkAsyncStorageToken();
        }
    };

    const saveTokenToDB = async (token: string) => {
        try {
            if (!db) {
                return;
            }

            await db.runAsync('DELETE FROM user');
            await db.runAsync('INSERT INTO user (token) VALUES (?)', [token]);
        } catch (error) {
            console.error('Error saving token to database:', error);
        }
    };

    const clearToken = async () => {
        try {
            await db.runAsync('DELETE FROM user');
            await AsyncStorage.removeItem("_token");
        } catch (error) {
            console.error('Error clearing token from DB:', error);
        }
    };

    return {
        initializeDatabase,
        checkAsyncStorageToken,
        checkExistingToken,
        saveTokenToDB,
        clearToken,
    };
};
