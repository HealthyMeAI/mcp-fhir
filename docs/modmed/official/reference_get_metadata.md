> ## Documentation Index
> Fetch the complete documentation index at: https://portal.api.modmed.com/llms.txt
> Use this file to discover all available pages before exploring further.

# server-capabilities: Fetch the server FHIR CapabilityStatement

# OpenAPI definition

```json
{
  "openapi": "3.0.1",
  "info": {
    "title": "EMA Certified API",
    "contact": {},
    "version": "4.1-SNAPSHOT"
  },
  "x-readme": {
    "explorer-enabled": true,
    "proxy-enabled": true
  },
  "servers": [
    {
      "url": "https://fhirmp.mmi.prod.fhir.ema-api.com/fhir/r4",
      "description": "EMA Certified FHIR API",
      "variables": {
        "firm": {
          "default": "fhirmp",
          "description": "Your firm subdomain (e.g. fhirmp, auraderm). Find yours at https://mm-fhir-endpoint-display.prod.fhir.ema-api.com/"
        }
      }
    }
  ],
  "tags": [
    {
      "name": "Capability Statement",
      "description": "Capability Statement"
    }
  ],
  "paths": {
    "/metadata": {
      "get": {
        "tags": [
          "Capability Statement"
        ],
        "summary": "server-capabilities: Fetch the server FHIR CapabilityStatement",
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json+fhir": {
                "schema": {
                  "$ref": "#/components/schemas/FHIR-JSON-RESOURCE"
                },
                "example": "{\n  \"resourceType\": \"CapabilityStatement\"\n}"
              },
              "application/xml+fhir": {
                "schema": {
                  "$ref": "#/components/schemas/FHIR-XML-RESOURCE"
                },
                "example": "<CapabilityStatement xmlns=\"http://hl7.org/fhir\"/>"
              },
              "application/json": {
                "examples": {
                  "OK": {
                    "summary": "OK",
                    "value": {
                      "resourceType": "CapabilityStatement",
                      "name": "FhirServer",
                      "status": "active",
                      "date": "2026-05-18T16:00:29+00:00",
                      "publisher": "Modernizing Medicine",
                      "kind": "instance",
                      "instantiates": [
                        "http://hl7.org/fhir/us/core/CapabilityStatement/us-core-server",
                        "http://hl7.org/fhir/uv/bulkdata/CapabilityStatement/bulk-data"
                      ],
                      "software": {
                        "name": "Fhir Server",
                        "version": "4.8_FINAL"
                      },
                      "implementation": {
                        "description": "Fhir Rest API Server",
                        "url": "https://fhirmp.mmi.prod.fhir.ema-api.com:443/fhir/r4"
                      },
                      "fhirVersion": "4.0.1",
                      "format": [
                        "application/xml+fhir",
                        "application/json+fhir"
                      ],
                      "rest": [
                        {
                          "mode": "server",
                          "security": {
                            "extension": [
                              {
                                "url": "http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris",
                                "extension": [
                                  {
                                    "url": "authorize",
                                    "valueUri": "https://fhirmp.mmi.prod.fhir.ema-api.com/fhir/r4/auth/realms/fhir/protocol/openid-connect/auth"
                                  },
                                  {
                                    "url": "token",
                                    "valueUri": "https://fhirmp.mmi.prod.fhir.ema-api.com/fhir/r4/auth/realms/fhir/protocol/openid-connect/token"
                                  }
                                ]
                              }
                            ],
                            "cors": true,
                            "service": [
                              {
                                "coding": [
                                  {
                                    "system": "http://terminology.hl7.org/CodeSystem/restful-security-service",
                                    "code": "OAuth",
                                    "display": "OAuth"
                                  }
                                ],
                                "text": "OAuth"
                              },
                              {
                                "coding": [
                                  {
                                    "system": "http://terminology.hl7.org/CodeSystem/restful-security-service",
                                    "code": "SMART-on-FHIR",
                                    "display": "SMART-on-FHIR"
                                  }
                                ],
                                "text": "SMART-on-FHIR"
                              }
                            ]
                          },
                          "resource": [
                            {
                              "type": "AllergyIntolerance",
                              "profile": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-allergyintolerance",
                              "supportedProfile": [
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-allergyintolerance"
                              ],
                              "interaction": [
                                {
                                  "code": "read"
                                },
                                {
                                  "code": "search-type"
                                }
                              ],
                              "searchParam": [
                                {
                                  "name": "_id",
                                  "type": "token",
                                  "documentation": "The ID of the resource"
                                },
                                {
                                  "name": "clinical-status",
                                  "type": "token",
                                  "documentation": "active | inactive | resolved"
                                },
                                {
                                  "name": "patient",
                                  "type": "reference",
                                  "documentation": "Who the sensitivity is for"
                                }
                              ]
                            },
                            {
                              "type": "CarePlan",
                              "profile": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-careplan",
                              "supportedProfile": [
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-careplan"
                              ],
                              "interaction": [
                                {
                                  "code": "read"
                                },
                                {
                                  "code": "search-type"
                                }
                              ],
                              "searchParam": [
                                {
                                  "name": "_id",
                                  "type": "token",
                                  "documentation": "The ID of the resource"
                                },
                                {
                                  "name": "category",
                                  "type": "token",
                                  "documentation": "Type of plan"
                                },
                                {
                                  "name": "intent",
                                  "type": "string",
                                  "documentation": "proposal | plan | order | option"
                                },
                                {
                                  "name": "patient",
                                  "type": "reference",
                                  "documentation": "Who the care plan is for"
                                },
                                {
                                  "name": "status",
                                  "type": "string",
                                  "documentation": "draft | active | on-hold | revoked | completed | entered-in-error | unknown"
                                }
                              ]
                            },
                            {
                              "type": "CareTeam",
                              "profile": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-careteam",
                              "supportedProfile": [
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-careteam"
                              ],
                              "interaction": [
                                {
                                  "code": "read"
                                },
                                {
                                  "code": "search-type"
                                }
                              ],
                              "searchParam": [
                                {
                                  "name": "_id",
                                  "type": "token",
                                  "documentation": "The ID of the resource"
                                },
                                {
                                  "name": "patient",
                                  "type": "reference",
                                  "documentation": "Who care team is for"
                                },
                                {
                                  "name": "status",
                                  "type": "string",
                                  "documentation": "proposed | active | suspended | inactive | entered-in-error"
                                }
                              ]
                            },
                            {
                              "type": "Condition",
                              "supportedProfile": [
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-condition",
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-condition-problems-health-concerns",
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-condition-encounter-diagnosis"
                              ],
                              "interaction": [
                                {
                                  "code": "read"
                                },
                                {
                                  "code": "search-type"
                                }
                              ],
                              "searchParam": [
                                {
                                  "name": "_id",
                                  "type": "token",
                                  "documentation": "The ID of the resource"
                                },
                                {
                                  "name": "category",
                                  "type": "token",
                                  "documentation": "The category of the condition"
                                },
                                {
                                  "name": "clinical-status",
                                  "type": "token",
                                  "documentation": "The clinical status of the condition"
                                },
                                {
                                  "name": "code",
                                  "type": "token",
                                  "documentation": "Code for the condition"
                                },
                                {
                                  "name": "encounter",
                                  "type": "reference",
                                  "documentation": "Encounter created as part of"
                                },
                                {
                                  "name": "onset-date",
                                  "type": "date",
                                  "documentation": "Date related onsets (dateTime and Period)"
                                },
                                {
                                  "name": "patient",
                                  "type": "reference",
                                  "documentation": "Who has the condition?"
                                },
                                {
                                  "name": "recorded-date",
                                  "type": "date",
                                  "documentation": "Date record was first recorded"
                                }
                              ]
                            },
                            {
                              "type": "Coverage",
                              "profile": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-coverage",
                              "supportedProfile": [
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-coverage"
                              ],
                              "interaction": [
                                {
                                  "code": "read"
                                },
                                {
                                  "code": "search-type"
                                }
                              ],
                              "searchParam": [
                                {
                                  "name": "_id",
                                  "type": "token",
                                  "documentation": "The ID of the resource"
                                },
                                {
                                  "name": "patient",
                                  "type": "reference",
                                  "documentation": "Retrieve coverages for a patient"
                                }
                              ]
                            },
                            {
                              "type": "Device",
                              "profile": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-implantable-device",
                              "supportedProfile": [
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-implantable-device"
                              ],
                              "interaction": [
                                {
                                  "code": "read"
                                },
                                {
                                  "code": "search-type"
                                }
                              ],
                              "searchParam": [
                                {
                                  "name": "_id",
                                  "type": "token",
                                  "documentation": "The ID of the resource"
                                },
                                {
                                  "name": "patient",
                                  "type": "reference",
                                  "documentation": "Patient information, if the resource is affixed to a person"
                                },
                                {
                                  "name": "type",
                                  "type": "token",
                                  "documentation": "The type of the device"
                                }
                              ]
                            },
                            {
                              "type": "DiagnosticReport",
                              "supportedProfile": [
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-diagnosticreport-lab",
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-diagnosticreport-note"
                              ],
                              "interaction": [
                                {
                                  "code": "read"
                                },
                                {
                                  "code": "search-type"
                                }
                              ],
                              "searchParam": [
                                {
                                  "name": "_id",
                                  "type": "token",
                                  "documentation": "The ID of the resource"
                                },
                                {
                                  "name": "category",
                                  "type": "token",
                                  "documentation": "Which diagnostic discipline/department created the report"
                                },
                                {
                                  "name": "code",
                                  "type": "token",
                                  "documentation": "The code for the report, as opposed to codes for the atomic results, which are the names on the observation resource referred to from the result"
                                },
                                {
                                  "name": "date",
                                  "type": "date",
                                  "documentation": "The clinically relevant time of the report"
                                },
                                {
                                  "name": "patient",
                                  "type": "reference",
                                  "documentation": "The subject of the report if a patient"
                                },
                                {
                                  "name": "status",
                                  "type": "string",
                                  "documentation": "The status of the report"
                                }
                              ]
                            },
                            {
                              "type": "DocumentReference",
                              "profile": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-documentreference",
                              "supportedProfile": [
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-documentreference"
                              ],
                              "interaction": [
                                {
                                  "code": "read"
                                },
                                {
                                  "code": "search-type"
                                }
                              ],
                              "searchParam": [
                                {
                                  "name": "_id",
                                  "type": "token",
                                  "documentation": "The ID of the resource"
                                },
                                {
                                  "name": "category",
                                  "type": "token",
                                  "documentation": "Categorization of document"
                                },
                                {
                                  "name": "date",
                                  "type": "date",
                                  "documentation": "When this document reference was created"
                                },
                                {
                                  "name": "patient",
                                  "type": "reference",
                                  "documentation": "Who/what is the subject of the document"
                                },
                                {
                                  "name": "period",
                                  "type": "date",
                                  "documentation": "Time of service that is being documented"
                                },
                                {
                                  "name": "status",
                                  "type": "token",
                                  "documentation": "current | superseded | entered-in-error"
                                },
                                {
                                  "name": "type",
                                  "type": "token",
                                  "documentation": "Kind of document (LOINC if possible)"
                                }
                              ]
                            },
                            {
                              "type": "Encounter",
                              "profile": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-encounter",
                              "supportedProfile": [
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-encounter"
                              ],
                              "interaction": [
                                {
                                  "code": "read"
                                },
                                {
                                  "code": "search-type"
                                }
                              ],
                              "searchParam": [
                                {
                                  "name": "_id",
                                  "type": "token",
                                  "documentation": "The ID of the resource"
                                },
                                {
                                  "name": "class",
                                  "type": "token",
                                  "documentation": "Classification of patient encounter"
                                },
                                {
                                  "name": "date",
                                  "type": "date",
                                  "documentation": "A date within the period the Encounter lasted"
                                },
                                {
                                  "name": "identifier",
                                  "type": "token",
                                  "documentation": "Identifier(s) by which this encounter is known"
                                },
                                {
                                  "name": "patient",
                                  "type": "reference",
                                  "documentation": "The patient or group present at the encounter"
                                },
                                {
                                  "name": "status",
                                  "type": "string",
                                  "documentation": "planned | arrived | triaged | in-progress | onleave | finished | cancelled +"
                                },
                                {
                                  "name": "type",
                                  "type": "token",
                                  "documentation": "Specific type of encounter"
                                }
                              ]
                            },
                            {
                              "type": "Endpoint",
                              "interaction": [
                                {
                                  "code": "read"
                                },
                                {
                                  "code": "search-type"
                                }
                              ],
                              "searchParam": [
                                {
                                  "name": "_id",
                                  "type": "token",
                                  "documentation": "The ID of the resource"
                                },
                                {
                                  "name": "connection-type",
                                  "type": "token",
                                  "documentation": "Protocol/Profile/Standard to be used with this endpoint connection"
                                },
                                {
                                  "name": "name",
                                  "type": "string",
                                  "documentation": "A name that this endpoint can be identified by"
                                },
                                {
                                  "name": "organization",
                                  "type": "reference",
                                  "documentation": "The organization that is managing the endpoint"
                                },
                                {
                                  "name": "status",
                                  "type": "string",
                                  "documentation": "The current status of the Endpoint (usually expected to be active)"
                                }
                              ]
                            },
                            {
                              "type": "Goal",
                              "profile": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-goal",
                              "supportedProfile": [
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-goal"
                              ],
                              "interaction": [
                                {
                                  "code": "read"
                                },
                                {
                                  "code": "search-type"
                                }
                              ],
                              "searchParam": [
                                {
                                  "name": "_id",
                                  "type": "token",
                                  "documentation": "The ID of the resource"
                                },
                                {
                                  "name": "lifecycle-status",
                                  "type": "token",
                                  "documentation": "proposed | planned | accepted | active | on-hold | completed | cancelled | entered-in-error | rejected"
                                },
                                {
                                  "name": "patient",
                                  "type": "reference",
                                  "documentation": "Who this goal is intended for"
                                },
                                {
                                  "name": "target-date",
                                  "type": "date",
                                  "documentation": "Reach goal on or before"
                                }
                              ]
                            },
                            {
                              "type": "Group",
                              "interaction": [
                                {
                                  "code": "read"
                                }
                              ],
                              "operation": [
                                {
                                  "name": "export",
                                  "definition": "http://hl7.org/fhir/uv/bulkdata/OperationDefinition/group-export"
                                }
                              ]
                            },
                            {
                              "type": "Immunization",
                              "profile": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-immunization",
                              "supportedProfile": [
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-immunization"
                              ],
                              "interaction": [
                                {
                                  "code": "read"
                                },
                                {
                                  "code": "search-type"
                                }
                              ],
                              "searchParam": [
                                {
                                  "name": "_id",
                                  "type": "token",
                                  "documentation": "The ID of the resource"
                                },
                                {
                                  "name": "date",
                                  "type": "date",
                                  "documentation": "Vaccination  (non)-Administration Date"
                                },
                                {
                                  "name": "patient",
                                  "type": "reference",
                                  "documentation": "The patient for the vaccination record"
                                },
                                {
                                  "name": "status",
                                  "type": "string",
                                  "documentation": "Immunization event status"
                                }
                              ]
                            },
                            {
                              "type": "Location",
                              "profile": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-location",
                              "supportedProfile": [
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-location"
                              ],
                              "interaction": [
                                {
                                  "code": "read"
                                },
                                {
                                  "code": "search-type"
                                }
                              ],
                              "searchParam": [
                                {
                                  "name": "_id",
                                  "type": "token",
                                  "documentation": "The ID of the resource"
                                },
                                {
                                  "name": "address",
                                  "type": "string",
                                  "documentation": "A (part of the) address of the location"
                                },
                                {
                                  "name": "address-city",
                                  "type": "string",
                                  "documentation": "A city specified in an address"
                                },
                                {
                                  "name": "address-country",
                                  "type": "string",
                                  "documentation": "A country specified in an address"
                                },
                                {
                                  "name": "address-postalcode",
                                  "type": "string",
                                  "documentation": "A postal code specified in an address"
                                },
                                {
                                  "name": "address-state",
                                  "type": "string",
                                  "documentation": "A state specified in an address"
                                },
                                {
                                  "name": "address-use",
                                  "type": "token",
                                  "documentation": "A use code specified in an address"
                                },
                                {
                                  "name": "identifier",
                                  "type": "token",
                                  "documentation": "An identifier for the location"
                                },
                                {
                                  "name": "name",
                                  "type": "string",
                                  "documentation": "A portion of the location's name or alias"
                                },
                                {
                                  "name": "status",
                                  "type": "token",
                                  "documentation": "Searches for locations with a specific kind of status"
                                }
                              ]
                            },
                            {
                              "type": "Medication",
                              "profile": "http://hl7.org/fhir/StructureDefinition/Medication",
                              "supportedProfile": [
                                "http://hl7.org/fhir/StructureDefinition/Medication"
                              ],
                              "interaction": [
                                {
                                  "code": "read"
                                }
                              ]
                            },
                            {
                              "type": "MedicationDispense",
                              "profile": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-medicationdispense",
                              "supportedProfile": [
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-medicationdispense"
                              ],
                              "interaction": [
                                {
                                  "code": "read"
                                },
                                {
                                  "code": "search-type"
                                }
                              ],
                              "searchParam": [
                                {
                                  "name": "_id",
                                  "type": "token",
                                  "documentation": "The ID of the resource"
                                },
                                {
                                  "name": "patient",
                                  "type": "reference",
                                  "documentation": "The identity of a patient to list dispenses  for"
                                }
                              ]
                            },
                            {
                              "type": "MedicationRequest",
                              "profile": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-medicationrequest",
                              "supportedProfile": [
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-medicationrequest"
                              ],
                              "interaction": [
                                {
                                  "code": "read"
                                },
                                {
                                  "code": "search-type"
                                }
                              ],
                              "searchParam": [
                                {
                                  "name": "_id",
                                  "type": "token",
                                  "documentation": "The ID of the resource"
                                },
                                {
                                  "name": "authoredon",
                                  "type": "date",
                                  "documentation": "Return prescriptions written on this date"
                                },
                                {
                                  "name": "encounter",
                                  "type": "reference",
                                  "documentation": "Return prescriptions with this encounter identifier"
                                },
                                {
                                  "name": "intent",
                                  "type": "string",
                                  "documentation": "Returns prescriptions with different intents"
                                },
                                {
                                  "name": "patient",
                                  "type": "reference",
                                  "documentation": "Returns prescriptions for a specific patient"
                                },
                                {
                                  "name": "status",
                                  "type": "string",
                                  "documentation": "Status of the prescription"
                                }
                              ]
                            },
                            {
                              "type": "Observation",
                              "supportedProfile": [
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-observation-lab",
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-blood-pressure",
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-bmi",
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-head-circumference",
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-body-height",
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-body-weight",
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-body-temperature",
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-heart-rate",
                                "http://hl7.org/fhir/us/core/StructureDefinition/pediatric-bmi-for-age",
                                "http://hl7.org/fhir/us/core/StructureDefinition/head-occipital-frontal-circumference-percentile",
                                "http://hl7.org/fhir/us/core/StructureDefinition/pediatric-weight-for-height",
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-pulse-oximetry",
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-respiratory-rate",
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-smokingstatus",
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-observation-sexual-orientation",
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-observation-occupation",
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-vital-signs",
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-observation-pregnancystatus",
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-observation-pregnancyintent",
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-observation-clinical-result",
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-observation-screening-assessment"
                              ],
                              "interaction": [
                                {
                                  "code": "read"
                                },
                                {
                                  "code": "search-type"
                                }
                              ],
                              "searchParam": [
                                {
                                  "name": "_id",
                                  "type": "token",
                                  "documentation": "The ID of the resource"
                                },
                                {
                                  "name": "category",
                                  "type": "token",
                                  "documentation": "The classification of the type of observation"
                                },
                                {
                                  "name": "code",
                                  "type": "token",
                                  "documentation": "The code of the observation type"
                                },
                                {
                                  "name": "date",
                                  "type": "date",
                                  "documentation": "Obtained date/time. If the obtained element is a period, a date that falls in the period"
                                },
                                {
                                  "name": "patient",
                                  "type": "reference",
                                  "documentation": "The subject that the observation is about (if patient)"
                                },
                                {
                                  "name": "status",
                                  "type": "string",
                                  "documentation": "The status of the observation"
                                }
                              ]
                            },
                            {
                              "type": "OperationDefinition",
                              "profile": "http://hl7.org/fhir/StructureDefinition/OperationDefinition",
                              "supportedProfile": [
                                "http://hl7.org/fhir/StructureDefinition/OperationDefinition"
                              ],
                              "interaction": [
                                {
                                  "code": "read"
                                }
                              ]
                            },
                            {
                              "type": "Organization",
                              "profile": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-organization",
                              "supportedProfile": [
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-organization"
                              ],
                              "interaction": [
                                {
                                  "code": "read"
                                },
                                {
                                  "code": "search-type"
                                }
                              ],
                              "searchParam": [
                                {
                                  "name": "_id",
                                  "type": "token",
                                  "documentation": "The ID of the resource"
                                },
                                {
                                  "name": "address",
                                  "type": "string",
                                  "documentation": "A server defined search that may match any of the string fields in the Address, including line, city, district, state, country, postalCode, and/or text"
                                },
                                {
                                  "name": "identifier",
                                  "type": "token",
                                  "documentation": "Any identifier for the organization (not the accreditation issuer's identifier)"
                                },
                                {
                                  "name": "name",
                                  "type": "string",
                                  "documentation": "A portion of the organization's name or alias"
                                }
                              ]
                            },
                            {
                              "type": "Patient",
                              "profile": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient",
                              "supportedProfile": [
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient"
                              ],
                              "interaction": [
                                {
                                  "code": "read"
                                },
                                {
                                  "code": "search-type"
                                }
                              ],
                              "searchParam": [
                                {
                                  "name": "_id",
                                  "type": "token",
                                  "documentation": "The ID of the resource"
                                },
                                {
                                  "name": "active",
                                  "type": "token",
                                  "documentation": "Whether the patient record is active"
                                },
                                {
                                  "name": "address",
                                  "type": "string",
                                  "documentation": "A server defined search that may match any of the string fields in the Address, including line, city, district, state, country, postalCode, and/or text"
                                },
                                {
                                  "name": "address-city",
                                  "type": "string",
                                  "documentation": "A city specified in an address"
                                },
                                {
                                  "name": "address-country",
                                  "type": "string",
                                  "documentation": "A country specified in an address"
                                },
                                {
                                  "name": "address-postalcode",
                                  "type": "string",
                                  "documentation": "A postalCode specified in an address"
                                },
                                {
                                  "name": "address-state",
                                  "type": "string",
                                  "documentation": "A state specified in an address"
                                },
                                {
                                  "name": "address-use",
                                  "type": "token",
                                  "documentation": "A use code specified in an address"
                                },
                                {
                                  "name": "birthdate",
                                  "type": "date",
                                  "documentation": "The patient's date of birth"
                                },
                                {
                                  "name": "deceased",
                                  "type": "token",
                                  "documentation": "This patient has been marked as deceased, or as a death date entered"
                                },
                                {
                                  "name": "email",
                                  "type": "token",
                                  "documentation": "A value in an email contact"
                                },
                                {
                                  "name": "family",
                                  "type": "string",
                                  "documentation": "A portion of the family name of the patient"
                                },
                                {
                                  "name": "gender",
                                  "type": "token",
                                  "documentation": "Gender of the patient"
                                },
                                {
                                  "name": "general-practitioner",
                                  "type": "reference",
                                  "documentation": "Patient's nominated general practitioner, not the organization that manages the record"
                                },
                                {
                                  "name": "given",
                                  "type": "string",
                                  "documentation": "A portion of the given name of the patient"
                                },
                                {
                                  "name": "identifier",
                                  "type": "token",
                                  "documentation": "A patient identifier"
                                },
                                {
                                  "name": "language",
                                  "type": "token",
                                  "documentation": "Language code (irrespective of use value)"
                                },
                                {
                                  "name": "link",
                                  "type": "reference",
                                  "documentation": "All patients linked to the given patient"
                                },
                                {
                                  "name": "link-type",
                                  "type": "string",
                                  "documentation": "The type of link between this Patient resource and another Patient/RelatedPerson resource"
                                },
                                {
                                  "name": "name",
                                  "type": "string",
                                  "documentation": "A server defined search that may match any of the string fields in the HumanName, including family, give, prefix, suffix, suffix, and/or text"
                                },
                                {
                                  "name": "phone",
                                  "type": "token",
                                  "documentation": "A value in a phone contact"
                                },
                                {
                                  "name": "telecom",
                                  "type": "token",
                                  "documentation": "The value in any kind of telecom details of the patient"
                                }
                              ],
                              "operation": [
                                {
                                  "name": "export",
                                  "definition": "http://hl7.org/fhir/uv/bulkdata/OperationDefinition/patient-export"
                                }
                              ]
                            },
                            {
                              "type": "Practitioner",
                              "profile": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-practitioner",
                              "supportedProfile": [
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-practitioner"
                              ],
                              "interaction": [
                                {
                                  "code": "read"
                                },
                                {
                                  "code": "search-type"
                                }
                              ],
                              "searchParam": [
                                {
                                  "name": "_id",
                                  "type": "token",
                                  "documentation": "The ID of the resource"
                                },
                                {
                                  "name": "active",
                                  "type": "token",
                                  "documentation": "Whether the practitioner record is active"
                                },
                                {
                                  "name": "email",
                                  "type": "token",
                                  "documentation": "A value in an email contact"
                                },
                                {
                                  "name": "family",
                                  "type": "string",
                                  "documentation": "A portion of the family name"
                                },
                                {
                                  "name": "given",
                                  "type": "string",
                                  "documentation": "A portion of the given name"
                                },
                                {
                                  "name": "identifier",
                                  "type": "token",
                                  "documentation": "A practitioner's Identifier"
                                },
                                {
                                  "name": "name",
                                  "type": "string",
                                  "documentation": "A server defined search that may match any of the string fields in the HumanName, including family, give, prefix, suffix, suffix, and/or text"
                                },
                                {
                                  "name": "phone",
                                  "type": "token",
                                  "documentation": "A value in a phone contact"
                                },
                                {
                                  "name": "telecom",
                                  "type": "token",
                                  "documentation": "The value in any kind of contact"
                                }
                              ]
                            },
                            {
                              "type": "PractitionerRole",
                              "profile": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-practitionerrole",
                              "supportedProfile": [
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-practitionerrole"
                              ],
                              "interaction": [
                                {
                                  "code": "read"
                                },
                                {
                                  "code": "search-type"
                                }
                              ],
                              "searchParam": [
                                {
                                  "name": "_id",
                                  "type": "token",
                                  "documentation": "The ID of the resource"
                                },
                                {
                                  "name": "active",
                                  "type": "token",
                                  "documentation": "Whether this practitioner role record is in active use"
                                },
                                {
                                  "name": "email",
                                  "type": "token",
                                  "documentation": "A value in an email contact"
                                },
                                {
                                  "name": "location",
                                  "type": "reference",
                                  "documentation": "One of the locations at which this practitioner provides care"
                                },
                                {
                                  "name": "organization",
                                  "type": "reference",
                                  "documentation": "The identity of the organization the practitioner represents / acts on behalf of"
                                },
                                {
                                  "name": "phone",
                                  "type": "token",
                                  "documentation": "A value in a phone contact"
                                },
                                {
                                  "name": "practitioner",
                                  "type": "reference",
                                  "documentation": "Practitioner that is able to provide the defined services for the organization"
                                },
                                {
                                  "name": "role",
                                  "type": "token",
                                  "documentation": "The practitioner can perform this role at for the organization"
                                },
                                {
                                  "name": "specialty",
                                  "type": "token",
                                  "documentation": "The practitioner has this specialty at an organization"
                                },
                                {
                                  "name": "telecom",
                                  "type": "token",
                                  "documentation": "The value in any kind of contact"
                                }
                              ]
                            },
                            {
                              "type": "Procedure",
                              "profile": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-procedure",
                              "supportedProfile": [
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-procedure"
                              ],
                              "interaction": [
                                {
                                  "code": "read"
                                },
                                {
                                  "code": "search-type"
                                }
                              ],
                              "searchParam": [
                                {
                                  "name": "_id",
                                  "type": "token",
                                  "documentation": "The ID of the resource"
                                },
                                {
                                  "name": "code",
                                  "type": "token",
                                  "documentation": "A code to identify a  procedure"
                                },
                                {
                                  "name": "date",
                                  "type": "date",
                                  "documentation": "When the procedure was performed"
                                },
                                {
                                  "name": "patient",
                                  "type": "reference",
                                  "documentation": "Search by subject - a patient"
                                },
                                {
                                  "name": "status",
                                  "type": "string",
                                  "documentation": "preparation | in-progress | not-done | on-hold | stopped | completed | entered-in-error | unknown"
                                }
                              ]
                            },
                            {
                              "type": "Provenance",
                              "profile": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-provenance",
                              "supportedProfile": [
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-provenance"
                              ],
                              "interaction": [
                                {
                                  "code": "read"
                                },
                                {
                                  "code": "search-type"
                                }
                              ],
                              "searchParam": [
                                {
                                  "name": "target",
                                  "type": "reference",
                                  "documentation": "Target Reference(s) (usually version specific)"
                                }
                              ]
                            },
                            {
                              "type": "Questionnaire",
                              "profile": "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire",
                              "supportedProfile": [
                                "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire"
                              ],
                              "interaction": [
                                {
                                  "code": "read"
                                },
                                {
                                  "code": "search-type"
                                }
                              ],
                              "searchParam": [
                                {
                                  "name": "_id",
                                  "type": "token",
                                  "documentation": "The ID of the resource"
                                },
                                {
                                  "name": "code",
                                  "type": "token",
                                  "documentation": "A code that corresponds to one of its items in the questionnaire"
                                }
                              ]
                            },
                            {
                              "type": "QuestionnaireResponse",
                              "profile": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-questionnaireresponse",
                              "supportedProfile": [
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-questionnaireresponse"
                              ],
                              "interaction": [
                                {
                                  "code": "read"
                                },
                                {
                                  "code": "search-type"
                                }
                              ],
                              "searchParam": [
                                {
                                  "name": "_id",
                                  "type": "token",
                                  "documentation": "The ID of the resource"
                                },
                                {
                                  "name": "patient",
                                  "type": "reference",
                                  "documentation": "The patient that is the subject of the questionnaire response"
                                }
                              ]
                            },
                            {
                              "type": "RelatedPerson",
                              "profile": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-relatedperson",
                              "supportedProfile": [
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-relatedperson"
                              ],
                              "interaction": [
                                {
                                  "code": "read"
                                },
                                {
                                  "code": "search-type"
                                }
                              ],
                              "searchParam": [
                                {
                                  "name": "_id",
                                  "type": "token",
                                  "documentation": "The ID of the resource"
                                },
                                {
                                  "name": "name",
                                  "type": "string",
                                  "documentation": "A server defined search that may match any of the string fields in the HumanName, including family, give, prefix, suffix, suffix, and/or text"
                                },
                                {
                                  "name": "patient",
                                  "type": "reference",
                                  "documentation": "The patient this related person is related to"
                                }
                              ]
                            },
                            {
                              "type": "ServiceRequest",
                              "profile": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-servicerequest",
                              "supportedProfile": [
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-servicerequest"
                              ],
                              "interaction": [
                                {
                                  "code": "read"
                                },
                                {
                                  "code": "search-type"
                                }
                              ],
                              "searchParam": [
                                {
                                  "name": "_id",
                                  "type": "token",
                                  "documentation": "The ID of the resource"
                                },
                                {
                                  "name": "authored",
                                  "type": "date",
                                  "documentation": "Date request signed"
                                },
                                {
                                  "name": "category",
                                  "type": "token",
                                  "documentation": "Classification of service"
                                },
                                {
                                  "name": "code",
                                  "type": "token",
                                  "documentation": "What is being requested/ordered"
                                },
                                {
                                  "name": "patient",
                                  "type": "reference",
                                  "documentation": "Search by subject - a patient"
                                },
                                {
                                  "name": "status",
                                  "type": "string",
                                  "documentation": "draft | active | on-hold | revoked | completed | entered-in-error | unknown"
                                }
                              ]
                            },
                            {
                              "type": "Specimen",
                              "profile": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-specimen",
                              "supportedProfile": [
                                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-specimen"
                              ],
                              "interaction": [
                                {
                                  "code": "read"
                                },
                                {
                                  "code": "search-type"
                                }
                              ],
                              "searchParam": [
                                {
                                  "name": "_id",
                                  "type": "token",
                                  "documentation": "The ID of the resource"
                                },
                                {
                                  "name": "patient",
                                  "type": "reference",
                                  "documentation": "The patient the specimen comes from"
                                }
                              ]
                            },
                            {
                              "type": "ValueSet",
                              "interaction": [
                                {
                                  "code": "read"
                                },
                                {
                                  "code": "search-type"
                                }
                              ],
                              "searchParam": [
                                {
                                  "name": "code",
                                  "type": "token",
                                  "documentation": "This special parameter searches for codes in the value set. See additional notes on the ValueSet resource"
                                },
                                {
                                  "name": "name",
                                  "type": "string",
                                  "documentation": "Computationally friendly name of the value set"
                                },
                                {
                                  "name": "publisher",
                                  "type": "string",
                                  "documentation": "Name of the publisher of the value set"
                                },
                                {
                                  "name": "title",
                                  "type": "string",
                                  "documentation": "The human-friendly name of the value set"
                                }
                              ]
                            }
                          ],
                          "operation": [
                            {
                              "name": "export",
                              "definition": "http://hl7.org/fhir/uv/bulkdata/OperationDefinition/export"
                            }
                          ]
                        }
                      ]
                    }
                  }
                }
              }
            }
          }
        },
        "security": []
      }
    }
  },
  "security": [
    {
      "smartOnFhir": [
        "openid",
        "fhirUser",
        "profile",
        "launch/patient",
        "offline_access",
        "patient/AllergyIntolerance.rs",
        "patient/CarePlan.rs",
        "patient/CareTeam.rs",
        "patient/Condition.rs",
        "patient/Coverage.rs",
        "patient/Device.rs",
        "patient/DiagnosticReport.rs",
        "patient/DocumentReference.rs",
        "patient/Encounter.rs",
        "patient/Goal.rs",
        "patient/Immunization.rs",
        "patient/Location.rs",
        "patient/Medication.rs",
        "patient/MedicationRequest.rs",
        "patient/Observation.rs",
        "patient/Organization.rs",
        "patient/Patient.rs",
        "patient/Practitioner.rs",
        "patient/PractitionerRole.rs",
        "patient/Procedure.rs",
        "patient/Provenance.rs",
        "patient/RelatedPerson.rs",
        "patient/ServiceRequest.rs",
        "user/AllergyIntolerance.rs",
        "user/CarePlan.rs",
        "user/CareTeam.rs",
        "user/Condition.rs",
        "user/Coverage.rs",
        "user/Device.rs",
        "user/DiagnosticReport.rs",
        "user/DocumentReference.rs",
        "user/Encounter.rs",
        "user/Goal.rs",
        "user/Immunization.rs",
        "user/Location.rs",
        "user/Medication.rs",
        "user/MedicationRequest.rs",
        "user/Observation.rs",
        "user/Organization.rs",
        "user/Patient.rs",
        "user/Practitioner.rs",
        "user/PractitionerRole.rs",
        "user/Procedure.rs",
        "user/Provenance.rs",
        "user/RelatedPerson.rs",
        "user/ServiceRequest.rs",
        "system/AllergyIntolerance.rs",
        "system/CarePlan.rs",
        "system/CareTeam.rs",
        "system/Condition.rs",
        "system/Coverage.rs",
        "system/Device.rs",
        "system/DiagnosticReport.rs",
        "system/DocumentReference.rs",
        "system/Encounter.rs",
        "system/Goal.rs",
        "system/Immunization.rs",
        "system/Location.rs",
        "system/Medication.rs",
        "system/MedicationRequest.rs",
        "system/Observation.rs",
        "system/Organization.rs",
        "system/Patient.rs",
        "system/Practitioner.rs",
        "system/PractitionerRole.rs",
        "system/Procedure.rs",
        "system/Provenance.rs",
        "system/RelatedPerson.rs",
        "system/ServiceRequest.rs"
      ]
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
      "smartOnFhir": {
        "type": "oauth2",
        "flows": {
          "authorizationCode": {
            "authorizationUrl": "https://fhirmp.mmi.prod.fhir.ema-api.com/fhir/r4/auth/realms/fhir/protocol/openid-connect/auth",
            "tokenUrl": "https://fhirmp.mmi.prod.fhir.ema-api.com/fhir/r4/auth/realms/fhir/protocol/openid-connect/token",
            "scopes": {
              "openid": "OpenID Connect (auto-granted)",
              "fhirUser": "FHIR reference to the authenticated practitioner",
              "profile": "Standard OIDC profile claims",
              "launch/patient": "Request patient context in the token",
              "offline_access": "Request a long-lived refresh token",
              "patient/AllergyIntolerance.rs": "Read/search AllergyIntolerance (patient context)",
              "patient/CarePlan.rs": "Read/search CarePlan (patient context)",
              "patient/CareTeam.rs": "Read/search CareTeam (patient context)",
              "patient/Condition.rs": "Read/search Condition (patient context)",
              "patient/Coverage.rs": "Read/search Coverage (patient context)",
              "patient/Device.rs": "Read/search Device (patient context)",
              "patient/DiagnosticReport.rs": "Read/search DiagnosticReport (patient context)",
              "patient/DocumentReference.rs": "Read/search DocumentReference (patient context)",
              "patient/Encounter.rs": "Read/search Encounter (patient context)",
              "patient/Goal.rs": "Read/search Goal (patient context)",
              "patient/Immunization.rs": "Read/search Immunization (patient context)",
              "patient/Location.rs": "Read/search Location (patient context)",
              "patient/Medication.rs": "Read/search Medication (patient context)",
              "patient/MedicationRequest.rs": "Read/search MedicationRequest (patient context)",
              "patient/Observation.rs": "Read/search Observation (patient context)",
              "patient/Organization.rs": "Read/search Organization (patient context)",
              "patient/Patient.rs": "Read/search Patient (patient context)",
              "patient/Practitioner.rs": "Read/search Practitioner (patient context)",
              "patient/PractitionerRole.rs": "Read/search PractitionerRole (patient context)",
              "patient/Procedure.rs": "Read/search Procedure (patient context)",
              "patient/Provenance.rs": "Read/search Provenance (patient context)",
              "patient/RelatedPerson.rs": "Read/search RelatedPerson (patient context)",
              "patient/ServiceRequest.rs": "Read/search ServiceRequest (patient context)",
              "user/AllergyIntolerance.rs": "Read/search AllergyIntolerance (user context)",
              "user/CarePlan.rs": "Read/search CarePlan (user context)",
              "user/CareTeam.rs": "Read/search CareTeam (user context)",
              "user/Condition.rs": "Read/search Condition (user context)",
              "user/Coverage.rs": "Read/search Coverage (user context)",
              "user/Device.rs": "Read/search Device (user context)",
              "user/DiagnosticReport.rs": "Read/search DiagnosticReport (user context)",
              "user/DocumentReference.rs": "Read/search DocumentReference (user context)",
              "user/Encounter.rs": "Read/search Encounter (user context)",
              "user/Goal.rs": "Read/search Goal (user context)",
              "user/Immunization.rs": "Read/search Immunization (user context)",
              "user/Location.rs": "Read/search Location (user context)",
              "user/Medication.rs": "Read/search Medication (user context)",
              "user/MedicationRequest.rs": "Read/search MedicationRequest (user context)",
              "user/Observation.rs": "Read/search Observation (user context)",
              "user/Organization.rs": "Read/search Organization (user context)",
              "user/Patient.rs": "Read/search Patient (user context)",
              "user/Practitioner.rs": "Read/search Practitioner (user context)",
              "user/PractitionerRole.rs": "Read/search PractitionerRole (user context)",
              "user/Procedure.rs": "Read/search Procedure (user context)",
              "user/Provenance.rs": "Read/search Provenance (user context)",
              "user/RelatedPerson.rs": "Read/search RelatedPerson (user context)",
              "user/ServiceRequest.rs": "Read/search ServiceRequest (user context)",
              "system/AllergyIntolerance.rs": "Read/search AllergyIntolerance (system/bulk context)",
              "system/CarePlan.rs": "Read/search CarePlan (system/bulk context)",
              "system/CareTeam.rs": "Read/search CareTeam (system/bulk context)",
              "system/Condition.rs": "Read/search Condition (system/bulk context)",
              "system/Coverage.rs": "Read/search Coverage (system/bulk context)",
              "system/Device.rs": "Read/search Device (system/bulk context)",
              "system/DiagnosticReport.rs": "Read/search DiagnosticReport (system/bulk context)",
              "system/DocumentReference.rs": "Read/search DocumentReference (system/bulk context)",
              "system/Encounter.rs": "Read/search Encounter (system/bulk context)",
              "system/Goal.rs": "Read/search Goal (system/bulk context)",
              "system/Immunization.rs": "Read/search Immunization (system/bulk context)",
              "system/Location.rs": "Read/search Location (system/bulk context)",
              "system/Medication.rs": "Read/search Medication (system/bulk context)",
              "system/MedicationRequest.rs": "Read/search MedicationRequest (system/bulk context)",
              "system/Observation.rs": "Read/search Observation (system/bulk context)",
              "system/Organization.rs": "Read/search Organization (system/bulk context)",
              "system/Patient.rs": "Read/search Patient (system/bulk context)",
              "system/Practitioner.rs": "Read/search Practitioner (system/bulk context)",
              "system/PractitionerRole.rs": "Read/search PractitionerRole (system/bulk context)",
              "system/Procedure.rs": "Read/search Procedure (system/bulk context)",
              "system/Provenance.rs": "Read/search Provenance (system/bulk context)",
              "system/RelatedPerson.rs": "Read/search RelatedPerson (system/bulk context)",
              "system/ServiceRequest.rs": "Read/search ServiceRequest (system/bulk context)"
            }
          }
        }
      }
    }
  }
}
```