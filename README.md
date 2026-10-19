# Ur Safe Place

A calm student wellbeing prototype. It runs in the browser, works on a laptop and a phone-sized screen, and keeps journal entries, bookmarks, demo registrations, and reports in local storage on that device.

This is a proposal demo, not a production service.

## Prerequisites

- [Node.js](https://nodejs.org/) 20 or newer, which includes npm
- A modern browser such as Chrome, Edge, Firefox, or Safari

Check that Node is available:

```bash
node -v
npm -v
```

## Installation

In this project folder:

```bash
npm install
```

## Start the development server

```bash
npm run dev
```

Vite is configured with `host: 0.0.0.0` and port `5173`. The terminal prints a local URL and a Network URL. Open the local one on this computer:

```text
http://localhost:5173
```

If port 5173 is already in use, Vite will print the port it chose. Use that port everywhere below.

## Production build

```bash
npm run build
npm run preview
```

The preview server listens on all network interfaces at port `4173`:

```text
http://localhost:4173
```

## Laptop

1. Run `npm run dev`.
2. Open `http://localhost:5173`.
3. Use the sidebar to open Home, My Journal, Community, Events, Resources, and Support.

The layout is comfortable around a 1366px-wide window.

## Mobile layout in browser tools

1. Open the app on your laptop.
2. Open developer tools.
   - Chrome or Edge: `F12` or `Ctrl+Shift+I`, then the device toolbar (`Ctrl+Shift+M`).
   - Firefox: `Ctrl+Shift+M`.
   - Safari: Develop menu, then Enter Responsive Design Mode.
3. Choose a phone preset or set the width to about `390` pixels.
4. Refresh once so the bottom navigation and tap targets settle.

You do not need a separate Android or iOS app. The same site changes layout with the screen width.

## Phone on the same Wi-Fi

`localhost` on a phone means the phone itself, not your laptop. Use the computer’s local IP address.

1. Connect the computer and the phone to the same Wi-Fi network. Guest networks often block devices from seeing each other.
2. Find the computer’s IPv4 address.
   - Windows: open Command Prompt or PowerShell and run `ipconfig`. Use the **IPv4 Address** under your Wi-Fi adapter, for example `192.168.1.24`.
   - macOS: System Settings → Network → Wi-Fi → Details, or run `ipconfig getifaddr en0`.
   - Linux: run `hostname -I` or `ip addr`.
3. Start the app with `npm run dev`.
4. On the phone, open `http://YOUR_IP:5173`, for example `http://192.168.1.24:5173`.

Windows may show a firewall prompt the first time Node listens on the network. Allow Node.js on **private** networks. If the phone cannot connect, check that the firewall allows inbound TCP on port 5173 and that the phone is not on mobile data.

The development server is not encrypted. Do not type real secrets into it.

## Install as a progressive web app

The project includes:

- `public/manifest.webmanifest`
- SVG and PNG icons
- a minimal service worker at `public/sw.js`

The service worker does **not** make the app work offline. It only gives browsers a fetch handler, which some of them require before they offer installation.

Installation usually works on `localhost` or on an **HTTPS** site. Opening the dev server from a phone with `http://192.168.x.x:5173` is not a secure context, so the service worker will not register there and **Add to Home Screen** may be limited or unavailable.

Where it does work:

- Chrome or Edge on localhost: look for the install icon in the address bar.
- Android Chrome on an HTTPS deployment: menu → Install app or Add to Home screen.
- iOS Safari: Share → Add to Home Screen. iOS may use the icon and name even when a full install prompt is not available.

## What is stored on the device

The browser keeps prototype data under keys beginning with `ursafe.`. That includes journal entries, community posts and comments you create, reactions, reports, event registrations, bookmarks, and whether sample statistics are shown.

Local storage is not secure encrypted storage. It does not synchronise across browsers or devices. Clearing site data, or using **Clear prototype data on this device** on the Support page, removes it.

## Sample data and limitations to disclose

- Community posts, mood counts, events, resources, and support cards are fictional demo content.
- The happiness index is calculated from illustrative sample records plus feelings you explicitly opt in. It is not live campus data. The chart stays hidden below 8 included responses.
- Private journal entries are not copied into Community. Sharing and contributing to the index are separate choices.
- Nothing is uploaded. There is no account, database, moderation team, or emergency monitoring.
- Support phone numbers and websites are placeholders. The app does not place calls or open unverified sites.
- Event registration does not contact an organiser or take payment.
- Reports stay in the browser with the status **Pending review**.
- There is no audio file in the two-minute practice.
- A website cannot lock a phone or stop someone switching apps.
- Google Fonts are loaded when the computer is online. If they cannot load, the app uses Georgia and Segoe UI.
