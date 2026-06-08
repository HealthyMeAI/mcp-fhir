# Patient

Base profile: https://hl7.org/fhir/R4/patient.html

## Common Use Cases
- Retrieve all patients for a specific practice
- Search for a specific patient
- Identify changes made within a given time frame
- Retrieve a patient's demographic information
- Create a new patient record
- Update an existing patient's demographics

## Related API Endpoints

### read-instance: Read Patient instance
`GET /ema/fhir/v2/Patient/{id}`

### Updates Patient Resource
`PUT /ema/fhir/v2/Patient/{id}`

### search-type: Search for Patient instances
`GET /ema/fhir/v2/Patient`

### Creates Patient Resource
`POST /ema/fhir/v2/Patient`

---

*Reference: https://portal.api.modmed.com/reference/patient-1*
