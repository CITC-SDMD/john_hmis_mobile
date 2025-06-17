import * as SQLite from 'expo-sqlite';

// CRITICAL CHANGE: db needs to be awaited once to get the database object
// It should not be a Promise that's then directly used with .transaction()
const dbPromise = SQLite.openDatabaseAsync('offline_CensusForms.db'); // This returns a Promise

export const initDb = async () => { // Make initDb async
    let db;
    try {
        db = await dbPromise; // Await the promise to get the actual database object
        await db.transactionAsync(async tx => { // Use async transactions for better error handling
            await tx.executeSqlAsync( // Use executeSqlAsync
                `CREATE TABLE IF NOT EXISTS forms (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          applicant_uuid TEXT NOT NULL,
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
          number_of_families TEXT,
          year_renovated TEXT,
          year_resided TEXT,
          structure_type TEXT,
          structure_others TEXT,
          storeys TEXT,
          structure_owner_name TEXT,
          lot_owner_name TEXT,
          rent_without_consent_location TEXT,
          rent_without_consent_location_others TEXT,
          is_dangerzone INTEGER, -- SQLite stores booleans as 0 or 1
          hazard TEXT,
          hazard_others TEXT,
          is_government_project INTEGER,
          project_type TEXT,
          community_facility TEXT,
          other_project_type TEXT,
          is_davao_voter INTEGER,
          is_court_order TEXT,
          not_davao_voter_place TEXT,
          is_remittance TEXT,
          have_property TEXT,
          is_awarded TEXT,
          awarded TEXT,
          date TEXT,
          structure_uri TEXT,  -- Store only the URI for the structure
          structure_name TEXT, -- Store name for reconstruction of file object
          structure_type_mime TEXT, -- Store mime type for reconstruction
          attested_by TEXT,
          attested_signature_uri TEXT, // Assuming this is also a URI if it's a file
          attested_signature_name TEXT,
          attested_signature_type TEXT,
          remarks TEXT,
          sync_status TEXT DEFAULT 'pending'
        );`,
                []
            );
            console.log('Forms table created or already exists.');
        });
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error; // Re-throw to propagate the error
    }
};

// You need a way to get the *resolved* database object for other functions.
// A common pattern is to export the promise and await it in each function,
// or store the resolved db in a module-level variable after initDb is called.
// Let's modify the functions to await dbPromise.
// Alternatively, you could have a single, globally accessible `getDb` function
// that ensures the db is initialized and returns the instance.

// Let's refactor to ensure db is initialized before use.
let _db = null; // Private variable to hold the actual database object

// Helper to get the DB instance, initializing if necessary
const getDb = async () => {
    if (!_db) {
        _db = await dbPromise; // Resolve the promise once
    }
    return _db;
};


