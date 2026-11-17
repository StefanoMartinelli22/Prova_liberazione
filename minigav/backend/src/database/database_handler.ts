/**
 * @file database_handler.ts
 * @brief Accesso e persistenza dei dati paziente tramite SQLite.
 */
import Database from "better-sqlite3";
import type { Paziente } from "../anagrafica/models/paziente.ts";
import { CodiceFiscaleDuplicatoError } from './errors/codice-fiscale-duplicato-error';

/**
 * @brief Gestisce la connessione SQLite e le query sulla tabella pazienti.
 *
 * La classe apre il database locale, inizializza lo schema necessario e offre
 * operazioni di inserimento, eliminazione e lettura dei pazienti. Non applica
 * regole di business né gestisce richieste HTTP.
 */
export class DatabaseHandler {
    /** @brief Connessione attiva al database SQLite. */
    private m_db: Database.Database;

    /** @brief Percorso del file SQLite aperto dalla connessione. */
    private m_dbPath: string;

    /** @brief Collezione locale riservata a un eventuale uso futuro in memoria. */
    private m_pazienti: Paziente[] = [];

    /**
     * @brief Apre il database e ne inizializza la struttura.
     * @param p_dbPath Percorso del file SQLite da aprire o creare.
     * @returns Non restituisce alcun valore.
     *
     * Crea la connessione e garantisce che la tabella `pazienti` sia
     * disponibile prima delle successive operazioni.
     */
    constructor(p_dbPath: string) {
        this.m_dbPath = p_dbPath;
        this.m_db = new Database(this.m_dbPath);
        this.initializeDatabase();
    }

    /**
     * @brief Crea la tabella pazienti se non è già presente.
     * @returns Non restituisce alcun valore.
     *
     * Esegue lo schema SQL iniziale mediante `CREATE TABLE IF NOT EXISTS`,
     * senza alterare le tabelle e i dati già esistenti.
     */
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

    /**
     * @brief Inserisce un nuovo paziente nella tabella SQLite.
     * @param m_paziente Dati del paziente già validati da salvare.
     * @returns Non restituisce alcun valore.
     *
     * Prepara una query parametrizzata e inserisce i dati ricevuti. SQLite
     * applica i vincoli definiti nello schema, incluso il codice fiscale unico.
     */
    public CreaPaziente(m_paziente: Paziente): void {

        const l_statement = this.m_db.prepare(`
            INSERT INTO pazienti (nome, cognome, data_nascita, codice_fiscale, telefono)
            VALUES (@nome, @cognome, @data_nascita, @codice_fiscale, @telefono)
        `);

        try {
            l_statement.run(m_paziente);
        } catch (errore) {
            if (
                errore instanceof Database.SqliteError &&
                errore.code === 'SQLITE_CONSTRAINT_UNIQUE'
            ) {
                throw new CodiceFiscaleDuplicatoError();
            }

            throw errore;
        }

    }

    /**
     * @brief Elimina un paziente in base al codice fiscale.
     * @param m_paziente Oggetto che contiene il codice fiscale del paziente.
     * @returns Non restituisce alcun valore.
     *
     * Esegue una query parametrizzata `DELETE`; le altre proprietà dell'oggetto
     * paziente non partecipano alla selezione della riga da eliminare.
     */
    public EliminaPaziente(m_paziente: Paziente): void {
        const l_statement = this.m_db.prepare(`
            DELETE FROM pazienti WHERE codice_fiscale = @codice_fiscale
        `);
        l_statement.run(m_paziente);
    }

    /**
     * @brief Legge e mostra tutti i pazienti registrati.
     * @returns Un array contenente tutti i pazienti registrati.
     *
     * Esegue una `SELECT` senza filtri e stampa nella console tutte le righe
     * ottenute. In una fase successiva il metodo restituirà l'elenco al
     * chiamante, invece di stamparlo direttamente.
     */
    public MostraPazienti(): Paziente[] {
        const l_statement = this.m_db.prepare("SELECT * FROM pazienti");
        const l_pazienti = l_statement.all() as Paziente[];
        console.log("Pazienti nel database:", l_pazienti);
        return l_pazienti;
    }
}
