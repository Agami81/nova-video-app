import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.momo.ai',
  appName: 'Nova',
  webDir: 'public',
  server: {
    // Production URL (Vercel)
    url: 'https://nova-video-app.vercel.app',
    cleartext: true
  }
};

export default config;
