# @flexpa/mcp-fhir

This is a TypeScript-based MCP server that connects to a FHIR server. It provides core MCP functionality for interacting with FHIR resources by:

- Accessing FHIR resources via URIs
- Providing search capabilities for FHIR resources
- Creating, updating, and deleting FHIR resources
- Searching bundled ModMed API documentation for guidance on resource operations and field formats

## Features

### Resources

> [!TIP]
> "Resources" here refers to the MCP definition _not_ the FHIR one. MCP Resources are a core primitive in the Model Context Protocol (MCP) that allow servers to expose data and content that can be read by clients and used as context for LLM interactions.

- List and access FHIR resources via `fhir://` URIs
- Resources are returned in FHIR JSON format
- Supports all FHIR Resource types available in the FHIR server's CapabilityStatement

### Tools
- `search_fhir` - Search FHIR resources
  - Takes `resourceType` and `searchParams` as parameters
  - Returns FHIR search results
- `read_fhir` - Read an individual FHIR resource
  - Takes `uri` as a parameter
  - Returns the FHIR resource in JSON format
- `create_fhir` - Create a new FHIR resource
  - Takes `resourceType`, `payload` (FHIR resource JSON), and optional `operation` (e.g. `$validate`)
  - Returns the created resource or a status with location header
- `update_fhir` - Update an existing FHIR resource
  - Takes `resourceType`, `id`, `payload`, and optional `operation`
  - Sends a PUT with the full resource body
- `delete_fhir` - Delete a FHIR resource
  - Takes `resourceType`, `id`, and optional `operation`
  - Sends a DELETE request
- `search_documentation` - Search bundled ModMed API documentation
  - Takes `query` as a parameter
  - Searches `.md` files in `docs/modmed/` directory with relevance scoring
  - Returns up to 3 most relevant docs with full content
  - Falls back to listing available topics if no matches

### Error Handling

All tools return structured `OperationOutcome` resources on failure, preserving ModMed's original error messages:

```json
{
  "resourceType": "OperationOutcome",
  "issue": [{
    "severity": "error",
    "code": "exception",
    "diagnostics": "Failed to create FHIR resource: {\"message\":\"...\"}"
  }]
}
```

### Flexible URI Parsing

The `read_fhir` tool accepts multiple URI formats:
- `fhir://Encounter/3065019` (canonical)
- `Encounter/3065019` (bare resourceType/id)
- `https://.../Encounter/3065019` (full URL — extracts last two path segments)

## ModMed EMA FHIR API Notes

This server was built and tested against the ModMed EMA staging and production APIs. Below are important findings to avoid common pitfalls.

### Resource Operation Support

Not all FHIR resources support all CRUD operations on ModMed:

| Resource | READ | SEARCH | CREATE | UPDATE | Notes |
|---|---|---|---|---|---|
| AllergyIntolerance | ✅ | ✅ | ✅ | ✅ | |
| Appointment | ✅ | ✅ | ✅ | ✅ | Dedicated appointment endpoints |
| ChargeItem | ✅ | ✅ | ✅ | ❌ | Create charges into ModMedPM |
| Composition | ✅ | ✅ | ✅ | ❌ | Requires encounter reference |
| Condition | ✅ | ✅ | ✅ | ✅ | Must be reconciled by practice in UI |
| Coverage | ✅ | ✅ | ✅ | ✅ | |
| DiagnosticReport | ✅ | ✅ | ❌ | ❌ | Results only |
| DocumentReference | ✅ | ✅ | ✅ | ❌ | Upload from S3 URL |
| **Encounter** | ✅ | ✅ | ❌ | ❌ | **Read-only. Created internally from appointments** |
| MedicationStatement | ✅ | ✅ | ✅ | ✅ | |
| Organization | ✅ | ✅ | ✅ | ❌ | Referring institutions |
| Patient | ✅ | ✅ | ✅ | ✅ | |
| Practitioner | ✅ | ✅ | ✅ | ❌ | Referring practitioners only |
| ServiceRequest | ✅ | ✅ | ❌ | ❌ | Orders only |

### ChargeItem CREATE

ChargeItems push charges into ModMed's billing system. Key details:

**Required `financialTransaction` extension:**
- `totalCost` / `unitCost` — Money objects with `value` and `currency`
- `attendingProviderId` — Practitioner ID (not NPI)
- `referralProviderId` — Practitioner ID
- `locationId` — Location's PMSID (e.g., `"30"`, not the FHIR Location ID)
- `transactionId` — Unique transaction identifier
- `sendingFacility` — Vendor/app name configured as bridge integration (e.g., `"healthyme"`)
- `receivingFacility` — Firm identifier (e.g., `"schweigerderm"`)
- `financialTransactionDetail` — Nested detail with CPT `code`, `unitCost`, `quantity`, `performingProviderId`, `postingDate`, `transactionPeriod`

**Code systems:**
- Procedure codes: `CPT` (e.g., `"17000"`)
- Diagnosis codes: `I10` for ICD-10 (e.g., `"Z02.9"`)

