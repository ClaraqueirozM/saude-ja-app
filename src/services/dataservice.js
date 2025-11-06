import * as SQLite from 'expo-sqlite';


let db;


export const initializeDatabase = async () => {
    try {
        
        db = await SQLite.openDatabaseAsync('dadoSaude.db');
        
        
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS Usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL UNIQUE,
                senha_hash TEXT NOT NULL,
                nome TEXT NOT NULL
            );
        `);
        
        console.log("Banco de dados inicializado com sucesso (Nova API).");
        return true;
        
    } catch (e) {
        console.error("Erro CRÍTICO ao inicializar DB (Nova API):", e);
        
        throw new Error(`Falha ao inicializar o banco: ${e.message}`);
    }
};


export const cadastrarUsuario = async (email, senhaHash, nome) => {
    
    if (!db) {
        await initializeDatabase();
    }

    try {
        
        const result = await db.runAsync(
            'INSERT INTO Usuarios (email, senha_hash, nome) VALUES (?, ?, ?);',
            [email, senhaHash, nome]
        );
        return result.lastInsertRowId; 
        
    } catch (error) {
        console.error("Erro ao cadastrar usuário (Nova API): ", error);
        
       
        if (error.message && error.message.includes('UNIQUE constraint failed')) { 
            throw new Error("Este e-mail já está cadastrado.");
        } else {
            throw new Error("Erro ao salvar usuário no banco de dados.");
        }
    }
};


export const buscarUsuarioPorEmail = async (email) => {
    if (!db) {
        await initializeDatabase();
    }

    try {
       
        const usuario = await db.getFirstAsync(
            'SELECT * FROM Usuarios WHERE email = ?;',
            [email]
        );
        
        return usuario || null; 
        
    } catch (error) {
        console.error("Erro ao buscar usuário (Nova API): ", error);
        throw new Error("Erro ao buscar usuário no banco de dados.");
    }
};