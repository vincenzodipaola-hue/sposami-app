/**
 * Sposami.ai — funzione server su Vercel: /api/claude
 *
 * Riceve le richieste dalla pagina (stesso sito), aggiunge la chiave API
 * di Anthropic, che così non è mai visibile nel browser, e inoltra a Claude.
 *
 * Variabili d'ambiente da impostare su Vercel (Settings > Environment Variables):
 *   ANTHROPIC_API_KEY   obbligatoria, la chiave presa da console.anthropic.com
 *   MODEL_DEFAULT       facoltativa, default claude-sonnet-5-5 (foto, preventivi, schede, bozze)
 *   MODEL_QUICK         facoltativa, default claude-haiku-5-5 (chat)
 *
 * Protezioni: solo POST, solo dal proprio dominio, richieste e risposte
 * di dimensione limitata. Il limite di spesa va impostato anche sulla
 * console Anthropic.
 */
export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Solo POST" });
  }

  // Accetta solo chiamate dalle pagine dello stesso sito
  const origin = req.headers.origin;
  if (origin) {
    let host = "";
    try { host = new URL(origin).host; } catch {}
    if (host !== req.headers.host) return res.status(403).json({ error: "Origine non ammessa" });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "Manca ANTHROPIC_API_KEY nelle variabili d'ambiente" });
  }

  const body = typeof req.body === "string" ? safeParse(req.body) : req.body;
  if (!body || !Array.isArray(body.messages) || body.messages.length === 0 || body.messages.length > 60) {
    return res.status(400).json({ error: "Messaggi non validi" });
  }

  const model = body.tier === "quick"
    ? (process.env.MODEL_QUICK || "claude-haiku-5-5")
    : (process.env.MODEL_DEFAULT || "claude-sonnet-5-5");

  const payload = {
    model,
    max_tokens: 1500,
    messages: body.messages,
    ...(typeof body.system === "string" ? { system: body.system.slice(0, 20000) } : {}),
    ...(Array.isArray(body.tools) && body.tools.length <= 8 ? { tools: body.tools } : {}),
  };

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(payload),
    });
    const text = await upstream.text();
    res.status(upstream.status).setHeader("content-type", "application/json").send(text);
  } catch (e) {
    res.status(502).json({ error: "Claude non raggiungibile" });
  }
}

function safeParse(s) { try { return JSON.parse(s); } catch { return null; } }
