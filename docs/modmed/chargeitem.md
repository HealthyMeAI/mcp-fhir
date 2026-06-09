# ChargeItem

Base profile: https://www.hl7.org/fhir/chargeitem.html

## Common Use Cases
- Create charges for encounters (push charges into ModMed billing)
- Link charges to patients, encounters, and diagnoses
- Auto-create bills when charges are pushed through the API

## Supported Operations

| Operation | Endpoint | Supported |
|-----------|----------|-----------|
| Create | `POST /ema/fhir/v2/ChargeItem` | Yes |
| Read | `GET /ema/fhir/v2/ChargeItem/{id}` | Yes |
| Search | `GET /ema/fhir/v2/ChargeItem` | Yes |
| Update | `PUT /ema/fhir/v2/ChargeItem/{id}` | Yes |

## Firm Admin Configuration

Before sending charges, the target firm must enable **Auto-create bill** in Firm Admin:

1. Log in to ModMed
2. Go to: **Firm Admin → Practice Management Settings**
3. Find the charge-sending vendor in the vendor list
4. Click **Edit** next to the vendor
5. Choose **Auto-create bill** — charges turn into bills automatically and show up in the New Bills tab
6. Save

Without this configuration, charges will not automatically generate bills.

## Authentication

Requires a valid OAuth2 bearer token. See [authentication.md](./authentication.md) for details.

## Required Headers

| Header | Value |
|--------|-------|
| `accept` | `application/fhir+json` |
| `content-type` | `application/fhir+json` |
| `x-api-key` | Your API key |

## Required Fields

These fields are required in the ChargeItem CREATE payload:

### Top-Level Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `resourceType` | string | Yes | Must be `"ChargeItem"` |
| `status` | string | Yes | Charge status (e.g. `"billable"`) |
| `occurrenceDateTime` | dateTime | Yes | Date/time of the charge |
| `subject` | Reference | Yes | Reference to the Patient |
| `context` | BackboneElement | Yes | Encounter reference (display = encounter ID) |
| `reason` | array | Yes | Diagnosis codes for the charge |
| `extension` | array | Yes | Financial transaction details (see below) |

### Financial Transaction Extension

The `extension` array must contain a single `financialTransaction` extension with the following nested extensions:

#### Top-Level Transaction Fields

| Extension URL | Type | Required | Description |
|---------------|------|----------|-------------|
| `totalCost` | Money | Yes | Total cost of the charge (value + currency) |
| `attendingProviderId` | string | Yes | Practitioner ID of the attending provider (must be a correctly configured practitioner — not all practitioners are set up for charge creation) |
| `referralProviderId` | string | Yes | Practitioner ID of the referral provider |
| `locationId` | string | Yes | **Location PMSID** (not the FHIR Location ID). Find it in the Location resource's `identifier` where `system` = `"PMSID"` (e.g. `"103336FAC000000034"`) |
| `transactionId` | string | Yes | Unique transaction identifier |
| `sendingFacility` | string | Yes | Name of the configured bridge integration vendor. **Must be `"healthyme"`** — other values like `"modmed"`, `"apiportal"`, `"mcp-fhir"` are not configured and will return `"Failed to find a bridge integration"` |
| `receivingFacility` | string | Yes | Firm identifier (e.g. `"schweigerderm"`) |
| `financialTransactionDetail` | Extension | Yes | Nested detail extension (see below) |

#### Financial Transaction Detail Fields

These are nested inside the `financialTransactionDetail` extension:

| Extension URL | Type | Required | Description |
|---------------|------|----------|-------------|
| `transactionType` | string | Yes | Transaction type code (e.g. `"CG"` for charge) |
| `performingProviderId` | string | Yes | Practitioner ID of the performing provider |
| `code` | Coding | Yes | Procedure code with `system`, `code`, `display` |
| `unitCost` | Money | Yes | Cost per unit (value + currency) |
| `quantity` | decimal | Yes | Number of units |
| `description` | string | Yes | Description of the charge item |
| `postingDate` | dateTime | Yes | Date/time for posting |
| `transactionPeriod` | Period | Yes | Start/end datetime for the transaction |
| `diagnosisDetail` | Extension | No | Nested diagnosis codes |

#### Diagnosis Detail Fields

Nested inside `diagnosisDetail`:

| Extension URL | Type | Required | Description |
|---------------|------|----------|-------------|
| `diagnosisCode` | Coding | No | Diagnosis with `system`, `code`, `display` |

### Code Systems

The following code systems are used in ChargeItem payloads:

| System | Usage | Example |
|--------|-------|---------|
| `CPT` | Procedure codes in `code` field | `V2020` |
| `I10` | ICD-10 diagnosis codes in `reason` and `diagnosisCode` | `H52.229` |

### Supporting Information

The `supportingInformation` array references Coverage resources. Include references to the patient's insurance coverage:

```json
"supportingInformation": [
    { "reference": "https://stage.ema-api.com/ema-dev/firm/schweigerderm/Coverage/{id}" }
]
```

## Example Payload

