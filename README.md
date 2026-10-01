# Silent.Web Enterprise 3.0

Private Next.js gateway for script distribution, telemetry, dashboard monitoring and Discord notifications.

## Important architecture

- Script source is stored server-side and is not rendered in the public catalog.
- Discord webhook is server-only (`DISCORD_WEBHOOK_URL`).
- `/api/gateway/:scriptId` returns the private script only when the script is active.
- `/api/telemetry` accepts client telemetry and combines it with request-derived server telemetry.
- Execution records are stored by the included local adapter. For Vercel production, replace `lib/store.ts` with a persistent database adapter; Vercel filesystem storage is not durable.
- IP geolocation is intentionally an optional adapter. The current build records the request IP but does not invent a city/country when no geolocation provider is configured.

## Setup

1. Copy `.env.example` to `.env.local`.
2. Set `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `DISCORD_WEBHOOK_URL`.
3. Put private script files under `storage/scripts` for local development, or replace `lib/scripts.ts` with your private database/blob adapter.
4. `npm install && npm run build`.

## Security notes

No client-side implementation can make delivered Lua source impossible to extract: once code executes on a client, it can potentially be observed there. This architecture prevents public raw URLs and keeps the storage/webhook/server secrets out of the browser.
