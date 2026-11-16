// Modello del paziente.
export interface Paziente {
    /** Identificativo generato da SQLite dopo l'inserimento. */
    id?: number;
    nome: string;
    cognome: string;
    data_nascita: string;
    codice_fiscale: string;
    telefono: string;
}
