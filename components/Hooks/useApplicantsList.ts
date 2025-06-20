import * as SQLite from 'expo-sqlite';
import NetInfo from '@react-native-community/netinfo';
import { applicantService } from '../API/ApplicantService';

let db = null;

export const useApplicantsDatabase = () => {

    const initializeDatabase = async () => {
        try {
            if (!db) {
                db = await SQLite.openDatabaseAsync('applicants.db');
                await db.execAsync(`
                    CREATE TABLE IF NOT EXISTS applicants (
                        id INTEGER,
                        uuid TEXT,
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
                        PRIMARY KEY (id, status)
                    );
                `);
            }
        } catch (error) {
            throw error;
        }
    };

    const fetchAndStoreApplicants = async (type: string, params: any = {}) => {
        await initializeDatabase();

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

            const data = response?.data ?? [];
            const meta = response?.meta || null;

            if (params.page === 1 || Object.keys(params).length === 0 || !params.page) {
                await db.runAsync(`DELETE FROM applicants WHERE status = ?`, [type]);
            }

            for (const item of data) {
                await db.runAsync(
                    `INSERT OR REPLACE INTO applicants (
                        id, uuid, firstname, middlename, lastname, username,
                        phone_number, gender, birthdate, address, type, status
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
                    ]
                );
            }
            return { data, meta };
        } catch (error) {
            return { data: await loadApplicantsFromDB(type), meta: null };
        }
    };

    const loadApplicantsFromDB = async (type: string) => {
        await initializeDatabase();

        try {
            const results = await db.getAllAsync(
                `SELECT * FROM applicants WHERE status = ?`,
                [type]
            );
            return results;
        } catch (error) {
            return [];
        }
    };

    const loadApplicants = async (type: string = 'new', page: number = 1) => {
        await initializeDatabase();

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