# Payload starter

A [Payload 3](https://payloadcms.com) CMS on Next.js with Postgres, ready to deploy on
[Containify](https://containify.net). It's the source of the
[Payload template](https://containify.net/templates/payload).

What's in it:

- Payload's blank template: **Users** (admin sign-in) and **Media** (uploads) collections
- The Postgres adapter, reading `DATABASE_URL`
- Migrations in `src/migrations`, run automatically when the production server starts
- The first user created from `ADMIN_EMAIL` and `ADMIN_PASSWORD` on start (see `onInit` in
  `src/payload.config.ts`), so a fresh deploy has no open sign-up page
- `GET /health`: 200 when Payload is initialised and Postgres answers
- A production Dockerfile: Next.js standalone output, running as the non-root `node` user,
  uploads in `/app/media` (mount a volume there)

## Run locally

```bash
docker run -d --name payload-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=payload -p 5432:5432 postgres:17
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:3000/admin and create the first user. In development, Payload
pushes schema changes to the database as you edit collections.

## Changing collections

Production doesn't push schema changes. After editing a collection, create a migration
against your local database and commit it:

```bash
npm run migrate:create my-change
```

The next deploy runs it before the server takes requests.

## Deploy on Containify

Deploy the Payload template from the Containify catalogue: it builds this repo, adds
Postgres, generates `PAYLOAD_SECRET` and mounts a volume for uploads. To ship your own
collections, fork this repo and point the Payload app at your fork.

## Environment

| Variable             | What it is                                               |
| -------------------- | -------------------------------------------------------- |
| `DATABASE_URL`       | Postgres connection string                               |
| `PAYLOAD_SECRET`     | Signs auth tokens; a long random string                  |
| `PAYLOAD_PUBLIC_URL` | Optional: the public URL, e.g. `https://cms.example.com` |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Optional: the first user, created when there is none |
| `MEDIA_DIR`          | Where uploads are stored; `/app/media` in the image      |
| `PORT`, `HOSTNAME`   | Where it listens; `3000` on `::` in the image            |

## License

MIT
