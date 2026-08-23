import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.minukodu.minuvis',
  appName: 'MINUVIS SmartHome App',
  // eigener Build-Ordner, weil der normale "build" (npm run build) fixe
  // absolute Pfade wie /minuvis/app/... enthält (aus "homepage" in package.json,
  // für Deployment auf einem Webserver gedacht) - das bricht im Capacitor-WebView.
  webDir: 'build-capacitor',
  server: {
    // Erlaube unverschlüsselte http-Verbindungen im lokalen Netz (ioBroker läuft meist ohne TLS)
    androidScheme: 'http',
    cleartext: true,
  },
};

export default config;
