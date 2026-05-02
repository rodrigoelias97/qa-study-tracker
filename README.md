# QA Study Tracker API

Estrutura inicial de uma API REST com JavaScript e Express, preparada para evolucao a partir de user stories no Jira.

## Tecnologias

- Node.js
- Express
- MongoDB com Mongoose
- JWT para autenticacao
- Swagger para documentacao da API

## Arquitetura inicial

```text
src/
  config/
  controllers/
  middlewares/
  models/
  routes/
  services/
```

## Endpoints iniciais

- `GET /api/health` - Health check
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login com validacao de campos obrigatorios e retorno de token JWT
- `GET /api/auth/me` - Dados do usuario autenticado
- `GET /docs` - Swagger UI

### Padrao de erro

Para erros de validacao e autenticacao, a API retorna payload padronizado:

```json
{
  "message": "Invalid or missing required fields",
  "code": "VALIDATION_ERROR",
  "details": {
    "fields": ["email", "password"]
  }
}
```

## Variaveis de ambiente

Copie o arquivo de exemplo e ajuste os valores:

```bash
cp .env.example .env
```

Variaveis disponiveis:

- `NODE_ENV`
- `PORT`
- `BASE_URL`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

## Como executar

Instale as dependencias:

```bash
npm install
```

Iniciar em modo estatico:

```bash
npm start
```

Iniciar em modo desenvolvimento (auto-reload):

```bash
npm run dev
```

## Testes unitarios

Executar testes unitarios:

```bash
npm test
```

Cobertura atual dos testes:

- QST-1: fluxo de registro no service (sucesso e e-mail em uso)
- QST-2: fluxo de login no service (sucesso, campos ausentes e credenciais invalidas)
- Middleware de erro padronizado

## Proximos passos sugeridos

- Adicionar validacao de payload (ex: Joi/Zod)
- Configurar pipeline de CI com GitHub Actions
- Preparar arquivos para deploy em Vercel
