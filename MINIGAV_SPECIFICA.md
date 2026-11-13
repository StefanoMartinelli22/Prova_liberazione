# MiniGAV

> Documento di riferimento del progetto - specifica di alto livello, architettura, ambiente e piano di sviluppo

| Progetto | Versione documento | Pianificazione | Destinazione |
| --- | --- | --- | --- |
| MiniGAV - Anagrafiche pazienti | 0.1 - baseline iniziale | 16-19 novembre 2026 | Repository GitHub del progetto |

MiniGAV è una **piccola piattaforma web didattica** per registrare e consultare anagrafiche di pazienti fittizi. Il progetto ha l’obiettivo di consolidare competenze di sviluppo full-stack attraverso un flusso completo: interfaccia Angular, API Node.js/TypeScript, persistenza SQL e caching Redis.

> **Ambito didattico** — Il nome e il caso d’uso sono ispirati al settore dei gestionali per associazioni; MiniGAV è un progetto autonomo e **non** è una replica o un componente di SmartGAV. Sono ammessi solo dati inventati. Non usare l’applicazione con pazienti reali.

## 1. Scopo, risultati attesi e confini

**Obiettivo primario:** sviluppare un MVP semplice, eseguibile in locale e comprensibile in ogni sua parte, da documentare su GitHub e illustrare durante un colloquio tecnico.

- **Utente:** inserisce un paziente tramite form e visualizza l’elenco delle anagrafiche registrate.

- **Sistema:** verifica i dati, li salva in SQLite e restituisce risposte HTTP coerenti.

- **Cache:** accelera il recupero della statistica aggregata “numero di pazienti” tramite Redis.

- **Sviluppatore:** sa descrivere motivazioni, responsabilità, flussi e test di ciascun componente.


**Fuori perimetro dell’MVP:** login, ruoli, ricerca avanzata, modifica/cancellazione, upload, appuntamenti, trasporti, fatturazione, API pubbliche, CDN, deploy cloud e dati sanitari. Le estensioni rimangono eventuali esercizi futuri.

## 2. Requisiti funzionali - livello alto

| ID | Requisito | Criterio osservabile |
| --- | --- | --- |
| RF-01 | Inserimento anagrafica | Il form invia i dati al backend; l’esito è mostrato a schermo. |
| RF-02 | Campi obbligatori | Nome, cognome, data di nascita e codice fiscale sono richiesti. |
| RF-03 | Campi facoltativi | Indirizzo, luogo di nascita, telefono ed e-mail possono essere omessi. |
| RF-04 | Controlli | Il sistema rifiuta campi obbligatori vuoti, date future e codici fiscali duplicati. |
| RF-05 | Memorizzazione | Le anagrafiche restano in SQLite dopo il riavvio del backend. |
| RF-06 | Consultazione | Il frontend mostra l’elenco dei pazienti salvati. |
| RF-07 | Cache runtime | Una statistica aggregata è recuperata da Redis quando disponibile; altrimenti da SQLite. |
| RF-08 | Feedback errori | Il frontend distingue operazione riuscita, input non valido, duplicato ed errore server. |

## 3. Requisiti non funzionali e regole di progetto

| ID | Principio | Indicazione |
| --- | --- | --- |
| RNF-01 | Separazione delle responsabilità | HTTP, business logic, SQL e caching restano componenti distinti. |
| RNF-02 | Semplicità | Preferire dipendenze minime e un unico backend; niente microservizi. |
| RNF-03 | Coerenza dati | SQLite è l’unica fonte autorevole; Redis non contiene l’unica copia dei dati. |
| RNF-04 | Sicurezza didattica | Solo uso locale e dati sintetici. Non usare dati personali o sanitari reali. |
| RNF-05 | Tracciabilità | Codice e documentazione in GitHub, commit per milestone. |
| RNF-06 | Verificabilità | Ogni funzionalità deve avere almeno un test manuale ripetibile. |

## 4. Macroarchitettura

