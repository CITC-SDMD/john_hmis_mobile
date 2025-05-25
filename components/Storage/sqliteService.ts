import * as SQLite from 'expo-sqlite';

const getDBConnection = () => {
    const db = SQLite.openDatabase('todo-data.db');
    return db;
};

export default getDBConnection;
