# iOS-App bauen – Anleitung (Minuvis SmartHome App / Capacitor)

Stand: 2026-08-16. Projekt: `minuvis-webapp.iobroker`, Branch `V300`.

Diese App kann auf diesem Windows-Rechner **nicht** final gebaut/getestet werden – dafür ist zwingend ein **Mac mit Xcode** nötig (Apple-Vorgabe, kein Workaround möglich). Diese Anleitung beschreibt den kompletten Weg vom aktuellen Projektstand bis zur lauffähigen iOS-App.

## 1. Voraussetzungen (auf dem Mac)

- **macOS** (aktuelle Version empfohlen)
- **Xcode** (aus dem Mac App Store), inkl. Command Line Tools:
  ```
  xcode-select --install
  ```
- **Node.js**
  - Projekt hat kein `engines`-Feld in `package.json` und keine `.nvmrc` – keine harte Versionsbindung
  - Empfehlung: gleiche Version wie auf diesem Windows-Rechner verwenden, aktuell **Node v24.19.0** (aktuelle LTS-Linie reicht ebenso, z. B. v20 oder v22 – wichtig ist nur: aktuell genug für Capacitor 8, das mind. Node 20 voraussetzt)
  - Installation auf dem Mac am einfachsten über **nvm** (Node Version Manager), damit Node-Version pro Projekt sauber wechselbar ist:
    ```
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
    ```
    danach Terminal neu starten (oder `source ~/.zshrc` bzw. `source ~/.bashrc`), dann:
    ```
    nvm install 24
    nvm use 24
    ```
    Prüfen mit `node -v` → sollte `v24.x.x` zeigen
  - Alternative ohne nvm: Installer direkt von https://nodejs.org (LTS-Version wählen) herunterladen und ausführen
- **CocoaPods** (verwaltet native iOS-Abhängigkeiten):
  ```
  sudo gem install cocoapods
  ```
- **Apple-ID / Apple Developer Account**
  - Kostenloser Account reicht zum Testen auf eigenem Gerät/Simulator (7-Tage-Signierung, Gerät muss neu verbunden werden nach Ablauf)
  - **Kostenpflichtige Apple Developer Program Mitgliedschaft (99 $/Jahr)** nötig für: TestFlight, App-Store-Veröffentlichung, längere Signierung, Push-Notifications etc.

## 2. Projekt auf den Mac bringen

- Repo klonen bzw. per Sync/USB/Cloud auf den Mac übertragen:
  ```
  git clone <repo-url> minuvis-webapp.iobroker
  cd minuvis-webapp.iobroker
  git checkout V300
  ```
- Abhängigkeiten installieren:
  ```
  npm install
  ```

## 3. Aktueller Stand des iOS-Projekts (bereits erledigt, muss NICHT wiederholt werden)

Der `ios/`-Ordner existiert bereits im Repo und enthält bereits folgende Anpassungen:

- `ios/App/App/Info.plist`:
  - `NSAppTransportSecurity` / `NSAllowsArbitraryLoads = true` (nötig, da lokaler ioBroker-Adapter meist nur HTTP ohne TLS spricht)
  - `NSCameraUsageDescription` (Berechtigungstext für QR-Code-Scanner-Feature)
- `ios/App/App/AppIcon-512@2x.png`: bereits mit Minuvis-Logo ersetzt (1024×1024, ohne Alpha-Kanal – Pflicht für App Store)
- `capacitor.config.ts`: `appId: com.minuvis.smarthome`, `appName: "MINUVIS SmartHome App"`, `webDir: build-capacitor`, `server.androidScheme: http`, `server.cleartext: true`

**Noch offen / nicht angefasst:**
- iOS-Äquivalent zur Android-StatusBar/NavigationBar-Farbanpassung (`#00828b`) – auf Android bereits fertig (siehe Projekt-Memory), auf iOS noch nicht umgesetzt
- Splashscreen mit Minuvis-Logo (`#00828b`) – auf Android bereits fertig, auf iOS noch nicht geprüft/erzeugt
- `pod install` wurde noch nie ausgeführt (siehe Schritt 5)

## 4. Web-Build für Capacitor erzeugen

Wichtig: **nicht** `npm run build` (das ist der Web/PWA-Build mit `homepage`-Unterpfad `/minuvis/app/`), sondern der spezielle Capacitor-Build:

```
npm run build:capacitor
```

Erzeugt `build-capacitor/` mit root-relativen Pfaden (kein `/minuvis/app/`-Präfix), das ist zwingend nötig, da der native WebView von der Wurzel lädt.

## 5. Sync nach iOS

```
npx cap sync ios
```

Kopiert die Web-Assets nach `ios/App/App/public` und synchronisiert native Plugins (`@capacitor/app` etc.). Führt beim ersten Mal bzw. bei geänderten Podfile-Abhängigkeiten automatisch `pod install` aus. Falls das fehlschlägt oder separat nötig ist:

```
cd ios/App
pod install
cd ../..
```

