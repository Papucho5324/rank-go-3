import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'ShowTalentos',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,  
      launchAutoHide: true,
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      backgroundColor: '#FFFFFF'
    },

  }
};

export default config;
