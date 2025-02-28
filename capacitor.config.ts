import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'RankGo3',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,  // Duración en milisegundos (3 segundos)
      launchAutoHide: true,      // Ocultar automáticamente después del tiempo definido
      androidScaleType: 'CENTER_CROP', // Ajuste de la imagen en Android
      showSpinner: true,         // Mostrar un spinner de carga
      backgroundColor: '#FFFFFF' // Color de fondo del splash
    },
    "Keyboard": {
    "resize": "ionic"
  }
  }
};

export default config;
