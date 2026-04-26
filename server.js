import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

const VERIFY_TOKEN = "mi_token_seguro";
const MAKE_WEBHOOK = "https://hook.make.com/xxxxx";

// 1. Verificación de Meta (IMPORTANTE)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  res.sendStatus(403);
});

// 2. Recibir mensajes de WhatsApp
app.post("/webhook", async (req, res) => {
  const message = req.body;

  const data = {
    from: message.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from,
    text: message.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body
  };

  // enviar a Make
  await axios.post(MAKE_WEBHOOK, data);

  res.sendStatus(200);
});

app.listen(3000, () => console.log("Webhook listo"));