**Response:** Returns `OperationOutcome` with `"ChargeItem successfully saved with Id: INBOUND|{id}"`. The `INBOUND|` prefix indicates the charge is in the processing queue — it may not be immediately queryable via the FHIR API until ModMed processes it.

**Production vs Staging:**
- Staging may return `"Failed to find configured business unit from npi"` — this is a ModMed configuration issue, not a payload issue
- Production has the correct bridge integration configuration and accepts charges
- The `sendingFacility` must match a configured vendor in ModMed Firm Admin

**Example payload:**
```json
{
  "resourceType": "ChargeItem",
  "extension": [{
    "url": "financialTransaction",
    "extension": [
      { "url": "totalCost", "valueMoney": { "value": "0.00", "currency": "USD" } },
      { "url": "attendingProviderId", "valueString": "18398424" },
      { "url": "referralProviderId", "valueString": "18398424" },
      { "url": "locationId", "valueString": "30" },
      { "url": "transactionId", "valueString": "test-charge-001" },
      { "url": "sendingFacility", "valueString": "healthyme" },
      { "url": "receivingFacility", "valueString": "schweigerderm" },
      { "url": "financialTransactionDetail", "extension": [
        { "url": "transactionType", "valueString": "CG" },
        { "url": "performingProviderId", "valueString": "18398424" },
        { "url": "code", "valueCoding": { "system": "CPT", "code": "17000", "display": "Destruction, premalignant lesion" } },
        { "url": "unitCost", "valueMoney": { "value": "0.00", "currency": "USD" } },
        { "url": "quantity", "valueDecimal": "1.0" },
        { "url": "description", "valueString": "Destruction, premalignant lesion" },
        { "url": "postingDate", "valueDateTime": "2026-06-08T17:00:00-04:00" },
        { "url": "transactionPeriod", "valuePeriod": { "start": "2026-06-08T17:00:00-04:00", "end": "2026-06-08T17:00:00-04:00" } },
        { "url": "diagnosisDetail", "extension": [
          { "url": "diagnosisCode", "valueCoding": { "system": "I10", "code": "Z02.9", "display": "Encounter for administrative examinations, unspecified" } }
        ] }
      ] }
    ]
  }],
  "status": "billable",
  "occurrenceDateTime": "2026-06-08T17:00:00-04:00",
  "subject": { "reference": "<FHIR_BASE_URL>/Patient/33557855" },
  "context": { "display": "54147960" },
  "reason": [{ "coding": [{ "system": "I10", "code": "Z02.9" }] }]
}
```

### Condition CREATE Requirements

Conditions require specific ModMed field formats that differ from standard FHIR:

```json
{
  "resourceType": "Condition",
  "clinicalStatus": {
    "coding": [{
      "system": "http://hl7.org/fhir/ValueSet/condition-clinical",
      "code": "ACTIVE"
    }],
    "text": "Active"
  },
  "category": [{
    "coding": [{
      "system": "<FHIR_BASE_URL>/../ValueSet/condition-category",
      "code": "DIAGNOSIS"
    }],
    "text": "Diagnosis"
  }],
  "code": {
    "coding": [{
      "system": "ICD10",
      "code": "L70.0",
      "display": "Acne vulgaris"
    }],
    "text": "Acne vulgaris"
  },
  "subject": {
    "reference": "<FHIR_BASE_URL>/Patient/<id>"
  },
  "encounter": {
    "reference": "<FHIR_BASE_URL>/Encounter/<id>"
  }
}
```

**Key points:**
- `code.coding[].system` must be `"ICD10"`, `"ICD9"`, or `"SNOMED CT"` — **not** URN-style like `http://hl7.org/fhir/sid/icd-10-cm`
- `clinicalStatus.coding[].code` must be **uppercase**: `"ACTIVE"`, `"INACTIVE"`, `"RESOLVED"`
- `category` must use the ModMed ValueSet URL and one of: `DIAGNOSIS`, `PROBLEM`, `CONDITION`, `SYMPTOM`, `FINDING`, `COMPLAINT`, `FUNCTIONAL LIMITATION`, `HEALTH STATUS`
- Conditions created via API must be **reconciled by the practice** in the ModMed UI before appearing on the patient's chart

### Encounter Limitations

Encounters **cannot be created via the FHIR API**. They are created internally by the ModMed workflow when:
- A patient checks in for an appointment
- An appointment is converted to an encounter in the ModMed UI

Attempting to POST an Encounter will fail with errors about missing "Encounter Location", "Primary Biller", and "Universal Id" — these are internal ModMed fields not exposed via FHIR.

### Appointment Creation

Appointments can be created via the FHIR API. Required fields:
- `participant` — Patient, Location, and Practitioner references
- `appointmentType` — Must use codes from the `<FHIR_BASE_URL>/ValueSet/appointment-type` ValueSet (e.g., `15452` for "Medical Established 10")
- `start` / `end` — ISO datetime
- `minutesDuration` — Duration in minutes
- `status` — e.g., `"booked"`

