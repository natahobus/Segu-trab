import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
console.log('dotenv carregado:', !!process.env.OPENROUTER_API_KEY);
console.log('cwd:', process.cwd());
console.log('.env existe:', fs.existsSync(path.resolve(process.cwd(), '.env')));

const app = express();
const PORT = 3000;
const API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = "openai/gpt-oss-120b:free";

if (!API_KEY) {
  console.error("Erro: configure OPENROUTER_API_KEY no arquivo .env.");
  process.exit(1);
}

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/api/status", (req, res) => {
  res.json({ status: "Segu online!", model: MODEL });
});

app.post("/api/segu", async (req, res) => {
  try {
    const { historico, pergunta } = req.body;
    console.log('>>> /api/segu recebida. pergunta length:', pergunta?.length);
    console.log('>>> body preview:', JSON.stringify(req.body).slice(0,1000));

    if (!pergunta || pergunta.trim().length === 0) {
      return res.status(400).json({ erro: "A pergunta não pode estar vazia." });
    }

    if (pergunta.length > 800) {
      return res.status(400).json({ erro: "Limite de 800 caracteres por pergunta." });
    }

    
    const mensagens = [
      {
        role: "system",
        content: `Voce e Segu, o assistente virtual interno da corretora SeguraMais.

Seu usuario e o CORRETOR de seguros da empresa, nao o cliente final. Ele ja entende o basico do mercado de seguros - nao precisa de explicacoes do tipo "para leigos".

Sua personalidade:
- Direto, tecnico quando necessario, mas sem enrolacao
- Fala como um colega experiente tirando uma duvida rapida no meio do expediente
- Quando cita um termo tecnico, nao precisa explicar o obvio (o corretor ja sabe o que e franquia, apolice, sinistro etc.) - so explica se for pedido
- Honesto: se a resposta depende da seguradora, do produto especifico ou da apolice do cliente, deixa isso claro e recomenda checar o sistema interno ou a seguradora
- Nunca inventa coberturas, valores ou regras - se nao tiver certeza, diz isso e orienta a confirmar na fonte oficial (seguradora/apolice)

Voce ajuda o corretor com:
- Duvidas rapidas sobre tipos de seguro e suas coberturas (auto, vida, residencial, saude, viagem, empresarial)
- Comparacao entre coberturas para orientar o cliente do corretor
- Como orientar o cliente em caso de sinistro
- Terminologia tecnica do setor
- Argumentos e pontos de atencao para apresentar ao cliente

Formato das respostas:
- Seja extremamente direto. Respostas de 1 a 4 frases resolvem a grande maioria das perguntas.
- Mesmo em perguntas de "passo a passo", limite a no maximo 5 pontos principais, sem sub-itens dentro de cada ponto. Se o assunto for realmente extenso, de o resumo essencial e ofereca aprofundar se o corretor pedir.
- Nao use markdown (sem **negrito**, sem *italico*, sem #cabecalhos): so texto simples, com quebras de linha e hifen para listas quando precisar
- Nao termine as respostas com perguntas genericas tipo "tem mais alguma duvida?" - isso e papel da interface, nao da resposta
- Nunca escreva mais de 120 palavras, a menos que o corretor peca explicitamente para detalhar mais
- Nunca responda com paredes de texto`
      },
      
      ...(Array.isArray(historico) ? historico : []),
      {
        role: "user",
        content: pergunta
      }
    ];

  
    const sanitizedMessages = mensagens.map(m => ({
      ...m,
      content: typeof m.content === 'string'
        ? m.content
            .replace(/[\u2013\u2014]/g, '-')
            .replace(/[\u2018\u2019]/g, "'")
            .replace(/[\u201C\u201D]/g, '"')
        : m.content
    }));

    const payload = {
      model: MODEL,
      messages: sanitizedMessages,
      temperature: 0.6,
      max_completion_tokens: 180
    };
    console.log('>>> Enviando payload pro OpenRouter (preview):', JSON.stringify(payload).slice(0,1500));

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-OpenRouter-Title": "Segu - Assistente de Seguros"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const detalhe = await response.text();
      console.error('OpenRouter returned non-OK:', response.status, detalhe);
      return res.status(502).json({
        erro: "Erro ao consultar o OpenRouter.",
        status: response.status,
        detalhe
      });
    }

    const data = await response.json();
    console.log('<<< OpenRouter response preview:', JSON.stringify(data).slice(0,2000));
    const resposta = data.choices?.[0]?.message?.content;

    if (!resposta) {
      console.error('OpenRouter retornou estrutura inesperada:', JSON.stringify(data).slice(0,2000));
      return res.status(502).json({ erro: "Resposta vazia ou inesperada da IA.", detalhe: data });
    }

    res.json({ resposta, uso: data.usage ?? null });

  } catch (error) {
    console.error('Erro no /api/segu:', error.stack || error.message);
    res.status(500).json({ erro: "Erro interno no servidor.", detalhe: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Segu rodando em http://localhost:${PORT}`);
});