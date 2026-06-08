# DocumentReference

Retrieve Document resources meeting specified search criteria.

## Endpoint
`GET /ema/fhir/v2/DocumentReference`

## Authentication
Requires a valid OAuth2 bearer token. See [authentication.md](./authentication.md) for details.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `_count` | string | No | Total count of matching resources |
| `category` | string | No | Classification of the document |
| `date` | date | No | Filter by date |
| `description` | string | No | Text search in description |
| `encounter` | string | No | Reference to encounter |
| `identifier` | string | No | Document identifier |
| `page` | string | No | Pagination page token |
| `patient` | string | **Yes** | Reference to patient |
| `requisition` | string | No | Search by requisition ID |
| `type` | string | No | Document type |

## Response
Returns FHIR DocumentReference resources in JSON format.

## Notes
- URLs for requests expire after 30 days
- Requires `accept: application/fhir+json` header

---

*Reference: https://portal.api.modmed.com/reference/get_fhir-v2-documentreference*
