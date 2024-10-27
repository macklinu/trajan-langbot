# trajan-langbot

> A Discord bot for some Detroit Pistons fans in a Detroit Pistons Discord server.

## Getting started

Use a Node.js version manager like [nvm](https://github.com/nvm-sh/nvm) to install the correct version of Node.js. From the root of the repository, run:

```bash
nvm install
```

Install the preferred package manager, [pnpm](https://pnpm.io/), through Node's corepack tool.

```bash
corepack enable
```

Install all dependencies.

```bash
pnpm i
```

## Running the bot

Idk yet.

## Structure

This is a monorepo managed by [pnpm](https://pnpm.io/). More documentation is needed, but here is a brief overview of the packages and apps that make up this bot.

| Package           | Location           | Description                                                             |
| ----------------- | ------------------ | ----------------------------------------------------------------------- |
| `@trajan/langbot` | `apps/bot`         | The Discord bot application.                                            |
| `@trajan/worker`  | `apps/worker`      | (TODO) A background worker to run cron jobs and other background tasks. |
| `@trajan/db`      | `packages/db`      | The database schema used by the bot.                                    |
| `@trajan/nba-api` | `packages/nba-api` | An API wrapper around NBA data.                                         |
