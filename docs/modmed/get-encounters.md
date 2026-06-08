# Get All Encounters for a Practice

Retrieves all encounters for a practice/firm.

## Endpoint
`GET /ema/fhir/v2/Encounter`

## Authentication
Requires a valid OAuth2 bearer token. See [authentication.md](./authentication.md) for details.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `accept` | string | No | Content type header (`application/fhir+json` or `application/fhir+xml`) |

### Query Parameters
The following query parameters can be used to filter and paginate results:

| Parameter | Type | Description |
|-----------|------|-------------|
| `_count` | string | Return total count of matching encounters instead of resources |
| `patient` | string | Filter encounters by patient reference |
| `_lastUpdated` | string | Filter encounters last updated after this timestamp (ISO 8601 format) |
| `practitioner` | string | Filter by practitioner reference |
| `_sort` | string | Sort field (e.g., `date`, `-date`) |
| `_elements` | string | Return only specified FHIR elements |

### Pagination Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `_page` | string | Page token for pagination |
| `_count` | number | Number of results per page |

## Response
Returns FHIR Encounter resources in JSON format.

## Notes
- URLs for requests expire after 30 days
- Requires `accept: application/fhir+json` header
- Encounters can include Telehealth visits, in-person visits, and Non-Visit Orders
- Encounters are distinct from Appointments (which represent scheduled future events, not actual clinical interactions)

## Related Endpoints

### Get a specific Encounter
`GET /ema/fhir/v2/Encounter/{id}`

See [get-encounter-by-id.md](./get-encounter-by-id.md) for retrieving a single encounter.

## Example Request

```bash
curl --request GET \
     --url https://stage.ema-api.com/ema-dev/firm/apiportal/ema/fhir/v2/Encounter \
     --header 'accept: application/fhir+json'
```

---

*Reference: https://portal.api.modmed.com/reference/get_fhir-v2-encounter*
