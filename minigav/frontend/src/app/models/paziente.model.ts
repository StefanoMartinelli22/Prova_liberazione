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