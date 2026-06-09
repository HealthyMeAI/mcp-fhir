> ## Documentation Index
> Fetch the complete documentation index at: https://portal.api.modmed.com/llms.txt
> Use this file to discover all available pages before exploring further.

# DiagnosticReport (Results)

Base profile: <<https://www.hl7.org/fhir/diagnosticreport.html>>

DiagnosticReport can be used to find Results PDFs for patients in EMA.

The following attributes are supported:

| Field Name        | Notes                                                          |
| :---------------- | :------------------------------------------------------------- |
| id                |                                                                |
| lastUpdated       |                                                                |
| identifier        | Reference to the RequisitionID                                 |
| basedOn           | Reference to ServiceRequest                                    |
| status            | final\|preliminary\|correction\|partial                        |
| code              | Orderable Code - likely CPT, LOINC, or Compendium code         |
| subject           | Reference to Patient                                           |
| encounter         | Reference to Encounter                                         |
| effectiveDateTime | Date and Time the report was processed by the reporting entity |
| issued            | Date and Time the report was delivered to EMA                  |
| performer         | Performing Entity (whoever performed the study)                |
| presentedForm     | PDF or document of the report                                  |