# Header Flags Reference

**Source**: [ModMed API Reference - Header Flags](https://portal.api.modmed.com/reference/header-flags)

**Purpose**: Custom header flags control optional content returned in API responses. Use the `Content-flag` header to request additional data.

## Available Flags

| Header Flag Value | Purpose | Used in Our Codebase |
|-------------------|---------|----------------------|
| `Referral` | Adds Referral Contact and Referral Source information to Patient and Appointment payloads. | No |
| `Pagination_optimization_disabled` | Provides the total count for all resources, not just the current page. Disables pagination optimization to return accurate total counts. | **Yes** - Used in POST requests to get total counts |

## Usage

### HTTP Header Format
```http
Content-flag: Pagination_optimization_disabled
```

### cURL Example
```bash
curl -X POST "https://api.modmed.com/fhir/v2/Composition" \
  -H "Authorization: Bearer <token>" \
  -H "x-api-key: <api-key>" \
  -H "Content-Type: application/fhir+json" \
  -H "Accept: application/fhir+json" \
  -H "Content-flag: Pagination_optimization_disabled" \
  -d '{"resourceType":"Composition", ...}'
```

### TypeScript Example (from our codebase)
```typescript
// src/modmed/client.ts - POST method
const response = await request(url, {
  method: 'POST',
  body: JSON.stringify(data),
  headers: {
    Authorization: `Bearer ${token}`,
    'x-api-key': this.apiKey,
    'Content-Type': 'application/fhir+json',
    Accept: 'application/fhir+json',
    'Content-flag': 'Pagination_optimization_disabled', // ← Header flag
  },
});
```

## Notes

- The `Content-flag` header is **optional**. Omitting it uses default behavior (pagination optimization enabled).
- Only one flag value can be specified per request.
- Flags are specific to certain endpoints (check ModMed documentation for endpoint compatibility).
- Our poller uses `Pagination_optimization_disabled` for accurate pagination counts when pushing FHIR Compositions.

