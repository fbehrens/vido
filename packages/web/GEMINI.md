## Project Overview

This project is a web application built with SvelteKit, a framework for building web applications of all sizes, with a beautiful development experience and flexible filesystem-based routing.

### Key Technologies

*   **Framework:** SvelteKit
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **UI Components:** shadcn-svelte (inferred from `bits-ui`, `lucide-svelte`)
*   **Database:** Drizzle ORM with a SQLite database (`better-sqlite3`)
*   **Testing:** Vitest
*   **Package Manager:** pnpm

### Architecture

*   The application is configured to run in a Node.js environment using `@sveltejs/adapter-node`.
*   It utilizes Svelte 5's new features like runes (`async: true` in compiler options).
*   Experimental SvelteKit features like `remoteFunctions` are enabled, suggesting a modern, interactive architecture.

## Building and Running

The following scripts are available in `package.json`:

*   `pnpm dev`: Starts the development server.
*   `pnpm build`: Builds the application for production.
*   `pnpm preview`: Serves the production build locally for previewing.
*   `pnpm test`: Runs the test suite using Vitest.
*   `pnpm check`: Performs type-checking on the Svelte and TypeScript files.

### Database Management

The project uses Drizzle ORM for database migrations and queries.

*   `pnpm db:push`: Pushes schema changes to the database.
*   `pnpm db:migrate`: Creates and applies database migrations.
*   `pnpm db:studio`: Starts Drizzle Studio, a GUI for the database.

## Development Conventions

*   **Formatting:** The project uses Prettier for code formatting, with plugins for Svelte and Tailwind CSS.
*   **Testing:** Tests are written with Vitest and are located in the `src` directory.
*   **Type Safety:** The project is fully typed with TypeScript and uses `svelte-check` to ensure type safety in Svelte components.
