import express from "express";
import type { Server } from "http";
class httpServer {
    private m_host: string;
    private m_port: number;
    private m_app: express.Application;
    private m_server?: Server;

    constructor(p_host: string, i_port: number) {
        this.m_host = p_host;
        this.m_port = i_port;
        this.m_app = express();
        this.setupRoutes();
    }
    public startServer(): void {
        this.m_server = this.m_app.listen(this.m_port, this.m_host, () => {
            console.log(`Server running on http://${this.m_host}:${this.m_port}`);
        });
    }
    public setupRoutes() {
        this.m_app.get("/api/health", (req, res) => {
            res.status(200).send("OK");
        });
        this.m_app.get("/api/pazienti/view", (req, res) => {
            res.status(200).send("Pazienti view");
        });
        this.m_app.post("/api/pazienti/add", (req, res) => {
            res.status(200).send("Pazienti add");
        });
        this.m_app.post("/api/pazienti/delete", (req, res) => {
            res.status(200).send("Pazienti delete");
        });
        this.m_app.get("/api/pazienti/update", (req, res) => {
            res.status(200).send("Pazienti update");
        });
    }
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