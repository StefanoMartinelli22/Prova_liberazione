import {DatabaseHandler} from "../database/database_handler";
import {Paziente} from "../anagrafica/models/paziente";


console.log("Inizio test database");
const dbHandler = new DatabaseHandler("test.db");
const paziente1: Paziente = {
    nome: "Mario",
    cognome: "Rossi",
    data_nascita: "1990-01-01",
    codice_fiscale: "MRARSS90A01H501Z",
    telefono: "1234567890"
};

const paziente2: Paziente = {
    nome: "Luigi",
    cognome: "Verdi",
    data_nascita: "1985-05-15",
    codice_fiscale: "LGVVD85E15H501Y",
    telefono: "0987654321"
};

dbHandler.CreaPaziente(paziente1);
dbHandler.CreaPaziente(paziente2);

console.log("Pazienti inseriti nel database:");
dbHandler.MostraPazienti();

dbHandler.EliminaPaziente(paziente1);

console.log("Dopo l'eliminazione di Mario Rossi:");
dbHandler.MostraPazienti();

console.log("Fine test database");
