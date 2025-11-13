import * as SQLite from 'expo-sqlite';
import CryptoJS from 'crypto-js';

let db = null;

const getDb = async () => {
    if (db === null) {
        db = await SQLite.openDatabaseAsync('dadoSaude.db');
    }
    return db;
};

export const initializeDatabase = async () => {
    const dbInstance = await getDb();
    await dbInstance.execAsync(`
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
    const dbInstance = await getDb();
    const result = await dbInstance.getFirstAsync('SELECT id, nome, senha_hash FROM Usuarios WHERE email = ?;', [email]);
    return result;
};

export const cadastrarUsuario = async (email, senhaHash, nome) => {
    const existingUser = await buscarUsuarioPorEmail(email); 
    
    if (existingUser) {
        return { success: false, message: 'Este e-mail já está cadastrado.' }; 
    }
    
    try {
        const dbInstance = await getDb();
        await dbInstance.runAsync(
            'INSERT INTO Usuarios (nome, email, senha_hash) VALUES (?, ?, ?);',
            [nome, email, senhaHash]
        );
        return { success: true };
    } catch (error) {
        return { success: false, message: 'Falha ao cadastrar usuário. Tente novamente.' };
    }
};

export const atualizarSenha = async (email, newSenhaHash) => {
    const existingUser = await buscarUsuarioPorEmail(email); 

    if (!existingUser) {
        throw new Error('Usuário não encontrado.');
    }
    
    try {
        const dbInstance = await getDb();
        await dbInstance.runAsync(
            'UPDATE Usuarios SET senha_hash = ? WHERE email = ?;',
            [newSenhaHash, email]
        );
    } catch (error) {
        throw new Error('Falha ao atualizar a senha.');
    }
};

export const logAllUsers = async () => {
    const dbInstance = await getDb();
    try {
        const results = await dbInstance.getAllAsync('SELECT id, nome, email, senha_hash FROM Usuarios;');
        
        console.log("--- DADOS DOS USUÁRIOS SALVOS ---");
        console.table(results);
        console.log("---------------------------------");
        
        return results;
    } catch (error) {
        console.error("Erro ao tentar visualizar usuários: ", error.message);
        return [];
    }
};