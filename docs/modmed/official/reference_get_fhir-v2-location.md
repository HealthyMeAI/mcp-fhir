> ## Documentation Index
> Fetch the complete documentation index at: https://portal.api.modmed.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Retrieve List of all locations for that firm

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
      "name": "Locations/Facilities",
      "description": "Locations/Facilities details"
    }
  ],
  "paths": {
    "/fhir/v2/Location": {
      "get": {
        "tags": [
          "Locations/Facilities"
        ],
        "summary": "Retrieve List of all locations for that firm",
        "parameters": [
          {
            "name": "_count",
            "in": "query",
            "description": "Number of records to use as the page size for paginated search. The maximum page size for this Resource is 100",
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
            "name": "address-city",
            "in": "query",
            "description": "A city specified in an address",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "address-country",
            "in": "query",
            "description": "A country specified in an address",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "address-postalcode",
            "in": "query",
            "description": "Is the Organization record active",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "address-state",
            "in": "query",
            "description": "A state specified in an address",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "name",
            "in": "query",
            "description": "A portion of the location's name or alias",
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
            "name": "status",
            "in": "query",
            "description": "Searches for locations with a specific kind of status",
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