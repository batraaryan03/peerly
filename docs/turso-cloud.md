# Turso Cloud — Overview

Turso is a distributed SQLite database built on libSQL. It provides an edge-hosted SQLite database with replication across regions, vector search, and a HTTP/WebSocket protocol for low-latency access.

## Why Turso for Peerly

- **Edge-native** — single-digit millisecond latency from any region
- **SQLite-compatible** — familiar, lightweight, zero-config
- **Built-in vector search** — enables AI-powered peer matching without extra infrastructure
- **Generous free tier** — 9 GB storage, 1 billion rows read/month, 25 million rows written/month
- **No ORM required** — raw SQL is sufficient; works seamlessly with `@libsql/client`

## Database Details

| Property | Value |
|----------|-------|
| **Name** | `peerly` |
| **Host** | `peerly-celestial-leo-tfhrj7.aws-ap-south-1.turso.io` |
| **Region** | `aws-ap-south-1` (Mumbai) |
| **Engine** | libSQL (SQLite-compatible) |
| **Version** | `2026.7.1` |
| **Type** | Logical database |
| **Status** | Active (not sleeping) |

## Current Tables

### `users`
Stores synced Clerk user profiles. Minimal fields — extended profile data lives client-side in Zustand.

### `time_slots`
Hourly availability slots created by users. Indexed on `user_id`, `start_time`, and `status` for fast queries.

See [Database Schema](./database-schema.md) for full column details.

## Authentication

Two types of tokens:

| Token Type | Scope | Use Case |
|-----------|-------|----------|
| **Database token** | Single database (read-write or read-only) | API routes, MCP tools, CLI access |
| **API token** (org-level) | Organization management | `turso-cloud-*` MCP tools, Turso Cloud API |

The database token in `.env` is a **read-write database token** with no expiry. An API token is configured in `opencode.json` for MCP management operations.

## Vector Search

Turso supports vector similarity search via `libsql_vector`. This can be used to:
- Match users by skill/interests embeddings
- Find similar session topics
- Recommend peer matches based on historical preference vectors

Vector columns are created with the `VECTOR` type and queried via `vector_distance()` and `vector_top_k()`.

## Pricing & Limits (Free Tier)

| Metric | Limit |
|--------|-------|
| Storage | 9 GB |
| Row reads | 1 billion/month |
| Row writes | 25 million/month |
| Databases | 500 per org |
| Locations | 1 region (more available on Scale plan) |
