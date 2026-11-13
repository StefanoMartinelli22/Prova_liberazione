import Database from "better-sqlite3";
import type { Paziente } from "../anagrafica/models/paziente";

export class DatabaseHandler {
    private m_db: Database.Database;
    private m_dbPath: string;
    private m_pazienti: Paziente[] = [];

    constructor(private p_dbPath: string) {
        this.m_dbPath = p_dbPath;
        this.m_db = new Database(this.m_dbPath);
        this.initializeDatabase();
    }
    private initializeDatabase() {
        this.m_db.exec(`
            CREATE TABLE IF NOT EXISTS pazienti (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                cognome TEXT NOT NULL,
                data_nascita TEXT NOT NULL,
                codice_fiscale TEXT NOT NULL UNIQUE,
                telefono TEXT)            
        `);
    }
    public CreaPaziente(m_paziente: Paziente): void {
        const l_statement = this.m_db.prepare(`
            INSERT INTO pazienti (nome, cognome, data_nascita, codice_fiscale, telefono)
            VALUES (@s_nome, @s_cognome, @s_data_nascita, @s_codice_fiscale, @s_telefono)
        `);
        l_statement.run(m_paziente);

    }
}
