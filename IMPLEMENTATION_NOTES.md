# Protocol Platform — Implementation Notes

**Prepared by:** Justin Segundo
**Assessment:** Junior Full Stack Developer — Activate Digital Media / Just Holistics
**Stack:** Laravel 11, React 18, Typesense, MySQL

---

## Overview

The Protocol Platform is a community-driven discussion platform where users can share structured wellness protocols, start discussion threads, leave reviews, comment with nested replies, and vote on content. Search is powered by Typesense for fast, relevant results.

The project is structured as a monorepo with a separate Laravel backend and React frontend communicating via a REST API.

---

## Architecture Decisions

**Why Laravel for the backend**

Laravel was the natural choice given the assessment requirements. It has first-class support for REST APIs, a clean ORM for handling relationships, built-in validation through Form Requests, and Sanctum for token-based authentication. The modular structure — Models, Controllers, Resources, Services, Policies — kept the codebase organized and maintainable as it grew.

**Why a dedicated TypesenseService class**

Rather than putting Typesense logic directly in controllers, I extracted it into a single `TypesenseService` class. This means every controller just calls `$this->typesense->indexProtocol($protocol)` without knowing anything about how Typesense works internally. If the Typesense integration ever needs to change, there is only one file to update. It also made the lazy initialization fix straightforward — the Typesense client is only instantiated when it is actually needed, which prevented boot-time errors when running Artisan commands.

**Why polymorphic relationships for votes**

The assessment mentioned votes on both threads and comments. Rather than creating two separate tables — `thread_votes` and `comment_votes` — I used a single polymorphic `votes` table with `votable_id` and `votable_type` columns. This keeps the schema clean and means the same voting logic handles both content types without duplication. A unique constraint on `[user_id, votable_id, votable_type]` enforces one vote per user at the database level as a safety net on top of the application-level check.

**Why self-referencing for comments**

Threaded replies are handled through a `parent_id` column on the `comments` table that references the same table. Top-level comments have `parent_id = null`. Replies point to their parent comment. This avoids a separate `replies` table and keeps the data model simple. The frontend renders them recursively — the `CommentItem` component renders itself for each reply, up to three levels deep.

**Why React Query for data fetching**

React Query handles caching, loading states, and background refetching cleanly without a lot of boilerplate. When a user posts a comment, calling `queryClient.invalidateQueries` tells React Query that the comment cache is stale and triggers a refetch automatically. This kept components focused on rendering rather than managing fetch state manually.

---

## Database Design

The core relationships are:

- `User` has many `Protocols`, `Threads`, `Comments`, `Reviews`, and `Votes`
- `Protocol` has many `Threads` and `Reviews`
- `Thread` has many `Comments` (top level) via `whereNull('parent_id')`
- `Comment` has many `Replies` via self-referencing `parent_id`
- `Vote` belongs to either a `Thread` or `Comment` via polymorphic relationship

Access control is handled through Laravel Policies. Before any update or delete operation, the policy checks that the authenticated user owns the resource. This keeps authorization logic out of controllers entirely.

---

## Typesense Integration

Two Typesense collections are maintained — `protocols` and `threads`. Data flows into Typesense automatically on every create, update, and delete operation through the `TypesenseService`. Controllers do not interact with Typesense directly — they call the service which handles building the document and upserting it.

The `ensureCollectionsExist` method runs before seeding to create the collections if they do not exist yet, or drop and recreate them if the schema has changed. This made development smoother since I could reseed freely without manually managing collections.

For search, the frontend sends queries directly to the Laravel API's `/api/search` endpoint which proxies to Typesense. This keeps the Typesense admin API key on the server side only. Search supports sorting by `created_at`, `average_rating`, `review_count`, and `upvote_count` natively in Typesense.

A CLI command `php artisan typesense:reindex` is available to force a full reindex of all protocols and threads. Useful if the index ever gets out of sync with the database.

---

## Frontend Design Decisions

The UI was built with TailwindCSS v3 using a deliberate editorial aesthetic — Playfair Display for headings and DM Sans for body text, with a forest green and amber color palette. The goal was for it to look like a real developer made intentional design decisions, not a generic template.

Voting uses optimistic UI — the vote count and button state update immediately when clicked, before the API responds. If the API call fails, the state rolls back to what it was before. This makes the app feel fast and responsive.

Search uses a 300 millisecond debounce so Typesense is not queried on every keystroke. Results appear as a dropdown below the search input and navigate directly to the selected item on click.

Protected routes redirect unauthenticated users to the login page automatically via a `ProtectedRoute` wrapper component that checks the auth context.

---

## Challenges and How I Solved Them

**Typesense SSL on Windows**

Running on WAMP locally, PHP's CLI was not picking up the CA certificate bundle needed for HTTPS connections to Typesense Cloud. The standard fix of setting `curl.cainfo` in php.ini was not taking effect because WAMP uses a separate php.ini for CLI versus Apache.

The practical fix was passing a custom Guzzle HTTP client with `verify: false` directly into the Typesense client constructor for local development. This bypasses the SSL check at the request level without touching php.ini. In production this should be set back to `true`.

**Typesense client initializing too early**

The original `TypesenseService` instantiated the Typesense client in the constructor. Laravel was resolving the service during container boot — before the `.env` values were loaded — causing a `ConfigError: api_key is not defined` on every Artisan command including `config:clear`. The fix was lazy initialization — the client is only created the first time `getClient()` is called, not when the service is constructed.

---

## What I Would Add With More Time

- **Admin dashboard** — a simple interface to manage users and content without going to the database directly
- **OpenAI summaries** — the assessment mentioned this as a bonus. I would add a summarize button on protocol pages that sends the content to the OpenAI API and returns a concise summary
- **Real-time notifications** — using Laravel Echo and WebSockets so users get notified when someone replies to their comment or votes on their protocol
- **Activity heatmap** — another bonus mentioned in the assessment, showing community engagement over time similar to a GitHub contribution graph
- **Email verification** — currently registration does not require email verification which would be needed in a production app