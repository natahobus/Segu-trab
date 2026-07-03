# Segu

Assistente interno para corretores da SeguraMais (corretora fictícia). É um chat que manda a pergunta do corretor pra um modelo de linguagem via OpenRouter e devolve a resposta na tela.

## Ideia do projeto

Não é um chatbot genérico. A proposta é ajudar o corretor no meio do trabalho, quando surge uma dúvida rápida: diferença entre tipos de franquia, como orientar um cliente num sinistro, terminologia do setor, esse tipo de coisa. Como quem usa já é do ramo, as respostas são diretas, sem ficar explicando o óbvio.

A conversa guarda o histórico durante a sessão, então dá pra fazer perguntas de seguida sem perder o contexto.

## Como funciona

1. O corretor digita a pergunta (ou clica numa das sugestões que aparecem na tela inicial)
2. O front (`public/index.html`) manda isso pro servidor (`server.js`)
3. O servidor monta o histórico + a pergunta, junto com um system prompt que define como o Segu deve se comportar, e manda tudo pro modelo `openai/gpt-oss-120b:free` via OpenRouter
4. A resposta volta e aparece no chat

A chave da API fica só no back-end, no `.env`. O navegador nunca tem acesso a ela.

Algumas validações no input: não deixa mandar pergunta vazia, bloqueia mensagens muito curtas tipo "a" ou "oi" (evita gastar chamada de API à toa, já mostra as sugestões de novo), e limita a 800 caracteres por pergunta.

## Estrutura

```
segu/
├── package.json
├── server.js
├── .env          <- você cria esse
└── public/
    └── index.html
```

## Como rodar

```bash
npm install
```

Cria um `.env` na raiz com:
```
OPENROUTER_API_KEY=sua_chave_aqui
```
(pega a chave em openrouter.ai; não sobe esse arquivo pro git, ele já está no .gitignore)

Depois:
```bash
npm start
```

E acessa `http://localhost:3000`.

## Modelo usado

`openai/gpt-oss-120b:free`, via OpenRouter.

## Erros comuns

- **Chave não encontrada** - `.env` não existe ou o nome da variável está errado
- **401** - chave inválida
- **429** - o modelo free está sobrecarregado no provedor no momento. Acontece de vez em quando por ser um modelo gratuito, principalmente em horário de pico. Espera um pouco e tenta de novo, ou coloca créditos próprios na OpenRouter pra aumentar o limite (ela mesma orienta isso no erro)
- **Não conecta** - esqueceu de rodar `npm start`