Architettura **client-server**: l’interfaccia comunica via HTTP/JSON con il backend. Il backend coordina logica, persistenza e cache; il frontend non accede direttamente a SQLite o Redis.

```text
Browser / Angular
        |  HTTP + JSON
        v
HttpServer (Node.js / TypeScript / Express)
        |
        v
Anagrafica (business logic)
        |                     |
        v                     v
DatabaseHandler         CacheHandler
        |                     |
        v                     v
      SQLite                 Redis
```

### 4.1 Componenti backend e confini

| Componente | Responsabilità | Non deve occuparsi di... |
| --- | --- | --- |
| **HttpServer** | Espone gli endpoint REST; interpreta richieste e restituisce JSON e codici HTTP. | Query SQL, regole sui pazienti, gestione diretta della cache. |
| **Anagrafica** | Valida i dati, applica regole di business, coordina database e cache. | Express, dettagli della libreria SQLite o del protocollo Redis. |
| **DatabaseHandler** | Apre il file SQLite; inizializza schema; esegue query parametrizzate. | Regole di business o costruzione di risposte HTTP. |
| **CacheHandler** | Gestisce connessione Redis, lettura, scrittura con TTL e invalidazione. | Persistenza anagrafica e decisioni di business. |
| **Paziente** (tipo) | Definisce proprietà e tipi TypeScript del dato applicativo. | Comportamenti di accesso a database o rete. |

### 4.2 Componenti frontend Angular

| Componente | Ruolo |
| --- | --- |
| **PazientiListComponent** | Mostra la lista, lo stato di caricamento e gli eventuali errori. |
| **PazienteFormComponent** | Raccoglie input, applica validazioni preliminari e invia il form. |
| **PazientiService** | Inietta HttpClient, esegue GET/POST e converte le risposte in tipi TS. |
| **App / shell** | Organizza la schermata e coordina l’aggiornamento dopo un inserimento. |

La validazione del form migliora l’esperienza utente, ma il backend **deve** ripetere i controlli: una chiamata HTTP può arrivare anche senza Angular.

## 5. Stack tecnologico, strumenti e ambiente

| Macrocomponente | Scelta iniziale | Strumenti / note operative |
| --- | --- | --- |
| Frontend | Angular + TypeScript | Angular CLI; editor VS Code; browser e DevTools; npm. |
| Backend | Node.js + TypeScript + Express | VS Code; npm; TypeScript in modalità strict; tsx per sviluppo; gestione variabili d’ambiente. |
| Database | SQLite | File locale `backend/data/minigav.db`; libreria Node `better-sqlite3`; client SQLite opzionale per ispezione. |
| Cache | Redis | Server Redis locale o avviato con Docker; pacchetto npm `redis` (node-redis). |
| Test API | HTTP manuale | curl o Postman; log console; test dei casi validi e invalidi. |
| Repository | Git + GitHub | Repository unico con cartelle frontend, backend e documentazione. |

> **Scelte operative** — Nomi dei pacchetti, porte e layout delle cartelle sono proposte pratiche per il prototipo, non vincoli architetturali immutabili. Si privilegiano versioni stabili compatibili con il Node.js installato.

### 5.1 Avvio locale e configurazione

- **Prerequisiti:** Git, Visual Studio Code, Node.js LTS con npm, browser; Redis installato localmente oppure Docker disponibile.

- **Backend:** applicazione in ascolto, in sviluppo, su `http://localhost:3000`.

- **Frontend:** server di sviluppo Angular, tipicamente `http://localhost:4200`, configurato per raggiungere il backend.

- **SQLite:** nessun database server da installare; il backend crea/apre il file `minigav.db` e inizializza le tabelle.

- **Redis:** servizio locale su `127.0.0.1:6379` (solo ambiente di sviluppo); non va esposto pubblicamente.

- **Configurazione:** file `.env` locale escluso da Git e `.env.example` con soli valori di esempio; CORS limitato all’origine locale oppure proxy di sviluppo Angular.


## 6. Dati, schema iniziale e regole

