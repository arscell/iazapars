// Arquivo: index.js

const express = require("express");
const axios = require("axios");
require("dotenv\config");

const app = express();
app.use(express.json());

// Rota principal
app.post("/pergunta", async (req, res) => {
  const pergunta = req.body.mensagem;

  if (!pergunta) return res.status(400).send({ erro: "Mensagem não enviada" });

  try {
    const resposta = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Você é um atendente simpático, técnico e bem humorado." },
          { role: "user", content: pergunta }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const respostaIA = resposta.data.choices[0].message.content;
    res.send({ resposta: respostaIA });
  } catch (err) {
    console.error("Erro ao acessar OpenAI:", err.response?.data || err);
    res.status(500).send({ erro: "Falha ao consultar a IA" });
  }
});

// Rota de teste GET
app.get("/", (req, res) => {
  res.send("MalukIA rodando liso!");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}`);
});
