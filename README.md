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
- `POST /api/auth/register` - Registro de usuario com validacao de campos obrigatorios
- `POST /api/auth/login` - Login e obtencao de token JWT
- `GET /api/auth/me` - Dados do usuario autenticado
- `GET /docs` - Swagger UI

### Padrao de erro

Para erros de validacao e conflito, a API retorna payload padronizado:

```json
{
  "message": "Invalid or missing required fields",
  "code": "VALIDATION_ERROR",
  "details": {
    "fields": ["name", "email", "password"]
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

Executar testes unitarios:

```bash
npm test
```

## Proximos passos sugeridos

- Configurar pipeline de CI com GitHub Actions
- Preparar arquivos para deploy em Vercel
