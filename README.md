# FinePrint
Who's got time to read all that?

---
**FinePrint** is an AI-powered insurance policy claims tool that lets insurance adjusters upload policy documents and ask questions. It retrieves grounded answers with source citations directly from the uploaded policies..

![FinePrint Homepage](./frontend/public/FinePrint_Home.png)

## Tech stack

| Layer | Technology |
|---|---|
| Backend API | C# / .NET  |
| Database | PostgreSQL + pgvector |
| Embeddings | OpenAI `text-embedding-3-small` |
| Chat completion | OpenAI `gpt-4o-mini` |
| Frontend | React + TypeScript + Vite |
| Styling | Tailwind CSS |
| Infrastructure | Docker |

## Getting started

### Prerequisites

- [.NET](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [OpenAI API key](https://platform.openai.com)

### 1. Clone the repo

```bash
git clone https://github.com/saymahub/FINEPRINT.git
cd fineprint
```

### 2. Set up environment variables

Create a `.env` file at the project root:

```env
OpenAI_key=<insert_your_api_key_here>
```

### 3. Start the database

```bash
docker compose up -d
```

### 4. Run the backend

```bash
cd FinePrint.Api
dotnet run
```

The API will start on `http://localhost:5082`. Migrations run automatically on startup.

### 5. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

Hope you enjoyed taking a look at my little project :D