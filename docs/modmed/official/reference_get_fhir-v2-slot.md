> ## Documentation Index
> Fetch the complete documentation index at: https://portal.api.modmed.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Search for a slot

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
      "name": "Appoitments and Slots",
      "description": "Appoitments and Slots Details"
    }
  ],
  "paths": {
    "/fhir/v2/Slot": {
      "get": {
        "tags": [
          "Appoitments and Slots"
        ],
        "summary": "Search for a slot",
        "parameters": [
          {
            "name": "appointment-type",
            "in": "query",
            "description": "The style of appointment or patient that may be booked in the slot",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "date",
            "in": "query",
            "description": "The param \"date\" supports date with prefix of eq in yyyy-MM-dd'T'HH:mm:ss.SSSSSSSZ format AND date range with start date with ge prefix and yyyy-MM-dd'T'HH:mm:ss.SSSSSSSZ format and end date with le prefix and yyyy-MM-dd'T'HH:mm:ss.SSSSSSSZ format",
            "required": false,
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "identifier",
            "in": "query",
            "description": "List of identifiers to search by for Slots. Valid Identifier Systems are PRN with a system value of https://www.hl7.org/fhir/v2/0203/index.html#v2-0203-PRN which is used for Provider id,  FI with a system value of https://www.hl7.org/fhir/v2/0203/index.html#v2-0203-FI which is used for Location id",
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