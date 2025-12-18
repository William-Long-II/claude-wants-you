import { NotificationProvider, NotificationMessage, NotificationConfig } from './types.js';
import { DesktopNotificationProvider } from './providers/desktop.js';
import { SMSNotificationProvider } from './providers/sms.js';
import { SlackNotificationProvider } from './providers/slack.js';
import { TeamsNotificationProvider } from './providers/teams.js';

export class NotificationManager {
  private providers: NotificationProvider[] = [];

  constructor(config: NotificationConfig) {
    this.initializeProviders(config);
  }

  private initializeProviders(config: NotificationConfig): void {
    if (config.desktop) {
      this.providers.push(new DesktopNotificationProvider());
    }

    if (config.sms) {
      this.providers.push(new SMSNotificationProvider(config.sms));
    }

    if (config.slack) {
      this.providers.push(new SlackNotificationProvider(config.slack));
    }

    if (config.teams) {
      this.providers.push(new TeamsNotificationProvider(config.teams));
    }
  }

  async sendNotification(message: NotificationMessage): Promise<void> {
    if (this.providers.length === 0) {
      console.warn('No notification providers configured');
      return;
    }

    const results = await Promise.allSettled(
      this.providers.map(async (provider) => {
        try {
          await provider.send(message);
          console.log(`✓ Notification sent via ${provider.name}`);
        } catch (error) {
          console.error(`✗ ${provider.name} failed:`, error instanceof Error ? error.message : error);
          throw error;
        }
      })
    );

    const failures = results.filter((r) => r.status === 'rejected');
    if (failures.length === results.length) {
      throw new Error('All notification providers failed');
    }
  }

  getProviderNames(): string[] {
    return this.providers.map((p) => p.name);
  }
}
