#!/usr/bin/env node

/**
 * This is a FHIR MCP server implementation that provides access to FHIR resources.
 * It supports:
 * - Reading FHIR resources
 * - Searching FHIR resources
 * - Creating FHIR resources
 * - Updating FHIR resources
 * - Deleting FHIR resources
 * - Retrieving CapabilityStatement
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ReadResourceRequest,
  CallToolRequest,
  ReadResourceResult,
  CallToolResult
} from "@modelcontextprotocol/sdk/types.js";
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.join(__dirname, '..', 'docs', 'modmed');

interface FHIRConfig {
  baseUrl: string;
  username?: string;
  password?: string;
  apiKey?: string;
  firmUrlPrefix?: string;
  accessToken?: string;
  useOAuth2?: boolean;
  oauthEndpoint?: string;
}

const config: FHIRConfig = {
  baseUrl: process.env.FHIR_BASE_URL || '',
  username: process.env.FHIR_USERNAME,
  password: process.env.FHIR_PASSWORD,
  apiKey: process.env.FHIR_API_KEY,
  firmUrlPrefix: process.env.FHIR_FIRM_URL_PREFIX,
  accessToken: process.env.FHIR_ACCESS_TOKEN,
  useOAuth2: process.env.FHIR_USE_OAUTH2 === 'true',
  oauthEndpoint: process.env.FHIR_OAUTH_ENDPOINT,
};

let cachedAccessToken: string | null = null;
let refreshTokenValue: string | null = null;
let tokenExpirationTime: number | null = null;
const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;

async function fetchOAuth2Token(useRefreshToken = false): Promise<string> {
  if (!config.username || !config.password || !config.apiKey) {
    throw new Error('FHIR_USERNAME, FHIR_PASSWORD, and FHIR_API_KEY environment variables must be set for OAuth2 authentication');
  }

  const oauthEndpoint = config.oauthEndpoint || constructOAuthEndpointFromBaseUrl();

  const requestBody = new URLSearchParams();

  if (useRefreshToken && refreshTokenValue) {
    requestBody.append('grant_type', 'refresh_token');
    requestBody.append('refresh_token', refreshTokenValue);
  } else {
    requestBody.append('grant_type', 'password');
    requestBody.append('username', config.username);
    requestBody.append('password', config.password);
  }

  const response = await axios.post(oauthEndpoint, requestBody, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'x-api-key': config.apiKey,
    },
  });

  cachedAccessToken = response.data.access_token;
  refreshTokenValue = response.data.refresh_token;
  tokenExpirationTime = Date.now() + (response.data.expires_in * 1000);

  return cachedAccessToken!;
}

function constructOAuthEndpointFromBaseUrl(): string {
  const baseUrl = new URL(config.baseUrl);
  const pathParts = baseUrl.pathname.split('/').filter(part => part.length > 0);

  const environmentPath = pathParts[0] || 'ema-training';
  const firmPrefix = config.firmUrlPrefix || 'apiportal';

  return `${baseUrl.protocol}//${baseUrl.hostname}/${environmentPath}/firm/${firmPrefix}/ema/ws/oauth2/grant`;
}

async function getAccessToken(): Promise<string> {
  if (!config.useOAuth2 && config.accessToken) {
    return config.accessToken;
  }

  if (config.useOAuth2) {
    const isTokenValid = cachedAccessToken &&
                        tokenExpirationTime &&
                        tokenExpirationTime > Date.now() + FIVE_MINUTES_IN_MS;

    if (isTokenValid && cachedAccessToken) {
      return cachedAccessToken;
    }

    const useRefresh = refreshTokenValue !== null;
    return await fetchOAuth2Token(useRefresh);
  }

  throw new Error('Either FHIR_ACCESS_TOKEN (for static token) or OAuth2 parameters (FHIR_USERNAME, FHIR_PASSWORD, FHIR_API_KEY, FHIR_FIRM_URL_PREFIX, FHIR_USE_OAUTH2=true) must be set');
}

const fhirClient = axios.create({
  baseURL: config.baseUrl,
  headers: {
    'Content-Type': 'application/fhir+json',
    'Accept': 'application/fhir+json',
    ...(config.apiKey && { 'x-api-key': config.apiKey }),
  },
});

fhirClient.interceptors.request.use(async (axiosConfig) => {
  const token = await getAccessToken();
  axiosConfig.headers.Authorization = `Bearer ${token}`;
  return axiosConfig;
});

// Add type for capability statement
interface FHIRCapabilityStatement {
  rest: Array<{
    resource: Array<{
      type: string;
      // Add other relevant fields
    }>;
  }>;
}

let capabilityStatement: FHIRCapabilityStatement | null = null;

const server = new Server(
  {
    name: "@flexpa/mpc-fhir",
    version: "0.0.1",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

// Cache capability statement
async function getCapabilityStatement() {
  if (!capabilityStatement) {
    const response = await fhirClient.get('/metadata');
    capabilityStatement = response.data;
  }
  return capabilityStatement;
}

/**
 * Handler for listing available FHIR resources based on CapabilityStatement
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const capability = await getCapabilityStatement();
  const resources = capability?.rest[0].resource || [];
  
  return {
    resources: resources.map((resource: any) => ({
      uri: `fhir://${resource.type}`,
      mimeType: "application/fhir+json",
      name: resource.type,
      description: `FHIR ${resource.type} resource`
    }))
  };
});

/**
 * Handler for reading FHIR resources
 */
