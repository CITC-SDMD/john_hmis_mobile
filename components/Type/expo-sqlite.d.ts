declare module 'expo-sqlite' {
    export function openDatabaseAsync(
        name: string,
        version?: string,
        description?: string,
        size?: number,
        callback?: (db: any) => void
    ): any;
}