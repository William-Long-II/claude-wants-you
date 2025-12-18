#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { loadConfig } from './config.js';
import { NotificationManager } from './notifier.js';
import { NotificationMessage } from './types.js';

// Initialize configuration and notification manager
const config = loadConfig();
const notificationManager = new NotificationManager(config);

// Define available tools
const TOOLS: Tool[] = [
  {
    name: 'send_notification',
    description:
      'Send a notification across all configured channels (desktop, SMS, Slack, Teams). ' +
      'Use this when Claude is waiting for user input, has completed a task, or needs attention.',
    inputSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'The notification title (e.g., "Claude Needs Input", "Task Complete")',
        },
        message: {
          type: 'string',
          description: 'The detailed notification message',
        },
        priority: {
          type: 'string',
          enum: ['low', 'normal', 'high'],
          description: 'Notification priority level (default: normal)',
        },
      },
      required: ['title', 'message'],
    },
  },
  {
    name: 'list_providers',
    description: 'List all configured notification providers',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

// Create MCP server
const server = new Server(
  {
    name: 'claude-notify-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'send_notification') {
      const { title, message, priority } = args as {
        title: string;
        message: string;
        priority?: 'low' | 'normal' | 'high';
      };

      const notificationMessage: NotificationMessage = {
        title,
        message,
        priority: priority || 'normal',
      };

      await notificationManager.sendNotification(notificationMessage);

      return {
        content: [
          {
            type: 'text',
            text: `Notification sent successfully via: ${notificationManager.getProviderNames().join(', ')}`,
          },
        ],
      };
    } else if (name === 'list_providers') {
      const providers = notificationManager.getProviderNames();

      return {
        content: [
          {
            type: 'text',
            text: providers.length > 0
              ? `Configured providers: ${providers.join(', ')}`
              : 'No providers configured. Check your .env file.',
          },
        ],
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: `Unknown tool: ${name}`,
        },
      ],
      isError: true,
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('Claude Notify MCP Server running');
  console.error(`Configured providers: ${notificationManager.getProviderNames().join(', ') || 'none'}`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
