> ## Documentation Index
> Fetch the complete documentation index at: https://portal.api.modmed.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Search ServiceRequests by certain parameters

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
      "name": "Clinical Data/Clipboard",
      "description": "Clinical Data/Clipboard details"
    }
  ],
  "paths": {
    "/fhir/v2/ServiceRequest": {
      "get": {
        "tags": [
          "Clinical Data/Clipboard"
        ],
        "summary": "Search ServiceRequests by certain parameters",
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
            "name": "authored",
            "in": "query",
            "description": "Date request signed",
            "required": false,
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "category",
            "in": "query",
            "description": "Classification of service",
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
            "description": "Search by subject - a patient",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "encounter",
            "in": "query",
            "description": "An encounter in which this request is made",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "requester",
            "in": "query",
            "description": "Who/what is requesting service",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "requisition",
            "in": "query",
            "description": "Composite Request ID",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "status",
            "in": "query",
            "description": "draft | active | suspended | completed | entered-in-error | cancelled",
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