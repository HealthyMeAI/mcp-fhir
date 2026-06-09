> ## Documentation Index
> Fetch the complete documentation index at: https://portal.api.modmed.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Authentication Endpoint

Obtain an OAuth2 access token using password grant type.\
**NOTE:**

1. Use default params.
2. Use following header x-api-key: Zt9tXPIgz17uxEU6gkZPWa3ZAFhZOqm04oEDHC1f

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
  "paths": {
    "/ws/oauth2/grant": {
      "post": {
        "tags": [
          "Authentication"
        ],
        "summary": "Obtain OAuth2 Token",
        "description": "Obtain an OAuth2 access token using password grant type.",
        "requestBody": {
          "required": true,
          "content": {
            "application/x-www-form-urlencoded": {
              "schema": {
                "type": "object",
                "properties": {
                  "grant_type": {
                    "type": "string",
                    "default": "password"
                  },
                  "username": {
                    "type": "string",
                    "default": "fhir_QfLlo"
                  },
                  "password": {
                    "type": "string",
                    "default": "925X3LZ505"
                  }
                }
              }
            }
          }
        },
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Access token response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "access_token": {
                      "type": "string"
                    },
                    "token_type": {
                      "type": "string"
                    },
                    "expires_in": {
                      "type": "integer"
                    },
                    "refresh_token": {
                      "type": "string"
                    }
                  }
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