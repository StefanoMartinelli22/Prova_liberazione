export interface Paziente {
  id: number;
  nome: string;
  cognome: string;
  data_nascita: string;
  codice_fiscale: string;
  telefono: string;
}

export interface PazienteDaCreare {
  nome: string;
  cognome: string;
  data_nascita: string;
  codice_fiscale: string;
  telefono: string;
}

export type EsitoOperazionePaziente =
  | 'CREATO'
  | 'MODIFICATO'
  | 'ELIMINATO'
  | 'DATI_NON_VALIDI'
  | 'CF_GIA_PRESENTE'
  | 'PAZIENTE_NON_TROVATO'
  | 'ERRORE_INTERNO';

export interface RisultatoOperazionePaziente {
  esito: EsitoOperazionePaziente;
  messaggio: string;
}