server.setRequestHandler(ReadResourceRequestSchema, async (request: ReadResourceRequest): Promise<ReadResourceResult> => {
  const url = new URL(request.params.uri);
  const resourceType = url.hostname;
  const id = url.pathname.replace(/^\//, '');

  try {
    const response = await fhirClient.get(`/${resourceType}/${id}`);
    
    return {
      contents: [{
        uri: request.params.uri,
        mimeType: "application/fhir+json",
        text: JSON.stringify(response.data, null, 2)
      }]
    };
  } catch (error: any) {
    throw new Error(`Failed to fetch FHIR resource: ${error.message}`);
  }
});

/**
 * Handler that lists available tools for FHIR operations
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search_fhir",
        description: "Search FHIR resources",
        inputSchema: {
          type: "object",
          properties: {
            resourceType: {
              type: "string",
              description: "Type of FHIR resource to search"
            },
            searchParams: {
              type: "object",
              description: "Search parameters"
            }
          },
          required: ["resourceType"]
        }
      },
      {
        name: "read_fhir",
        description: "Read an individual FHIR resource by its URI. The URI must use the format: fhir://{resourceType}/{id} (e.g. fhir://Encounter/3065019, fhir://Patient/99081, fhir://Condition/848539)",
        inputSchema: {
          type: "object",
          properties: {
            uri: {
              type: "string",
              description: "URI of the FHIR resource to read. Must use format: fhir://{resourceType}/{id} (e.g. fhir://Encounter/3065019)"
            }
          },
          required: ["uri"]
        }
      },
      {
        name: "create_fhir",
        description: [
          "Create a new FHIR resource. Sends a POST to the FHIR server with the provided resource payload.",
          "",
          "IMPORTANT - ModMed EMA resource support & requirements:",
          "- Resources that support CREATE: AllergyIntolerance, ChargeItem, Composition, Condition, Coverage, DocumentReference, MedicationStatement, Organization, Patient, Practitioner (referring)",
          "- Resources that are READ-ONLY (no CREATE): Encounter (created internally from appointments), Appointment (use dedicated Appointment endpoints), DiagnosticReport, ServiceRequest, Procedure",
          "- Encounters are created internally by ModMed workflow (from appointments) and cannot be POSTed.",
          "",
          "Condition CREATE requires these ModMed-specific formats:",
          '- clinicalStatus: use "ACTIVE" (uppercase) in coding, e.g. {"coding":[{"system":"http://hl7.org/fhir/ValueSet/condition-clinical","code":"ACTIVE"}],"text":"Active"}',
          '- category: use ModMed ValueSet URL, e.g. {"coding":[{"system":"<baseurl>/ValueSet/condition-category","code":"DIAGNOSIS"}],"text":"Diagnosis"}. Accepted codes: DIAGNOSIS, PROBLEM, CONDITION, SYMPTOM, FINDING, COMPLAINT, FUNCTIONAL LIMITATION, HEALTH STATUS',
          '- code.coding[].system: use "ICD10", "ICD9", or "SNOMED CT" (not URN-style like http://hl7.org/fhir/sid/icd-10-cm)',
          "- Conditions created via API must be reconciled by the practice in the ModMed UI before appearing on the patient chart.",
          "",
          "ChargeItem CREATE requires: account (patient reference), encounter, code with CPT/HCPCS coding, and quantity.",
          "Composition CREATE requires: subject (patient), encounter, author (practitioner), section with narrative.",
          "",
          "On success, the API may return an empty body with the new resource location in headers."
        ].join("\n"),
        inputSchema: {
          type: "object",
          properties: {
            resourceType: {
              type: "string",
              description: "Type of FHIR resource to create (e.g. Patient, ChargeItem, Composition, Condition)"
            },
            payload: {
              type: "object",
              description: "The full FHIR resource body to create, as a JSON object. Must include resourceType and all required fields."
            },
            operation: {
              type: "string",
              description: "Optional FHIR operation name (e.g. $validate). Appended to the URL when provided."
            }
          },
          required: ["resourceType", "payload"]
        }
      },
      {
        name: "update_fhir",
        description: [
          "Update an existing FHIR resource by ID. Sends a PUT to the FHIR server with the provided resource payload.",
          "",
          "IMPORTANT - ModMed EMA resource support:",
          "- Resources that support UPDATE: AllergyIntolerance, Condition, Coverage, MedicationStatement, Patient, Appointment",
          "- Some fields are immutable on update (e.g., Condition subject/code/recordedDate cannot be changed).",
          "- Condition UPDATE only supports: abatement, clinicalStatus, category."
        ].join("\n"),
        inputSchema: {
          type: "object",
          properties: {
            resourceType: {
              type: "string",
              description: "Type of FHIR resource to update (e.g. Patient, Condition, Coverage)"
            },
            id: {
              type: "string",
              description: "The logical ID of the FHIR resource to update"
            },
            payload: {
              type: "object",
              description: "The complete FHIR resource body to update. The payload must include all mandatory fields defined by the resource's profile."
            },
            operation: {
              type: "string",
              description: "Optional FHIR operation name (e.g. $validate). Appended to the URL when provided."
            }
          },
          required: ["resourceType", "id", "payload"]
        }
      },
      {
        name: "delete_fhir",
        description: "Delete a FHIR resource by ID. Sends a DELETE to the FHIR server.",
        inputSchema: {
          type: "object",
          properties: {
            resourceType: {
              type: "string",
              description: "Type of FHIR resource to delete (e.g. Patient, ChargeItem, Composition)"
            },
            id: {
              type: "string",
              description: "The logical ID of the FHIR resource to delete"
            },
            operation: {
              type: "string",
              description: "Optional FHIR operation name (e.g. $expunge). Appended to the URL when provided."
            }
          },
          required: ["resourceType", "id"]
        }
      },
      {
        name: "search_documentation",
        description: [
          "Search bundled ModMed EMA FHIR API documentation for guidance on resource operations, field formats, and API behavior.",
          "Use this tool BEFORE creating or updating FHIR resources to understand ModMed-specific requirements.",
          "Returns relevant documentation sections matching your query, or lists available documentation topics if no matches are found."
        ].join("\n"),
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search query to find relevant ModMed API documentation. Use resource names (e.g. 'Condition', 'Encounter', 'Appointment'), operation types ('create', 'update'), or topics ('authentication', 'value sets')."
            }
          },
          required: ["query"]
        }
      }
    ]
  };
});

/**
 * Handler for FHIR operations
 */
server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest): Promise<CallToolResult> => {
  switch (request.params.name) {
    case "search_fhir": {
      const resourceType = String(request.params.arguments?.resourceType);
      const searchParams = request.params.arguments?.searchParams || {};

      try {
        const response = await fhirClient.get(`/${resourceType}`, { params: searchParams });
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify(response.data, null, 2)
          }]
        };
      } catch (error: any) {
        throw new Error(`Failed to search FHIR resources: ${error.message}`);
      }
    }

    case "read_fhir": {
      const uri = String(request.params.arguments?.uri);
      let resourceType: string;
      let id: string;

      if (uri.startsWith("fhir://")) {
        const url = new URL(uri);
        resourceType = url.hostname;
        id = url.pathname.replace(/^\//, '');
      } else if (uri.match(/^https?:\/\//)) {
        const url = new URL(uri);
        const parts = url.pathname.split("/").filter(Boolean);
        id = parts.pop() || "";
        resourceType = parts.pop() || "";
      } else {
        const parts = uri.replace(/^\//, "").split("/");
        resourceType = parts[0];
        id = parts.slice(1).join("/");
      }

      try {
        const response = await fhirClient.get(`/${resourceType}/${id}`);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify(response.data, null, 2)
          }]
        };
      } catch (error: any) {
        throw new Error(`Failed to fetch FHIR resource: ${error.message}`);
      }
    }

    case "create_fhir": {
      const resourceType = String(request.params.arguments?.resourceType);
      const payload = request.params.arguments?.payload as Record<string, any>;
      const operation = request.params.arguments?.operation ? String(request.params.arguments.operation) : '';

      if (!resourceType) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              resourceType: "OperationOutcome",
              issue: [{ severity: "error", code: "required", diagnostics: "A required element 'resourceType' is missing." }]
            }, null, 2)
          }]
        };
      }

      try {
        const url = operation ? `/${resourceType}/${operation}` : `/${resourceType}`;
        const response = await fhirClient.post(url, payload);
        
        // If the response body is empty, return the Location header info
        if (!response.data || (typeof response.data === 'string' && response.data.trim() === '')) {
          const location = response.headers?.location || response.headers?.Location || '';
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                status: "created",
                resourceType,
                location,
                message: location ? `Resource created at ${location}` : "Resource created successfully (no body returned)"
              }, null, 2)
            }]
          };
        }
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify(response.data, null, 2)
          }]
        };
      } catch (error: any) {
        const errorData = error.response?.data || { message: error.message };
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              resourceType: "OperationOutcome",
              issue: [{ severity: "error", code: "exception", diagnostics: `Failed to create FHIR resource: ${JSON.stringify(errorData)}` }]
            }, null, 2)
          }]
        };
      }
    }

    case "update_fhir": {
      const resourceType = String(request.params.arguments?.resourceType);
      const id = String(request.params.arguments?.id);
      const payload = request.params.arguments?.payload as Record<string, any>;
      const operation = request.params.arguments?.operation ? String(request.params.arguments.operation) : '';

      if (!resourceType) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              resourceType: "OperationOutcome",
              issue: [{ severity: "error", code: "required", diagnostics: "A required element 'resourceType' is missing." }]
            }, null, 2)
          }]
        };
      }

      if (!id) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              resourceType: "OperationOutcome",
              issue: [{ severity: "error", code: "required", diagnostics: "A required element 'id' is missing." }]
            }, null, 2)
          }]
        };
      }

      try {
        const url = operation ? `/${resourceType}/${id}/${operation}` : `/${resourceType}/${id}`;
        const response = await fhirClient.put(url, { ...payload, id });
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify(response.data, null, 2)
          }]
        };
      } catch (error: any) {
        const errorData = error.response?.data || { message: error.message };
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              resourceType: "OperationOutcome",
              issue: [{ severity: "error", code: "exception", diagnostics: `Failed to update FHIR resource: ${JSON.stringify(errorData)}` }]
            }, null, 2)
          }]
        };
      }
    }

    case "delete_fhir": {
      const resourceType = String(request.params.arguments?.resourceType);
      const id = String(request.params.arguments?.id);
      const operation = request.params.arguments?.operation ? String(request.params.arguments.operation) : '';

      if (!resourceType) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              resourceType: "OperationOutcome",
              issue: [{ severity: "error", code: "required", diagnostics: "A required element 'resourceType' is missing." }]
            }, null, 2)
          }]
        };
      }

      if (!id) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              resourceType: "OperationOutcome",
              issue: [{ severity: "error", code: "required", diagnostics: "A required element 'id' is missing." }]
            }, null, 2)
          }]
        };
      }

      try {
        const url = operation ? `/${resourceType}/${id}/${operation}` : `/${resourceType}/${id}`;
        const response = await fhirClient.delete(url);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify(response.data || {
              resourceType: "OperationOutcome",
              issue: [{ severity: "information", code: "SUCCESSFUL_DELETE", diagnostics: `Successfully deleted ${resourceType}/${id}.` }]
            }, null, 2)
          }]
        };
      } catch (error: any) {
        const errorData = error.response?.data || { message: error.message };
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              resourceType: "OperationOutcome",
              issue: [{ severity: "error", code: "exception", diagnostics: `Failed to delete FHIR resource: ${JSON.stringify(errorData)}` }]
            }, null, 2)
          }]
        };
      }
    }

    case "search_documentation": {
      const query = String(request.params.arguments?.query || '').toLowerCase();

      if (!query) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              error: "A 'query' parameter is required."
            }, null, 2)
          }]
        };
      }

      try {
        // Check if docs directory exists
        if (!fs.existsSync(DOCS_DIR)) {
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                message: "No ModMed documentation directory found.",
                docsPath: DOCS_DIR,
                hint: "Download ModMed API docs into the docs/modmed/ directory."
              }, null, 2)
            }]
          };
        }

        const files = fs.readdirSync(DOCS_DIR).filter(f => f.endsWith('.md'));

        if (files.length === 0) {
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                message: "No documentation files found in docs/modmed/.",
                hint: "Add .md files to the docs/modmed/ directory."
              }, null, 2)
            }]
          };
        }

        // Search through all doc files
        const results: Array<{ file: string; relevance: number; content: string }> = [];

        for (const file of files) {
          const filePath = path.join(DOCS_DIR, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          const lowerContent = content.toLowerCase();
          const lowerFile = file.toLowerCase();

          // Count query term matches for relevance scoring
          const queryTerms = query.split(/\s+/).filter(Boolean);
          let matchCount = 0;
          for (const term of queryTerms) {
            const regex = new RegExp(term, 'gi');
            const matches = lowerContent.match(regex);
            if (matches) matchCount += matches.length;
            // Also boost if term appears in filename
            if (lowerFile.includes(term)) matchCount += 10;
          }

          if (matchCount > 0) {
            results.push({ file, relevance: matchCount, content });
          }
        }

        // Sort by relevance (most matches first)
        results.sort((a, b) => b.relevance - a.relevance);

        if (results.length === 0) {
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                message: `No documentation found matching "${query}".`,
                availableTopics: files.map(f => f.replace(/\.md$/, ''))
              }, null, 2)
            }]
          };
        }

        // Return top matches (limit to avoid overwhelming the LLM)
        const maxResults = Math.min(results.length, 3);
        const output = results.slice(0, maxResults).map(r => ({
          file: r.file,
          content: r.content
        }));

        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              query,
              matchesFound: results.length,
              showing: maxResults,
              results: output
            }, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              resourceType: "OperationOutcome",
              issue: [{ severity: "error", code: "exception", diagnostics: `Failed to search documentation: ${error.message}` }]
            }, null, 2)
          }]
        };
      }
    }

    default:
      throw new Error("Unknown tool");
  }
});

async function main() {
  if (!config.baseUrl) {
    throw new Error('FHIR_BASE_URL environment variable must be set');
  }

  if (!config.useOAuth2 && !config.accessToken) {
    throw new Error('FHIR_ACCESS_TOKEN environment variable must be set when not using OAuth2');
  }

  if (config.useOAuth2) {
    if (!config.username || !config.password || !config.apiKey || !config.firmUrlPrefix) {
      throw new Error('FHIR_USERNAME, FHIR_PASSWORD, FHIR_API_KEY, and FHIR_FIRM_URL_PREFIX environment variables must be set for OAuth2 authentication');
    }
  }
  
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  try {
    await getCapabilityStatement();
  } catch (error) {
    console.error('Warning: Failed to fetch capability statement during startup:', error);
    console.error('The MCP server will continue, but FHIR operations may fail if the server is unreachable.');
  }
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
