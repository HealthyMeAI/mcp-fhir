# ModMed API Pagination

For performance optimization, some API endpoints return paginated responses. You can control pagination with two optional parameters:

- `_count`: Specifies the number of results per page. If not provided, the default maximum page size for the resource will be used (e.g., current maximum page size for the Patient resource is 50).
- `page`: Specifies the page number to retrieve in the paginated results.

## Total Field Behavior

Two different implementations for handling pagination and result counts exist.

### Default (as of release 7.7)

- `total` represents the total number of results **on the current page**.
- `next` provides the link to the next set of results.
- Pagination continues until no more results are available (i.e., when `total` is 0).

### Alternative (provides total records)

To enable this implementation, include the following header in your request:

```
Content-flag: Pagination_optimization_disabled
```

When this header is present:

- `total` = total number of records across all pages.
- Paginated links in the returned bundle provide links for both the next and previous pages (if applicable).
- Links include `self` (always returned), `next`, `previous`, `last`.
- If only one page of records exists, no pagination links will be provided.

## Example

```
GET {baseUrl}/Patient?_count=50&page=2
```

Response with alternative pagination enabled:

```json
{
  "resourceType": "Bundle",
  "type": "searchset",
  "total": 22437,
  "link": [
    { "relation": "self", "url": "{baseUrl}/Patient" },
    { "relation": "next", "url": "{baseUrl}/Patient?page=3" },
    { "relation": "last", "url": "{baseUrl}/Patient?page=449" }
  ]
}
```

## Notes

- The Slot resource does not have any pagination.
- Default page size varies per resource (check resource-specific documentation).

## Usage in HealthyMe Poller

Our codebase assumes alternative pagination (total records) and uses a page size of 50 with the `page` parameter.

- Encounter polling (`src/modmed/encounters.ts`): calculates total pages as `Math.ceil(total / 50)`.
- No `_count` parameter is passed; relies on default page size (50 for Encounter resource).
- The `Content-flag` header is **not** added to GET requests; alternative pagination may be the default for certain endpoints (verify with ModMed).
- If using default pagination (total per page), iteration should follow `next` links until `total` is 0.
