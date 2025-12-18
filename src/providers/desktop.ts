import notifier from 'node-notifier';
import { NotificationProvider, NotificationMessage } from '../types.js';

export class DesktopNotificationProvider implements NotificationProvider {
  name = 'Desktop';

  async send(message: NotificationMessage): Promise<void> {
    return new Promise((resolve, reject) => {
      notifier.notify(
        {
          title: message.title,
          message: message.message,
          sound: true,
          wait: false,
        },
        (err) => {
          if (err) {
            reject(new Error(`Desktop notification failed: ${err.message}`));
          } else {
            resolve();
          }
        }
      );
    });
  }
}
