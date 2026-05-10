import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.starworld.app',
  appName: 'StarWorld',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true, // Allow cleartext for development; disable in production
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
};

export default config;
