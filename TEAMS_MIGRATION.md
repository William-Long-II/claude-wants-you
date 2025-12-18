# Microsoft Teams Migration Guide

## Why This Change?

Microsoft is retiring Office 365 Connectors (Incoming Webhooks) and replacing them with **Workflows** powered by Power Automate. This change affects how notifications are sent to Teams.

**Important Dates:**
- Microsoft announced the retirement of Office 365 Connectors
- Existing connectors will continue to work until Microsoft's end-of-life date
- All users should migrate to the new Workflows method

## What Changed in Claude Notify MCP

We've updated the Teams provider to use:
- **Adaptive Cards** instead of MessageCards
- **Teams Workflows** (Power Automate webhooks) instead of Office 365 Connectors
- Modern webhook URLs that start with `https://prod-XX.XX.logic.azure.com:443/workflows/...`

## Migration Steps

### Step 1: Create New Workflow Webhook

**Option A: Via Teams Workflows (Recommended)**

1. Open Microsoft Teams
2. Navigate to the channel where you want notifications
3. Click the three dots (...) next to the channel name
4. Select "Workflows" (or "Manage workflows")
5. Click "Create" or "Add workflow"
6. Search for and select "Post to a channel when a webhook request is received"
7. Follow the setup wizard:
   - Select your team
   - Select your channel
   - Give it a name (e.g., "Claude Notifications")
8. Copy the webhook URL that's generated
9. Click "Done"

**Option B: Via Power Automate (Advanced)**

1. Go to https://make.powerautomate.com
2. Create a new flow
3. Choose "When a HTTP request is received" as the trigger
4. In the flow designer:
   - Add action: "Post message in a chat or channel" (Teams connector)
   - Select "Flow bot" as who posts
   - Select your team and channel
   - Configure the message format using dynamic content from the HTTP request
5. Save the flow
6. Copy the "HTTP POST URL" from the trigger

### Step 2: Update Your Configuration

Replace your old webhook URL in your configuration:

**Old format (deprecated):**
```
https://your-org.webhook.office.com/webhookb2/...
```

**New format:**
```
https://prod-XX.XX.logic.azure.com:443/workflows/...
```

Update your `.claude/claude_code_config.json`:

```json
{
  "mcpServers": {
    "claude-notify": {
      "command": "npx",
      "args": ["-y", "claude-notify-mcp"],
      "env": {
        "TEAMS_WEBHOOK_URL": "https://prod-XX.XX.logic.azure.com:443/workflows/YOUR_NEW_URL"
      }
    }
  }
}
```

Or if using a `.env` file:

```bash
# Old (deprecated)
# TEAMS_WEBHOOK_URL=https://your-org.webhook.office.com/webhookb2/...

# New (recommended)
TEAMS_WEBHOOK_URL=https://prod-XX.XX.logic.azure.com:443/workflows/...
```

### Step 3: Test the New Webhook

1. Restart Claude Code
2. Ask Claude: "Send me a test notification"
3. Verify you receive the notification in Teams

The new notifications will appear as Adaptive Cards with:
- Bold title
- Message body
- Priority and timestamp footer
- Color coding based on priority level

### Step 4: Remove Old Connector (Optional)

Once the new webhook is working:

1. Go to your Teams channel
2. Click the three dots (...) → "Connectors" or "Manage connectors"
3. Find the old "Incoming Webhook" connector
4. Click "Remove" or "Delete"

## Comparison: Old vs New

### Old Method (MessageCard via Connectors)
```json
{
  "@type": "MessageCard",
  "@context": "https://schema.org/extensions",
  "summary": "Title",
  "themeColor": "00B294",
  "sections": [...]
}
```

### New Method (Adaptive Card via Workflows)
```json
{
  "type": "message",
  "attachments": [{
    "contentType": "application/vnd.microsoft.card.adaptive",
    "content": {
      "type": "AdaptiveCard",
      "version": "1.4",
      "body": [...]
    }
  }]
}
```

## Benefits of the New Method

1. **Future-proof**: Won't be deprecated
2. **More flexible**: Adaptive Cards support more features
3. **Better integration**: Works with Power Automate flows
4. **Enhanced formatting**: Richer card layouts and interactions
5. **Consistent**: Aligns with Microsoft's modern Teams platform

## Troubleshooting

### "Webhook not found" or 404 errors
- Verify the webhook URL is correct
- Ensure the workflow is enabled in Teams/Power Automate
- Check that you have permissions to the channel

### Notifications not appearing
- Confirm the workflow is active
- Check the workflow run history in Power Automate
- Verify the channel hasn't been deleted or renamed

### "Invalid request body" errors
- Update to the latest version of claude-notify-mcp
- The new version uses Adaptive Cards format
- Old MessageCard format won't work with new webhooks

### Still using old connector format?
If you're still using the old `webhook.office.com` URL:
- It may continue to work temporarily
- You should migrate as soon as possible
- Microsoft will eventually disable these webhooks

## Need Help?

- Check the [SETUP.md](SETUP.md) for detailed setup instructions
- See [README.md](README.md) for general documentation
- Open an issue on GitHub if you encounter problems

## Version Compatibility

- **v1.0.0+**: Supports both old and new webhook formats
- **Recommended**: Use the new Workflows method for all new setups
- **Legacy**: Old connectors will be phased out by Microsoft

## Additional Resources

- [Microsoft Teams Workflows Documentation](https://support.microsoft.com/en-us/office/workflows-in-microsoft-teams)
- [Power Automate Documentation](https://learn.microsoft.com/en-us/power-automate/)
- [Adaptive Cards Documentation](https://adaptivecards.io/)
- [Microsoft's Connector Retirement Announcement](https://devblogs.microsoft.com/microsoft365dev/)
