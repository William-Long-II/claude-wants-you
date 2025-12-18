# Contributing to Claude Wants You

Thank you for your interest in contributing! This document provides guidelines and information for contributors.

## Getting Started

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/yourusername/claude-wants-you.git
   cd claude-wants-you
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Build the project**:
   ```bash
   npm run build
   ```

## Development Workflow

### Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes in the `src/` directory

3. Build and test:
   ```bash
   npm run build
   ```

4. Test your changes:
   ```bash
   node dist/index.js
   ```

### Code Style

- Use TypeScript for all new code
- Follow existing code structure and naming conventions
- Add types for all functions and interfaces
- Use async/await for asynchronous operations
- Handle errors appropriately

### Adding a New Notification Provider

To add support for a new notification service:

1. **Create provider file** in `src/providers/`:
   ```typescript
   // src/providers/yourservice.ts
   import { NotificationProvider, NotificationMessage, NotificationConfig } from '../types.js';

   export class YourServiceProvider implements NotificationProvider {
     name = 'Your Service';
     private config: NonNullable<NotificationConfig['yourService']>;

     constructor(config: NonNullable<NotificationConfig['yourService']>) {
       this.config = config;
     }

     async send(message: NotificationMessage): Promise<void> {
       // Your implementation here
       // Make sure to throw errors if the send fails
     }
   }
   ```

2. **Update types** in `src/types.ts`:
   ```typescript
   export interface NotificationConfig {
     // ... existing providers
     yourService?: {
       apiKey: string;
       // other config fields
     };
   }
   ```

3. **Update config loader** in `src/config.ts`:
   ```typescript
   // Add in loadConfig() function
   if (process.env.YOUR_SERVICE_API_KEY) {
     config.yourService = {
       apiKey: process.env.YOUR_SERVICE_API_KEY,
     };
   }
   ```

4. **Register provider** in `src/notifier.ts`:
   ```typescript
   import { YourServiceProvider } from './providers/yourservice.js';

   // Add in initializeProviders()
   if (config.yourService) {
     this.providers.push(new YourServiceProvider(config.yourService));
   }
   ```

5. **Update documentation**:
   - Add setup instructions to `README.md`
   - Add configuration to `.env.example`
   - Update `SETUP.md` with credentials guide

6. **Test your provider**:
   - Test successful notifications
   - Test error handling
   - Test with invalid credentials

### Testing

Currently, testing is manual. To test your changes:

1. **Configure your new provider** in a `.env` file or environment variables

2. **Run the server**:
   ```bash
   node dist/index.js
   ```

3. **Test via MCP protocol** by configuring in Claude Code

4. **Verify**:
   - Notifications are received
   - Errors are handled gracefully
   - Logs are clear and helpful

Future: We'd welcome contributions for automated testing!

## Submitting Changes

### Pull Request Process

1. **Update documentation** if needed:
   - README.md for user-facing changes
   - SETUP.md for new configuration
   - PROJECT_SUMMARY.md for architectural changes

2. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Add: Brief description of your changes"
   ```

   Use conventional commit prefixes:
   - `Add:` for new features
   - `Fix:` for bug fixes
   - `Update:` for improvements
   - `Docs:` for documentation changes
   - `Refactor:` for code restructuring

3. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request**:
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Provide a clear description of your changes
   - Link any related issues

### Pull Request Guidelines

- **One feature per PR**: Keep PRs focused on a single feature or fix
- **Clear description**: Explain what changes you made and why
- **Test your code**: Ensure everything works before submitting
- **Update docs**: Include documentation updates in the same PR

## Ideas for Contributions

### New Features
- Additional notification providers (Email, Discord, Telegram, etc.)
- Configuration validation and helpful error messages
- Notification templates/presets
- Quiet hours feature
- Notification history/logging
- Web UI for configuration
- Automated tests
- CI/CD pipeline

### Improvements
- Better error messages
- Performance optimizations
- More flexible configuration options
- Message formatting options
- Retry logic for failed notifications
- Rate limiting

### Documentation
- Video tutorials
- More examples
- Troubleshooting guides
- API documentation
- Architecture diagrams

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn

## Questions?

If you have questions about contributing:
1. Check existing issues and discussions
2. Open a new issue with the "question" label
3. Be as specific as possible

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
