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
| `attendingProviderId` | string | Yes | Practitioner ID of the attending provider |
| `referralProviderId` | string | Yes | Practitioner ID of the referral provider |
| `locationId` | string | Yes | Location/facility ID |
| `transactionId` | string | Yes | Unique transaction identifier |
| `sendingFacility` | string | Yes | Name of the sending facility/vendor (e.g. `"healthyme"`) |
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

- The `sendingFacility` identifies your vendor/application (e.g. `"healthyme"`)
- The `receivingFacility` is the ModMed firm identifier (e.g. `"schweigerderm"`)
- `context.display` contains the encounter ID as a string
- `subject.reference` is a full URL to the patient resource
- `supportingInformation` references Coverage resources by full URL
- When **Auto-create bill** is enabled in Firm Admin, charges pushed via API automatically generate bills in the New Bills tab
- The sandbox environment may need ChargeItem_CREATE configuration enabled separately — contact ModMed support if CREATE fails in sandbox
- `transactionId` should be a unique identifier for each charge transaction

---

*Source: ModMed Synapsys team correspondence (Shakawat Sobuj), May 2026*
*Reference: https://portal.api.modmed.com/reference/chargeitem*
