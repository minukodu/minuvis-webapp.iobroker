// React
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Capacitor } from '@capacitor/core';
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
}

