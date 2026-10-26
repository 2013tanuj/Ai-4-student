# AI 4 STUDENT

An approachable bilingual study companion for school students, powered by Google Gemini.

## Run & Operate

- `pnpm --filter @workspace/ai-4-student run dev` — run the web app
- `pnpm --filter @workspace/api-server run dev` — run the shared API server
- `pnpm run typecheck` — typecheck all workspace packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI
- Required secret: `GEMINI_API_KEY` — read only by the API server

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React, Vite, Tailwind CSS, TanStack Query, Wouter
- API: Express 5 with Google Gemini Interactions API
- Validation and API codegen: OpenAPI, Zod, Orval
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/ai-4-student/src/App.tsx` — dashboard, bilingual study tools, and routes
- `artifacts/ai-4-student/src/index.css` — app theme and responsive layout
- `artifacts/api-server/src/routes/study.ts` — server-side Gemini integration
- `lib/api-spec/openapi.yaml` — source of truth for API contracts

## Architecture decisions

- Gemini requests are made only by the API server; never expose `GEMINI_API_KEY` to browser code.
- Gemini interactions use `store: false`; chat history is sent by the client rather than retained by Google.
- Study tools are stateless; chat history currently lives in the open page session.

## Product

- AI study chat, step-by-step homework explanations, chapter notes, quizzes/MCQs, and timetable suggestions
- English and Hindi response options
- Responsive dashboard and navigation designed for phone screens

## User preferences


## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
