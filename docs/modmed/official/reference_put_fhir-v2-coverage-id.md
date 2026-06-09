> ## Documentation Index
> Fetch the complete documentation index at: https://portal.api.modmed.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Updates Coverage Resource

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
      "name": "Insurance",
      "description": "Insurance Details"
    }
  ],
  "paths": {
    "/fhir/v2/Coverage/{id}": {
      "put": {
        "tags": [
          "Insurance"
        ],
        "summary": "Updates Coverage Resource",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "description": "The resource ID",
            "required": true,
            "style": "simple",
            "schema": {
              "minimum": 1,
              "type": "string"
            },
            "example": "123"
          }
        ],
        "requestBody": {
          "description": "Send Valid Coverage information to be updated in JSON form",
          "content": {
            "application/fhir+json": {
              "schema": {
                "$ref": "#/components/schemas/FHIR-JSON-RESOURCE"
              }
            }
          },
          "required": true
        },
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