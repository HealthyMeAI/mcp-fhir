# Read Patient Instance

Retrieves a specific Patient resource by ID.

## Endpoint
`GET /ema/fhir/v2/Patient/{id}`

## Authentication
Requires a valid OAuth2 bearer token. See [authentication.md](./authentication.md) for details.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | **Yes** | Patient resource ID (≥1) |
| `accept` | string | No | Content type header (`application/fhir+json` or `application/fhir+xml`) |

## Response
Returns FHIR Patient resource in JSON format.

## Notes
- URLs for requests expire after 30 days
- Requires `accept: application/fhir+json` header

## Example Request
```bash
curl --request GET \
     --url https://stage.ema-api.com/ema-dev/firm/apiportal/ema/fhir/v2/Patient/ \
     --header 'accept: application/fhir+json'
```

---

*Reference: https://portal.api.modmed.com/reference/get_fhir-v2-patient-id*
