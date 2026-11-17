import express from "express";
import type { Server } from "http";
import { anagrafica } from "../anagrafica/anagrafica";
import cors from 'cors';
import { EsitoOperazionePaziente } from "../anagrafica/models/risultati-operazioni-paziente";
/**
 * @brief Gestisce il server HTTP dell'applicazione MiniGAV.
 *
 * Configura l'applicazione Express, registra le route API e ne gestisce
 * l'avvio e l'arresto sulla rete.
 */
export class HttpServer {
    /** @brief Indirizzo di rete su cui il server ascolta. */
    private m_host: string;

    /** @brief Porta TCP usata dal server HTTP. */
    private m_port: number;

    /** @brief Applicazione Express su cui sono configurate le route. */
    private m_app: express.Application;

    /** @brief Server HTTP Node.js creato all'avvio; assente se non avviato. */
    private m_server?: Server;

    /** @brief Servizio applicativo delegato dalle route relative ai pazienti. */
    private m_anagrafica: anagrafica;

    /**
     * @brief Crea e configura il server HTTP.
     * @param p_host Indirizzo di rete su cui il server dovrà ascoltare.
     * @param p_port Porta TCP su cui il server dovrà ascoltare.
     * @param p_anagrafica Servizio che gestisce i casi d'uso dei pazienti.
     * @returns Non restituisce alcun valore.
     *
     * Inizializza Express e registra tutte le route dell'applicazione, ma non
     * avvia ancora l'ascolto delle richieste.
     */
    constructor(p_host: string, p_port: number, p_anagrafica: anagrafica) {
        this.m_host = p_host;
        this.m_port = p_port;
        this.m_app = express();
        this.m_app.use(cors({
            origin: 'http://localhost:4200',
            methods: ['GET', 'POST', 'DELETE'],
        }));
        this.m_app.use(express.json());
        this.m_anagrafica = p_anagrafica;
        this.setupRoutes();
    }

    /**
     * @brief Avvia il server HTTP.
     * @returns Non restituisce alcun valore.
     *
     * Mette l'applicazione Express in ascolto sull'host e sulla porta
     * configurati, conservando il server Node.js creato per poterlo chiudere.
     */
    public startServer(): void {
        this.m_server = this.m_app.listen(this.m_port, this.m_host, () => {
            console.log(`Server running on http://${this.m_host}:${this.m_port}`);
        });
    }

    /**
     * @brief Registra gli endpoint HTTP esposti dall'applicazione.
     * @returns Non restituisce alcun valore.
     *
     * Associa percorsi e metodi HTTP agli handler Express. Gli handler delegano
     * le operazioni sui pazienti al servizio Anagrafica.
     */
    public setupRoutes() {
        this.m_app.get("/api/health", (req, res) => {
            res.status(200).send("OK");
        });
        this.m_app.get("/api/pazienti/view", (req, res) => {
            const l_pazienti = this.m_anagrafica.mostraPazienti();
            res.status(200).json(l_pazienti);
        });
        this.m_app.post("/api/pazienti/add", (req, res) => {
            try {
                const risultato = this.m_anagrafica.inserisciPaziente(req.body);
                if (risultato.esito === EsitoOperazionePaziente.DATI_NON_VALIDI) {
                    res.status(400).json(risultato);
                }
                else if (risultato.esito === EsitoOperazionePaziente.CF_GIA_PRESENTE) {
                    res.status(409).json(risultato);
                }
                else {
                    res.status(201).json(risultato);
                }
            } catch (errore) {
                console.error('Errore durante la creazione del paziente:', errore);
                res.status(500).json({
                    esito: 'ERRORE_INTERNO',
                    messaggio: 'Errore interno del server.'
                });
            }
        });
        this.m_app.delete("/api/pazienti/delete", (req, res) => {

            const risultato = this.m_anagrafica.eliminaPaziente(req.body);
            if (risultato.esito === EsitoOperazionePaziente.DATI_NON_VALIDI) {
                res.status(400).json({ messaggio: risultato.messaggio });
            } else {
                res.status(200).json({ messaggio: risultato.messaggio });
            }

        });

        this.m_app.get("/api/pazienti/update", (req, res) => {
            res.status(500).send("Errore Interno del Server");
            res.status(200).send("Pazienti update");

        });
    }

    /**
     * @brief Arresta il server HTTP se è in esecuzione.
     * @returns Non restituisce alcun valore.
     *
     * Chiude il server Node.js e termina l'accettazione di nuove richieste.
     * Se il server non è stato avviato, segnala la condizione nella console.
     */
    public closeServer() {
        if (!this.m_server) {
            console.log("Server is not running");
            return;
        }
        this.m_server.close(() => {
            console.log("Server closed");
        });
    }
}
