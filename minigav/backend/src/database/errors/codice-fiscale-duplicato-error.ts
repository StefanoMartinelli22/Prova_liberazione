/**
 * @brief Segnala il tentativo di inserire un codice fiscale già registrato.
 *
 * Espone al livello applicativo un errore indipendente da SQLite.
 */
export class CodiceFiscaleDuplicatoError extends Error {
    constructor() {
        super('Esiste già un paziente con questo codice fiscale.');
        this.name = 'CodiceFiscaleDuplicatoError';
    }
}