**Important:** The practitioner must have an **active calendar** in ModMed. Creating an appointment with a practitioner who doesn't have an active calendar returns: `"doesn't have an active calendar"`.

**Note:** Changing appointment status to `"checked-in"` via the FHIR API does **not** trigger ModMed's internal encounter creation workflow. Encounters are created through the ModMed EMA application's internal process.

### API Response Behavior

- Successful CREATE requests may return an **empty response body** with the new resource URL in the `Location` header — our tools detect this and return a `{status, resourceType, location, message}` object instead of an empty string
- Successful ChargeItem CREATE returns an `OperationOutcome` with `INBOUND|{id}` — the charge is queued for processing
- Errors are returned as FHIR `OperationOutcome` resources — our tools preserve ModMed's original error messages in the `diagnostics` field
- Search results are returned as FHIR `Bundle` resources with pagination links

### ModMed API Documentation

- API reference: https://portal.api.modmed.com/
- LLM-friendly index: https://portal.api.modmed.com/llms.txt
- Encounter docs: https://portal.api.modmed.com/reference/encountersvisits.md
- Condition docs: https://portal.api.modmed.com/reference/condition-1.md

## Configuration

The server supports two authentication modes:

### Static Access Token (Default)
Set the following environment variables:
- `FHIR_BASE_URL`: The base URL of your FHIR server
- `FHIR_ACCESS_TOKEN`: A SMART on FHIR access token for authentication

### OAuth2 Password Grant (ModMed)
For FHIR servers using OAuth2 password grant flow (e.g., ModMed), set the following:
- `FHIR_BASE_URL`: The base URL of your FHIR server (e.g., `https://stage.ema-api.com/ema-dev/firm/apiportal/ema/fhir/v2/Patient`)
- `FHIR_USERNAME`: OAuth2 username
- `FHIR_PASSWORD`: OAuth2 password
- `FHIR_API_KEY`: API key for authentication
- `FHIR_FIRM_URL_PREFIX`: Firm URL prefix (e.g., `apiportal`, `schweigerderm`)
- `FHIR_USE_OAUTH2`: Set to `true` to enable OAuth2 authentication
- `FHIR_OAUTH_ENDPOINT` (optional): Full OAuth2 token endpoint URL. If not provided, it will be constructed from `FHIR_BASE_URL` by replacing the FHIR path with `/ws/oauth2/grant`

The server will automatically:
- Obtain an access token using OAuth2 password grant
- Refresh tokens when they expire (with 5-minute buffer)
- Include the access token in the `Authorization` header for all API requests
- Include the `x-api-key` header for all API requests (required by ModMed)

## Development

Install dependencies:
```bash
npm install
```

Build the server:
```bash
npm run build
```

For development with auto-rebuild:
```bash
npm run watch
```

## Installation

To use with Claude Desktop, add the server config:

On MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
On Windows: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "fhir": {
      "command": "node",
      "args": ["/path/to/@flexpa/mcp-fhir/build/index.js"],
      "env": {
        "FHIR_BASE_URL": "<FHIR_BASE_URL>",
        "FHIR_ACCESS_TOKEN": "<FHIR_ACCESS_TOKEN>"
      }
    }
  }
}
```

For OAuth2 authentication (ModMed):
```json
{
  "mcpServers": {
    "fhir": {
      "command": "npx",
      "args": ["tsx", "/path/to/@flexpa/mcp-fhir/src/index.ts"],
      "env": {
        "FHIR_BASE_URL": "https://mmapi.ema-api.com/ema-prod/firm/schweigerderm/ema/fhir/v2/Patient",
        "FHIR_USERNAME": "<FHIR_USERNAME>",
        "FHIR_PASSWORD": "<FHIR_PASSWORD>",
        "FHIR_API_KEY": "<FHIR_API_KEY>",
        "FHIR_FIRM_URL_PREFIX": "<FHIR_FIRM_URL_PREFIX>",
        "FHIR_USE_OAUTH2": "true"
      }
    }
  }
}
```

**Note:** When `FHIR_USE_OAUTH2` is set to `"true"`, the `FHIR_ACCESS_TOKEN` is not required.

### ModMed API Documentation

The `docs/modmed/` directory contains bundled ModMed API documentation that the `search_documentation` tool searches against. Topics include:

- Authentication & OAuth2 grant flow
- Resource-specific guides: Condition, ChargeItem, Patient, Encounter, Appointment, Coverage, Organization, DocumentReference, Composition
- Operational guides: Pagination, Rate limiting, Response codes, Header flags
- Endpoint examples: Get patient, Get encounters, Get conditions, Get bearer token

### Debugging

Since MCP servers communicate over stdio, debugging can be challenging. We recommend using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector), which is available as a package script:

```bash
npm run inspector
```

The Inspector will provide a URL to access debugging tools in your browser.


