import { useState, useEffect, useCallback } from 'react';
import * as SQLite from 'expo-sqlite';
import NetInfo from '@react-native-community/netinfo';
import { Toast, ALERT_TYPE } from 'react-native-alert-notification';
import { applicationService } from '../API/ApplicationService';
import { format } from "date-fns";

type SQLiteDatabase = SQLite.SQLiteDatabase;

interface FormRecord {
    id: number;
    applicant_uuid: string;
    purok: string | null;
    tag_number: string | null;
    barangay: string | null;
    admin_district: string | null;
    sex: string | null;
    civil_status: string | null;
    married_date: string | null;
    live_in_date: string | null;
    spouse_firstname: string | null;
    spouse_middlename: string | null;
    spouse_lastname: string | null;
    spouse_birthdate: string | null;
    present_address: string | null;
    housing_occupancy: string | null;
    lot_occupancy: string | null;
    number_of_families: number | null;
    year_renovated: number | null;
    year_resided: number | null;
    structure_type: string | null;
    structure_others: string | null;
    storeys: number | null;
    structure_owner_name: string | null;
    lot_owner_name: string | null;
    rent_without_consent_location: string | null;
    rent_without_consent_location_others: string | null;
    is_dangerzone: boolean; // Changed to boolean
    hazard: string | null;
    hazard_others: string | null;
    is_government_project: boolean; // Changed to boolean
    project_type: string | null;
    community_facility: string | null;
    other_project_type: string | null;
    is_davao_voter: boolean; // Changed to boolean
    is_court_order: boolean; // Changed to boolean
    not_davao_voter_place: string | null;
    is_remittance: boolean; // Changed to boolean
    have_property: boolean; // Changed to boolean
    is_awarded: boolean; // Changed to boolean
    awarded: string | null;
    date: string | null;
    attested_by: string | null;
    remarks: string | null;
    structure_uri: string | null;
    structure_name: string | null;
    structure_type_mime: string | null;
    attested_signature_uri: string | null;
    attested_signature_name: string | null;
    attested_signature_type: string | null;
    synced: number;
    created_at: string;
}

