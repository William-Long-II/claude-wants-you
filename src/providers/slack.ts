import { NotificationProvider, NotificationMessage, NotificationConfig } from '../types.js';

export class SlackNotificationProvider implements NotificationProvider {
  name = 'Slack';
  private webhookUrl: string;

  constructor(config: NonNullable<NotificationConfig['slack']>) {
    this.webhookUrl = config.webhookUrl;
  }

  async send(message: NotificationMessage): Promise<void> {
    const payload = {
      text: message.title,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: message.title,
            emoji: true,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: message.message,
          },
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `Priority: ${message.priority || 'normal'} | ${new Date().toLocaleString()}`,
            },
          ],
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
      throw new Error(`Slack notification failed: ${response.status} ${error}`);
    }
  }
}
