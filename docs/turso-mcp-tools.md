# Turso Cloud MCP Tools — Complete Reference

The Turso Cloud MCP server is configured in `opencode.json` and exposes 7 tools for managing and querying Turso databases directly from the agent.

## Tool Reference

---

### `list_databases`
Lists all databases in the Turso organization.

```
Usage: list_databases()
Response: { databases: [{ Name, Hostname, regions, type, version, group, ... }] }
```

**Capabilities:**
- View all databases with metadata (region, version, type, sleeping status)
- Check if a database exists
- Verify database creation/deletion

---

### `create_database`
Creates a new database in the organization.

```
Usage: create_database(name, group?, regions?)
Response: { database: { DbId, Hostname, Name }, username, password }
```

**Capabilities:**
- Create databases with specific region placement
- Optionally add to deployment groups
- Returns credentials for immediate use

**Limitations:**
- Database name must be unique across the organization
- Free tier limited to 500 databases

---

### `delete_database`
Permanently deletes a database and all its data.

```
Usage: delete_database(name)
Response: { success: true }
```

⚠️ Irreversible. Always confirm before running.

---

### `list_tables`
Lists all tables in a database.

```
Usage: list_tables(database)
Response: { database, tables: [string] }
```

**Notes:**
- `database` parameter expects the logical database **name** (`peerly`), not the hostname URL

---

### `describe_table`
Shows column details for a table.

```
Usage: describe_table(table, database?)
Response: { database, table, columns: [{ name, type, nullable, default_value, primary_key }] }
```

**Capabilities:**
- Full schema introspection
- Nullability, defaults, PK constraints
- Hidden columns (used by vector indexes) shown via `table_xinfo` PRAGMA

---

### `execute_read_only_query`
Runs read-only SQL queries (SELECT, PRAGMA, EXPLAIN).

```
Usage: execute_read_only_query(query, params?, database?)
Response: { database, query, result: { rows, columns, rowsAffected } }
```

**Safeguards:**
- Automatically rejects INSERT/UPDATE/DELETE/ALTER/DROP statements
- Safe for exploration and data analysis

**Useful PRAGMA queries:**
```sql
-- Show all tables
SELECT name FROM sqlite_master WHERE type='table';

-- Show all indexes
SELECT sql FROM sqlite_master WHERE type='index' AND sql IS NOT NULL;

-- Table column details
PRAGMA table_info(table_name);

-- Table with hidden/vector columns
PRAGMA table_xinfo(table_name);
```

---

### `execute_query`
Runs write operations (INSERT, UPDATE, DELETE, ALTER, DROP).

```
Usage: execute_query(query, params?, database?)
Response: Similar to read-only but allows data modification
```

⚠️ Destructive operations require explicit user confirmation.

**Parameterized queries are supported** for security:
```sql
INSERT INTO users (id, name, email) VALUES (?, ?, ?)
```

---

### `generate_database_token`
Generates a scoped JWT token for database access.

```
Usage: generate_database_token(database, permission)
Permissions: "full-access" | "read-only"
Response: { jwt, permission, database }
```

**Capabilities:**
- Create read-only tokens for analytics/read-only clients
- Create full-access tokens for server-side operations
- Tokens are time-stamped but don't auto-expire unless server-configured

---

### `vector_search`
Performs vector similarity search against a vector column.

```
Usage: vector_search(table, vector_column, query_vector, limit?, database?)
Response: Similarity-ranked results
```

**Requirements:**
- Target table must have a `VECTOR`-typed column
- `libsql_vector` extension must be enabled on the database

**Not yet in use** — requires vector column creation in the schema (see [Database Schema](./database-schema.md#future-vector-columns)).

---

## Tool Usage Patterns

### Pattern 1: Schema Exploration
```
list_tables("peerly")
describe_table("time_slots", "peerly")
execute_read_only_query("peerly", "SELECT * FROM sqlite_master WHERE type='index'")
```

### Pattern 2: Data Inspection
```
execute_read_only_query("peerly", "SELECT status, COUNT(*) FROM time_slots GROUP BY status")
execute_read_only_query("peerly", "SELECT * FROM users")
```

### Pattern 3: Schema Changes
```
execute_query("peerly", "ALTER TABLE time_slots ADD COLUMN updated_at INTEGER")
```

### Pattern 4: Token Management
```
generate_database_token("peerly", "read-only")
```

---

## Configuration

The MCP server is configured in `opencode.json`:

```json
"turso-cloud": {
  "type": "local",
  "command": ["npx", "-y", "mcp-turso-cloud"],
  "environment": {
    "TURSO_API_TOKEN": "eyJ...",
    "TURSO_ORGANIZATION": "celestial-leo-tfhrj7",
    "TURSO_DEFAULT_DATABASE": "libsql://peerly-celestial-leo-tfhrj7.aws-ap-south-1.turso.io"
  }
}
```

| Env Variable | Value | Purpose |
|-------------|-------|---------|
| `TURSO_API_TOKEN` | Org-level API token | Authenticates to Turso Cloud API |
| `TURSO_ORGANIZATION` | `celestial-leo-tfhrj7` | Organization slug |
| `TURSO_DEFAULT_DATABASE` | Full hostname URL | Default database for operations |

## Migration from the old `@libsql/client` only approach

With the MCP tools available, schema changes and data inspection can be done directly from the agent without writing code or using the CLI. The API routes (`/api/time-slots`, `/api/users/sync`, `/api/db/init`) remain the production data path, while the MCP tools are used during development and maintenance.
