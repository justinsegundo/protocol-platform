# Protocol Platform — Implementation Notes

**Prepared by:** Justin Segundo
**Assessment:** Junior Full Stack Developer — Activate Digital Media / Just Holistics
**Stack:** Laravel 11, React 18, Typesense, MySQL

---

## Overview

The Protocol Platform is a community-driven discussion platform where users can share wellness protocols, start threads, leave reviews, comment with nested replies, and vote on content. It is structured as a monorepo with a Laravel backend and React frontend communicating via a REST API.

---

## Architecture Decisions

**Why Laravel** — It was specified in the assessment and it is what I am most comfortable with for APIs. Form Requests for validation, Sanctum for auth, and Eloquent for relationships covered everything I needed without extra packages.

**Why a dedicated TypesenseService** — I put all Typesense logic in one service class instead of scattering it across controllers. If something breaks with indexing there is one place to look. Controllers just call the service without knowing how Typesense works internally.

**Why polymorphic votes** — One polymorphic votes table handles both threads and comments. A unique constraint on user_id, votable_id, and votable_type means the database itself rejects duplicate votes as a safety net.

**Why self-referencing comments** — A parent_id column on the comments table references the same table. Top-level comments have parent_id null, replies point to their parent. The frontend renders them recursively up to three levels deep.

**Why React Query** — It handles caching, loading states, and refetching without boilerplate. After posting a comment, calling queryClient.invalidateQueries triggers a refetch automatically without a page reload.

---

## Database Design

- User has many Protocols, Threads, Comments, Reviews, and Votes
- Protocol has many Threads and Reviews
- Thread has many top-level Comments via whereNull('parent_id')
- Comment has many Replies via self-referencing parent_id
- Vote belongs to Thread or Comment via polymorphic relationship

Access control is handled through Laravel Policies — authorization logic stays out of controllers entirely.

---

## Typesense Integration

Two collections are maintained — protocols and threads. Data syncs automatically on every create, update, and delete through TypesenseService. The frontend queries a Laravel search endpoint that proxies to Typesense, keeping the admin API key server-side only. A CLI command php artisan typesense:reindex forces a full reindex if the index ever gets out of sync with the database.

---

## Frontend Design

Built with TailwindCSS v3 using Playfair Display for headings and DM Sans for body text with a forest green and amber palette. Voting uses optimistic UI — state updates instantly before the API responds and rolls back on failure. Search uses a 300ms debounce so Typesense is not queried on every keystroke. Protected routes redirect unauthenticated users to login via a ProtectedRoute component.

---

## Challenges

**Typesense SSL on Windows** — WAMP's CLI uses a different php.ini than Apache so setting curl.cainfo had no effect on Artisan commands. The fix was passing a custom Guzzle client with verify set to false into the Typesense constructor for local development.

**Typesense initializing too early** — The original service instantiated the client in the constructor. Laravel resolved it during boot before .env values loaded, causing a ConfigError on every Artisan command. The fix was lazy initialization — the client is only created the first time getClient() is called.

---

## What I Would Add With More Time

- **OpenAI summaries** — a summarize button on protocol pages sending content to the OpenAI API
- **Activity heatmap** — community engagement over time similar to a GitHub contribution graph
- **Real-time notifications** — Laravel Echo and WebSockets for comment and vote alerts
- **Admin dashboard** — content management without direct database access
- **Email verification** — required for a production app

