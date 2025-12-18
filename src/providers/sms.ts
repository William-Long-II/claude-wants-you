import { NotificationProvider, NotificationMessage, NotificationConfig } from '../types.js';

export class SMSNotificationProvider implements NotificationProvider {
  name = 'SMS';
  private config: NonNullable<NotificationConfig['sms']>;

  constructor(config: NonNullable<NotificationConfig['sms']>) {
    this.config = config;
  }

  async send(message: NotificationMessage): Promise<void> {
    const { accountSid, authToken, fromNumber, toNumber } = this.config;

    const body = `${message.title}\n\n${message.message}`;

    const authHeader = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

    const params = new URLSearchParams({
      To: toNumber,
      From: fromNumber,
      Body: body,
    });

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`SMS notification failed: ${response.status} ${error}`);
    }
  }
}
