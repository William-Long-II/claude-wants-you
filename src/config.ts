import { config as dotenvConfig } from 'dotenv';
import { NotificationConfig } from './types.js';

dotenvConfig();

export function loadConfig(): NotificationConfig {
  const config: NotificationConfig = {};

  // Desktop notifications are enabled by default
  config.desktop = true;

  // SMS Configuration (Twilio)
  if (
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_FROM_NUMBER &&
    process.env.TWILIO_TO_NUMBER
  ) {
    config.sms = {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      fromNumber: process.env.TWILIO_FROM_NUMBER,
      toNumber: process.env.TWILIO_TO_NUMBER,
    };
  }

  // Slack Configuration
  if (process.env.SLACK_WEBHOOK_URL) {
    config.slack = {
      webhookUrl: process.env.SLACK_WEBHOOK_URL,
    };
  }

  // Microsoft Teams Configuration
  if (process.env.TEAMS_WEBHOOK_URL) {
    config.teams = {
      webhookUrl: process.env.TEAMS_WEBHOOK_URL,
    };
  }

  return config;
}
