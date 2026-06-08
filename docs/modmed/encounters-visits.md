# Encounters/Visits

Base profile: https://www.hl7.org/fhir/encounter.html

Understanding Visits and Encounters

Visits, including Telehealth visits and Non-Visit Orders, are represented in the /Encounter resource. It's important to note that Encounters are distinct from Appointments. Think of an appointment as a placeholder, while an encounter represents the actual clinical interaction.

**Key Concepts:**
- **Encounters/Visits**: Represent actual clinical interactions (in-person, telehealth, or orders placed without a visit)
- **Appointments**: Represent scheduled future events, not yet occurred
- Encounters can be linked to documents, conditions, and other clinical data

## Related API Endpoints

### Get a specific Encounter
`GET /ema/fhir/v2/Encounter/{id}`

### Get All Encounters for a Practice
`GET /ema/fhir/v2/Encounter`

See detailed API documentation for parameters and response formats.

---

*Reference: https://portal.api.modmed.com/reference/encountersvisits*
