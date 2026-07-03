import 'dotenv/config';

const API_KEY = process.env.OPENROUTER_API_KEY;
if (!API_KEY) {
  console.error('OPENROUTER_API_KEY não encontrada em process.env');
  process.exit(1);
}

const payload = {
  model: 'openai/gpt-oss-120b:free',
  messages: [{ role: 'user', content: 'Olá, teste rápido para verificar conexão com o OpenRouter' }],
  temperature: 0.6
};

try {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  console.log('HTTP status:', res.status);
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    console.log(JSON.stringify(json, null, 2));
  } catch (e) {
    console.log(text);
  }
} catch (err) {
  console.error('Erro na requisição:', err.stack || err);
  process.exit(1);
}
