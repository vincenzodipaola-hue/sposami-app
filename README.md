# Sposami.ai — web app di anteprima

Assistente AI per gli sposi, area fornitori e portale GEO, con l'AI di Claude attiva per chiunque apra il sito.

## Cosa c'è dentro

| Percorso | Cosa fa |
| --- | --- |
| `public/index.html` | Tutta l'app: sposi, fornitori, portale GEO |
| `api/claude.js` | Funzione server di Vercel: aggiunge la chiave API e chiama Claude |
| `vercel.json` | Impostazioni di sicurezza delle pagine |

La chiave API non è mai nella pagina: sta solo nelle variabili d'ambiente di Vercel.

## Messa online in 4 passi

### 1. Chiave API di Anthropic
1. Su console.anthropic.com creare un account con email aziendale WR.
2. Aggiungere il pagamento e impostare subito un **limite di spesa mensile** (es. 50 € in fase di test).
3. Creare una chiave API e copiarla (si vede una volta sola).

### 2. GitHub
1. Su github.com creare un nuovo repository **privato**, es. `sposami-app`.
2. Caricare il contenuto di questa cartella (pulsante "Add file › Upload files", trascinando `api`, `public`, `package.json`, `vercel.json`, `README.md`, `.gitignore`).

### 3. Vercel
1. Su vercel.com accedere con l'account GitHub.
2. "Add New › Project", scegliere il repository `sposami-app`, framework **Other**, lasciare il resto com'è.
3. Prima di "Deploy", in **Environment Variables** aggiungere `ANTHROPIC_API_KEY` con la chiave del passo 1.
4. Premere **Deploy**. Dopo un minuto il sito è online a un indirizzo tipo `https://sposami-app.vercel.app`.

### 4. Prova
Aprire il sito: in alto deve comparire **"AI attiva (server Sposami)"**. Scrivere in chat, per esempio: *"Ci sposiamo il 18 settembre 2027 in Puglia, 120 invitati, budget 40.000 €"*.

Se compare "Modalità demo" o la chat dà errore, controllare in Vercel › Project › Logs: quasi sempre manca la variabile `ANTHROPIC_API_KEY` o va rifatto il deploy dopo averla aggiunta.

## Dopo

- **Dominio**: in Vercel › Settings › Domains si collega un dominio vostro, es. `demo.sposami.it`.
- **Aggiornamenti**: ogni modifica caricata su GitHub viene pubblicata da sola.
- **Modelli**: con le variabili `MODEL_DEFAULT` e `MODEL_QUICK` si cambia il modello senza toccare il codice.
- **Abusi e costi**: attivare il limite di spesa su Anthropic e, su Vercel, una regola di rate limiting nel Firewall del progetto.
- **Privacy**: messaggi e foto degli sposi vengono inviati ad Anthropic per generare le risposte. Prima di aprire il sito al pubblico servono informativa privacy e verifica legale.
- **Limiti dell'anteprima**: fornitori e prezzi sono inventati; il progetto degli sposi resta nel browser di chi lo usa (niente account né sincronizzazione tra dispositivi).
