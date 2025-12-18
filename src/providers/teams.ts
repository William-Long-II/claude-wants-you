import { NotificationProvider, NotificationMessage, NotificationConfig } from '../types.js';

/**
 * Microsoft Teams notification provider using Workflows (Power Automate)
 *
 * Note: This uses the new Teams Workflows webhooks with Adaptive Cards format.
 * Microsoft is retiring Office 365 Connectors (the old MessageCard format).
 *
 * Webhook URL format: https://prod-XX.XX.logic.azure.com:443/workflows/...
 *
 * Setup:
 * 1. In Teams channel → (...) → Workflows
 * 2. Create → "Post to a channel when a webhook request is received"
 * 3. Copy the generated webhook URL
 */
export class TeamsNotificationProvider implements NotificationProvider {
  name = 'Microsoft Teams';
  private webhookUrl: string;

  constructor(config: NonNullable<NotificationConfig['teams']>) {
    this.webhookUrl = config.webhookUrl;
  }

  async send(message: NotificationMessage): Promise<void> {
    // Microsoft Teams Workflows (Power Automate) format
    // This replaces the deprecated Office 365 Connectors
    const payload = {
      type: 'message',
      attachments: [
        {
          contentType: 'application/vnd.microsoft.card.adaptive',
          contentUrl: null,
          content: {
            $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
            type: 'AdaptiveCard',
            version: '1.4',
            body: [
              {
                type: 'TextBlock',
                text: message.title,
                weight: 'Bolder',
                size: 'Large',
                wrap: true,
                color: this.getColorForPriority(message.priority),
              },
              {
                type: 'TextBlock',
                text: message.message,
                wrap: true,
                spacing: 'Medium',
              },
              {
                type: 'TextBlock',
                text: `Priority: ${message.priority || 'normal'} • ${new Date().toLocaleString()}`,
                size: 'Small',
                color: 'Accent',
                spacing: 'Medium',
                isSubtle: true,
              },
            ],
          },
        },
      ],
    };

    const response = await fetch(this.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Teams notification failed: ${response.status} ${error}`);
    }
  }

  private getColorForPriority(priority?: string): string {
    // Adaptive Card color values
    switch (priority) {
      case 'high':
        return 'Attention'; // Red
      case 'low':
        return 'Accent'; // Blue
      default:
        return 'Good'; // Green
    }
  }
}
