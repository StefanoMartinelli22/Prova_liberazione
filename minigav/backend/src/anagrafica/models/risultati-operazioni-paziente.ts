/**
 * @brief Esiti possibili delle operazioni sull'anagrafica dei pazienti.
 */
export enum EsitoOperazionePaziente {
    CREATO = 'CREATO',
    MODIFICATO = 'MODIFICATO',
    ELIMINATO = 'ELIMINATO',
    DATI_NON_VALIDI = 'DATI_NON_VALIDI',
    CF_GIA_PRESENTE = 'CF_GIA_PRESENTE',
    PAZIENTE_NON_TROVATO = 'PAZIENTE_NON_TROVATO'
}

/**
 * @brief Risultato dell'operazione di inserimento di un paziente.
 */
export interface RisultatoInserimentoPaziente {
    esito: EsitoOperazionePaziente;
    messaggio: string;
}

/**
 * @brief Risultato dell'operazione di modifica di un paziente.
 */
export interface RisultatoModificaPaziente {
    esito: EsitoOperazionePaziente;
    messaggio: string;
}

/**
 * @brief Risultato dell'operazione di eliminazione di un paziente.
 */
export interface RisultatoEliminazionePaziente {
    esito: EsitoOperazionePaziente;
    messaggio: string;
}