```json
{
    "resourceType": "ChargeItem",
    "extension": [
        {
            "url": "financialTransaction",
            "extension": [
                {
                    "url": "totalCost",
                    "valueMoney": {
                        "value": "66.00",
                        "currency": "USD"
                    }
                },
                {
                    "url": "attendingProviderId",
                    "valueString": "895670"
                },
                {
                    "url": "referralProviderId",
                    "valueString": "895670"
                },
                {
                    "url": "locationId",
                    "valueString": "108583FAC000000001"
                },
                {
                    "url": "transactionId",
                    "valueString": "05081977"
                },
                {
                    "url": "sendingFacility",
                    "valueString": "healthyme"
                },
                {
                    "url": "receivingFacility",
                    "valueString": "schweigerderm"
                },
                {
                    "url": "financialTransactionDetail",
                    "extension": [
                        {
                            "url": "transactionType",
                            "valueString": "CG"
                        },
                        {
                            "url": "performingProviderId",
                            "valueString": "171873"
                        },
                        {
                            "url": "code",
                            "valueCoding": {
                                "system": "CPT",
                                "code": "V2020",
                                "display": "Patient Own Frame"
                            }
                        },
                        {
                            "url": "unitCost",
                            "valueMoney": {
                                "value": "66.00",
                                "currency": "USD"
                            }
                        },
                        {
                            "url": "quantity",
                            "valueDecimal": "1.0"
                        },
                        {
                            "url": "description",
                            "valueString": "Patient Own Frame"
                        },
                        {
                            "url": "postingDate",
                            "valueDateTime": "2025-02-06T10:00:00-05:00"
                        },
                        {
                            "url": "transactionPeriod",
                            "valuePeriod": {
                                "start": "2025-02-06T10:00:00-05:00",
                                "end": "2025-02-06T10:00:00-05:00"
                            }
                        },
                        {
                            "url": "diagnosisDetail",
                            "extension": [
                                {
                                    "url": "diagnosisCode",
                                    "valueCoding": {
                                        "system": "I10",
                                        "code": "H52.229",
                                        "display": "Regular astigmatism, unspecified eye"
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    "status": "billable",
    "occurrenceDateTime": "2025-02-06T10:00:00-05:00",
    "subject": {
        "reference": "https://stage.ema-api.com/ema-dev/firm/schweigerderm/Patient/171879"
    },
    "context": {
        "display": "656"
    },
    "supportingInformation": [
        {
            "reference": "https://stage.ema-api.com/ema-dev/firm/schweigerderm/Coverage/139926"
        }
    ],
    "reason": [
        {
            "coding": [
                {
                    "system": "I10",
                    "code": "H52.229"
                }
            ]
        }
    ]
}
```

## Notes

### sendingFacility Configuration
Only `"healthyme"` is configured as a bridge integration for inbound charges. Other values (`"modmed"`, `"apiportal"`, `"mcp-fhir"`) will fail with `"Failed to find a bridge integration"`. This applies to both staging and production.

### locationId — Must Use PMSID
The `locationId` field requires the Location's **PMSID**, not the FHIR Location resource ID. To find the correct value:
1. Read the Location resource via the FHIR API
2. Look in the `identifier` array for the entry where `system` = `"PMSID"`
3. Use that value (e.g., `"103336FAC000000034"` for Location 1068, `"30"` for Location 1471)

### Practitioner Configuration
The practitioner referenced in `attendingProviderId` must be correctly configured in ModMed for charge creation. Using an unconfigured practitioner may return `"Failed to find configured business unit from npi provided in payload"`.

### Autobill
When **Auto-create bill** (Autobill) is enabled in Firm Admin, charges pushed via API automatically generate bills in the New Bills tab. Autobill is now enabled in the Schweiger Derm production environment.

### Response Format
Successful CREATE returns an `OperationOutcome` with the charge ID in `INBOUND|{id}` format:
```json
{
  "resourceType": "OperationOutcome",
  "issue": [{
    "severity": "information",
    "code": "informational",
    "diagnostics": "ChargeItem successfully saved with Id: INBOUND|1001362"
  }]
}
```
The `INBOUND|` prefix indicates the charge is in the processing queue. It may not be immediately queryable via the FHIR API (`GET /ChargeItem/INBOUND|{id}` returns 400 due to the pipe character).

### General
- `context.display` contains the encounter ID as a string
- `subject.reference` is a full URL to the patient resource
- `supportingInformation` references Coverage resources by full URL (optional if patient has no coverage)
- `transactionId` should be a unique identifier for each charge transaction
- Staging environments may have additional configuration issues (NPI→business unit mapping not set up) that are resolved in production

---

*Source: ModMed Synapsys team correspondence (Shakawat Sobuj), May 2026*
*Production testing confirmed June 2026 — patient Bob Admin (33557855), encounter 54147960, ChargeItem INBOUND|1001362*
*Bridge integration and PMSID guidance confirmed by ModMed support, June 2026*
*Reference: https://portal.api.modmed.com/reference/chargeitem*
