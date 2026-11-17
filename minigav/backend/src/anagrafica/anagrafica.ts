/**
 * @file anagrafica.ts
 * @brief Servizio che gestisce le regole dell'anagrafica pazienti.
 */
import { Paziente } from './models/paziente';
import { DatabaseHandler } from '../database/database_handler';
import { CodiceFiscaleDuplicatoError } from '../database/errors/codice-fiscale-duplicato-error';
import {
    EsitoOperazionePaziente,
    RisultatoEliminazionePaziente,
    RisultatoInserimentoPaziente
} from './models/risultati-operazioni-paziente';

/**
 * @brief Coordina validazione dei pazienti e persistenza su database.
 *
 * Riceve richieste dall'HTTP server, applica le regole applicative e delega
 * a DatabaseHandler le sole operazioni SQLite. Non contiene dettagli Express
 * né query SQL.
 */
export class anagrafica {
    /** @brief Gestore del database usato per salvare e leggere i pazienti. */
    private m_dbHandler: DatabaseHandler;


    /**
     * @brief Crea il servizio anagrafico.
     * @param p_dbHandler Istanza che gestisce la persistenza SQLite.
     * @returns Non restituisce alcun valore.
     */
    constructor(p_dbHandler: DatabaseHandler) {
        this.m_dbHandler = p_dbHandler;
    }

    /**
     * @brief Valida e salva un nuovo paziente.
     * @param p_paziente Dati del paziente da verificare e inserire.
     * @returns Non restituisce alcun valore.
     * @throws Error Se il paziente manca o non rispetta le regole di validazione.
     *
     * Controlla i dati obbligatori, codice fiscale, telefono e data di nascita;
     * dopo la validazione delega l'inserimento a DatabaseHandler.
     */
    public inserisciPaziente(p_paziente: Paziente): RisultatoInserimentoPaziente {
        if (!p_paziente) {
            return { esito: EsitoOperazionePaziente.DATI_NON_VALIDI, messaggio: "Oggetto paziente non fornito." };


        }
        if (!p_paziente.nome || !p_paziente.cognome || !p_paziente.data_nascita || !p_paziente.codice_fiscale || !p_paziente.telefono) {

            return { esito: EsitoOperazionePaziente.DATI_NON_VALIDI, messaggio: "Dati del paziente incompleti." };
        }
        if (!this.validaCodiceFiscale(p_paziente.codice_fiscale)) {
            return { esito: EsitoOperazionePaziente.DATI_NON_VALIDI, messaggio: "Codice fiscale non valido. Deve essere lungo 16 caratteri." };
        }

        if (!this.validaTelefono(p_paziente.telefono)) {
            return { esito: EsitoOperazionePaziente.DATI_NON_VALIDI, messaggio: "Numero di telefono non valido. Deve essere lungo tra 10 e 15 caratteri." };
        }
        if (!this.validaDataNascita(p_paziente.data_nascita)) {
            return { esito: EsitoOperazionePaziente.DATI_NON_VALIDI, messaggio: "Data di nascita non valida." };
        }
        try {
            this.m_dbHandler.CreaPaziente(p_paziente);
            return {
                esito: EsitoOperazionePaziente.CREATO,
                messaggio: 'Paziente inserito con successo.'
            };
        } catch (errore) {
            if (errore instanceof CodiceFiscaleDuplicatoError) {
                return { esito: EsitoOperazionePaziente.CF_GIA_PRESENTE, messaggio: "Codice fiscale già presente nel database." };
            }

            throw errore;
        }
    }

    /**
     * @brief Valida ed elimina un paziente tramite codice fiscale.
     * @param p_paziente Oggetto che contiene il codice fiscale da eliminare.
     * @returns Non restituisce alcun valore.
     * @throws Error Se manca il paziente o il suo codice fiscale non è valido.
     */
    public eliminaPaziente(p_paziente: Paziente): RisultatoEliminazionePaziente {
        if (!p_paziente) {

            return { esito: EsitoOperazionePaziente.DATI_NON_VALIDI, messaggio: "Oggetto paziente non fornito." };
        }
        if (!p_paziente.codice_fiscale || !this.validaCodiceFiscale(p_paziente.codice_fiscale)) {
            return { esito: EsitoOperazionePaziente.DATI_NON_VALIDI, messaggio: "Codice fiscale del paziente non valido." };
        }

        this.m_dbHandler.EliminaPaziente(p_paziente);
        return { esito: EsitoOperazionePaziente.ELIMINATO, messaggio: 'Paziente eliminato con successo.' };
    }

    /**
     * @brief Richiede la visualizzazione di tutti i pazienti.
     * @returns Non restituisce alcun valore.
     *
     * Delega la lettura completa al DatabaseHandler.
     */
    public mostraPazienti(): Paziente[] {
        return this.m_dbHandler.MostraPazienti();
    }

    /**
     * @brief Verifica il formato minimo di un codice fiscale.
     * @param codiceFiscale Testo del codice fiscale da verificare.
     * @returns `true` se contiene 16 caratteri alfanumerici maiuscoli; altrimenti `false`.
     */
    private validaCodiceFiscale(codiceFiscale: string): boolean {
        if (codiceFiscale.length !== 16) {
            return false;
        }
        const l_regex = /^[A-Z0-9]+$/;
        return l_regex.test(codiceFiscale);
    }

    /**
     * @brief Verifica il formato minimo di un numero di telefono.
     * @param telefono Numero di telefono da verificare.
     * @returns `true` se contiene solo cifre ed è lungo da 10 a 15 caratteri.
     */
    private validaTelefono(telefono: string): boolean {
        if (telefono.length < 10 || telefono.length > 15) {
            return false;
        }
        const l_regex = /^[0-9]+$/;
        return l_regex.test(telefono);
    }

    /**
     * @brief Verifica il formato ISO della data di nascita.
     * @param dataNascita Data da verificare nel formato `YYYY-MM-DD`.
     * @returns `true` se la stringa è convertibile in una data JavaScript; altrimenti `false`.
     */
    private validaDataNascita(dataNascita: string): boolean {
        const l_regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!l_regex.test(dataNascita)) {
            return false;
        }
        const l_data = new Date(dataNascita);
        return !isNaN(l_data.getTime());
    }
}

