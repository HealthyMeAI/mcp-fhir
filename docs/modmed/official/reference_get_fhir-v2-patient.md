> ## Documentation Index
> Fetch the complete documentation index at: https://portal.api.modmed.com/llms.txt
> Use this file to discover all available pages before exploring further.

# search-type: Search for Patient instances

This is a search type

Use [Authentication Endpoint](https://portal.api.modmed.com/reference/post_ws-oauth2-grant#/) page to get token

# OpenAPI definition

```json
{
  "openapi": "3.0.1",
  "info": {
    "title": "EMA Proprietary API",
    "contact": {
      "email": "ankit.srivastava@modmed.com"
    },
    "version": "3.4.3_FINAL"
  },
  "servers": [
    {
      "url": "https://stage.ema-api.com/ema-dev/firm/apiportal/ema"
    }
  ],
  "tags": [
    {
      "name": "Patient",
      "description": "Paitent Details"
    }
  ],
  "paths": {
    "/fhir/v2/Patient": {
      "get": {
        "tags": [
          "Patient"
        ],
        "summary": "search-type: Search for Patient instances",
        "description": "This is a search type",
        "parameters": [
          {
            "name": "_count",
            "in": "query",
            "description": "Number of records to use as the page size for paginated search. The maximum page size for this Resource is 50",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "_lastUpdated",
            "in": "query",
            "description": "This is an Optional Date in the format _lastUpdated=gtDATE, _lastUpdated=eqDATE and _lastUpdated=leDATE in the format yyyy-mm-dd",
            "required": false,
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "address-postalcode",
            "in": "query",
            "description": "A postalCode specified in an address",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "active",
            "in": "query",
            "description": "Whether the patient record is active (true|false)",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "birthdate",
            "in": "query",
            "description": "This is the patient's Date of birth - Valid format yyyy-MM-dd",
            "required": false,
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "email",
            "in": "query",
            "description": "A value in an email contact",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "family",
            "in": "query",
            "description": "This is the patient's last name - Supports exact matches",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "gender",
            "in": "query",
            "description": "This is the patient's gender - male, female, or unknown",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "general-practitioner",
            "in": "query",
            "description": "Patient's nominated general practitioner, not the organization that manages the record",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "given",
            "in": "query",
            "description": "A portion of the given name of the patient",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "identifier",
            "in": "query",
            "description": "This is a List of Identifiers for a Patient. Valid Identifier Systems are MRN with a system value of https://www.hl7.org/fhir/v2/0203/index.html#v2-0203-MR, SSN with a system value of http://hl7.org/fhir/sid/us-ssn, or PMS to be used for the PMS Id",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "language",
            "in": "query",
            "description": "Language code (irrespective of use value)",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "page",
            "in": "query",
            "description": "Page to be used for paginated search",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "phone",
            "in": "query",
            "description": "A value in a phone contact",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "us-core-ethnicity",
            "in": "query",
            "description": "Returns patients with an ethnicity extension matching the specified code. Detailed Extension specification can be found at: http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity.",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "us-core-race",
            "in": "query",
            "description": "Returns patients with a race extension matching the specified code. Detailed Extension specification can be found at: http://hl7.org/fhir/us/core/StructureDefinition/us-core-race.",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "referral-source",
            "in": "query",
            "description": "If the Patient has been assigned a Referral Source in MMPM, this will be a reference to that ID. Referral Sources can be found by querying the following Value Set: {base url}/{firm_url_prefix}/ema/fhir/v2/ValueSet/referral-source",
            "required": false,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/fhir+json": {
                "schema": {
                  "$ref": "#/components/schemas/FHIR-JSON-RESOURCE"
                }
              },
              "application/fhir+xml": {
                "schema": {
                  "$ref": "#/components/schemas/FHIR-XML-RESOURCE"
                }
              }
            }
          }
        }
      }
    }
  },
  "security": [
    {
      "BearerAuth": [],
      "ApiKeyAuth": []
    }
  ],
  "components": {
    "schemas": {
      "FHIR-JSON-RESOURCE": {
        "type": "object",
        "description": "A FHIR resource"
      },
      "FHIR-XML-RESOURCE": {
        "type": "object",
        "description": "A FHIR resource"
      }
    },
    "securitySchemes": {
      "BearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT",
        "description": "Get token from Authentication page"
      },
      "ApiKeyAuth": {
        "type": "apiKey",
        "in": "header",
        "name": "x-api-key",
        "description": "Use this fixed API key: `Zt9tXPIgz17uxEU6gkZPWa3ZAFhZOqm04oEDHC1f`\n"
      }
    }
  }
}
```