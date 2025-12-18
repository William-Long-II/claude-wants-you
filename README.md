# Claude Wants You MCP

<p align="center">
  <img src="hero.jpg" alt="Claude Wants You Hero" />
</p>

An MCP (Model Context Protocol) server that enables Claude to send notifications when it needs your attention. Perfect for long-running tasks where you want to be notified when Claude is waiting for input or has completed work.

## Features

- **Desktop Notifications**: Native OS notifications on Windows, macOS, and Linux
- **SMS**: Send text messages via Twilio
- **Slack**: Post notifications to Slack channels via webhooks
- **Microsoft Teams**: Send notifications to Teams channels via Workflows (updated for new Teams platform)
- **Multi-provider**: Configure multiple notification methods simultaneously

> **Note for Teams Users**: Microsoft is retiring Office 365 Connectors. This package now uses the new Teams Workflows with Adaptive Cards. See [TEAMS_MIGRATION.md](TEAMS_MIGRATION.md) if you're upgrading from the old connector method.

## Installation

You can run this MCP server using npx without installation:

```bash
npx claude-wants-you
```

Or install globally:

```bash
npm install -g claude-wants-you
```

## Configuration

Create a `.env` file in your working directory or set environment variables:

```bash
# Desktop notifications are enabled by default (no config needed)

# SMS via Twilio (optional)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_FROM_NUMBER=+1234567890
TWILIO_TO_NUMBER=+1234567890

# Slack (optional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# Microsoft Teams (optional - using Workflows)
TEAMS_WEBHOOK_URL=https://prod-XX.XX.logic.azure.com:443/workflows/YOUR/WORKFLOW/URL
```

### Setting Up Webhooks

**Slack:**
1. Go to your Slack workspace settings
2. Navigate to "Apps" and search for "Incoming Webhooks"
3. Click "Add to Slack" and select a channel
4. Copy the webhook URL

**Microsoft Teams:**
**Note:** Microsoft is retiring Office 365 Connectors. Use Workflows instead:
1. In your Teams channel, click the three dots (...) and select "Workflows"
2. Click "Create" → "Post to a channel when a webhook request is received"
3. Select the team and channel, give it a name
4. Copy the generated webhook URL (starts with `https://prod-XX.XX.logic.azure.com:443/workflows/...`)
5. Alternatively, create a flow in Power Automate (https://make.powerautomate.com) with "When a HTTP request is received" trigger

**Twilio SMS:**
1. Sign up for a Twilio account at https://www.twilio.com
2. Get your Account SID and Auth Token from the console
3. Get a phone number from Twilio (or use your existing one)

## MCP Configuration

Add this server to your Claude Code (or other MCP client) configuration:

**For Claude Code (`.claude/claude_code_config.json`):**

```json
{
  "mcpServers": {
    "claude-wants-you": {
      "command": "npx",
      "args": ["-y", "claude-wants-you"],
      "env": {
        "SLACK_WEBHOOK_URL": "https://hooks.slack.com/services/YOUR/WEBHOOK/URL",
        "TEAMS_WEBHOOK_URL": "https://your-org.webhook.office.com/webhookb2/YOUR/WEBHOOK/URL",
        "TWILIO_ACCOUNT_SID": "your_account_sid",
        "TWILIO_AUTH_TOKEN": "your_auth_token",
        "TWILIO_FROM_NUMBER": "+1234567890",
        "TWILIO_TO_NUMBER": "+1234567890"
      }
    }
  }
}
```

Alternatively, if you have a `.env` file in your project:

```json
{
  "mcpServers": {
    "claude-wants-you": {
      "command": "npx",
      "args": ["-y", "claude-wants-you"]
    }
  }
}
```

## Usage

Once configured, Claude can use the notification tools:

### Available Tools

**send_notification**
- Sends a notification across all configured channels
- Parameters:
  - `title` (required): The notification title
  - `message` (required): The detailed notification message
  - `priority` (optional): "low", "normal", or "high" (default: "normal")

**list_providers**
- Lists all configured notification providers

### Example Prompts

"Notify me when you're done analyzing this codebase"

"Send me a notification when you need my input"

"Let me know via Slack when the tests finish"

## How It Works

1. Claude detects when it needs user input or completes a task
2. Claude calls the `send_notification` tool
3. The MCP server sends notifications through all configured providers
4. You receive notifications on your chosen platforms

## Troubleshooting

### No notifications received

1. Check that the server is running: Look for "Claude Notify MCP Server running" in logs
2. Verify your configuration: Use the `list_providers` tool to see what's configured
3. Check environment variables are set correctly
4. For desktop notifications, ensure your OS allows notifications

### Provider-specific issues

**Desktop notifications not showing:**
- On macOS: Check System Preferences → Notifications
- On Windows: Check Settings → System → Notifications
- On Linux: Ensure `libnotify` is installed

**Slack/Teams not working:**
- Verify webhook URLs are correct and active
- Test webhook URLs with curl:
  ```bash
  curl -X POST -H 'Content-Type: application/json' \
    -d '{"text":"Test"}' YOUR_WEBHOOK_URL
  ```

**SMS not working:**
- Verify Twilio credentials
- Check phone numbers are in E.164 format (+1234567890)
- Ensure your Twilio account has sufficient credit

## Development

To modify or extend the server:

```bash
# Clone the repository
git clone https://github.com/William-Long-II/claude-wants-you.git
cd claude-wants-you

# Install dependencies
npm install

# Build
npm run build

# Run in development mode
npm run dev
```

## Adding New Providers

To add a new notification provider:

1. Create a new file in `src/providers/`
2. Implement the `NotificationProvider` interface
3. Add configuration to `src/types.ts` and `src/config.ts`
4. Register the provider in `src/notifier.ts`

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
