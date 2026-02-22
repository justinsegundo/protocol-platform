# Protocol Platform

A full-stack discussion platform for sharing and discovering wellness protocols. Built with Laravel 11, React, and Typesense for the Just Holistics / Activate Digital Media technical assessment.

Users can post structured protocols, start discussion threads, leave reviews with star ratings, comment with nested replies, and upvote or downvote content. Search is handled by Typesense so it's fast and works with partial matches.

---

## Stack

- **Backend** — Laravel 11, MySQL, Laravel Sanctum
- **Frontend** — React 18, TailwindCSS v3, React Query, Axios
- **Search** — Typesense Cloud
- **Auth** — Sanctum token-based authentication

---

## Project Structure

```
protocol-platform/
├── backend/        # Laravel REST API
├── frontend/       # React app
└── README.md
```

---

## Setup

### Requirements

- PHP 8.2+
- Composer
- MySQL
- Node.js 18+
- Typesense Cloud instance (credentials below)

---

### Backend

```bash
cd backend
composer install
cp .env.example .env
```

Fill in your `.env` — database credentials and Typesense keys (see Environment Variables section).

```bash
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve
```

API runs at `http://127.0.0.1:8000`

---

### Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend folder:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

```bash
npm run dev
```

App runs at `http://localhost:5173`

---

## Environment Variables

### backend/.env.example

```env
APP_NAME="Protocol Platform"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=protocol_platform
DB_USERNAME=root
DB_PASSWORD=

TYPESENSE_HOST=your-typesense-host.typesense.net
TYPESENSE_PORT=443
TYPESENSE_PROTOCOL=https
TYPESENSE_API_KEY=your-admin-api-key
TYPESENSE_SEARCH_ONLY_API_KEY=your-search-only-key

FRONTEND_URL=http://localhost:5173
```

### frontend/.env.example

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

---

## Test Account

After seeding the database you can log in with:

```
Email:    admin@example.com
Password: password
```

Or register a new account directly from the app.

---

## API Endpoints

### Auth

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout       (requires token)
GET    /api/auth/me           (requires token)
```

### Protocols

```
GET    /api/protocols
GET    /api/protocols/{id}
POST   /api/protocols         (requires token)
PUT    /api/protocols/{id}    (requires token, owner only)
DELETE /api/protocols/{id}    (requires token, owner only)
```

**Query params:**
```
?sort_by=latest
?sort_by=top_rated
?sort_by=most_reviewed
?search=your-term
?per_page=12
?page=1
```

### Threads

```
GET    /api/threads
GET    /api/threads/{id}
POST   /api/threads           (requires token)
PUT    /api/threads/{id}      (requires token, owner only)
DELETE /api/threads/{id}      (requires token, owner only)
```

**Query params:**
```
?sort_by=latest
?sort_by=most_upvoted
?sort_by=most_commented
?protocol_id=1
?search=your-term
```

### Comments

```
GET    /api/threads/{id}/comments
POST   /api/threads/{id}/comments              (requires token)
PUT    /api/threads/{id}/comments/{commentId}  (requires token, owner only)
DELETE /api/threads/{id}/comments/{commentId}  (requires token, owner only)
```

To post a reply, include `parent_id` in the request body pointing to the comment you're replying to.

### Reviews

```
POST   /api/protocols/{id}/reviews   (requires token)
PUT    /api/protocols/{id}/reviews   (requires token)
DELETE /api/protocols/{id}/reviews   (requires token)
```

One review per user per protocol. Returns 422 if the user has already reviewed.

### Votes

```
POST   /api/votes   (requires token)
```

Request body:
```json
{
  "votable_type": "thread",
  "votable_id": 1,
  "type": "upvote"
}
```

`votable_type` accepts `thread` or `comment`. Voting the same type twice removes the vote. Voting the opposite type switches it.

### Search

```
GET /api/search?q=gut&collection=protocols
GET /api/search?q=fasting&collection=threads
```

Queries Typesense directly. Supports partial matches and relevance ranking.

**Additional params:**
```
?sort_by=latest
?sort_by=top_rated
?sort_by=most_reviewed
?sort_by=most_upvoted
?page=1
?per_page=10
```

---

## Typesense

Two collections are maintained — `protocols` and `threads`. Both are automatically synced whenever content is created, updated, or deleted. You don't need to manually reindex during normal use.

If you need to force a full reindex:

```bash
php artisan typesense:reindex
```

This loops through all protocols and threads in MySQL and pushes them to Typesense fresh. Useful if the index gets out of sync with the database.

---

## Seeded Data

Running `php artisan migrate:fresh --seed` creates:

| Model | Count |
|-------|-------|
| Users | 15 |
| Protocols | 12 |
| Threads | 10 |
| Comments | 30+ (with nested replies) |
| Reviews | 40+ |
| Votes | 50+ |

All seed data uses realistic English content — not Lorem Ipsum.

---

## Features

- Token-based auth with Laravel Sanctum
- Full CRUD for protocols, threads, comments, and reviews
- Polymorphic voting — threads and comments share one votes table
- One vote per user enforced at both application and database level
- Nested comment replies (self-referencing, up to 3 levels deep)
- Typesense search with debounced search-as-you-type on the frontend
- Sort and filter by recency, rating, review count, and upvotes
- Ownership-based access control via Laravel Policies
- Fully responsive UI — tested at 375px, 768px, and 1280px
- Optimistic UI on votes — updates instantly before API confirms

---

## Notes

The Typesense SSL certificate on Windows (WAMP) requires the cacert.pem file to be configured in php.ini. If you run into SSL errors locally, either configure the cert or set `verify: false` in the Guzzle client inside `TypesenseService.php`. Do not disable SSL in production.