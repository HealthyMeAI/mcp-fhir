> ## Documentation Index
> Fetch the complete documentation index at: https://portal.api.modmed.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Retrieve Document resources meeting the specified search criteria

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
      "name": "Documents",
      "description": "Documents details"
    }
  ],
  "paths": {
    "/fhir/v2/DocumentReference": {
      "get": {
        "tags": [
          "Documents"
        ],
        "summary": "Retrieve Document resources meeting the specified search criteria",
        "parameters": [
          {
            "name": "_count",
            "in": "query",
            "description": "Number of records to use as the page size for paginated search. The maximum page size for this Resource is 10",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "date",
            "in": "query",
            "description": "The original upload date in format of yyyy-MM-dd'T'HH:mm:ss.SSSSSSSZ",
            "required": false,
            "schema": {
              "type": "string",
              "format": "date"
            }
          },
          {
            "name": "category",
            "in": "query",
            "description": "File extension type, this is an optional field, e.g. ccda, note",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "description",
            "in": "query",
            "description": "File title, this is an optional field",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "encounter",
            "in": "query",
            "description": "Context of the document content",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "identifier",
            "in": "query",
            "description": "Document reference identifier, can be search by filename passing the identifier filename and the value in format filename|value. This is an optional field",
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
            "description": "Patient reference url in format : /resoucrename/id or id, this is a mandatory field.",
            "required": true,
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
            "name": "type",
            "in": "query",
            "description": "File extension type, this is an optional field e.g. type=pdf",
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