export const useFormsDatabase = () => {
    const [isFormsDbInitialized, setIsFormsDbInitialized] = useState(false);
    const [db, setDb] = useState<SQLiteDatabase | null>(null);

    useEffect(() => {
        const initializeDb = async () => {
            try {
                const database = await SQLite.openDatabaseAsync("forms.db");
                setDb(database);
                console.log("Database opened successfully:", database);

                await database.execAsync(`
                    PRAGMA journal_mode = WAL;
                    CREATE TABLE IF NOT EXISTS forms (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        applicant_uuid TEXT NOT NULL UNIQUE,
                        purok TEXT,
                        tag_number TEXT,
                        barangay TEXT,
                        admin_district TEXT,
                        sex TEXT,
                        civil_status TEXT,
                        married_date TEXT,
                        live_in_date TEXT,
                        spouse_firstname TEXT,
                        spouse_middlename TEXT,
                        spouse_lastname TEXT,
                        spouse_birthdate TEXT,
                        present_address TEXT,
                        housing_occupancy TEXT,
                        lot_occupancy TEXT,
                        number_of_families INTEGER,
                        year_renovated INTEGER,
                        year_resided INTEGER,
                        structure_type TEXT,
                        structure_others TEXT,
                        storeys INTEGER,
                        structure_owner_name TEXT,
                        lot_owner_name TEXT,
                        rent_without_consent_location TEXT,
                        rent_without_consent_location_others TEXT,
                        is_dangerzone INTEGER,
                        hazard TEXT,
                        hazard_others TEXT,
                        is_government_project INTEGER,
                        project_type TEXT,
                        community_facility TEXT,
                        other_project_type TEXT,
                        is_davao_voter INTEGER,
                        is_court_order INTEGER,
                        not_davao_voter_place TEXT,
                        is_remittance INTEGER,
                        have_property INTEGER,
                        is_awarded INTEGER,
                        awarded TEXT,
                        date TEXT,
                        attested_by TEXT,
                        remarks TEXT,
                        structure_uri TEXT,
                        structure_name TEXT,
                        structure_type_mime TEXT,
                        attested_signature_uri TEXT,
                        attested_signature_name TEXT,
                        attested_signature_type TEXT,
                        synced INTEGER DEFAULT 0,
                        created_at TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now'))
                    );
                `);
                console.log("Forms table created successfully or already exists.");
                setIsFormsDbInitialized(true);

            } catch (error: unknown) {
                let errorMessage = "An unknown error occurred.";
                if (error instanceof Error) {
                    errorMessage = error.message;
                } else if (typeof error === 'object' && error !== null && 'message' in error) {
                    errorMessage = (error as { message: string }).message;
                }
                console.error("Error initializing database or creating table:", errorMessage, error);
            }
        };

        initializeDb();

        // Optional: Close the database when the component unmounts
        return () => {
            if (db) {
                db.closeAsync().then(() => console.log("Database closed.")).catch(e => console.error("Error closing database:", e));
            }
        };
    }, []);

    const saveFormDataLocal = useCallback(async (applicant_uuid: string, formData: any) => {
        if (!db) {
            console.warn("Database not initialized. Cannot save form locally.");
            throw new Error("Database not initialized.");
        }

        const values = {
            applicant_uuid: applicant_uuid,
            purok: formData.purok ?? null,
            tag_number: formData.tag_number ?? null,
            barangay: formData.barangay ?? null,
            admin_district: formData.admin_district ?? null,
            sex: formData.sex ?? null,
            civil_status: formData.civil_status ?? null,
            married_date: formData.married_date ? format(formData.married_date, "yyyy-MM-dd") : null,
            live_in_date: formData.live_in_date ? format(formData.live_in_date, "yyyy-MM-dd") : null,
            spouse_firstname: formData.spouse_firstname ?? null,
            spouse_middlename: formData.spouse_middlename ?? null,
            spouse_lastname: formData.spouse_lastname ?? null,
            spouse_birthdate: formData.spouse_birthdate ? format(formData.spouse_birthdate, "yyyy-MM-dd") : null,
            present_address: formData.present_address ?? null,
            housing_occupancy: formData.housing_occupancy ?? null,
            lot_occupancy: formData.lot_occupancy ?? null,
            number_of_families: formData.number_of_families ?? null,
            year_renovated: formData.year_renovated ?? null,
            year_resided: formData.year_resided ?? null,
            structure_type: formData.structure_type ?? null,
            structure_others: formData.structure_others ?? null,
            storeys: formData.storeys ?? null,
            structure_owner_name: formData.structure_owner_name ?? null,
            lot_owner_name: formData.lot_owner_name ?? null,
            rent_without_consent_location: formData.rent_without_consent_location ?? null,
            rent_without_consent_location_others: formData.rent_without_consent_location_others ?? null,
            is_dangerzone: formData.is_dangerzone ? 1 : 0,
            hazard: formData.hazard ?? null,
            hazard_others: formData.hazard_others ?? null,
            is_government_project: formData.is_government_project ? 1 : 0,
            project_type: formData.project_type ?? null,
            community_facility: formData.community_facility ?? null,
            other_project_type: formData.other_project_type ?? null,
            is_davao_voter: formData.is_davao_voter ? 1 : 0,
            is_court_order: formData.is_court_order ? 1 : 0,
            not_davao_voter_place: formData.not_davao_voter_place ?? null,
            is_remittance: formData.is_remittance ? 1 : 0,
            have_property: formData.have_property ? 1 : 0,
            is_awarded: formData.is_awarded ? 1 : 0,
            awarded: formData.awarded ?? null,
            date: formData.date ? format(formData.date, "yyyy-MM-dd") : null,
            attested_by: formData.attested_by ?? null,
            remarks: formData.remarks ?? null,
            structure_uri: formData.structure?.uri ?? null,
            structure_name: formData.structure?.name ?? null,
            structure_type_mime: formData.structure?.type ?? null,
            attested_signature_uri: formData.attested_signature?.uri ?? null,
            attested_signature_name: formData.attested_signature?.name ?? null,
            attested_signature_type: formData.attested_signature?.type ?? null,
        };

        const columns = Object.keys(values).join(', ');
        const placeholders = Object.keys(values).map(() => '?').join(', ');
        const sqlValues = Object.values(values);

        const result = await db.runAsync(
            `INSERT INTO forms (${columns}) VALUES (${placeholders})`,
            sqlValues
        );
        console.log("Form saved locally with ID:", result.lastInsertRowId);
        return result.lastInsertRowId;

    }, [db]);

    const getPendingForms = useCallback(async () => {
        if (!db) {
            console.warn("Database not initialized. Cannot get pending forms.");
            return [];
        }
        const rows = await db.getAllAsync("SELECT * FROM forms WHERE synced = 0");
        const forms: FormRecord[] = rows.map((row: Record<string, any>) => {
            return {
                ...row,
                is_dangerzone: row.is_dangerzone === 1,
                is_government_project: row.is_government_project === 1,
                is_davao_voter: row.is_davao_voter === 1,
                is_court_order: row.is_court_order === 1,
                is_remittance: row.is_remittance === 1,
                have_property: row.have_property === 1,
                is_awarded: row.is_awarded === 1,
            } as FormRecord;
        });
        return forms;

    }, [db]);

    const markFormAsSynced = useCallback(async (id: number) => {
        if (!db) {
            console.warn("Database not initialized. Cannot mark form as synced.");
            throw new Error("Database not initialized.");
        }
        const result = await db.runAsync(
            "UPDATE forms SET synced = 1 WHERE id = ?",
            [id]
        );
        if (result.changes && result.changes > 0) {
            return true;
        } else {
            throw new Error("Form not found or already synced.");
        }
    }, [db]);

    const deleteSyncedForms = useCallback(async () => {
        if (!db) {
            console.warn("Database not initialized. Cannot delete synced forms.");
            return 0;
        }

        const result = await db.runAsync(
            "DELETE FROM forms WHERE synced = 1",
            []
        );
        return result.changes || 0;
    }, [db]);

    const syncOfflineData = useCallback(async (isManualTrigger = false): Promise<{ syncedCount: number; failedCount: number }> => {
        const networkState = await NetInfo.fetch();
        const currentlyConnectedAndReachable = networkState.isConnected && networkState.isInternetReachable;

        if (!currentlyConnectedAndReachable || !isFormsDbInitialized || !db) {
            if (isManualTrigger) {
                Toast.show({ title: "Sync Info", textBody: "Not connected or database not ready to sync.", type: ALERT_TYPE.INFO });
            }
            console.log("Not connected or forms DB not initialized. Skipping sync.");
            return { syncedCount: 0, failedCount: 0 };
        }

        console.log("Attempting to sync offline data from useFormsDatabase...");
        let formsSyncedCount = 0;
        let formsFailedCount = 0;

        try {
            const pendingForms: FormRecord[] = await getPendingForms();
            if (pendingForms.length === 0) {
                console.log("No pending forms to sync.");
                if (isManualTrigger) {
                    Toast.show({ title: "Sync Info", textBody: "No pending forms found to synchronize.", type: ALERT_TYPE.INFO });
                }
                return { syncedCount: 0, failedCount: 0 };
            }
            console.log(`${pendingForms.length} pending forms found. Syncing...`);

            for (const formRecord of pendingForms) {
                let retries = 0;
                const MAX_RETRIES = 3;
                const RETRY_DELAY = 2000;

                let formSyncedSuccessfully = false;

                while (retries < MAX_RETRIES && !formSyncedSuccessfully) {
                    try {
                        const formData = new FormData();
                        formData.append('applicant_uuid', formRecord.applicant_uuid);

                        const apiFieldMap: { [key: string]: string } = {
                            purok: 'purok', tag_number: 'tag_number', barangay: 'barangay', admin_district: 'admin_district',
                            sex: 'sex', civil_status: 'civil_status', married_date: 'married_date', live_in_date: 'live_in_date',
                            spouse_firstname: 'spouse_firstname', spouse_middlename: 'spouse_middlename', spouse_lastname: 'spouse_lastname',
                            spouse_birthdate: 'spouse_birthdate', present_address: 'present_address', housing_occupancy: 'housing_occupancy',
                            lot_occupancy: 'lot_occupancy', number_of_families: 'number_of_families', year_renovated: 'year_renovated',
                            year_resided: 'year_resided', structure_type: 'structure_type', structure_others: 'structure_others',
                            storeys: 'storeys', structure_owner_name: 'structure_owner_name', lot_owner_name: 'lot_owner_name',
                            rent_without_consent_location: 'rent_without_consent_location', rent_without_consent_location_others: 'rent_without_consent_location_others',
                            is_dangerzone: 'is_dangerzone', hazard: 'hazard', hazard_others: 'hazard_others',
                            is_government_project: 'is_government_project', project_type: 'project_type', community_facility: 'community_facility',
                            other_project_type: 'other_project_type', is_davao_voter: 'is_davao_voter', is_court_order: 'is_court_order',
                            not_davao_voter_place: 'not_davao_voter_place', is_remittance: 'is_remittance', have_property: 'have_property',
                            is_awarded: 'is_awarded', awarded: 'awarded', date: 'date', attested_by: 'attested_by', remarks: 'remarks',
                        };

                        for (const dbCol in apiFieldMap) {
                            const apiField = apiFieldMap[dbCol];
                            let value = formRecord[dbCol as keyof FormRecord];

                            if (typeof value === 'boolean') {
                                formData.append(apiField, value.toString());
                            } else if (value !== null && value !== undefined) {
                                formData.append(apiField, value.toString());
                            } else {
                                formData.append(apiField, '');
                            }
                        }

                        if (formRecord.structure_uri && formRecord.structure_name && formRecord.structure_type_mime) {
                            formData.append('structure', {
                                uri: formRecord.structure_uri,
                                name: formRecord.structure_name,
                                type: formRecord.structure_type_mime,
                            } as unknown as Blob);
                        }

                        if (formRecord.attested_signature_uri && formRecord.attested_signature_name && formRecord.attested_signature_type) {
                            formData.append('attested_signature', {
                                uri: formRecord.attested_signature_uri,
                                name: formRecord.attested_signature_name,
                                type: formRecord.attested_signature_type,
                            } as unknown as Blob);
                        }

                        console.log(`Attempting to upload pending form: ${formRecord.id} (Attempt ${retries + 1}/${MAX_RETRIES})`);
                        const response = await applicationService.saveApplication(formData);

                        if (response.data) {
                            await markFormAsSynced(formRecord.id);
                            console.log(`Form ${formRecord.id} successfully synced and marked.`);
                            formsSyncedCount++;
                            formSyncedSuccessfully = true;
                        } else {
                            console.warn(`API response for form ${formRecord.id} did not indicate success on attempt ${retries + 1}.`);
                            formsFailedCount++;
                            break;
                        }
                    } catch (uploadError: unknown) {
                        let errorMessage = "unknown error";
                        if (uploadError instanceof Error) {
                            errorMessage = uploadError.message;
                        } else if (typeof uploadError === 'object' && uploadError !== null && 'message' in uploadError) {
                            errorMessage = (uploadError as { message: string }).message;
                        }
                        console.error(`Failed to sync form ${formRecord.id} (Attempt ${retries + 1}/${MAX_RETRIES}):`, errorMessage);

                        if (errorMessage.includes('Network request failed') && retries < MAX_RETRIES - 1) {
                            console.log(`Network error detected for form ${formRecord.id}. Retrying in ${RETRY_DELAY / 1000} seconds...`);
                            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                            retries++;
                        } else {
                            formsFailedCount++;
                            if (isManualTrigger) {
                                Toast.show({ title: "Sync Error", textBody: `Failed to sync a form (${formRecord.id}): ${errorMessage}`, type: ALERT_TYPE.WARNING });
                            }
                            break;
                        }
                    }
                }
            }

            await deleteSyncedForms();

            if (isManualTrigger) {
                if (formsSyncedCount > 0) {
                    Toast.show({ title: "Sync Complete", textBody: `${formsSyncedCount} form(s) synchronized.`, type: ALERT_TYPE.SUCCESS });
                }
                if (formsFailedCount > 0) {
                    Toast.show({ title: "Sync Issues", textBody: `${formsFailedCount} form(s) failed to sync. Check console for details.`, type: ALERT_TYPE.WARNING });
                }
                if (formsSyncedCount === 0 && formsFailedCount === 0) {
                    Toast.show({ title: "Sync Info", textBody: "No pending forms found to synchronize.", type: ALERT_TYPE.INFO });
                }
            }

            return { syncedCount: formsSyncedCount, failedCount: formsFailedCount };

        } catch (error: unknown) {
            let errorMessage = "unknown error";
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'object' && error !== null && 'message' in error) {
                errorMessage = (error as { message: string }).message;
            }
            console.error("Error during offline data sync process:", errorMessage);
            if (isManualTrigger) {
                Toast.show({ title: "Sync Error", textBody: "An error occurred during offline data synchronization.", type: ALERT_TYPE.DANGER });
            }
            return { syncedCount: 0, failedCount: 0 };
        }
    }, [isFormsDbInitialized, getPendingForms, markFormAsSynced, deleteSyncedForms, db]);

    return {
        db,
        isFormsDbInitialized,
        saveFormDataLocal,
        getPendingForms,
        markFormAsSynced,
        deleteSyncedForms,
        syncOfflineData,
    };
};