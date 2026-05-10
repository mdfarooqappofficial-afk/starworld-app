# StarWorld – Automated APK Build Scripts

This project includes automated build scripts that generate the APK with a single command. No manual steps required!

## Quick Start (Choose Your OS)

### macOS / Linux

```bash
chmod +x build-apk.sh
./build-apk.sh debug
```

### Windows

```bash
build-apk.bat debug
```

---

## What the Script Does (Automatically)

✅ Installs dependencies  
✅ Builds the web app  
✅ Syncs to Capacitor  
✅ Builds the APK  
✅ Shows you the APK location  

**Total time: 5-10 minutes** (first run) or **2-3 minutes** (subsequent runs)

---

## Build Types

### Debug APK (for testing)
```bash
./build-apk.sh debug
# or
./build-apk.sh
```
- Faster to build
- Larger file size
- Can be installed directly on device
- Good for development and testing

### Release APK (for distribution)
```bash
./build-apk.sh release
```
- Optimized and smaller
- Must be signed with keystore
- Ready for Google Play Store
- Production-ready

---

## After the APK is Built

### Install on Connected Device

```bash
adb install /path/to/app-debug.apk
```

Or in Android Studio:
1. Connect your Android device
2. Click the green **Run** button
3. Select your device

---

## Troubleshooting

### Script not found
**macOS/Linux:**
```bash
chmod +x build-apk.sh
./build-apk.sh debug
```

### "Android SDK not found"
Set the `ANDROID_HOME` environment variable:

**macOS/Linux:**
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

**Windows:**
```
ANDROID_HOME = C:\Users\YourUsername\AppData\Local\Android\Sdk
Add to PATH: %ANDROID_HOME%\emulator, %ANDROID_HOME%\tools, %ANDROID_HOME%\platform-tools
```

### Gradle build fails
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

### Out of memory error
The `gradle.properties` file is already configured with 4GB memory. If you still get errors, increase it:

Edit `gradle.properties`:
```
org.gradle.jvmargs=-Xmx8192m -XX:MaxPermSize=1024m
```

---

## Pre-Configured Settings

The `gradle.properties` file includes:
- ✅ Parallel build execution (faster)
- ✅ Build caching (incremental builds)
- ✅ Kotlin incremental compilation
- ✅ Android X support
- ✅ Optimized memory allocation (4GB)

**No manual Gradle configuration needed!**

---

## npm Scripts (Alternative)

You can also add these to `package.json` for npm-style commands:

```json
{
  "scripts": {
    "build:apk:debug": "./build-apk.sh debug",
    "build:apk:release": "./build-apk.sh release",
    "build:apk": "./build-apk.sh debug"
  }
}
```

Then run:
```bash
pnpm build:apk
```

---

## What Happens Step-by-Step

1. **Check prerequisites** — Verifies Node.js, pnpm, Android SDK
2. **Install dependencies** — `pnpm install`
3. **Build web app** — `pnpm build` (React + Tailwind compilation)
4. **Sync to Capacitor** — `pnpm exec cap sync android`
5. **Build APK** — `./gradlew assembleDebug` or `assembleRelease`
6. **Output location** — Shows where the APK is saved

---

## Performance Tips

- **First run:** 10-15 minutes (downloads dependencies)
- **Subsequent runs:** 2-3 minutes (uses cache)
- **Incremental builds:** 30-60 seconds (if only code changed)

To speed up builds:
1. Use debug builds for testing
2. Avoid clean builds unless necessary
3. Keep Android SDK updated
4. Use SSD for faster disk I/O

---

## Support

If you encounter issues:
1. Check the error message in the terminal
2. See Troubleshooting section above
3. Review `CAPACITOR_BUILD_GUIDE.md` for detailed setup
4. Check Android Studio Logcat for runtime errors

---

**Ready to build? Run the script and grab your APK! 🚀**
