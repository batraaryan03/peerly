<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:mcp-tools -->
# Available MCP Tools

## Turso Cloud (Database)
The production database is a Turso (libSQL) database hosted at `peerly-celestial-leo-tfhrj7.aws-ap-south-1.turso.io`.

Available operations:
- `turso_cloud_list_databases` — List all databases
- `turso_cloud_list_tables` ([database]) — List tables in a database
- `turso_cloud_describe_table` (table, [database]) — Get table schema info
- `turso_cloud_execute_read_only_query` (query, [database]) — Safe read-only queries (SELECT, PRAGMA, EXPLAIN)
- `turso_cloud_execute_query` (query, [database]) — ⚠️ Write operations (INSERT, UPDATE, DELETE, DROP, ALTER)
- `turso_cloud_generate_database_token` (database, permission) — Generate full-access or read-only tokens
- `turso_cloud_vector_search` (table, vector_column, query_vector, limit, [database]) — Vector similarity search
- `turso_cloud_create_database` (name, [group], [regions]) — ✓ SAFE: Create new database
- `turso_cloud_delete_database` (name) — ⚠️ DESTRUCTIVE: Permanently deletes database

DB config (from drizzle.config.ts):
- Schema: `./src/db/schema.ts`
- Output: `./drizzle/`
- Dialect: `turso`
- Credentials from `.env.local`: TURSO_DATABASE_URL, TURSO_AUTH_TOKEN

Drizzle commands:
- `npx drizzle-kit generate --name <name>` — Generate migration from schema changes
- `npx drizzle-kit migrate` — Apply pending migrations
- `npx drizzle-kit check` — Verify migration state
- `npx drizzle-kit studio` — Launch Drizzle Studio visualizer

## GitHub
Full GitHub API via these tools:
- **Issues**: `github_create_issue`, `github_get_issue`, `github_update_issue`, `github_search_issues`
- **Pull Requests**: `github_create_pull_request`, `github_get_pull_request`, `github_list_pull_requests`, `github_merge_pull_request`, `github_get_pull_request_comments`, `github_get_pull_request_files`, `github_get_pull_request_reviews`, `github_get_pull_request_status`, `github_update_pull_request_branch`, `github_create_pull_request_review`
- **Files**: `github_get_file_contents`, `github_create_or_update_file`, `github_push_files`
- **Repos**: `github_create_repository`, `github_search_repositories`, `github_list_commits`
- **Branches**: `github_create_branch`, `github_fork_repository`
- **Search**: `github_search_code`, `github_search_users`

Usage: `github_<verb>_<noun>(params)` — all require owner/repo for repo-scoped operations.

## Next.js DevTools
Next.js 16+ MCP integration tools:
- `next_devtools_init(project_path)` — ⚠️ CALL FIRST: Initialize Next.js DevTools MCP context
- `next_devtools_nextjs_index([port])` — Discover running Next.js dev servers and their MCP tools
- `next_devtools_nextjs_call(port, toolName, [args])` — Call a tool on a running Next.js dev server
- `next_devtools_nextjs_docs(path, [anchor])` — Fetch Next.js official docs (use llms-index first to find path)
- `next_devtools_upgrade_nextjs_16(project_path)` — Guide through upgrading to Next.js 16
- `next_devtools_enable_cache_components(project_path)` — Migrate to Cache Components mode
- `next_devtools_browser_eval(action, ...)` — Full Playwright browser automation

Workflow:
1. Run `next_devtools_init` at session start
2. Read `nextjs-docs://llms-index` resource to find doc paths
3. Use `next_devtools_nextjs_docs` with exact path from index
4. For runtime info: `next_devtools_nextjs_index` + `next_devtools_nextjs_call`

## Context7 Documentation
Query up-to-date library documentation:
- `context7_resolve_library_id(query, libraryName)` — Resolve a package to Context7 library ID
- `context7_query_docs(libraryId, query)` — Fetch documentation and code examples
- Max 3 calls per question

Use when implementing features with packages you're unfamiliar with (e.g., PeerJS, Stripe, etc.).

## Web Fetch & Search
- `web_search(query, [max_results])` — External web search (Tavily/Brave)
- `websearch(query, [numResults], [livecrawl], [type])` — Alternative web search
- `webfetch(url, [format], [timeout])` — Fetch URL content as markdown/text/html
- `gitingest(url, [maxFileSize], [pattern], [patternType])` — Fetch full GitHub repo content

# Commit Convention

All changes should be committed automatically after each completed task or milestone.

Commit message format:
```
peerly: <scope>: <description>
```

Examples:
- `peerly: schema: add foreign key constraints to all tables`
- `peerly: api: add ratings POST/GET endpoints`
- `peerly: ui: wire RatingDialog into sessions page`

Before committing:
1. `git status` — review changes
2. `git diff --stat` — summary of files changed
3. `git add <relevant files>` — stage intentionally
4. `git commit -m "peerly: <scope>: <description>"` — commit with message

Always verify:
- No secrets committed (check for .env values)
- No unrelated files staged
- Changes are logically grouped per task

# Database Schema (9 Tables)

```sql
users            -- id, name, email, avatar, image_url, rating, rating_count, created_at, last_seen_at
time_slots       -- id, user_id, userName, userAvatar, userImage, start_time, end_time, date, status, created_at
sessions         -- id, time_slot_id, host_id, participant_id, start_time, end_time, status, room_name, created_at, updated_at
session_requests -- id, slot_id, requester_id, message, status, created_at
groups           -- id, name, description, avatar_url, created_by, created_at
group_members    -- group_id, user_id, role, joined_at
messages         -- id, sender_id, receiver_id, group_id, content, created_at
ratings          -- id, session_id, from_user_id, to_user_id, score, comment, created_at
notifications    -- id, user_id, type, title, body, link, is_read, created_at
```

Foreign key constraints are defined in schema.ts via `foreignKey()` on all 9 tables — covering user_id → users.id, session_id → sessions.id, group_id → groups.id, and every other cross-table reference. Drizzle ORM relations are defined in src/db/relations.ts with `one` and `many` helpers for query-time joins across the full graph.

# API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/session-requests?userId=X` | GET | Fetch pending requests for a user (as requester or host) |
| `/api/session-requests` | POST | Create a session request (auto-creates notification for slot owner) |
| `/api/ratings?sessionId=X` | GET | Get ratings for a session |
| `/api/ratings` | POST | Submit a rating (updates the rated user's avg rating & count on users table) |

# Services

## PeerJS Signaling Server
`server/signaling.ts` — runs on port 3001 at `/peerjs` path. Scoped (no global discovery), CORS-restricted to the Next.js origin.

```bash
npx tsx server/signaling.ts
```

Environment: `SIGNALING_PORT` (default 3001), `CORS_ORIGIN` (default http://localhost:3000). Graceful shutdown on SIGTERM/SIGINT.

# Test Infrastructure

Tests use **vitest** with jsdom environment. Path alias `@/` → `./src` is configured.

```bash
npx vitest run          # Single run
npx vitest              # Watch mode
```

Test files: `src/**/*.test.{ts,tsx}` and `server/**/*.test.{ts,tsx}`.