Nell’MVP usiamo **una sola tabella** `pazienti`. Questo permette di imparare struttura e vincoli SQL senza introdurre relazioni non necessarie. Eventuali tabelle collegate potranno essere aggiunte in una fase successiva.

| Campo | Tipo logico | Regola |
| --- | --- | --- |
| id | Intero | Chiave primaria, generata da SQLite. |
| nome | Testo | Obbligatorio; si eliminano spazi ai bordi. |
| cognome | Testo | Obbligatorio; si eliminano spazi ai bordi. |
| data_nascita | Data ISO `YYYY-MM-DD` | Obbligatoria, data reale non futura. |
| codice_fiscale | Testo | Obbligatorio; normalizzato maiuscolo; univoco. |
| indirizzo | Testo o NULL | Facoltativo. |
| luogo_nascita | Testo o NULL | Facoltativo. |
| telefono | Testo o NULL | Facoltativo. |
| email | Testo o NULL | Facoltativo, controllo di formato essenziale. |

### 6.1 Schema SQL di partenza

```sql
CREATE TABLE IF NOT EXISTS pazienti (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL,
  cognome TEXT NOT NULL,
  data_nascita TEXT NOT NULL,
  codice_fiscale TEXT NOT NULL UNIQUE,
  indirizzo TEXT,
  luogo_nascita TEXT,
  telefono TEXT,
  email TEXT
);
```

La verifica completa dell’autenticità di un codice fiscale italiano **non** è un requisito dell’MVP. Si controllano presenza, normalizzazione e un formato minimo dichiarato; l’unicità viene garantita anche dal vincolo SQL `UNIQUE`. Le query useranno parametri, non concatenazione di stringhe.

## 7. Contratto HTTP iniziale

| Metodo | Endpoint | Descrizione / risposta |
| --- | --- | --- |
| POST | `/api/pazienti` | Crea il paziente. `201` con record e ID; `400` dati non validi; `409` codice fiscale già presente. |
| GET | `/api/pazienti` | Restituisce un array JSON di pazienti, anche vuoto. `200`. |
| GET | `/api/pazienti/statistiche` | Restituisce `{ "totale": numero }`; usa Redis quando possibile. `200`. |

L’endpoint tecnico `GET /api/health` (risposta `200`) è facoltativo ma utile per verificare che il processo HTTP sia in ascolto.

### 7.1 Esempio illustrativo di POST

```http
POST /api/pazienti
Content-Type: application/json

{
  "nome": "Giulia",
  "cognome": "Neri",
  "dataNascita": "1992-04-15",
  "codiceFiscale": "FAKEXX90A01H501Z",
  "telefono": "0000000000"
}
```

La risposta positiva contiene il record creato e il suo `id`. Le risposte di errore useranno un formato JSON uniforme, ad esempio `{ "error": { "code": "DUPLICATO", "message": "..." } }`. I dati dell’esempio sono inventati.

## 8. Flussi fondamentali e Redis

### 8.1 Inserimento del paziente

1. Angular verifica i campi e invia `POST /api/pazienti`.

2. HttpServer passa il contenuto del body ad Anagrafica.

3. Anagrafica normalizza e valida i dati, poi chiama DatabaseHandler.

4. DatabaseHandler esegue un `INSERT` parametrizzato in SQLite.

5. Dopo il successo, Anagrafica richiede a CacheHandler di invalidare `pazienti:count`.

6. Il backend restituisce `201`; Angular aggiorna l’elenco e mostra un messaggio.


### 8.2 Recupero della statistica con cache-aside

1. Angular richiede `GET /api/pazienti/statistiche`.

2. Anagrafica tenta di leggere la chiave Redis `pazienti:count`.

3. Su **cache hit** restituisce il valore già disponibile.

4. Su **cache miss** interroga SQLite con `COUNT(*)`, poi scrive il risultato in Redis con TTL indicativo di 60 secondi.

5. Se Redis è indisponibile, la richiesta continua usando SQLite; la cache resta un’ottimizzazione.