export const saveFormDataLocal = async (uuid, form) => {
    const db = await getDb(); // Get the initialized DB instance
    // ... (rest of your saveFormDataLocal function)
    return new Promise((resolve, reject) => {
        // CRITICAL CHANGE: Use db.transactionAsync with await
        db.transactionAsync(async tx => {
            const columns = [
                'applicant_uuid', 'purok', 'tag_number', 'barangay', 'admin_district', 'sex',
                'civil_status', 'married_date', 'live_in_date', 'spouse_firstname',
                'spouse_middlename', 'spouse_lastname', 'spouse_birthdate', 'present_address',
                'housing_occupancy', 'lot_occupancy', 'number_of_families', 'year_renovated',
                'year_resided', 'structure_type', 'structure_others', 'storeys',
                'structure_owner_name', 'lot_owner_name', 'rent_without_consent_location',
                'rent_without_consent_location_others', 'is_dangerzone', 'hazard',
                'hazard_others', 'is_government_project', 'project_type', 'community_facility',
                'other_project_type', 'is_davao_voter', 'is_court_order',
                'not_davao_voter_place', 'is_remittance', 'have_property', 'is_awarded',
                'awarded', 'date', 'structure_uri', 'structure_name', 'structure_type_mime',
                'attested_by', 'attested_signature_uri', 'attested_signature_name', 'attested_signature_type',
                'remarks', 'sync_status'
            ];

            const values = [
                uuid,
                form.purok ?? '',
                form.tag_number ?? '',
                form.barangay ?? '',
                form.admin_district ?? '',
                form.sex ?? '',
                form.civil_status ?? '',
                form.married_date ? form.married_date.toISOString().split('T')[0] : null,
                form.live_in_date ? form.live_in_date.toISOString().split('T')[0] : null,
                form.spouse_firstname ?? '',
                form.spouse_middlename ?? '',
                form.spouse_lastname ?? '',
                form.spouse_birthdate ? form.spouse_birthdate.toISOString().split('T')[0] : null,
                form.present_address ?? '',
                form.housing_occupancy ?? '',
                form.lot_occupancy ?? '',
                form.number_of_families ?? '',
                form.year_renovated ?? '',
                form.year_resided ?? '',
                form.structure_type ?? '',
                form.structure_others ?? '',
                form.storeys ?? '',
                form.structure_owner_name ?? '',
                form.lot_owner_name ?? '',
                form.rent_without_consent_location ?? '',
                form.rent_without_consent_location_others ?? '',
                form.is_dangerzone ? 1 : 0,
                form.hazard ?? '',
                form.hazard_others ?? '',
                form.is_government_project ? 1 : 0,
                form.project_type ?? '',
                form.community_facility ?? '',
                form.other_project_type ?? '',
                form.is_davao_voter ? 1 : 0,
                form.is_court_order ?? '',
                form.not_davao_voter_place ?? '',
                form.is_remittance ?? '',
                form.have_property ?? '',
                form.is_awarded ?? '',
                form.awarded ?? '',
                form.date ?? '',
                form.structure?.uri ?? null,
                form.structure?.name ?? null,
                form.structure?.type ?? null,
                form.attested_by ?? '',
                form.attested_signature?.uri ?? null,
                form.attested_signature?.name ?? null,
                form.attested_signature?.type ?? null,
                form.remarks ?? '',
                'pending'
            ];

            const placeholders = columns.map(() => '?').join(', ');
            const sql = `INSERT INTO forms (${columns.join(', ')}) VALUES (${placeholders});`;

            const result = await tx.executeSqlAsync(sql, values); // Use executeSqlAsync
            console.log('Form data saved locally (pending):', result.insertId);
            resolve(result.insertId);
        }).catch(error => { // Catch errors from transactionAsync
            console.error('Error saving form data locally:', error);
            reject(error);
        });
    });
};

export const getPendingForms = async () => {
    const db = await getDb();
    try {
        const result = await db.getAllAsync(`SELECT * FROM forms WHERE sync_status = 'pending';`); // Use getAllAsync
        console.log('Pending forms retrieved:', result.length);
        return result; // getAllAsync directly returns the array
    } catch (error) {
        console.error('Error getting pending forms:', error);
        throw error;
    }
};

export const markFormAsSynced = async (id) => {
    const db = await getDb();
    try {
        const result = await db.runAsync(`UPDATE forms SET sync_status = 'synced' WHERE id = ?;`, [id]); // Use runAsync
        console.log('Form marked as synced:', id);
        return result.changes > 0; // runAsync returns { changes, lastInsertRowId }
    } catch (error) {
        console.error('Error marking form as synced:', error);
        throw error;
    }
};

export const deleteSyncedForms = async () => {
    const db = await getDb();
    try {
        const result = await db.runAsync(`DELETE FROM forms WHERE sync_status = 'synced';`); // Use runAsync
        console.log('Deleted synced forms:', result.changes);
        return result.changes;
    } catch (error) {
        console.error('Error deleting synced forms:', error);
        throw error;
    }
};