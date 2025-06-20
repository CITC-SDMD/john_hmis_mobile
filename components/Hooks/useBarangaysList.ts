import * as SQLite from 'expo-sqlite';
import NetInfo from '@react-native-community/netinfo';
import { barangayService } from '../API/BarangayService';

let barangayDb = null;

export const useBarangayDatabase = () => {

    const initializeBarangayDatabase = async () => {
        try {
            if (!barangayDb) {
                barangayDb = await SQLite.openDatabaseAsync('Barangays.db');
            }

            await barangayDb.execAsync(`
                CREATE TABLE IF NOT EXISTS barangays (
                    id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL,
                    district TEXT
                );
            `);
        } catch (error) {
            throw error;
        }
    };

    const fetchAndStoreBarangays = async () => {
        await initializeBarangayDatabase();

        try {
            const apiData = await barangayService.getBarangays();
            const barangaysArray = apiData?.data ?? [];

            const apiBarangayIds = barangaysArray.map(item => item.id);
            const existingDbBarangays = await barangayDb.getAllAsync(`SELECT id FROM barangays`);
            const existingDbBarangayIds = existingDbBarangays.map(item => item.id);

            await barangayDb.withTransactionAsync(async () => {
                for (const item of barangaysArray) {
                    await barangayDb.runAsync(
                        `INSERT OR REPLACE INTO barangays (id, name, district) VALUES (?, ?, ?)`,
                        [item.id, item.name, item.district]
                    );
                }

                const idsToDelete = existingDbBarangayIds.filter(dbId => !apiBarangayIds.includes(dbId));
                if (idsToDelete.length > 0) {
                    const placeholders = idsToDelete.map(() => '?').join(',');
                    await barangayDb.runAsync(
                        `DELETE FROM barangays WHERE id IN (${placeholders})`,
                        idsToDelete
                    );
                    console.log(`[Barangay DB Hook] Deleted ${idsToDelete.length} obsolete barangays.`);
                } else {
                    console.log('[Barangay DB Hook] No obsolete barangays to delete.');
                }
            });

            const formattedData = barangaysArray.map(item => ({
                value: item.id,
                label: item.name,
                district: item.district,
            }));

            return formattedData;
        } catch (error) {
            return await loadBarangaysFromDB();
        }
    };

    const loadBarangaysFromDB = async () => {
        await initializeBarangayDatabase();

        try {
            const results = await barangayDb.getAllAsync(`SELECT id, name, district FROM barangays`);
            return results.map(item => ({
                value: item.id,
                label: item.name,
                district: item.district,
            }));
        } catch (error) {
            return [];
        }
    };

    const loadBarangays = async () => {
        await initializeBarangayDatabase();

        const net = await NetInfo.fetch();

        if (net.isConnected && net.isInternetReachable) {
            console.log('[Barangay DB Hook] Network online. Attempting to fetch and store barangay data from API.');
            return await fetchAndStoreBarangays();
        } else {
            console.log('[Barangay DB Hook] Network offline. Attempting to load barangay data from local DB.');
            return await loadBarangaysFromDB();
        }
    };

    return {
        loadBarangays,
    };
};