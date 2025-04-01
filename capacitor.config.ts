import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize, KeyboardStyle } from '@capacitor/keyboard';

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
    android: {
      fullscreen: false
    },
    Keyboard:{
      resize: KeyboardResize.Body,
      style:KeyboardStyle.Dark,
      resizeOnFullScreen: true,
    }

  }
};

export default config;
