/**
 * @file main.ts
 * @brief Punto di ingresso del backend MiniGAV.
 *
 * Legge la configurazione del server, crea l'istanza di HttpServer e ne
 * avvia l'ascolto delle richieste HTTP.
 */
import { HttpServer } from "./httpserver/http_server";

/** @brief Indirizzo su cui il server HTTP resta in ascolto. */
const host: string = process.env.HOST || "localhost";

/** @brief Porta TCP su cui il server HTTP resta in ascolto. */
const port: number = parseInt(process.env.PORT || "3000", 10);

/** @brief Istanza responsabile del ciclo di vita del server HTTP. */
const server = new HttpServer(host, port);

/** @brief Avvia il server HTTP configurato. */
server.startServer();   