> **Scelta consapevole** — Per l’esercizio Redis memorizza solo una statistica aggregata. Le anagrafiche non vengono messe in cache: si evita di aggiungere complessità e di duplicare dati personali, anche se sintetici.

## 9. Struttura proposta del repository

```text
minigav/
|-- frontend/                  # progetto Angular (Angular CLI)
|-- backend/
|   |-- src/
|   |   |-- main.ts
|   |   |-- http_server.ts
|   |   |-- anagrafica.ts
|   |   |-- database_handler.ts
|   |   |-- cache_handler.ts
|   |   `-- models/paziente.ts
|   |-- data/                  # file SQLite NON versionato
|   |-- .env.example
|   |-- package.json
|   `-- tsconfig.json
|-- docs/                      # specifiche e note di sviluppo
|-- .gitignore
`-- README.md
```

Nel repository si versionano codice sorgente, schema/inizializzazione DB, file di esempio per le variabili d’ambiente e documentazione. **Non** si versionano `node_modules`, file `.env` reali, `*.db`, log, file compilati e credenziali.

## 10. Guida allo sviluppo - sequenza consigliata

La regola è semplice: **ogni giornata deve terminare con una parte eseguibile e verificata**. Iniziare dal backend e dal database consente di testare le API indipendentemente da Angular; Redis arriva per ultimo, quando il flusso principale è solido.

| Quando | Sviluppo | Verifica di fine fase |
| --- | --- | --- |
| **Lun 16/11**<br>Base backend + DB | Creare repository; inizializzare Node/TS; `DatabaseHandler` con tabella; modello Paziente; `Anagrafica`; `HttpServer` con health, GET e POST. | POST valida salva nel file; GET restituisce il record; riavviando il server il record resta. |
| **Mar 17/11**<br>Angular | Generare frontend Angular; creare servizio HTTP; lista pazienti; form con controlli obbligatori; collegare POST/GET al backend. | Inserimento dal browser; lista aggiornata; messaggi comprensibili su successo o errore. |
| **Mer 18/11**<br>Robustezza | Gestire duplicati, date future, formati errati, errori HTTP; normalizzazione codice fiscale; query parametrizzate; README di avvio. | Casi negativi ripetibili; risposta 409 sul duplicato; frontend mostra gli errori previsti. |
| **Gio 19/11**<br>Redis + revisione | Avviare Redis; aggiungere CacheHandler e statistica con TTL; invalidare dopo POST; testare fallback; pulizia Git e demo finale. | Cache miss/hit verificabili; cache aggiornata dopo inserimento; app funziona anche con Redis fermo. |

### 10.1 Ordine concreto dei componenti

1. **Primo:** DatabaseHandler - aprire SQLite, creare tabella, `insert` e `findAll`.

2. **Secondo:** Anagrafica - validazioni, normalizzazione e coordinamento.

3. **Terzo:** HttpServer - API Express; nessuna query SQL diretta.

4. **Quarto:** Angular - form, lista e servizio HTTP.

5. **Quinto:** CacheHandler - Redis per il conteggio, con fallback SQLite.


## 11. Piano di test / criteri di accettazione

| Test | Operazione | Esito atteso |
| --- | --- | --- |
| T01 | GET elenco su database vuoto | HTTP 200, array `[]`. |
| T02 | POST con tutti i campi obbligatori validi | HTTP 201, ID generato, record persistito. |
| T03 | POST senza nome o cognome | HTTP 400; nessuna scrittura. |
| T04 | POST con data futura o impossibile | HTTP 400; nessuna scrittura. |
| T05 | POST con codice fiscale già registrato | HTTP 409; rimane un solo record con quel codice. |
| T06 | POST solo obbligatori, senza opzionali | HTTP 201; campi facoltativi null/assenti secondo contratto. |
| T07 | Riavviare il backend, poi GET elenco | Il record esiste ancora nel file SQLite. |
| T08 | Form Angular compilato correttamente | La POST parte; messaggio di conferma ed elenco aggiornato. |
| T09 | Form Angular incompleto | Il pulsante resta disabilitato o mostra errori; backend comunque protetto. |
| T10 | Prima GET statistiche | Cache miss; COUNT da SQLite; Redis popolato. |
| T11 | Seconda GET entro il TTL | Cache hit; stesso conteggio. |
| T12 | Nuova POST, poi GET statistiche | Cache invalidata; conteggio aggiornato. |
| T13 | Fermare Redis, poi GET statistiche | HTTP 200 e conteggio da SQLite, senza perdita dati. |
| T14 | Query con input malformato | Nessuna SQL injection; errore controllato. |

**Strumenti di verifica:** curl o Postman per il backend; DB Browser for SQLite o CLI SQLite per controllare il file; DevTools del browser per le richieste Angular; log espliciti “cache hit/miss” durante lo sviluppo. Un test automatico unitario per Anagrafica è consigliabile se rimane tempo, senza rinviare l’MVP.

## 12. Definizione di completamento (Definition of Done)

- [ ] Il progetto si avvia in locale con istruzioni README ripetibili.

- [ ] Il backend è TypeScript/Node.js e rispetta la separazione HttpServer / Anagrafica / DatabaseHandler / CacheHandler.

- [ ] Inserimento e consultazione funzionano da Angular.

- [ ] SQLite conserva i record dopo un riavvio.

- [ ] I quattro campi obbligatori sono controllati lato server; il codice fiscale è univoco.

- [ ] Errori di input, duplicato ed errori interni sono gestiti con codici HTTP appropriati.

- [ ] Redis implementa una cache con TTL, invalidazione dopo inserimento e fallback a SQLite.

- [ ] I test T01-T14 sono stati eseguiti; risultati annotati in `docs/test-report.md`.

- [ ] Il repository contiene solo codice, configurazioni di esempio e dati sintetici, mai credenziali o dati reali.


## 13. Documentazione GitHub e milestone

Il repository deve essere leggibile anche da chi non conosce il progetto. **README.md** riporta: scopo, architettura in tre righe, prerequisiti, istruzioni di avvio frontend/backend/Redis, endpoint, come creare i dati di prova e come eseguire i test.

| Milestone Git | Contenuto suggerito |
| --- | --- |
| M1 - backend-sqlite | Schema SQL, Anagrafica e API GET/POST funzionanti. |
| M2 - angular-ui | Form e lista Angular integrati con il backend. |
| M3 - validation-tests | Gestione errori, validazioni e test documentati. |
| M4 - redis-cache | Statistica cache-aside, TTL, invalidazione e fallback. |

I commit possono essere incrementali e descrittivi. Un tag finale `v0.1.0` è facoltativo per identificare la prima versione dimostrabile; non rappresenta una release produttiva.

## 14. Decisioni aperte / evoluzioni future

| Tema | Scelta iniziale | Eventuale evoluzione |
| --- | --- | --- |
| Contatti paziente | Telefono ed e-mail come campi semplici. | Tabella separata per più contatti e uso di FOREIGN KEY / JOIN. |
| Validazione codice fiscale | Controllo minimo di formato, normalizzazione, unicità. | Algoritmo formale e test dedicati. |
| Cache | Solo conteggio aggregato. | Caching di dati non sensibili, misure di hit rate, invalidazioni avanzate. |
| Database | SQLite locale e una tabella. | Più tabelle, migrazioni, transazioni, PostgreSQL/SQL Server. |
| Sicurezza | Solo sviluppo locale con dati sintetici. | Autenticazione, ruoli, audit, privacy e deployment protetto. |
| Qualità | Test manuali di accettazione e pochi unit test. | Test automatici backend/frontend, CI GitHub Actions. |

**Principio guida:** non aggiungere un componente o una funzionalità solo per “usare una tecnologia”. Ogni parte deve risolvere un problema esplicito e poter essere spiegata, testata e mantenuta.
