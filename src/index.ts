#!/usr/bin/env node
/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {format as formatString} from 'node:util';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

import { CodeSnippet } from './types/snippets.js';
import { GenericMCPResponse } from './types/transport_types.js';
import { StorageBase } from './engine/storage_base.js';
import { LocalStorage } from './engine/local_storage.js';
import LocaleData from './locales/locale.js';

class CodeSnippetServer {
  private server: Server;
  private engine: StorageBase;

  constructor() {
    this.engine = new LocalStorage();
    this.server = new Server(
      {
        name: 'code-snippet-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
          prompts: {},
        },
      }
    );
    this.setupToolHandlers();
  }

  /**
   * Get formatted locale string
   */
  private getLocalizedString(item: string, ...args:any) :string {
    return formatString(LocaleData[item], ...args);
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'create_snippet',
          description: this.getLocalizedString("tool_create_snippet"),
          inputSchema: {
            type: 'object',
            properties: {
              title: { type: 'string', description: this.getLocalizedString("snippet_schema_title") },
              language: { type: 'string', description: this.getLocalizedString("snippet_schema_language") },
              code: { type: 'string', description: this.getLocalizedString("snippet_schema_code") },
              tags: {
                type: 'array',
                items: { type: 'string' },
                description: this.getLocalizedString("snippet_schema_tags")
              }
            },
            required: ['title', 'language', 'code']
          }
        },
        {
          name: 'list_snippets',
          description: this.getLocalizedString("tool_list_snippets"),
          inputSchema: {
            type: 'object',
            properties: {
              language: {
                type: 'string',
                description: this.getLocalizedString("snippet_schema_language_filter")
              },
              tag: {
                type: 'string',
                description: this.getLocalizedString("snippet_schema_tag_filter")
              }
            }
          }
        },
        {
          name: 'delete_snippet',
          description: this.getLocalizedString("tool_delete_snippet"),
          inputSchema: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                description: this.getLocalizedString("snippet_schema_id_to_delete")
              }
            },
            required: ['id']
          }
        }
      ]
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case 'create_snippet':
          return await this.createSnippet(request.params.arguments);

        case 'list_snippets':
          return await this.listSnippets(request.params.arguments);

        case 'delete_snippet':
          return await this.deleteSnippet(request.params.arguments);

        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${request.params.name}`
          );
      }
    });
  }

  private async createSnippet(args: any): Promise<GenericMCPResponse> {
    if (!args || typeof args.title !== 'string' || typeof args.language !== 'string' || typeof args.code !== 'string') {
      throw new McpError(ErrorCode.InvalidParams, 'Invalid snippet parameters');
    }

    const newSnippet: CodeSnippet = {
      id: Date.now().toString(),
      title: args.title,
      language: args.language,
      code: args.code,
      tags: args.tags || [],
      createdAt: new Date().toISOString()
    };

    await this.engine.InsertSnippet(newSnippet);

    return {
      content: [{
        type: 'text',
        text: this.getLocalizedString("snippet_created", newSnippet.title, newSnippet.id)
      }]
    };
  }

  private async listSnippets(args: any): Promise<GenericMCPResponse> {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(await this.engine.ListSnippets(args), null, 2)
      }]
    };
  }

  private async deleteSnippet(args: any): Promise<GenericMCPResponse> {
    if (!args || typeof args.id !== 'string') {
      throw new McpError(ErrorCode.InvalidParams, 'Invalid snippet ID');
    }

    if (await this.engine.DeleteSnippet(args.id)) {
      return {
        content: [{
          type: 'text',
          text: this.getLocalizedString("snippet_deleted", args.id)
        }]
      };
    }
    return {
      content: [{
        type: 'text',
        text: this.getLocalizedString("snippet_not_found", args.id)
      }]
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.engine.Initialize();
    await this.server.connect(transport);
    console.error('Started code snippet server');
  }
}

const server = new CodeSnippetServer();
server.run().catch(console.error);
