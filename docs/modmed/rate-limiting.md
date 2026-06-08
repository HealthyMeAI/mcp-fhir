# Rate Limiting

**Source:** [ModMed API Documentation](https://portal.api.modmed.com/reference/rate-limiting)

## Official Rate Limits

- **120 calls per minute** per API key (default limit)
- Contact `synapsys@modmed.com` for higher limits
- No additional details provided in official documentation about:
  - 429 response handling
  - Retry-after headers
  - Exponential backoff
  - Token bucket algorithms

## Healthyme-Poller Implementation

Our codebase implements distributed rate limiting using Valkey/Redis:

**Files:**
- `src/utils/valkey-rate-limiter.ts` - Distributed rate limiting
- `src/modmed/rate-limiter.ts` - Per-instance rate limiting

**Configuration:**
- Target: 100-120 requests per minute (below official limit)
- Parallel firm pollers: 10 firms simultaneously
- Each firm has its own rate limiter

## Notes for Emulator

When testing with the modmed-emulator:
- No rate limiting is enforced by the emulator
- Real API would enforce 120 calls/minute limit
- Our implementation should stay within this limit in production

