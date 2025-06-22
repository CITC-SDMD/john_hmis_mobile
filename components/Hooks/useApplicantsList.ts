import * as SQLite from 'expo-sqlite';
import NetInfo from '@react-native-community/netinfo';
import { applicantService } from '../API/ApplicantService';
import { useRef, useCallback } from 'react';

export const useApplicantsDatabase = () => {
    const dbRef = useRef(null);
    const initPromiseRef = useRef(null);

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const getDb = useCallback(async () => {
        if (initPromiseRef.current) {
            return await initPromiseRef.current;
        }

        if (dbRef.current) {
            return dbRef.current;
        }

        initPromiseRef.current = (async () => {
            const MAX_RETRIES = 3;
            for (let i = 0; i < MAX_RETRIES; i++) {
                try {
                    const newDb = await SQLite.openDatabaseAsync('applicants.db');
                    if (!newDb) {
                        throw new Error('Database initialization failed: newDb is null.');
                    }
                    await newDb.execAsync(`PRAGMA user_version;`);

                    await newDb.execAsync(`
            CREATE TABLE IF NOT EXISTS applicants (
              id INTEGER,
              uuid TEXT UNIQUE,
              firstname TEXT,
              middlename TEXT,
              lastname TEXT,
              username TEXT,
              phone_number TEXT,
              gender TEXT,
              birthdate TEXT,
              address TEXT,
              type TEXT,
              status TEXT,
              application TEXT,
              documents TEXT,
              household_members TEXT,
              schedule TEXT,
              is_cancelled INTEGER,
              is_scheduled INTEGER,
              PRIMARY KEY (uuid, status)
            );
          `);

                    dbRef.current = newDb;
                    initPromiseRef.current = null;
                    return dbRef.current;
                } catch (error) {
                    dbRef.current = null;
                    if (i < MAX_RETRIES - 1) {
                        await delay(500 * (i + 1));
                    } else {
                        initPromiseRef.current = null;
                        throw error;
                    }
                }
            }
            const finalError = new Error('Database initialization failed after multiple retries.');
            initPromiseRef.current = null;
            throw finalError;
        })();

        return await initPromiseRef.current;
    }, []);

    const fetchAndStoreApplicants = async (type, params = {}) => {
        let dbInstance;
        try {
            dbInstance = await getDb();
        } catch (dbError) {
            const offlineData = await loadApplicantsFromDB(type);
            return { data: offlineData, meta: null };
        }

        let onlineData = [];
        let onlineMeta = null;

        try {
            let response;
            switch (type) {
                case 'schedule':
                    response = await applicantService.getApplicantsSchedule(params);
                    break;
                case 'approved':
                    response = await applicantService.getApproved(params);
                    break;
                case 'disapproved':
                    response = await applicantService.getRejected(params);
                    break;
                default:
                    response = await applicantService.getApplicants(params);
                    break;
            }

            onlineData = response?.data || [];
            onlineMeta = response?.meta || null;

            if (params.page === 1 || Object.keys(params).length === 0 || !params.page) {
                if (!dbInstance || typeof dbInstance.runAsync !== 'function') {
                    dbRef.current = null;
                    throw new Error('Database instance unavailable or invalid for delete operation.');
                }
                await dbInstance.runAsync(`DELETE FROM applicants WHERE status = ?`, [type]);
            }

            const insertPromises = onlineData.map(item => {
                if (!dbInstance || typeof dbInstance.runAsync !== 'function') {
                    dbRef.current = null;
                    return Promise.resolve();
                }

                const applicationJson = item.application ? JSON.stringify(item.application) : null;
                const documentsJson = item.documents ? JSON.stringify(item.documents) : null;
                const householdMembersJson = item.household_members ? JSON.stringify(item.household_members) : null;
                const isCancelledInt = item.is_cancelled ? 1 : 0;
                const isScheduledInt = item.is_scheduled ? 1 : 0;

                return dbInstance.runAsync(
                    `INSERT OR REPLACE INTO applicants (
            id, uuid, firstname, middlename, lastname, username,
            phone_number, gender, birthdate, address, type, status,
            application, documents, household_members, schedule, is_cancelled, is_scheduled
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        item.id,
                        item.uuid,
                        item.firstname,
                        item.middlename,
                        item.lastname,
                        item.username,
                        item.phone_number,
                        item.gender,
                        item.birthdate,
                        item.address,
                        item.type,
                        type,
                        applicationJson,
                        documentsJson,
                        householdMembersJson,
                        item.schedule,
                        isCancelledInt,
                        isScheduledInt
                    ]
                ).catch(insertError => {
                    if (insertError.message && (insertError.message.includes('NullPointerException') || insertError.message.includes('NativeDatabase.prepareAsync') || String(insertError.code) === '17')) {
                        dbRef.current = null;
                    }
                });
            });
            await Promise.all(insertPromises);

            return { data: onlineData, meta: onlineMeta };

        } catch (error) {
            if (error.message && (error.message.includes('NullPointerException') || error.message.includes('NativeDatabase.prepareAsync') || String(error.code) === '17')) {
                dbRef.current = null;
            }
            const offlineData = await loadApplicantsFromDB(type);
            return { data: offlineData, meta: null };
        }
    };

    const loadApplicantsFromDB = async (type) => {
        let dbInstance;
        try {
            dbInstance = await getDb();
        } catch (dbError) {
            dbRef.current = null;
            return [];
        }

        try {
            if (!dbInstance || typeof dbInstance.getAllAsync !== 'function') {
                dbRef.current = null;
                throw new Error('Database instance unavailable or invalid for select operation.');
            }
            const results = await dbInstance.getAllAsync(
                `SELECT * FROM applicants WHERE status = ?`,
                [type]
            );

            const parsedResults = results.map(row => ({
                ...row,
                application: row.application ? JSON.parse(row.application) : null,
                documents: row.documents ? JSON.parse(row.documents) : [],
                household_members: row.household_members ? JSON.parse(row.household_members) : [],
                is_cancelled: row.is_cancelled === 1,
                is_scheduled: row.is_scheduled === 1,
            }));

            return parsedResults;
        } catch (error) {
            if (error.message && (error.message.includes('NullPointerException') || error.message.includes('NativeDatabase.prepareAsync') || String(error.code) === '17')) {
                dbRef.current = null;
            }
            return [];
        }
    };

    const loadApplicants = async (type = 'new', page = 1) => {
        const net = await NetInfo.fetch();

        if (net.isConnected && net.isInternetReachable) {
            return await fetchAndStoreApplicants(type, { page });
        } else {
            return { data: await loadApplicantsFromDB(type), meta: { current_page: 1, last_page: 1, per_page: 0, total: 0 } };
        }
    };

    return {
        loadApplicants,
    };
};