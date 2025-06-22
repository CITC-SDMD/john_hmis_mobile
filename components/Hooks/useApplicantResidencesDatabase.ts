import { useState, useEffect, useCallback } from 'react';
import * as SQLite from 'expo-sqlite';
import NetInfo from '@react-native-community/netinfo';
import { Toast, ALERT_TYPE } from 'react-native-alert-notification';
import { applicantResidencesService } from "../API/applicantResidencesService";

type SQLiteDatabase = SQLite.SQLiteDatabase;

interface ApplicantResidenceRecord {
    id: number;
    applicant_uuid: string;
    place: string;
    inclusive_dates: string;
    synced: number;
    created_at: string;
}

export const useApplicantResidencesDatabase = () => {
    const [isResidencesDbInitialized, setIsResidencesDbInitialized] = useState(false);
    const [db, setDb] = useState<SQLiteDatabase | null>(null);

    useEffect(() => {
        const initializeDb = async () => {
            try {
                const database = await SQLite.openDatabaseAsync("applicant_residences.db");
                setDb(database);
                console.log("Applicant Residences Database opened successfully.", database);

                await database.execAsync(`
                    CREATE TABLE IF NOT EXISTS applicant_residences (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        applicant_uuid TEXT NOT NULL,
                        place TEXT NOT NULL,
                        inclusive_dates TEXT NOT NULL,
                        synced INTEGER DEFAULT 0,
                        created_at TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now'))
                    );
                `);
                console.log("Applicant Residences table created successfully or already exists.");
                setIsResidencesDbInitialized(true);

            } catch (error) {
                console.error("Error initializing applicant residences database or creating table:", error);
            }
        };

        initializeDb();
    }, []);

    const saveApplicantResidenceLocal = useCallback(async (applicant_uuid: string, place: string, inclusive_dates: string) => {
        if (!db) {
            console.warn("Applicant Residences Database not initialized. Cannot save residence locally.");
            throw new Error("Database not initialized.");
        }

        try {
            const result = await db.runAsync(
                `INSERT INTO applicant_residences (applicant_uuid, place, inclusive_dates, synced) VALUES (?, ?, ?, ?)`,
                [applicant_uuid, place, inclusive_dates, 0] // 0 means not synced
            );
            console.log("Applicant residence saved locally with ID:", result.lastInsertRowId);
            return result.lastInsertRowId;
        } catch (error) {
            console.error("Error saving applicant residence locally:", error);
            throw error;
        }
    }, [db]);

    const getPendingApplicantResidences = useCallback(async () => {
        if (!db) {
            console.warn("Applicant Residences Database not initialized. Cannot get pending residences.");
            return [];
        }
        try {
            const rows = await db.getAllAsync<ApplicantResidenceRecord>("SELECT * FROM applicant_residences WHERE synced = 0");
            return rows;
        } catch (error) {
            console.error("Error fetching pending applicant residences:", error);
            return [];
        }
    }, [db]);

    const markApplicantResidenceAsSynced = useCallback(async (id: number) => {
        if (!db) {
            console.warn("Applicant Residences Database not initialized. Cannot mark residence as synced.");
            throw new Error("Database not initialized.");
        }
        try {
            const result = await db.runAsync(
                "UPDATE applicant_residences SET synced = 1 WHERE id = ?",
                [id]
            );
            if (result.changes && result.changes > 0) {
                return true;
            } else {
                throw new Error("Applicant residence not found or already synced.");
            }
        } catch (error) {
            console.error("Error marking applicant residence as synced:", error);
            throw error;
        }
    }, [db]);

    const deleteSyncedApplicantResidences = useCallback(async () => {
        if (!db) {
            console.warn("Applicant Residences Database not initialized. Cannot delete synced residences.");
            return 0;
        }
        try {
            const result = await db.runAsync(
                "DELETE FROM applicant_residences WHERE synced = 1",
                []
            );
            return result.changes || 0;
        } catch (error) {
            console.error("Error deleting synced applicant residences:", error);
            return 0;
        }
    }, [db]);

    const syncOfflineApplicantResidences = useCallback(async (isManualTrigger = false): Promise<{ syncedCount: number; failedCount: number }> => {
        const networkState = await NetInfo.fetch();
        const currentlyConnectedAndReachable = networkState.isConnected && networkState.isInternetReachable;

        if (!currentlyConnectedAndReachable || !isResidencesDbInitialized || !db) {
            if (isManualTrigger) {
                Toast.show({ title: "Sync Info", textBody: "Not connected or applicant residences database not ready to sync.", type: ALERT_TYPE.INFO });
            }
            console.log("Not connected or applicant residences DB not initialized. Skipping sync.");
            return { syncedCount: 0, failedCount: 0 };
        }

        console.log("Attempting to sync offline applicant residences data...");
        let residencesSyncedCount = 0;
        let residencesFailedCount = 0;

        try {
            const pendingResidences: ApplicantResidenceRecord[] = await getPendingApplicantResidences();
            if (pendingResidences.length === 0) {
                console.log("No pending applicant residences to sync.");
                if (isManualTrigger) {
                    Toast.show({ title: "Sync Info", textBody: "No pending residences found to synchronize.", type: ALERT_TYPE.INFO });
                }
                return { syncedCount: 0, failedCount: 0 };
            }
            console.log(`${pendingResidences.length} pending applicant residences found. Syncing...`);

            for (const residenceRecord of pendingResidences) {
                let retries = 0;
                const MAX_RETRIES = 3;
                const RETRY_DELAY = 2000;

                let residenceSyncedSuccessfully = false;

                while (retries < MAX_RETRIES && !residenceSyncedSuccessfully) {
                    try {
                        const params = {
                            applicant_uuid: residenceRecord.applicant_uuid,
                            place: residenceRecord.place,
                            inclusive_dates: residenceRecord.inclusive_dates
                        };
                        console.log(`Attempting to upload pending residence: ${residenceRecord.id} (Attempt ${retries + 1}/${MAX_RETRIES})`);
                        const response = await applicantResidencesService.saveApplicantResidences(params);

                        if (response.data) {
                            await markApplicantResidenceAsSynced(residenceRecord.id);
                            console.log(`Applicant residence ${residenceRecord.id} successfully synced and marked.`);
                            residencesSyncedCount++;
                            residenceSyncedSuccessfully = true;
                        } else {
                            console.warn(`API response for residence ${residenceRecord.id} did not indicate success on attempt ${retries + 1}.`);
                            residencesFailedCount++;
                            break; // Stop retrying this specific residence if API didn't confirm success
                        }
                    } catch (uploadError: unknown) {
                        let errorMessage = "unknown error";
                        if (uploadError instanceof Error) {
                            errorMessage = uploadError.message;
                        } else if (typeof uploadError === 'object' && uploadError !== null && 'message' in uploadError) {
                            errorMessage = (uploadError as { message: string }).message;
                        }
                        console.error(`Failed to sync applicant residence ${residenceRecord.id} (Attempt ${retries + 1}/${MAX_RETRIES}):`, errorMessage);

                        if (errorMessage.includes('Network request failed') && retries < MAX_RETRIES - 1) {
                            console.log(`Network error detected for residence ${residenceRecord.id}. Retrying in ${RETRY_DELAY / 1000} seconds...`);
                            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                            retries++;
                        } else {
                            residencesFailedCount++;
                            if (isManualTrigger) {
                                Toast.show({ title: "Sync Error", textBody: `Failed to sync a residence (${residenceRecord.id}): ${errorMessage}`, type: ALERT_TYPE.WARNING });
                            }
                            break;
                        }
                    }
                }
            }

            await deleteSyncedApplicantResidences();

            if (isManualTrigger) {
                if (residencesSyncedCount > 0) {
                    Toast.show({ title: "Sync Complete", textBody: `${residencesSyncedCount} residence(s) synchronized.`, type: ALERT_TYPE.SUCCESS });
                }
                if (residencesFailedCount > 0) {
                    Toast.show({ title: "Sync Issues", textBody: `${residencesFailedCount} residence(s) failed to sync. Check console for details.`, type: ALERT_TYPE.WARNING });
                }
                if (residencesSyncedCount === 0 && residencesFailedCount === 0) {
                    Toast.show({ title: "Sync Info", textBody: "No pending residences found to synchronize.", type: ALERT_TYPE.INFO });
                }
            }

            return { syncedCount: residencesSyncedCount, failedCount: residencesFailedCount };

        } catch (error: unknown) {
            let errorMessage = "unknown error";
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'object' && error !== null && 'message' in error) {
                errorMessage = (error as { message: string }).message;
            }
            console.error("Error during offline applicant residences data sync process:", errorMessage);
            if (isManualTrigger) {
                Toast.show({ title: "Sync Error", textBody: "An error occurred during offline applicant residences synchronization.", type: ALERT_TYPE.DANGER });
            }
            return { syncedCount: 0, failedCount: 0 };
        }
    }, [isResidencesDbInitialized, getPendingApplicantResidences, markApplicantResidenceAsSynced, deleteSyncedApplicantResidences, db]);

    return {
        db,
        isResidencesDbInitialized,
        saveApplicantResidenceLocal,
        getPendingApplicantResidences,
        markApplicantResidenceAsSynced,
        deleteSyncedApplicantResidences,
        syncOfflineApplicantResidences,
    };
};