# 🛡️ Segu — Assistente de Dúvidas de Seguros

Assistente virtual de uma corretora de seguros fictícia chamada **SeguraMais**.

O usuário conversa com o **Segu**, um atendente com persona própria que responde dúvidas sobre seguros em linguagem simples e acessível — sem jargão, sem enrolação.

A conversa mantém contexto entre as mensagens, ou seja, o Segu lembra o que foi dito antes e responde de forma coerente, como um atendimento real.

---

## 💬 O que o Segu responde

- O que cada tipo de seguro cobre (auto, vida, residencial, viagem, saúde)
- Termos técnicos explicados: franquia, prêmio, apólice, sinistro, carência
- Como acionar o seguro em caso de acidente, furto ou sinistro
- Dicas para escolher o seguro certo para cada perfil
- O que fazer quando a seguradora nega um pedido

---

## 📁 Estrutura do projeto

```
segu/
├── package.json
├── server.js
├── .env              ← criar manualmente
└── public/
    └── index.html
```

---

## ⚙️ Como instalar e executar

### 1. Instalar dependências
```bash
npm install
```

### 2. Criar o arquivo `.env`
```
OPENROUTER_API_KEY=sua_chave_aqui
```
> Obtenha sua chave em [openrouter.ai](https://openrouter.ai/). Nunca publique este arquivo.

### 3. Rodar o servidor
```bash
npm start
```

### 4. Acessar no navegador
```
http://localhost:3000
```

---

## 🔌 Modelo utilizado
`openai/gpt-oss-120b:free` via OpenRouter

---

## ⚠️ Erros comuns

| Erro | Causa |
|------|-------|
| Chave não encontrada | `.env` ausente ou variável com nome errado |
| 401 | Chave da API inválida |
| 429 | Limite de requisições atingido |
| Não conecta | Esqueceu de rodar `npm start` |
