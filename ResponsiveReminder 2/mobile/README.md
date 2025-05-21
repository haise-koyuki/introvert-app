# ReplyMinder Mobile App

A mobile version of the ReplyMinder application for Android and iOS devices.

## Features

- View pending message responses organized by priority
- Manage contacts with custom reminder times
- Customize priority levels and notification settings
- Cross-platform compatibility (iOS and Android)
- Integrates with multiple messaging platforms

## Prerequisites

- Node.js (v14 or newer)
- npm or yarn package manager
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- For iOS testing: macOS with Xcode
- For Android testing: Android Studio with an emulator

## Getting Started

1. Install dependencies:
   ```
   cd mobile
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

3. Run on a device or emulator:
   - Press `a` to run on Android emulator
   - Press `i` to run on iOS simulator (macOS only)
   - Scan the QR code with the Expo Go app on your physical device

## Project Structure

- `src/screens/`: Main screen components
- `src/components/`: Reusable UI components
- `src/lib/`: Utilities and API services
- `src/providers/`: Context providers for state management

## Building for Production

To create a production build for deployment to app stores:

1. Configure app.json with your app details
2. Build for the desired platform:
   ```
   expo build:android
   ```
   or
   ```
   expo build:ios
   ```

## Backend Integration

The mobile app connects to the same backend API as the web version. Make sure the backend server is running when testing the mobile app.

Default backend URLs:
- Android emulator: http://10.0.2.2:5000
- iOS simulator: http://localhost:5000
- Production: Configure in src/lib/api.ts