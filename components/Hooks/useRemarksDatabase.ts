import { useState, useEffect, useCallback } from 'react';
import * as SQLite from 'expo-sqlite';
import NetInfo from '@react-native-community/netinfo';
import { Toast, ALERT_TYPE } from 'react-native-alert-notification';
import { applicationService } from "../API/ApplicationService";

type SQLiteDatabase = SQLite.SQLiteDatabase;

interface ApplicantRemarkRecord {
    id: number;
    applicant_uuid: string;
    remarks: string;
    sex: string;
    attested_by: string;
    attested_signature: string;
    synced: number;
    created_at: string;
}

export const useApplicantRemarksDatabase = () => {
    const [isRemarksDbInitialized, setIsRemarksDbInitialized] = useState(false);
    const [db, setDb] = useState<SQLiteDatabase | null>(null);

    // Effect to initialize the database and create the table
    useEffect(() => {
        const initializeDb = async () => {
            try {
                // Open or create the SQLite database file for remarks
                const database = await SQLite.openDatabaseAsync("applicant_remarks.db");
                setDb(database);
                console.log("Applicant Remarks Database opened successfully.", database);

                // Execute SQL to create the applicant_remarks table if it doesn't exist
                await database.execAsync(`
                    CREATE TABLE IF NOT EXISTS applicant_remarks (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        applicant_uuid TEXT NOT NULL,
                        remarks TEXT NOT NULL,
                        sex TEXT NOT NULL,
                        attested_by TEXT NOT NULL,
                        attested_signature TEXT NOT NULL,
                        synced INTEGER DEFAULT 0,
                        created_at TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now'))
                    );
                `);
                console.log("Applicant Remarks table created successfully or already exists.");
                setIsRemarksDbInitialized(true); // Mark as initialized
            } catch (error) {
                console.error("Error initializing applicant remarks database or creating table:", error);
            }
        };

        initializeDb();

        return () => {
            if (db) {
                db.closeAsync().then(() => console.log("Database closed.")).catch(e => console.error("Error closing database:", e));
            }
        };
    }, []);

    /**
     * Saves an applicant remark record locally into the SQLite database.
     * @param applicant_uuid The UUID of the applicant.
     * @param remarks The remarks text.
     * @param sex The sex of the applicant.
     * @param attested_by The name of the person who attested.
     * @param attested_signature The signature of the person who attested.
     * @returns The ID of the newly inserted row.
     */
    const saveApplicantRemarkLocal = useCallback(async (
        applicant_uuid: string,
        remarks: string,
        sex: string,
        attested_by: string,
        attested_signature: string
    ) => {
        if (!db) {
            console.warn("Applicant Remarks Database not initialized. Cannot save remark locally.");
            throw new Error("Database not initialized.");
        }

        try {
            const result = await db.runAsync(
                `INSERT INTO applicant_remarks (applicant_uuid, remarks, sex, attested_by, attested_signature, synced) VALUES (?, ?, ?, ?, ?, ?)`,
                [applicant_uuid, remarks, sex, attested_by, attested_signature, 0] // 0 means not synced
            );
            console.log("Applicant remark saved locally with ID:", result.lastInsertRowId);
            return result.lastInsertRowId;
        } catch (error) {
            console.error("Error saving applicant remark locally:", error);
            throw error;
        }
    }, [db]);

    /**
     * Updates an existing applicant remark record locally in the SQLite database.
     * Marks the record as unsynced (synced = 0) after update, so it will be synced later.
     * @param id The ID of the remark record to update.
     * @param applicant_uuid The UUID of the applicant (should match the existing record).
     * @param remarks The updated remarks text.
     * @param sex The updated sex of the applicant.
     * @param attested_by The updated name of the person who attested.
     * @param attested_signature The updated signature of the person who attested.
     * @returns True if successfully updated, false otherwise.
     */
    const updateApplicantRemarkLocal = useCallback(async (
        id: number,
        applicant_uuid: string, // Keep for consistency, though not updated in WHERE clause
        remarks: string,
        sex: string,
        attested_by: string,
        attested_signature: string
    ) => {
        if (!db) {
            console.warn("Applicant Remarks Database not initialized. Cannot update remark locally.");
            throw new Error("Database not initialized.");
        }
        try {
            const result = await db.runAsync(
                `UPDATE applicant_remarks SET remarks = ?, sex = ?, attested_by = ?, attested_signature = ?, synced = 0 WHERE id = ?`,
                [remarks, sex, attested_by, attested_signature, id]
            );
            if (result.changes && result.changes > 0) {
                console.log(`Applicant remark ${id} updated locally.`);
                return true;
            } else {
                throw new Error("Applicant remark not found or no changes made.");
            }
        } catch (error) {
            console.error(`Error updating applicant remark ${id} locally:`, error);
            throw error;
        }
    }, [db]);

    /**
     * Fetches all applicant remarks that are marked as unsynced (synced = 0).
     * @returns An array of pending ApplicantRemarkRecord objects.
     */
    const getPendingApplicantRemarks = useCallback(async () => {
        if (!db) {
            console.warn("Applicant Remarks Database not initialized. Cannot get pending remarks.");
            return [];
        }
        try {
            const rows = await db.getAllAsync<ApplicantRemarkRecord>("SELECT * FROM applicant_remarks WHERE synced = 0");
            console.log(`Fetched ${rows.length} pending applicant remarks.`);
            return rows;
        } catch (error) {
            console.error("Error fetching pending applicant remarks:", error);
            return [];
        }
    }, [db]);

    /**
     * Fetches all applicant remarks for a specific applicant_uuid, regardless of sync status.
     * @param uuid The UUID of the applicant to fetch remarks for.
     * @returns An array of ApplicantRemarkRecord objects for the specified applicant.
     */
    const getApplicantRemarksByUuid = useCallback(async (uuid: string) => {
        if (!db) {
            console.warn("Applicant Remarks Database not initialized. Cannot get remarks by UUID.");
            return [];
        }
        try {
            const rows = await db.getAllAsync<ApplicantRemarkRecord>(
                "SELECT * FROM applicant_remarks WHERE applicant_uuid = ?",
                [uuid]
            );
            return rows;
        } catch (error) {
            console.error(`Error fetching applicant remarks for UUID ${uuid}:`, error);
            return [];
        }
    }, [db]);


    /**
     * Marks a specific applicant remark record as synced (synced = 1) in the local database.
     * @param id The ID of the remark record to mark as synced.
     * @returns True if successfully marked, false otherwise.
     */
    const markApplicantRemarkAsSynced = useCallback(async (id: number) => {
        if (!db) {
            console.warn("Applicant Remarks Database not initialized. Cannot mark remark as synced.");
            throw new Error("Database not initialized.");
        }
        try {
            const result = await db.runAsync(
                "UPDATE applicant_remarks SET synced = 1 WHERE id = ?",
                [id]
            );
            if (result.changes && result.changes > 0) {
                return true;
            } else {
                throw new Error("Applicant remark not found or already synced.");
            }
        } catch (error) {
            console.error("Error marking applicant remark as synced:", error);
            throw error;
        }
    }, [db]);

    /**
     * Deletes all applicant remark records that are marked as synced (synced = 1).
     * @returns The number of deleted rows.
     */
    const deleteSyncedApplicantRemarks = useCallback(async () => {
        if (!db) {
            console.warn("Applicant Remarks Database not initialized. Cannot delete synced remarks.");
            return 0;
        }
        try {
            const result = await db.runAsync(
                "DELETE FROM applicant_remarks WHERE synced = 1",
                []
            );
            return result.changes || 0;
        } catch (error) {
            console.error("Error deleting synced applicant remarks:", error);
            return 0;
        }
    }, [db]);

    /**
     * Attempts to synchronize offline applicant remark data with the remote server.
     * Checks network connectivity, fetches pending remarks, uploads them, marks them as synced,
     * and then deletes the synced records from the local database.
     * @param isManualTrigger Optional. If true, toasts will be shown for user feedback.
     * @returns An object containing counts of synced and failed records.
     */
    const syncOfflineApplicantRemarks = useCallback(async (isManualTrigger = false): Promise<{ syncedCount: number; failedCount: number }> => {
        const networkState = await NetInfo.fetch();
        const currentlyConnectedAndReachable = networkState.isConnected && networkState.isInternetReachable;

        // Skip sync if not connected, DB not initialized, or DB object is null
        if (!currentlyConnectedAndReachable || !isRemarksDbInitialized || !db) {
            if (isManualTrigger) {
                Toast.show({ title: "Sync Info", textBody: "Not connected or applicant remarks database not ready to sync.", type: ALERT_TYPE.INFO });
            }
            console.log("Not connected or applicant remarks DB not initialized. Skipping sync.");
            return { syncedCount: 0, failedCount: 0 };
        }

        console.log("Attempting to sync offline applicant remarks data...");
        let remarksSyncedCount = 0;
        let remarksFailedCount = 0;

        try {
            // Get all pending remarks from the local database
            const pendingRemarks: ApplicantRemarkRecord[] = await getPendingApplicantRemarks();
            if (pendingRemarks.length === 0) {
                console.log("No pending applicant remarks to sync.");
                if (isManualTrigger) {
                    Toast.show({ title: "Sync Info", textBody: "No pending remarks found to synchronize.", type: ALERT_TYPE.INFO });
                }
                return { syncedCount: 0, failedCount: 0 };
            }
            console.log(`${pendingRemarks.length} pending applicant remarks found. Syncing...`);

            // Iterate through each pending remark and attempt to sync
            for (const remarkRecord of pendingRemarks) {
                let retries = 0;
                const MAX_RETRIES = 3;
                const RETRY_DELAY = 2000; // 2 seconds

                let remarkSyncedSuccessfully = false;

                while (retries < MAX_RETRIES && !remarkSyncedSuccessfully) {
                    try {
                        // Create FormData object as required by the original `handleSubmitRemarks`
                        const formData = new FormData();
                        formData.append('applicant_uuid', remarkRecord.applicant_uuid);
                        formData.append('remarks', remarkRecord.remarks);
                        formData.append('sex', remarkRecord.sex);
                        formData.append('attested_by', remarkRecord.attested_by);
                        formData.append('attested_signature', remarkRecord.attested_signature);
                        console.log('asdasf', remarkRecord.attested_signature)

                        if (remarkRecord.attested_signature) {
                            formData.append('attested_signature', remarkRecord.attested_signature);
                        }

                        // if (remarkRecord.attested_signature?.uri) {
                        //     formData.append('structure', {
                        //         uri: remarkRecord.attested_signature.uri,
                        //         name: remarkRecord.attested_signature.name || `structure_${Date.now()}.jpg`,
                        //         type: remarkRecord.attested_signature.type || 'image/jpeg',
                        //     });
                        // }

                        //     if (remarkRecord.structure_uri && remarkRecord.structure_name && remarkRecord.structure_type_mime) {
                        //     formData.append('structure', {
                        //         uri: remarkRecord.structure_uri,
                        //         name: remarkRecord.structure_name,
                        //         type: remarkRecord.structure_type_mime,
                        //     } as unknown as Blob);
                        // }


                        console.log(`Attempting to upload pending remark: ${remarkRecord.id} (Attempt ${retries + 1}/${MAX_RETRIES})`);
                        // Call the actual application service to save the remark remotely
                        const response = await applicationService.saveRemarks(remarkRecord.applicant_uuid, formData);

                        if (response.data) {
                            // If successful, mark the record as synced in the local DB
                            await markApplicantRemarkAsSynced(remarkRecord.id);
                            console.log(`Applicant remark ${remarkRecord.id} successfully synced and marked.`);
                            remarksSyncedCount++;
                            remarkSyncedSuccessfully = true;
                        } else {
                            console.warn(`API response for remark ${remarkRecord.id} did not indicate success on attempt ${retries + 1}.`);
                            remarksFailedCount++;
                            break; // Stop retrying this specific remark if API didn't confirm success
                        }
                    } catch (uploadError: unknown) {
                        let errorMessage = "unknown error";
                        if (uploadError instanceof Error) {
                            errorMessage = uploadError.message;
                        } else if (typeof uploadError === 'object' && uploadError !== null && 'message' in uploadError) {
                            errorMessage = (uploadError as { message: string }).message;
                        }
                        console.error(`Failed to sync applicant remark ${remarkRecord.id} (Attempt ${retries + 1}/${MAX_RETRIES}):`, errorMessage);

                        // Retry only for network-related errors
                        if (errorMessage.includes('Network request failed') && retries < MAX_RETRIES - 1) {
                            console.log(`Network error detected for remark ${remarkRecord.id}. Retrying in ${RETRY_DELAY / 1000} seconds...`);
                            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                            retries++;
                        } else {
                            remarksFailedCount++;
                            if (isManualTrigger) {
                                Toast.show({ title: "Sync Error", textBody: `Failed to sync a remark (${remarkRecord.id}): ${errorMessage}`, type: ALERT_TYPE.WARNING });
                            }
                            break; // Stop retrying if not a network error or max retries reached
                        }
                    }
                }
            }

            // After attempting to sync all, delete records that were successfully synced
            await deleteSyncedApplicantRemarks();

            // Provide user feedback if manually triggered
            if (isManualTrigger) {
                if (remarksSyncedCount > 0) {
                    Toast.show({ title: "Sync Complete", textBody: `${remarksSyncedCount} remark(s) synchronized.`, type: ALERT_TYPE.SUCCESS });
                }
                if (remarksFailedCount > 0) {
                    Toast.show({ title: "Sync Issues", textBody: `${remarksFailedCount} remark(s) failed to sync. Check console for details.`, type: ALERT_TYPE.WARNING });
                }
                if (remarksSyncedCount === 0 && remarksFailedCount === 0 && pendingRemarks.length > 0) {
                    Toast.show({ title: "Sync Info", textBody: "No pending remarks found to synchronize.", type: ALERT_TYPE.INFO });
                }
            }

            return { syncedCount: remarksSyncedCount, failedCount: remarksFailedCount };

        } catch (error: unknown) {
            let errorMessage = "unknown error";
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'object' && error !== null && 'message' in error) {
                errorMessage = (error as { message: string }).message;
            }
            console.error("Error during offline applicant remarks data sync process:", errorMessage);
            if (isManualTrigger) {
                Toast.show({ title: "Sync Error", textBody: "An error occurred during offline applicant remarks synchronization.", type: ALERT_TYPE.DANGER });
            }
            return { syncedCount: 0, failedCount: 0 };
        }
    }, [isRemarksDbInitialized, getPendingApplicantRemarks, markApplicantRemarkAsSynced, deleteSyncedApplicantRemarks, db]);

    return {
        db,
        isRemarksDbInitialized,
        saveApplicantRemarkLocal,
        getPendingApplicantRemarks,
        getApplicantRemarksByUuid,
        updateApplicantRemarkLocal, // <--- EXPORTING THE NEW FUNCTION
        markApplicantRemarkAsSynced,
        deleteSyncedApplicantRemarks,
        syncOfflineApplicantRemarks,
    };
};
