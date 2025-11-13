import * as SQLite from 'expo-sqlite';
import CryptoJS from 'crypto-js';

const db = SQLite.openDatabase('dadoSaude.db');

export const initializeDatabase = async () => {
    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS Usuarios (
            id INTEGER PRIMARY KEY NOT NULL,
            nome TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            senha_hash TEXT NOT NULL
        );
    `);
};

export const buscarUsuarioPorEmail = async (email) => {
    if (!db) {
        await initializeDatabase();
    }
    const result = await db.getFirstAsync('SELECT id, nome, senha_hash FROM Usuarios WHERE email = ?;', [email]);
    return result;
};

 export const cadastrarUsuario = async (email, senhaHash, nome) => {
    if (!db) {
        await initializeDatabase();
    }
    
    const existingUser = await buscarUsuarioPorEmail(email); 
    
    if (existingUser) {
        throw new Error('Este e-mail já está cadastrado.');
    }
    
    try {
        await db.runAsync(
            'INSERT INTO Usuarios (nome, email, senha_hash) VALUES (?, ?, ?);',
            [nome, email, senhaHash]
         );
    } catch (error) {
        throw new Error('Falha ao cadastrar usuário. Tente novamente.');
    }
};
 
export const logAllUsers = async () => {
    if (!db) {
        await initializeDatabase();
     }
    try {
        const results = await db.getAllAsync('SELECT id, nome, email, senha_hash FROM Usuarios;');
        
        console.log("--- DADOS DOS USUÁRIOS SALVOS ---");
        console.table(results);
        console.log("---------------------------------");
        
        return results;
    } catch (error) {
        console.error("Erro ao tentar visualizar usuários: ", error.message);
        return [];
    }
};