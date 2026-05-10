# StarWorld APK – Quick Start (5 Minutes)

## TL;DR – Get the APK Running

### On Your Local Machine (macOS/Linux/Windows)

1. **Install prerequisites:**
   ```bash
   # Install Android Studio from https://developer.android.com/studio
   # Set ANDROID_HOME environment variable
   ```

2. **Clone the project:**
   ```bash
   cd starworld-app
   pnpm install
   ```

3. **Build and sync:**
   ```bash
   pnpm build
   pnpm exec cap sync android
   ```

4. **Open in Android Studio:**
   ```bash
   pnpm exec cap open android
   ```

5. **Build APK:**
   - Click **Build** → **Build APK(s)** in Android Studio
   - Or run: `cd android && ./gradlew assembleDebug`

6. **Install on device:**
   - Connect your Android phone
   - Click **Run** (green play icon) in Android Studio
   - Select your device and click OK

7. **Test the app:**
   - Open StarWorld
   - Sign in with Manus OAuth
   - Explore Live Rooms, Chat, and AI Dream features

---

## What's Included

✅ **Real-time Chat** – Send messages in live rooms  
✅ **Live Rooms** – Browse and join streaming spaces  
✅ **AI Dream Events** – Personalized notifications  
✅ **Digital Relationships** – Couple rings and marriage  
✅ **Night Mode** – Animated stars and moonlight  
✅ **Superstar Streamer Mode** – Fan clubs and voice battles  
✅ **User Authentication** – Manus OAuth integration  

---

## Detailed Guide

See **CAPACITOR_BUILD_GUIDE.md** for step-by-step instructions with troubleshooting.

---

## Files to Know

- `capacitor.config.ts` – Capacitor configuration
- `android/` – Native Android project (generated)
- `server/routers.ts` – Backend API endpoints
- `drizzle/schema.ts` – Database tables
- `client/src/pages/` – Frontend pages

---

## Backend Features

All backend APIs are live and ready:

```typescript
// Get live rooms
trpc.rooms.list.useQuery()

// Send chat message
trpc.chat.sendMessage.useMutation()

// Get AI Dream events
trpc.aiDream.getEvents.useQuery()

// Join/leave rooms
trpc.rooms.join.useMutation()
trpc.rooms.leave.useMutation()
```

---

## Need Help?

1. **Android SDK not found?** → Set `ANDROID_HOME` environment variable
2. **Gradle build failed?** → Run `cd android && ./gradlew clean`
3. **App crashes?** → Check Logcat in Android Studio (View → Tool Windows → Logcat)
4. **OAuth not working?** → Verify app ID matches Manus OAuth config

---

**Ready to build? Start with step 1 above! 🚀**
