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
- `POST /api/auth/login` - Login e obtencao de token JWT
- `GET /api/auth/me` - Dados do usuario autenticado
- `GET /api/courses/:id` - Apresentacao de curso por id (requer autenticacao)
- `GET /docs` - Swagger UI

### Padrao de resposta do curso

```json
{
  "course": {
    "id": "68190f9868e2f8b96e436a09",
    "userId": "68190f6b68e2f8b96e436a08",
    "name": "API Testing",
    "link": "https://example.com/course",
    "totalWorkloadHours": 30,
    "status": "planned",
    "registrationDate": "2026-05-02T00:00:00.000Z",
    "createdAt": "2026-05-02T10:00:00.000Z",
    "updatedAt": "2026-05-02T10:00:00.000Z"
  }
}
```

### Padrao de erro

```json
{
  "message": "Course not found",
  "code": "RESOURCE_NOT_FOUND"
}
```

## Testes unitarios

Executar:

```bash
npm test
```

Cobertura atual:

- `course.service#getCourseById` (QST-4)
- `course.controller#getCourseById` (QST-4)

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

## Proximos passos sugeridos

- Adicionar validacao de payload (ex: Joi/Zod)
- Criar testes automatizados
- Configurar pipeline de CI com GitHub Actions
- Preparar arquivos para deploy em Vercel