**Merkregel (analog Android):** Nach JEDER Code-Änderung immer den vollen Workflow durchlaufen: `npm run build:capacitor` → `npx cap sync ios` → App in Xcode neu bauen. Nur `build:capacitor` allein reicht nicht, die Änderung landet sonst nicht im nativen Projekt.

## 6. Projekt in Xcode öffnen

```
npx cap open ios
```

Öffnet `ios/App/App.xcworkspace` (nicht `.xcodeproj` – wegen CocoaPods immer den `.xcworkspace` verwenden) in Xcode.

## 7. Signing einrichten (in Xcode)

1. Projekt-Navigator → Ziel **App** auswählen → Tab **Signing & Capabilities**
2. **Team**: eigene Apple-ID/Team auswählen (ggf. „Add Account…“ mit Apple-ID anmelden)
3. **Bundle Identifier**: bereits `com.minuvis.smarthome` gesetzt (aus `capacitor.config.ts` übernommen) – muss ggf. eindeutig sein, falls Kollision mit bereits vergebener ID
4. Xcode verwaltet Provisioning Profile bei „Automatically manage signing“ selbst

## 8. Auf Simulator testen

- Ziel-Gerät oben in Xcode auf einen iOS-Simulator stellen (z. B. „iPhone 15“)
- ▶️ Play-Button bzw. `Cmd+R`
- Prüfen: Setup-Formular erscheint (Server-URL/Config-Datei manuell eingeben oder QR-Code-Scan – Kamera funktioniert im Simulator nicht, dafür echtes Gerät nötig), Verbindung zum ioBroker-Adapter testen

## 9. Auf echtem iPhone/iPad testen

1. Gerät per USB (oder WLAN-Debugging) mit dem Mac verbinden
2. Am Gerät: **Einstellungen → Allgemein → VPN & Geräteverwaltung** → Entwickler-Zertifikat vertrauen (nach erstem Deploy-Versuch nötig)
3. Gerät als Ziel in Xcode auswählen, `Cmd+R`
4. Bei kostenlosem Account: App läuft nur 7 Tage, danach Gerät neu verbinden und erneut installieren
5. Kamera-Permission-Dialog beim ersten QR-Scan-Versuch bestätigen (Text kommt aus `NSCameraUsageDescription`, bereits gesetzt) – **das ist der offene Test-Punkt aus dem QR-Feature, noch nie auf echtem Gerät verifiziert**

## 10. Prüfpunkte speziell für dieses Projekt

- [ ] App startet, Setup-Formular für Server-URL/Config-Datei erscheint (kein Query-String-Zugriff in nativer App möglich)
- [ ] Verbindung zum ioBroker-Adapter via Socket.io klappt (auch nach Reload – bekannter früherer Bug mit `configFromLocalStorage`, siehe Projekt-Memory, sollte bereits gefixt sein)
- [ ] QR-Code-Scanner: Kamera-Permission-Dialog erscheint, Scan eines JSON-QR-Codes (`{ url, type, fileName, useAuth, user, pass }`) befüllt die Felder korrekt
- [ ] App-Icon zeigt Minuvis-Logo (nicht Standard-Xcode-Platzhalter)
- [ ] Splashscreen (falls vorhanden/gewünscht) – aktuell für iOS vermutlich noch Standard/weiß, nicht Teal wie Android
- [ ] "Server-Konfiguration löschen"-Button auf Info-Seite funktioniert, Reload zeigt danach wieder Setup-Formular

## 11. Optional: TestFlight / App Store Vorbereitung

Nur mit kostenpflichtigem Apple Developer Account möglich:

1. App in **App Store Connect** (appstoreconnect.apple.com) anlegen, Bundle ID `com.minuvis.smarthome` registrieren
2. In Xcode: **Product → Archive** (nur mit „Any iOS Device“ als Build-Ziel möglich, nicht Simulator)
3. Im Organizer-Fenster: **Distribute App** → App Store Connect → Upload
4. In App Store Connect: Build unter TestFlight freigeben, Tester einladen (per E-Mail), oder für Review einreichen
5. Benötigt zusätzlich: App-Screenshots (mehrere Gerätegrößen), Datenschutzerklärung-URL, App-Beschreibung, Kategorie – bisher nicht vorbereitet

## 12. Bekannte Stolpersteine (aus Android-Erfahrung, analog erwartbar)

- `pod install` schlägt manchmal wegen veralteter CocoaPods-Repo-Specs fehl → `pod repo update` vorher ausführen
- Nach Versionsbump in `package.json` immer `npx cap sync` NICHT vergessen (sonst zeigt App alte Versionsnummer, wie bei Android schon einmal passiert)
- Signing-Fehler „No profiles found“ → Team in Signing & Capabilities neu auswählen, Xcode neu starten

## Zusammenfassung Kurzworkflow (für spätere Wiederholung)

```
npm install
npm run build:capacitor
npx cap sync ios
npx cap open ios
# in Xcode: Team wählen, Ziel wählen, Cmd+R
```
