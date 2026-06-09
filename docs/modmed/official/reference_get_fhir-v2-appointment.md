> ## Documentation Index
> Fetch the complete documentation index at: https://portal.api.modmed.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Retrieve All Appointments for a Practice/Firm

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
    "/fhir/v2/Appointment": {
      "get": {
        "tags": [
          "Appoitments and Slots"
        ],
        "summary": "Retrieve All Appointments for a Practice/Firm",
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
            "name": "appointment-type",
            "in": "query",
            "description": "The style of appointment or patient that has been booked in the slot (not service type)",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "created",
            "in": "query",
            "description": "Created date in format of yyyy-MM-dd'T'HH:mm:ss.SSSSSSSZ",
            "required": false,
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "date",
            "in": "query",
            "description": "Appointment date/time.",
            "required": false,
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "location",
            "in": "query",
            "description": "This location is listed in the participants of the appointment",
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
            "name": "patient",
            "in": "query",
            "description": "One of the individuals of the appointment is this patient",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "practitioner",
            "in": "query",
            "description": "One of the individuals of the appointment is this practitioner",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "status",
            "in": "query",
            "description": "The overall status of the appointment",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "supporting-info",
            "in": "query",
            "description": "Additional information to support the appointment",
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