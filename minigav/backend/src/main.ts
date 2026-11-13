// Punto di ingresso del backend MiniGAV.
import { HttpServer } from "./httpserver/http_server";

// Configurazione del server
const host: string = process.env.HOST || "localhost";
const port: number = parseInt(process.env.PORT || "3000", 10);

// Creazione e avvio del server HTTP
const server = new HttpServer(host, port);
server.startServer();   

