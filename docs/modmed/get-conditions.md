# Retrieve Condition Resources

Retrieves Condition resources by specified search criteria.

## Endpoint
`GET /ema/fhir/v2/Condition`

## Authentication
Requires a valid OAuth2 bearer token. See [authentication.md](./authentication.md) for details.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `patient` | string | Yes | Reference to patient |
| `accept` | string | No | Content type header (`application/fhir+json` or `application/fhir+xml`) |

Additional search parameters may be available. See full documentation.

## Response
Returns FHIR Condition resources in JSON format.

## Notes
- URLs for requests expire after 30 days
- Requires `accept: application/fhir+json` header

## Example Request
```bash
curl --request GET \
     --url https://stage.ema-api.com/ema-dev/firm/apiportal/ema/fhir/v2/Condition?patient=Patient/{id} \
     --header 'accept: application/fhir+json'
```

---

*Reference: https://portal.api.modmed.com/reference/get_fhir-v2-condition*
