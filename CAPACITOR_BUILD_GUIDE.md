# StarWorld – Capacitor Android APK Build Guide

This guide will help you build a native Android APK from the StarWorld web app using Capacitor.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

### 1. **Node.js & pnpm**
- Node.js 18+ (download from https://nodejs.org/)
- pnpm (install via: `npm install -g pnpm`)

### 2. **Java Development Kit (JDK)**
- JDK 17 or later (required for Android development)
- Download from: https://www.oracle.com/java/technologies/downloads/
- Or use: `brew install openjdk@17` (macOS) or `apt install openjdk-17-jdk` (Linux)

### 3. **Android Studio**
- Download from: https://developer.android.com/studio
- During installation, ensure you install:
  - Android SDK
  - Android SDK Platform (API 34+)
  - Android Virtual Device (AVD) for testing

### 4. **Environment Variables**
After installing Android Studio, set these environment variables:

**macOS/Linux:**
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
# or
export ANDROID_HOME=$HOME/Android/Sdk  # Linux

export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

**Windows:**
```
ANDROID_HOME = C:\Users\YourUsername\AppData\Local\Android\Sdk
Add to PATH: %ANDROID_HOME%\emulator, %ANDROID_HOME%\tools, %ANDROID_HOME%\platform-tools
```

## Step-by-Step Build Instructions

### Step 1: Clone/Download the Project

```bash
cd /path/to/starworld-app
```

### Step 2: Install Dependencies

```bash
pnpm install
```

### Step 3: Build the Web App

```bash
pnpm build
```

This generates the optimized web app in the `dist/` folder, which Capacitor will package into the APK.

### Step 4: Initialize Capacitor (First Time Only)

If Capacitor hasn't been initialized yet:

```bash
pnpm exec cap init
```

When prompted:
- **App name:** StarWorld
- **App ID:** com.starworld.app
- **Directory:** dist (this is already configured in capacitor.config.ts)

### Step 5: Add Android Platform

```bash
pnpm exec cap add android
```

This creates the `android/` directory with the native Android project.

### Step 6: Sync Web Assets to Android

Every time you make changes to the web app, sync them:

```bash
pnpm exec cap sync android
```

Or after building:

```bash
pnpm build && pnpm exec cap sync android
```

### Step 7: Open Android Studio

```bash
pnpm exec cap open android
```

This opens Android Studio with the native Android project ready to build.

### Step 8: Build the APK in Android Studio

**Option A: Using Android Studio GUI**
1. In Android Studio, go to **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Wait for the build to complete
3. You'll see a notification with the APK location (usually `android/app/build/outputs/apk/debug/app-debug.apk`)

**Option B: Using Command Line**

```bash
cd android
./gradlew assembleDebug
```

The APK will be generated at: `android/app/build/outputs/apk/debug/app-debug.apk`

### Step 9: Install APK on Device/Emulator

**Via Android Studio:**
1. Connect your Android device or start an emulator
2. Click the **Run** button (green play icon) in Android Studio
3. Select your device and click OK

**Via Command Line:**

```bash
cd android
./gradlew installDebug
```

Or manually:

```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### Step 10: Test the App

Once installed, open StarWorld on your device and test:
- ✅ Authentication (Manus OAuth login)
- ✅ Live Rooms display
- ✅ Real-time chat functionality
- ✅ AI Dream notifications
- ✅ Profile and relationships features
- ✅ Night Mode toggle

## Building a Release APK (Production)

For production distribution, build a signed release APK:

### Step 1: Create a Keystore

```bash
keytool -genkey -v -keystore starworld-release.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias starworld
```

### Step 2: Configure Signing in Android Studio

1. In Android Studio: **Build** → **Generate Signed Bundle / APK**
2. Select **APK**
3. Choose the keystore file you created
4. Enter the keystore password and key alias
5. Select **Release** build type
6. Click **Finish**

### Step 3: Upload to Google Play Store

Once you have a signed release APK, you can upload it to Google Play Store:
1. Create a Google Play Developer account (one-time $25 fee)
2. Create a new app listing
3. Upload the signed APK
4. Fill in store listing details
5. Submit for review

## Troubleshooting

### Issue: "Android SDK not found"
**Solution:** Ensure ANDROID_HOME environment variable is set correctly and Android SDK is installed.

### Issue: "Gradle build failed"
**Solution:** 
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

### Issue: "App crashes on startup"
**Solution:** Check the Logcat in Android Studio:
1. Open Android Studio
2. Go to **View** → **Tool Windows** → **Logcat**
3. Look for error messages and stack traces
4. Check that all environment variables are configured correctly

### Issue: "OAuth login not working"
**Solution:** 
- Ensure the app ID in `capacitor.config.ts` matches your Manus OAuth app configuration
- Check that the redirect URL is correctly configured in Manus OAuth settings
- Verify network connectivity on the device/emulator

## Backend Integration

The app includes a full-stack backend with:
- **Real-time chat** in live rooms
- **User authentication** via Manus OAuth
- **AI Dream events** and notifications
- **Relationship management** (couple rings, marriage)
- **Live room viewer tracking**

All backend APIs are accessible via tRPC procedures defined in `server/routers.ts`.

## Project Structure

```
starworld-app/
├── client/                  # React frontend
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable components
│   │   └── App.tsx         # Main app shell
│   └── index.html
├── server/                  # Express backend
│   ├── routers.ts          # tRPC procedures
│   ├── db.ts               # Database queries
│   └── _core/              # Core server setup
├── drizzle/                # Database schema
│   └── schema.ts           # Table definitions
├── android/                # Native Android project (generated by Capacitor)
├── capacitor.config.ts     # Capacitor configuration
├── package.json
└── vite.config.ts
```

## Next Steps

1. **Test locally** with the web version at: https://starworld-2pwhncej.manus.space
2. **Build the APK** following the steps above
3. **Test on Android device** to ensure all features work
4. **Iterate** on features and UI based on feedback
5. **Deploy to Google Play Store** when ready

## Support

For issues or questions:
- Check the [Capacitor documentation](https://capacitorjs.com/docs)
- Review [Android Studio documentation](https://developer.android.com/studio/intro)
- Check the project's GitHub issues (if applicable)

---

**Happy building! 🚀**
