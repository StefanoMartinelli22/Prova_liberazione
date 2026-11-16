/**
 * @file main.ts
 * @brief Punto di ingresso del backend MiniGAV.
 *
 * Legge la configurazione, crea i componenti dell'applicazione e collega le
 * dipendenze DatabaseHandler, Anagrafica e HttpServer.
 */
import { HttpServer } from "./httpserver/http_server";
import { DatabaseHandler } from "./database/database_handler";
import { anagrafica } from "./anagrafica/anagrafica";

/** @brief Indirizzo su cui il server HTTP resta in ascolto. */
const host: string = process.env.HOST || "localhost";

/** @brief Porta TCP su cui il server HTTP resta in ascolto. */
const port: number = parseInt(process.env.PORT || "3000", 10);

/** @brief Percorso del file SQLite usato per la persistenza locale. */
const dbPath: string = process.env.DB_PATH || "minigav.db";

/** @brief Gestore della connessione SQLite e della persistenza dei pazienti. */
const databaseHandler = new DatabaseHandler(dbPath);

/** @brief Servizio che applica le regole di gestione dell'anagrafica. */
const anagraficaService = new anagrafica(databaseHandler);

/** @brief Istanza responsabile del ciclo di vita del server HTTP. */
const server = new HttpServer(host, port, anagraficaService);

/** @brief Avvia il server HTTP configurato. */
server.startServer();
