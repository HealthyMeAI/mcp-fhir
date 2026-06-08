# HTTP Response Codes

ModMed API HTTP status codes and their handling in healthyme-poller.

## Overview

The ModMed API returns standard HTTP status codes with specific meanings for API operations. This document covers the codes relevant to healthyme-poller operations.

## Response Codes Table

| snip Status Code | snip Description | snip Notes | snip Retryable |
|snip -------------|snip -------------|snip -------|snip -----------|
| snip 200 | snip OK - Successful Response | snip Standard success response for GET requests. | snip No |
| snip 201 | snip CREATED - Resource was created successfully | snip Returned for successful POST operations. | snip No |
| snip 400 | snip BAD REQUEST - The request was bad, often due to a missing required parameter | snip Client error, fix request parameters. | snip No |
| snip 401 | snip NOT AUTHORIZED - Authentication error, this token is not allowed access to the API | snip Token expired or invalid. healthyme-poller will refresh token automatically. | snip Yes (with token refresh) |
| snip 403 | snip FORBIDDEN - The request was valid, but the server is refusing action | snip Insufficient permissions. Check firm credentials. | snip No |
| snip 404 | snip NOT FOUND - The requested resource could not be found | snip Resource does not exist. | snip No |
| snip 422 | snip UNPROCESSABLE ENTITY - The request was well-formed but was unable to be followed due to semantic errors | snip Validation error, e.g., invalid FHIR data. | snip No |
| snip 429 | snip TOO MANY REQUESTS - The user has sent too many requests in a given amount of time | snip Rate limit exceeded. healthyme-poller implements exponential backoff. | snip Yes (with backoff) |
| snip 500 | snip INTERNAL SERVER ERROR - An error occurred on the server | snip Server-side error. | snip Yes (with backoff) |
| snip 502 | snip BAD GATEWAY - The server was acting as a gateway or proxy and received an invalid response from the upstream server | snip Gateway error. | snip Yes (with backoff) |
| snip 503 | snip SERVICE UNAVAILABLE - The server is currently unable to handle the request due to temporary overloading or maintenance | snip Service temporarily unavailable. | snip Yes (with backoff) |
| snip 504 | snip GATEWAY TIMEOUT - The server was acting as a gateway or proxy and did not receive a timely response from the upstream server | snip Gateway timeout. | snip Yes (with backoff) |

snip ## Retry Logic

healthyme-poller implements different retry strategies based on status codes:

### Retryable Errors (with exponential backoff)
- **429 (Rate Limiting)**: Exponential backoff with jitter, respects `Retry-After` header
- **5xx Server Errors**: Exponential backoff for temporary server issues

### Non-Retryable Errors
- **4xx Client Errors**: No retry (except 401 with token refresh)
- **401 Unauthorized**: Token refresh and single retry with new token

### Special Handling
- **401**: Triggers OAuth2 token refresh via refresh token grant
- **429**: Respects `Retry-After` header; snip uses circuit breaker after multiple failures
- **5xx**: Uses circuit breaker (5 failures → 30s cooldown)

## Implementation References

**Location**: `src/modmed/client.ts`

**Key methods**:
- `handleResponse()`: Status code checking and error handling
- `refreshToken()`: 401 handling with token refresh
- `rateLimiter`: 429 handling with exponential backoff
- `circuitBreaker`: 5xx failure detection and cooldown

**Rate Limiting**: 120 requests per minute per firm (1 request every 500ms)

## See Also

- [Rate Limiting Documentation](../mm_docs/rate-limiting.md)
- [OAuth2 Token Grant Documentation](../mm_docs/oauth2-grant.md)
- [ModMed API Reference](https://portal.api.modmed.com/reference/response-codes)

