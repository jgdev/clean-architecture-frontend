# Arithmetic Calculator web app

### Local setup

- Required node version: v18.16 or higher
- Run `npm install -g pnpm` and then `pnpm install`
- Copy the file `.env.example` and rename it to `.env`

#### Environment variables

| Key | Value | Example
| --- | --- | -- |
| `VITE_API_BASE_URL` | Base api url | `http://localhost:3001` |

#### Commands

- `pnpm dev`: Starts the website in development mode, you can expose the server to the internet using the parameter `--host`
- `pnpm build`: Create a production ready build.
- `pnpm test`: Run test coverage
