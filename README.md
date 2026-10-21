# pern-stack-todo

A small to-do list built on the PERN stack: PostgreSQL, Prisma, Express, and React.

**Status:** In progress. Creating, listing and viewing todos works end to end, but the client's delete and done-toggle calls have no matching server behavior, so those two features do not persist.

## The problem

This is a compact reference for how a React front end, an Express API and a Prisma-managed PostgreSQL database fit together. The app keeps a list of todos, each with a title, a description and a done flag.

## What it does

- **List todos**: the React app loads `GET /todo` on mount and renders each item.
- **Add a todo**: a form posts `title` and `description` to `POST /todo` and appends the saved row to the list.
- **Edit a todo**: each item switches to an edit mode with inputs and sends `PUT /todo/:id`.
- **Look up one todo**: `GET /todo/:id` returns a single row.

## How it's built

- **Database**: PostgreSQL with a single `Todo` model in `api/prisma/schema.prisma` (`id`, `title`, `description`, `done`). Two Prisma migrations are committed under `api/prisma/migrations`.
- **API**: Express 4 with `cors` and `express.json()`, written in TypeScript and run with `ts-node`. Each route wraps its Prisma call in `try/catch`.
- **Client**: React 18 with TypeScript, built with Vite. `App.tsx` holds the todo list in component state. Each `Item` keeps its own local edit state and writes changes back through `setTodos`.
- **Decision to note**: the client and API are separate projects with no shared types. The `Todo` interface is written out again in `App.tsx`.

## Running it locally

The API needs a PostgreSQL connection string in `DATABASE_URL` for Prisma. Apply the schema with the Prisma CLI (`npx prisma migrate dev` from `api/`).

```bash
cd api && pnpm install && pnpm dev      # API on http://localhost:3000
cd client && pnpm install && pnpm dev   # Vite dev server
```

`api/package.json` also has a `start` script (`ts-node index.ts`) for running without `nodemon`.

## What's left

- The client sends `DELETE /todo/:id`, but the API has no delete route, so the server returns 404 and the todo only disappears until the page reloads.
- The done checkbox sends `PUT /todo/:id` with `{ done }`, but the PUT handler only reads `title` and `description`, so the done flag is never saved.
- Errors are returned as the raw error object with a 200 status, not as proper HTTP error responses.
- The API port (3000) and the API URL in the client are hard-coded.
- `dotenv` is listed as a dependency but is not imported in `api/index.ts`.
- The client logs the todo list to the console on every render.
- No tests, and no `.env.example` showing the required `DATABASE_URL`.

## Author

Created by [Mehfooz-ur-Rehman](https://github.com/MehfoozurRehman).
