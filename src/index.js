// React
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Capacitor, SystemBars, SystemBarsStyle, SystemBarType } from '@capacitor/core';
import './index.css';
import ConfigLoader from './components/ConfigLoader';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Render application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ConfigLoader />
);

// Service Worker nur im Browser (PWA), nicht in der nativen Capacitor-App
if (!Capacitor.isNativePlatform()) {
  serviceWorkerRegistration.register();
} else {
  // Status-Bar-Hintergrund ist immer Teal (siehe MainActivity-Scrim) -> Icons immer hell.
  // Navigation-Bar bleibt System-Standard (folgt Geraete-Dark/Light-Mode automatisch).
  SystemBars.setStyle({ style: SystemBarsStyle.Dark, bar: SystemBarType.StatusBar });
}

