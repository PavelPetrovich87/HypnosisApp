# Detox E2E Testing - Quick Reference

## 🚀 Common Commands

### Initial Setup (One-time)
```bash
# Install dependencies
npm install -g detox-cli eas-cli
npm install --save-dev detox jest @types/jest expo-dev-client

# Generate native directories
npx expo prebuild --clean
```

### Daily Development Workflow

#### 1. Start Development Server
```bash
npx expo start --clear
```

#### 2. Run Tests
```bash
# Build app (first time or after code changes)
npm run test:e2e:build:ios

# Run tests
npm run test:e2e:test:ios

# Or combined
npm run test:e2e:build:ios && npm run test:e2e:test:ios
```

## 🔧 Available Scripts

```bash
npm run test:e2e:build:ios      # Build iOS app for testing
npm run test:e2e:test:ios       # Run iOS E2E tests
npm run test:e2e:build:android  # Build Android app for testing  
npm run test:e2e:test:android   # Run Android E2E tests
npm run test:e2e                # Quick iOS test (alias)
```

## 🐛 Debug Commands

```bash
# Verbose logging
npx detox test -c ios.sim.debug --loglevel verbose

# Run single test
npx detox test -c ios.sim.debug --testNamePattern="test name"

# List available devices
xcrun simctl list devices

# Check if Expo server is running
lsof -i :8081

# View app logs in simulator
xcrun simctl spawn DEVICE_ID log stream --level debug --predicate 'process == "HypnosisApp"'
```

## 📱 Test File Template

```javascript
describe('YourApp', () => {
  beforeAll(async () => {
    await device.launchApp();
    await new Promise(resolve => setTimeout(resolve, 5000));
  });

  it('should interact with elements', async () => {
    // Basic element interactions
    await expect(element(by.text('Button Text'))).toBeVisible();
    await element(by.text('Button Text')).tap();
    await element(by.id('input')).typeText('Hello');
  });
});
```

## 🎯 Key Selectors

```javascript
// By text content
element(by.text('Button Title'))

// By testID (recommended)
element(by.id('submit-button'))

// By accessibility label  
element(by.label('Submit Form'))

// Waiting for elements
await waitFor(element(by.text('Loading...'))).toBeVisible().withTimeout(10000);
```

## ⚡ Quick Fixes

- **Build issues**: `npx expo prebuild --clean`
- **Connection issues**: Restart Expo server with `npx expo start --clear`
- **Simulator issues**: Reset iOS Simulator (Device → Erase All Content and Settings)
- **Port conflicts**: Kill processes on port 8081: `lsof -ti:8081 | xargs kill`

## 📂 Key Files

- `.detoxrc.js` - Detox configuration
- `e2e/jest.config.js` - Jest test configuration  
- `e2e/*.test.js` - Your test files
- `app.json` - Expo config (includes expo-dev-client)
- `package.json` - Scripts and dependencies

## 🎉 Success Indicators

✅ Tests pass consistently  
✅ iOS simulator launches automatically  
✅ Can tap buttons and verify UI elements  
✅ Build completes in ~3-5 minutes  
✅ Tests run in ~30-60 seconds  

---

For complete setup instructions, see `README-DETOX-SETUP.md`
