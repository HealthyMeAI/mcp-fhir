# Condition

Base profile: https://www.hl7.org/fhir/condition.html

## Common Use Cases
- Find all Conditions for a Patient
- Add a Condition to a Patient's record
- Update a Condition's status

## Supported Attributes

The following attributes are supported:

| Field Name | Notes |
|------------|-------|
| `clinicalStatus` | Values: Active, Inactive, Resolved |
| `subject` | Reference to Patient |

## Related API Endpoints

### Retrieve Condition details for an ID
`GET /ema/fhir/v2/Condition/{id}`

### Update Condition resource
`PUT /ema/fhir/v2/Condition/{id}`

### Retrieve Condition resources by specified search criteria
`GET /ema/fhir/v2/Condition`

### Create Condition resource
`POST /ema/fhir/v2/Condition`

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `accept` | string | No | Content type header (`application/fhir+json` or `application/fhir+xml`) |
| `patient` | string | Yes | Reference to patient (for search) |
| `id` | string | Yes | Condition resource ID (≥1) |

## Notes
- URLs for requests expire after 30 days
- Requires `accept: application/fhir+json` header

---

*Reference: https://portal.api.modmed.com/reference/condition-1*
