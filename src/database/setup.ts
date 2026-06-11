import { RECIPE_SCHEMA } from '@/database/schema';
import { SQLiteDatabase } from 'expo-sqlite';


export async function setupDatabase(db: SQLiteDatabase) 
{
    const DATABASE_VERSION = 1;

    const fetchResult = await db.getFirstAsync<{user_version: number}>('PRAGMA user_version;'); // fetch db metadata (PRAGMA) user_version
    let currentDbVersion = fetchResult?.user_version ?? 0;

    if (currentDbVersion >= DATABASE_VERSION) {
        // up to date : no migration needed
        return; 
    }
    
    if (currentDbVersion === 0) {
        // first initialization : create tables
        initialize(db);
    }
    else if(currentDbVersion < DATABASE_VERSION){
        // not up to date : needs migration
        // TODO : implement migration strategy
        migrate(db);
    }

    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION};`);
}

async function initialize(db: SQLiteDatabase) {
    try {
        await db.execAsync(RECIPE_SCHEMA);
        console.log('[db] Database schemas verified and initialized successfully.');
    } catch (error) {
        console.error('[db] Critical Error: Failed to initialize local database:', error);
        throw error;
    }
}

async function migrate(db: SQLiteDatabase) {
    console.log('[db] Database migration not implemented yet.');
}
