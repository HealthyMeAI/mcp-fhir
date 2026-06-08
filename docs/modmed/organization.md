# Organization

Currently, the 'Organization' resource can only be used to query two different data sets. It can be used to find Payers in the ModMed Practice Management system. It can also be used to find Referring Institutions within EMA/MMPM.

We will be expanding on the Organization resource to include other type capabilities in future releases, so stay tuned for updates.

## Key Use Cases
- Find insurance payers
- Find referring institutions
- Query organizational data from different systems

## Related API Endpoints

### Retrieve information by ID
`GET /ema/fhir/v2/Organization/{id}`

### Search Organization by certain parameters
`GET /ema/fhir/v2/Organization`

### Create Referring Institution
`POST /ema/fhir/v2/Organization`

## Notes
- Base profile: https://www.hl7.org/fhir/organization.html
- URLs for requests expire after 30 days
- Requires `accept: application/fhir+json` header

---

*Reference: https://portal.api.modmed.com/reference/organization-1*
