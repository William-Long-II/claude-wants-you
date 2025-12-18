# Quick Start Guide

Get Claude Wants You running in 5 minutes.

## Option 1: Desktop Notifications Only (Easiest)

1. Edit `.claude/claude_code_config.json`:
```json
{
  "mcpServers": {
    "claude-notify": {
      "command": "npx",
      "args": ["-y", "claude-wants-you"]
    }
  }
}
```

2. Restart Claude Code

3. Done! Try: "Send me a test notification"

## Option 2: With Slack

1. Get Slack webhook:
   - Go to https://api.slack.com/apps
   - Create app → Incoming Webhooks → Copy URL

2. Edit `.claude/claude_code_config.json`:
```json
{
  "mcpServers": {
    "claude-notify": {
      "command": "npx",
      "args": ["-y", "claude-wants-you"],
      "env": {
        "SLACK_WEBHOOK_URL": "YOUR_WEBHOOK_URL_HERE"
      }
    }
  }
}
```

3. Restart Claude Code

## Option 3: With Teams

1. Get Teams webhook (new Workflows method):
   - In Teams channel → (...) → Workflows
   - Create → "Post to a channel when a webhook request is received"
   - Copy the generated webhook URL

2. Edit `.claude/claude_code_config.json`:
```json
{
  "mcpServers": {
    "claude-notify": {
      "command": "npx",
      "args": ["-y", "claude-wants-you"],
      "env": {
        "TEAMS_WEBHOOK_URL": "YOUR_WEBHOOK_URL_HERE"
      }
    }
  }
}
```

3. Restart Claude Code

## Option 4: With SMS (Twilio)

1. Get Twilio credentials:
   - Sign up at https://www.twilio.com
   - Get Account SID, Auth Token, and phone numbers

2. Edit `.claude/claude_code_config.json`:
```json
{
  "mcpServers": {
    "claude-notify": {
      "command": "npx",
      "args": ["-y", "claude-wants-you"],
      "env": {
        "TWILIO_ACCOUNT_SID": "your_account_sid",
        "TWILIO_AUTH_TOKEN": "your_auth_token",
        "TWILIO_FROM_NUMBER": "+1234567890",
        "TWILIO_TO_NUMBER": "+1234567890"
      }
    }
  }
}
```

3. Restart Claude Code

## All Together

Want everything? Combine the env variables:

```json
{
  "mcpServers": {
    "claude-notify": {
      "command": "npx",
      "args": ["-y", "claude-wants-you"],
      "env": {
        "SLACK_WEBHOOK_URL": "your_slack_webhook",
        "TEAMS_WEBHOOK_URL": "your_teams_webhook",
        "TWILIO_ACCOUNT_SID": "your_twilio_sid",
        "TWILIO_AUTH_TOKEN": "your_twilio_token",
        "TWILIO_FROM_NUMBER": "+1234567890",
        "TWILIO_TO_NUMBER": "+1234567890"
      }
    }
  }
}
```

## Usage

Once configured, tell Claude things like:

- "Notify me when you're done"
- "Send me a notification when you need input"
- "Alert me when the tests complete"
- "Let me know on Slack when finished"

## Verify Setup

Ask Claude: "List your notification providers"

You should see which channels are active.

## Troubleshooting

**Nothing works?**
- Did you restart Claude Code?
- Check the config file is valid JSON
- Look for typos in webhook URLs

**Desktop notifications not showing?**
- Check OS notification settings
- Try: "Send me a test notification"

**Need help?**
- See [SETUP.md](SETUP.md) for detailed setup
- See [README.md](README.md) for full documentation

## File Locations

- **Windows**: `%USERPROFILE%\.claude\claude_code_config.json`
- **Mac/Linux**: `~/.claude/claude_code_config.json`

## Next Steps

- Read [README.md](README.md) for complete documentation
- See [SETUP.md](SETUP.md) for detailed provider setup
- Check [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for architecture details
