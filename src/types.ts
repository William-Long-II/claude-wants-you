export interface NotificationConfig {
  desktop?: boolean;
  sms?: {
    accountSid: string;
    authToken: string;
    fromNumber: string;
    toNumber: string;
  };
  slack?: {
    webhookUrl: string;
  };
  teams?: {
    webhookUrl: string;
  };
}

export interface NotificationMessage {
  title: string;
  message: string;
  priority?: 'low' | 'normal' | 'high';
}

export interface NotificationProvider {
  name: string;
  send(message: NotificationMessage): Promise<void>;
}
