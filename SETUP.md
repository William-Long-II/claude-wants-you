# Setup Guide for Claude Notify MCP

This guide will walk you through setting up the Claude Notify MCP server step by step.

## Quick Start (Desktop Notifications Only)

The simplest setup uses only desktop notifications and requires no configuration:

1. Add to your Claude Code config (`.claude/claude_code_config.json`):

```json
{
  "mcpServers": {
    "claude-notify": {
      "command": "npx",
      "args": ["-y", "claude-notify-mcp"]
    }
  }
}
```

2. Restart Claude Code

That's it! Claude can now send you desktop notifications.

## Full Setup (All Notification Types)

### Step 1: Choose Your Notification Methods

You can enable any combination of:
- Desktop notifications (default, no setup needed)
- SMS via Twilio
- Slack
- Microsoft Teams

### Step 2: Get Your Credentials

#### For Slack:

1. Go to https://api.slack.com/apps
2. Click "Create New App" → "From scratch"
3. Name your app (e.g., "Claude Notifications") and select your workspace
4. In the left sidebar, click "Incoming Webhooks"
5. Toggle "Activate Incoming Webhooks" to On
6. Click "Add New Webhook to Workspace"
7. Select the channel where notifications should go
8. Copy the webhook URL (starts with `https://hooks.slack.com/services/...`)

#### For Microsoft Teams:

**Note:** Microsoft is retiring Office 365 Connectors. Use the new Workflows method instead:

1. Open the Teams channel where you want notifications
2. Click the three dots (...) next to the channel name
3. Select "Workflows" (or "Manage workflows")
4. Click "Create" → "Post to a channel when a webhook request is received"
5. Select the team and channel
6. Give it a name (e.g., "Claude Notifications")
7. Copy the webhook URL that's generated
8. Click "Done"

The webhook URL will look like: `https://prod-XX.XX.logic.azure.com:443/workflows/...`

**Alternative (if Workflows not available):**
1. Go to Power Automate (https://make.powerautomate.com)
2. Create a new flow: "When a HTTP request is received"
3. Add action: "Post message in a chat or channel"
4. Configure the channel and message format
5. Save and copy the HTTP POST URL

#### For SMS (Twilio):

1. Sign up at https://www.twilio.com/try-twilio
2. After signing up, go to the Console Dashboard
3. Find your **Account SID** and **Auth Token**
4. Get a phone number:
   - Go to Phone Numbers → Manage → Buy a number
   - Or use the free trial number provided
5. Note:
   - `TWILIO_FROM_NUMBER`: Your Twilio phone number (format: +1234567890)
   - `TWILIO_TO_NUMBER`: Your personal phone number (format: +1234567890)

### Step 3: Configure Claude Code

Edit your `.claude/claude_code_config.json`:

```json
{
  "mcpServers": {
    "claude-notify": {
      "command": "npx",
      "args": ["-y", "claude-notify-mcp"],
      "env": {
        "SLACK_WEBHOOK_URL": "https://hooks.slack.com/services/YOUR/WEBHOOK/URL",
        "TEAMS_WEBHOOK_URL": "https://your-org.webhook.office.com/webhookb2/YOUR/WEBHOOK/URL",
        "TWILIO_ACCOUNT_SID": "your_account_sid_here",
        "TWILIO_AUTH_TOKEN": "your_auth_token_here",
        "TWILIO_FROM_NUMBER": "+1234567890",
        "TWILIO_TO_NUMBER": "+1234567890"
      }
    }
  }
}
```

**Important:** Only include the environment variables for services you want to use. You can mix and match any combination.

### Step 4: Test It

1. Restart Claude Code
2. In a conversation with Claude, try:
   - "List your available notification providers"
   - "Send me a test notification"

You should see which providers are configured and receive a test notification.

## Alternative: Using .env File

If you're running the server locally (not via npx), you can create a `.env` file:

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` with your credentials:
```bash
# Slack
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# Microsoft Teams
TEAMS_WEBHOOK_URL=https://your-org.webhook.office.com/webhookb2/YOUR/WEBHOOK/URL

# SMS via Twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_FROM_NUMBER=+1234567890
TWILIO_TO_NUMBER=+1234567890
```

3. Update your Claude Code config to use the local version:
```json
{
  "mcpServers": {
    "claude-notify": {
      "command": "node",
      "args": ["d:/Projects/claude_wants_you/dist/index.js"]
    }
  }
}
```

## Troubleshooting

### "No providers configured"

This means the server started but couldn't find any configuration. Check that:
1. Your environment variables are set correctly in the config file
2. The variable names match exactly (case-sensitive)
3. You've restarted Claude Code after changing the config

### Desktop notifications not showing

- **Windows**: Check Settings → System → Notifications → Make sure they're enabled
- **macOS**: Check System Preferences → Notifications → Allow notifications
- **Linux**: Install `libnotify-bin` if not already installed

### Slack webhook fails

Test your webhook manually:
```bash
curl -X POST -H 'Content-Type: application/json' \
  -d '{"text":"Test from curl"}' \
  YOUR_SLACK_WEBHOOK_URL
```

If this fails, your webhook URL might be invalid or expired.

### Teams webhook fails

Test your webhook manually:
```bash
curl -X POST -H 'Content-Type: application/json' \
  -d '{"text":"Test from curl"}' \
  YOUR_TEAMS_WEBHOOK_URL
```

### SMS not sending

Common issues:
1. Phone numbers must be in E.164 format: `+12345678901`
2. Twilio trial accounts can only send to verified numbers
3. Check your Twilio account has credit
4. Verify Account SID and Auth Token are correct

### Server not starting

Check the Claude Code logs for error messages. Common issues:
- Missing dependencies: Run `npm install` in the project directory
- TypeScript not compiled: Run `npm run build`
- Wrong Node version: Requires Node 18 or higher

## Usage Examples

Once configured, you can ask Claude:

- "Notify me when you finish analyzing this codebase"
- "Send me a notification when you need my input"
- "Alert me on Slack when the tests complete"
- "Let me know when you're done with a high priority notification"

Claude will use the `send_notification` tool to alert you across all configured channels.

## Publishing to npm

If you want to publish this as your own package:

1. Update `package.json` with your package name
2. Run `npm login`
3. Run `npm publish`

Then others can use it via `npx your-package-name`.

## Security Notes

- Never commit your `.env` file or credentials to version control
- Webhook URLs are sensitive - treat them like passwords
- Consider using a secrets manager for production deployments
- Twilio Auth Tokens should be kept secure and rotated regularly
