# Create Composition

Creates a new Composition resource.

## Endpoint
`POST /ema/fhir/v2/Composition`

## Authentication
Requires a valid OAuth2 bearer token. See [authentication.md](./authentication.md) for details.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `accept` | string | No | Content type header (`application/fhir+json` or `application/fhir+xml`) |

## Response
Returns created FHIR Composition resource in JSON format.

## Notes
- URLs for requests expire after 30 days
- Requires `accept: application/fhir+json` header
- Requires `content-type: application/fhir+json` header for POST body

## Example Request
```bash
curl --request POST \
     --url https://stage.ema-api.com/ema-dev/firm/apiportal/ema/fhir/v2/Composition \
     --header 'accept: application/fhir+json' \
     --header 'content-type: application/fhir+json'
```

---

*Reference: https://portal.api.modmed.com/reference/post_fhir-v2-composition*
