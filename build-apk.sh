#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# STARWORLD – ONE-CLICK APK BUILD SCRIPT
# ═══════════════════════════════════════════════════════════════
# Usage: ./build-apk.sh [debug|release]
# Example: ./build-apk.sh debug
# ═══════════════════════════════════════════════════════════════

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BUILD_TYPE="${1:-debug}"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ANDROID_DIR="$PROJECT_DIR/android"
APK_OUTPUT_DEBUG="$ANDROID_DIR/app/build/outputs/apk/debug/app-debug.apk"
APK_OUTPUT_RELEASE="$ANDROID_DIR/app/build/outputs/apk/release/app-release.apk"

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  STARWORLD – ONE-CLICK APK BUILD${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Step 1: Verify prerequisites
echo -e "${YELLOW}[1/5] Checking prerequisites...${NC}"
if ! command -v node &> /dev/null; then
  echo -e "${RED}✗ Node.js not found. Please install Node.js 18+${NC}"
  exit 1
fi

if ! command -v pnpm &> /dev/null; then
  echo -e "${RED}✗ pnpm not found. Installing...${NC}"
  npm install -g pnpm
fi

if [ ! -d "$ANDROID_DIR" ]; then
  echo -e "${RED}✗ Android directory not found. Run: pnpm exec cap add android${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Prerequisites OK${NC}"
echo ""

# Step 2: Install dependencies
echo -e "${YELLOW}[2/5] Installing dependencies...${NC}"
cd "$PROJECT_DIR"
pnpm install --frozen-lockfile
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 3: Build web app
echo -e "${YELLOW}[3/5] Building web app...${NC}"
pnpm build
echo -e "${GREEN}✓ Web app built${NC}"
echo ""

# Step 4: Sync to Capacitor
echo -e "${YELLOW}[4/5] Syncing to Capacitor...${NC}"
pnpm exec cap sync android
echo -e "${GREEN}✓ Capacitor synced${NC}"
echo ""

# Step 5: Build APK
echo -e "${YELLOW}[5/5] Building APK ($BUILD_TYPE)...${NC}"
cd "$ANDROID_DIR"

if [ "$BUILD_TYPE" = "release" ]; then
  echo -e "${BLUE}Building RELEASE APK...${NC}"
  ./gradlew assembleRelease
  APK_OUTPUT="$APK_OUTPUT_RELEASE"
else
  echo -e "${BLUE}Building DEBUG APK...${NC}"
  ./gradlew assembleDebug
  APK_OUTPUT="$APK_OUTPUT_DEBUG"
fi

echo -e "${GREEN}✓ APK built successfully${NC}"
echo ""

# Verify APK exists
if [ -f "$APK_OUTPUT" ]; then
  APK_SIZE=$(du -h "$APK_OUTPUT" | cut -f1)
  echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
  echo -e "${GREEN}  ✓ APK READY!${NC}"
  echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
  echo -e "${GREEN}Location: $APK_OUTPUT${NC}"
  echo -e "${GREEN}Size: $APK_SIZE${NC}"
  echo ""
  echo -e "${BLUE}Next steps:${NC}"
  echo -e "  1. Connect your Android device via USB"
  echo -e "  2. Enable USB Debugging on your device"
  echo -e "  3. Run: adb install \"$APK_OUTPUT\""
  echo -e "  4. Or drag & drop the APK to Android Studio"
  echo ""
else
  echo -e "${RED}✗ APK build failed. Check error messages above.${NC}"
  exit 1
fi
