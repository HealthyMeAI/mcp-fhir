> ## Documentation Index
> Fetch the complete documentation index at: https://portal.api.modmed.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Header Flags

To ensure API changes remain non-breaking for our vendors, we sometimes use header flags to control the content returned in certain payloads. To access specific content, include the following header in your request:

* `Content-flag`

**Available Header Flag Values:**

* `Referral:` Adds Referral Contact and Referral Source information to the Patient and Appointment payloads.
* `Pagination_optimization_disabled:` Provides the total count for all resources, not just the current page.