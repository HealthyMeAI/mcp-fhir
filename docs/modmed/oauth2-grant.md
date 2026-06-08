# OAuth2 Token Grant Endpoint

ModMed API OAuth2 endpoint for obtaining bearer tokens. Used by healthyme-poller for authentication.

## Endpoint

```
POST /firm/{firm_url_prefix}/ema/ws/oauth2/grant
```

**URL Construction** (see `src/config.ts`):
```typescript
// Base URL: https://stage.ema-api.com/ema-training/firm/{firm_url_prefix}/ema/fhir/v2
// Auth URL: replace '/fhir/v2' with '/ws/oauth2/grant'
```

**Full URL examples**:
- Production: `https://mmapi.ema-api.com/ema-prod/firm/{firm_url_prefix}/ema/ws/oauth2/grant`
- Stage/Dev: `https://stage.ema-api.com/ema-training/firm/{firm_url_prefix}/ema/ws/oauth2/grant`
- Local emulator: `http://localhost:9000/firm/{firm_url_prefix}/ema/ws/oauth2/grant`

## Headers

| Header | Value | Required |
|--------|-------|----------|
| `x-api-key` | Firm-specific API key | Yes |
| `Content-Type` | `application/x-www-form-urlencoded` | Yes |
| `Accept` | `application/json` (optional) | No |

## Request Body

### Password Grant (initial authentication)
```
grant_type=password&username={encoded_username}&password={encoded_password}
```

### Refresh Token Grant (token refresh)
```
grant_type=refresh_token&refresh_token={encoded_refresh_token}
```

**Parameters**:
- `grant_type`: Either `password` or `refresh_token`
- `username`: Firm-specific FHIR username (when `grant_type=password`)
- `password`: Firm-specific password (when `grant_type=password`)
- `refresh_token`: Refresh token from previous response (when `grant_type=refresh_token`)

**Encoding**: All parameter values must be URL-encoded.

## Response

**Success (200 OK)**:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "def50200f9c2a7d8f3b...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "{firm_url_prefix}"
}
```

**Fields**:
- `access_token`: Bearer token for FHIR API requests (valid for 1 hour)
- `refresh_token`: Single-use token for obtaining new access tokens
- `token_type`: Always `"Bearer"`
- `expires_in`: Token lifetime in seconds (3600 = 1 hour)
- `scope`: Firm URL prefix (mirrored from request path)

## Error Responses

### 400 Bad Request
```json
{
  "error": "invalid_request",
  "error_description": "Missing required parameter: grant_type"
}
```

### 401 Unauthorized
```json
{
  "error": "invalid_client",
  "error_description": "Invalid API key"
}
```

```json
{
  "error": "invalid_grant",
  "error_description": "Invalid username or password"
}
```

### 429 Too Many Requests
```json
{
  "error": "too_many_requests",
  "error_description": "Rate limit exceeded for firm {firm_id}. Try again in 60 seconds."
}
```

**Headers**: `Retry-After: 60`

### 5xx Server Errors
Generic server errors with JSON or plain text response body.

## Rate Limiting

- **Global limit**: 120 requests per minute per firm (1 request every 500ms)
- **429 responses**: Include `Retry-After` header with recommended wait time
- **Retry logic**: Exponential backoff with jitter (see `src/modmed/client.ts:176-196`)

## Implementation in healthyme-poller

**Location**: `src/modmed/client.ts:147-278`

**Key behaviors**:
1. Password grant used for initial authentication
2. Refresh token grant used when existing access token expires
3. Automatic retry on 429 with exponential backoff
4. Circuit breaker after 5 consecutive failures
5. Tokens cached in-memory per firm client instance

**Example usage**:
```typescript
// Password grant
const body = `grant_type=password&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

// Refresh token grant  
const body = `grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}`;

const response = await request(authUrl, {
  method: 'POST',
  body,
  headers: {
    'x-api-key': apiKey,
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});
```

## Example cURL Commands

### Password Grant
```bash
curl --request POST \
  --url https://stage.ema-api.com/ema-training/firm/schweigerderm/ema/ws/oauth2/grant \
  --header 'x-api-key: YOUR_API_KEY' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'grant_type=password' \
  --data-urlencode 'username=fhir_xxxx' \
  --data-urlencode 'password=xxxxxxx'
```

### Refresh Token Grant
```bash
curl --request POST \
  --url https://stage.ema-api.com/ema-training/firm/schweigerderm/ema/ws/oauth2/grant \
  --header 'x-api-key: YOUR_API_KEY' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'grant_type=refresh_token' \
  --data-urlencode 'refresh_token=def50200f9c2a7d8f3b...'
```

## Notes

- **Token expiration**: Access tokens expire after 1 hour (3600 seconds)
- **Refresh token single-use**: Each refresh token can only be used once
- **Firm isolation**: Each firm has separate rate limiting and credentials
- **Local emulator**: The modmed-emulator implements identical behavior for testing
- **Security**: API key must be kept secret and rotated periodically

## References

- Code: `src/modmed/client.ts` - OAuth2 client implementation
- Code: `src/config.ts` - URL construction logic  
- Code: `modmed-emulator/src/routes/oauth2.ts` - Emulator implementation
- Documentation: `modmed-emulator/mm_docs/get-bearer-token.md` - Quick reference
