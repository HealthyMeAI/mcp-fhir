> ## Documentation Index
> Fetch the complete documentation index at: https://portal.api.modmed.com/llms.txt
> Use this file to discover all available pages before exploring further.

# GET: /Patient/$export

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
      "name": "Patient",
      "description": "The Patient FHIR resource type<br/>Base profile: http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient"
    }
  ],
  "paths": {
    "/Patient/$export": {
      "get": {
        "tags": [
          "Patient"
        ],
        "summary": "GET: /Patient/$export",
        "parameters": [
          {
            "name": "_outputFormat",
            "in": "query",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "_since",
            "in": "query",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string",
                  "format": "date-time"
                },
                {
                  "type": "string",
                  "format": "date"
                }
              ]
            }
          },
          {
            "name": "_type",
            "in": "query",
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
              "application/json+fhir": {
                "schema": {
                  "$ref": "#/components/schemas/FHIR-JSON-RESOURCE"
                }
              },
              "application/xml+fhir": {
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