#!/usr/bin/env node

/**
 * This is a FHIR MCP server implementation that provides access to FHIR resources.
 * It supports:
 * - Reading FHIR resources
 * - Searching FHIR resources
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
        description: "Read an individual FHIR resource",
        inputSchema: {
          type: "object",
          properties: {
            uri: {
              type: "string",
              description: "URI of the FHIR resource to read"
            }
          },
          required: ["uri"]
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
      const url = new URL(uri);
      const resourceType = url.hostname;
      const id = url.pathname.replace(/^\//, '');

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
