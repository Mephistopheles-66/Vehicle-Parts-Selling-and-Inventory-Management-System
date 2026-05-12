Generated OpenAPI client
========================

The backend exposes its OpenAPI document at:

```text
http://localhost:5165/openapi/v1.json
```

Start the backend, then run:

```bash
npm run openapi:generate
```

This writes generated OpenAPI schema types to:

```text
src/api/generated/schema.d.ts
```

It also writes generated endpoint services, models, and fetch core files to:

```text
src/api/generated/client
```

Use a different spec URL with:

```bash
OPENAPI_INPUT_URL=https://your-api-host/openapi/v1.json npm run openapi:generate
```

Do not manually edit generated files.
