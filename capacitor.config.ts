import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.momo.ai',
  appName: 'Nova',
  webDir: 'public',
  server: {
    androidScheme: 'https',
    // REPLACE with your production URL after deploying (e.g. https://your-app.vercel.app)
    // For local testing on phone, use your computer's IP: http://192.168.1.101:3000
    url: 'http://192.168.1.101:3000',
    cleartext: true
  }
};

export default config;
