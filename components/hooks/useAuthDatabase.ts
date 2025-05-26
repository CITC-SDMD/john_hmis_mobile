import * as SQLite from 'expo-sqlite';
import React, { useEffect, useState } from "react";
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
            console.log('Database initialized successfully');
        } catch (error) {
            console.error('Error initializing database:', error);
            checkAsyncStorageToken();
        }
    };

    const checkAsyncStorageToken = async () => {
        try {
            const token = await AsyncStorage.getItem("_token");
            if (token) {
                router.replace("/dashboard");
            }
        } catch (error) {
            console.error('Error checking AsyncStorage token:', error);
        }
    };

    const checkExistingToken = async () => {
        try {
            if (!db) {
                console.log('Database not initialized, checking AsyncStorage');
                await checkAsyncStorageToken();
                return;
            }

            const result = await db.getFirstAsync('SELECT token FROM user ORDER BY id DESC LIMIT 1');
            console.log('Database result:', result);

            if (result && result.token) {
                await AsyncStorage.setItem("_token", result.token);
                console.log('Token found in database:', result.token);
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
                console.log('Database not available, skipping DB save');
                return;
            }

            await db.runAsync('DELETE FROM user');
            await db.runAsync('INSERT INTO user (token) VALUES (?)', [token]);
            console.log('Token saved to database successfully');
        } catch (error) {
            console.error('Error saving token to database:', error);
        }
    };

    const clearToken = async () => {
        try {
            await db.runAsync('DELETE FROM user');
            await AsyncStorage.removeItem("_token");
            console.log('Token cleared from database and AsyncStorage successfully');
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
