This project leverages AI to automatically generate quizzes based on input documents. This process enhances learning and assessment by creating tailored quizzes that reflect the important points and concepts within the document.

## Screenshot
![alt text](<webss.png>)

## Tech Stack 

- Next.js - Framework
- Next-auth - Authentication
- Shadcn ui - ui library
- Open Al - AI Integration
- Langchain - LLM Framework
- Drizzle - Orm
- PostgreSQL - Database
- Supabase - Database hosting
- Typescript - Type Checking
- Vercel - Deployment

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Environment Variables

Create a new .env file and add your keys in the following manner:
```
OPENAI_API_KEY=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
AUTH_SECRET=""
DATABASE_URL=""
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
