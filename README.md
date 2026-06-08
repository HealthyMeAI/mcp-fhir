# @flexpa/mcp-fhir

This is a TypeScript-based MCP server that connects to a FHIR server. It provides core MCP functionality for interacting with FHIR resources by:

- Accessing FHIR resources via URIs
- Providing search capabilities for FHIR resources

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

## ModMed EMA FHIR API Notes

This server was built and tested against the ModMed EMA staging API. Below are important findings to avoid common pitfalls.

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

### API Response Behavior

- Successful CREATE requests may return an **empty response body** with the new resource URL in the `Location` header
- Errors are returned as FHIR `OperationOutcome` resources
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
      "command": "/path/to/@flexpa/mcp-fhir/build/index.js"
    },
    "env": {
      "FHIR_BASE_URL": "<FHIR_BASE_URL>",
      "FHIR_ACCESS_TOKEN": "<FHIR_ACCESS_TOKEN>"
    }
  }
}
```

For OAuth2 authentication (ModMed):
```json
{
  "mcpServers": {
    "fhir": {
      "command": "/path/to/@flexpa/mcp-fhir/build/index.js"
    },
    "env": {
      "FHIR_BASE_URL": "https://stage.ema-api.com/ema-dev/firm/apiportal/ema/fhir/v2/Patient",
      "FHIR_USERNAME": "<FHIR_USERNAME>",
      "FHIR_PASSWORD": "<FHIR_PASSWORD>",
      "FHIR_API_KEY": "<FHIR_API_KEY>",
      "FHIR_FIRM_URL_PREFIX": "<FHIR_FIRM_URL_PREFIX>",
      "FHIR_USE_OAUTH2": "<FHIR_USE_OAUTH2>"
    }
  }
}
```

**Note:** When `FHIR_USE_OAUTH2` is set to `"true"`, the `FHIR_ACCESS_TOKEN` is not required.

### Debugging

Since MCP servers communicate over stdio, debugging can be challenging. We recommend using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector), which is available as a package script:

```bash
npm run inspector
```

The Inspector will provide a URL to access debugging tools in your browser.


