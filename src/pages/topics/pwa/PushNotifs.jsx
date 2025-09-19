import React from "react";
import { Styled } from "./styled";

const PushNotifs = () => {
    return (
        <Styled.Page>
            <Styled.Title>Push Notifications (Web Push)</Styled.Title>

            <Styled.Lead>
                <b>Web Push</b> lets a website send timely notifications to a user's device
                even when the page is not open. It relies on a <b>Service Worker</b>, the
                <b> Push API</b> (subscribe), and the <b>Notifications API</b> (show UI).
            </Styled.Lead>

            {/* 1) Definitions */}
            <Styled.Section>
                <Styled.H2>Core Definitions</Styled.H2>
                <Styled.List>
                    <li><b>Service Worker (SW):</b> a background script that runs independently of pages. Needed to receive push messages and display notifications.</li>
                    <li><b>Notifications API:</b> browser API to display system-level notifications (<Styled.InlineCode>new Notification()</Styled.InlineCode> or <Styled.InlineCode>registration.showNotification()</Styled.InlineCode> in SW).</li>
                    <li><b>Push API:</b> lets the SW subscribe to a push service and receive messages from your server.</li>
                    <li><b>Subscription:</b> a JSON object (endpoint + keys) that uniquely identifies a user's device/browser for push delivery.</li>
                    <li><b>Push Service:</b> infra run by the browser vendor (e.g., FCM for Chrome) that receives your server's push request and delivers it to the device.</li>
                    <li><b>VAPID (Voluntary Application Server Identification):</b> public/private key pair used to authenticate your server with browser push services.</li>
                    <li><b>Permission states:</b> <i>default</i> (not asked), <i>granted</i>, <i>denied</i>. You can only show notifications if <i>granted</i>.</li>
                    <li><b>Payload:</b> the data your server sends to the push service to be delivered to the SW (e.g., title, body, icon URL, actions).</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Requirements & constraints */}
            <Styled.Section>
                <Styled.H2>Requirements & Constraints</Styled.H2>
                <Styled.List>
                    <li><b>HTTPS required:</b> push + service workers work only on secure origins (localhost is OK for dev).</li>
                    <li><b>User gesture:</b> request permission only in response to an explicit user action (e.g., a button click).</li>
                    <li><b>Background delivery:</b> messages arrive to the SW even when no tab is open (subject to OS/browser limits, battery saver, etc.).</li>
                    <li><b>Platform support:</b> most modern browsers support Web Push; iOS Safari supports it via "Web Push for PWAs." Behavior may still vary by platform.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Flow overview */}
            <Styled.Section>
                <Styled.H2>End-to-End Flow</Styled.H2>
                <Styled.List>
                    <li>Register a <b>Service Worker</b>.</li>
                    <li>Ask user for <b>Notification Permission</b> (on a user action).</li>
                    <li>Create/refresh a <b>Push Subscription</b> in the SW registration (needs your <b>VAPID public key</b>).</li>
                    <li><b>Send subscription</b> JSON to your server and store it (DB).</li>
                    <li>From server, use <b>web-push</b> (or similar) with your <b>VAPID private key</b> to send a payload to the subscription's <b>endpoint</b>.</li>
                    <li>SW receives the <b>push</b> event, and shows a <b>notification</b> via <Styled.InlineCode>showNotification()</Styled.InlineCode>.</li>
                </Styled.List>
            </Styled.Section>

            {/* 4) Permission request */}
            <Styled.Section>
                <Styled.H2>Requesting Permission (UI Thread)</Styled.H2>
                <Styled.Pre>
                    {`// Trigger this from a user gesture (e.g., button click)
async function askNotificationPermission() {
  if (!("Notification" in window)) {
    alert("This browser does not support notifications.");
    return "denied";
  }
  const current = Notification.permission; // "default" | "granted" | "denied"
  if (current === "granted" || current === "denied") return current;

  const result = await Notification.requestPermission();
  // result: "granted" | "denied"
  return result;
}`}
                </Styled.Pre>
                <Styled.Small>Only call <Styled.InlineCode>Notification.requestPermission()</Styled.InlineCode> after a user clicks a button; otherwise many browsers will auto-deny.</Styled.Small>
            </Styled.Section>

            {/* 5) Register SW + Subscribe */}
            <Styled.Section>
                <Styled.H2>Register Service Worker & Subscribe to Push</Styled.H2>
                <Styled.List>
                    <li><b>applicationServerKey:</b> your <i>VAPID public key</i> (URL-safe base64) converted to <Styled.InlineCode>Uint8Array</Styled.InlineCode>.</li>
                    <li><b>userVisibleOnly: true</b> is required; every push must show a notification.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Convert base64 (URL-safe) VAPID key to Uint8Array
function base64UrlToUint8Array(base64Url) {
  const padding = "=".repeat((4 - (base64Url.length % 4)) % 4);
  const base64 = (base64Url + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

async function registerAndSubscribe(vapidPublicKey) {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    throw new Error("Service Worker / Push not supported in this browser.");
  }

  // 1) Register your service worker (e.g., /sw.js at site root)
  const reg = await navigator.serviceWorker.register("/sw.js");

  // 2) Subscribe (creates or returns existing subscription)
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: base64UrlToUint8Array(vapidPublicKey),
    });
  }

  // 3) Send subscription JSON to your server to store it
  await fetch("/api/save-subscription", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sub),
  });

  return sub;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Service Worker: receive push & show notification */}
            <Styled.Section>
                <Styled.H2>Service Worker: Receive & Show Notification</Styled.H2>
                <Styled.Pre>
                    {`// /sw.js (must be served from the site origin or scope-matched)
// self is the ServiceWorkerGlobalScope
self.addEventListener("push", (event) => {
  // Event may not always contain data; handle both cases
  let payload = {};
  try { payload = event.data ? event.data.json() : {}; } catch {}
  const title = payload.title || "Hello!";
  const options = {
    body: payload.body || "You have a new message.",
    icon: payload.icon || "/icons/icon-192.png",
    badge: payload.badge || "/icons/badge-72.png",
    data: payload.data || { url: "/" },
    tag: payload.tag,              // avoid stacking dupes if desired
    renotify: !!payload.renotify,  // whether to re-alert on same tag
    actions: payload.actions || [  // buttons in the notification
      { action: "open", title: "Open" },
      { action: "dismiss", title: "Dismiss" }
    ]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle clicks on the notification or its actions
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";

  if (event.action === "dismiss") return;

  event.waitUntil((async () => {
    // Focus an existing client tab if available, otherwise open a new one
    const allClients = await clients.matchAll({ type: "window", includeUncontrolled: true });
    const hadClient = allClients.some((client) => {
      if (client.url.includes(self.location.origin) && "focus" in client) {
        client.focus();
        return true;
      }
      return false;
    });
    if (!hadClient) await clients.openWindow(url);
  })());
});`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Note:</b> Service workers can't show modal UI; they use <Styled.InlineCode>showNotification()</Styled.InlineCode>.
                    Use <Styled.InlineCode>notificationclick</Styled.InlineCode> to navigate or focus a tab.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Backend: store subscription & send push */}
            <Styled.Section>
                <Styled.H2>Backend: Store Subscription & Send Push</Styled.H2>
                <Styled.List>
                    <li><b>Store subscriptions:</b> Save each subscription JSON (one per device/browser) in your DB.</li>
                    <li><b>Send:</b> Use a library like <Styled.InlineCode>web-push</Styled.InlineCode> with your VAPID keys to POST a payload to the browser's push service.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Node/Express (example): save subscription & send push
// 1) Setup web-push with VAPID keys (generate once and keep private key secret)
const webpush = require("web-push");
webpush.setVapidDetails(
  "mailto:you@example.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// 2) Save subscriptions (simplified; use a DB in production)
const subs = new Set();
app.post("/api/save-subscription", express.json(), (req, res) => {
  subs.add(req.body); // req.body is the subscription JSON from the client
  res.json({ ok: true });
});

// 3) Send a push to all subscribers
app.post("/api/push", express.json(), async (req, res) => {
  const payload = JSON.stringify({
    title: req.body.title || "New alert",
    body: req.body.body || "Something happened!",
    data: { url: req.body.url || "/" }
  });

  const results = [];
  for (const sub of subs) {
    try {
      await webpush.sendNotification(sub, payload, { TTL: 60 });
      results.push({ ok: true });
    } catch (err) {
      results.push({ ok: false, error: String(err) });
      // If 410 Gone, the subscription is invalid; remove from DB
    }
  }
  res.json({ ok: true, results });
});`}
                </Styled.Pre>
                <Styled.Small>
                    <b>TTL:</b> time-to-live (seconds) the push service should retain the message if the device is offline.
                    If you get <i>410 Gone</i>, remove that subscription from your DB (it's expired/invalid).
                </Styled.Small>
            </Styled.Section>

            {/* 8) UX guidelines */}
            <Styled.Section>
                <Styled.H2>UX & Best Practices</Styled.H2>
                <Styled.List>
                    <li><b>Ask thoughtfully:</b> explain the value before showing the permission prompt.</li>
                    <li><b>Granular topics:</b> let users opt in to specific categories (e.g., "Deals", "Breaking news").</li>
                    <li><b>Respect quiet hours:</b> avoid late-night pings; consider local time.</li>
                    <li><b>Actionable:</b> include buttons (actions) that lead the user to a relevant screen.</li>
                    <li><b>Unsubscribe path:</b> provide a clear way to turn off notifications.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Security & Privacy */}
            <Styled.Section>
                <Styled.H2>Security & Privacy</Styled.H2>
                <Styled.List>
                    <li><b>Keys:</b> keep the VAPID <i>private</i> key on the server only.</li>
                    <li><b>HTTPS:</b> required to prevent tampering and protect subscriptions.</li>
                    <li><b>Data minimization:</b> send only what's necessary; avoid sensitive data in payloads.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Troubleshooting */}
            <Styled.Section>
                <Styled.H2>Troubleshooting</Styled.H2>
                <Styled.List>
                    <li><b>Permission is "denied":</b> you cannot prompt again; provide UI that explains how to re-enable in browser settings.</li>
                    <li><b>"NotAllowedError" on subscribe:</b> permission not granted, or called without a user gesture.</li>
                    <li><b>No notification shown:</b> verify SW scope, <Styled.InlineCode>push</Styled.InlineCode> handler, and that the payload reaches <Styled.InlineCode>showNotification()</Styled.InlineCode>.</li>
                    <li><b>410 Gone from push service:</b> remove that subscription from your DB (stale).</li>
                    <li><b>iOS oddities:</b> ensure the site is installed as a PWA and notifications are enabled in iOS settings.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Endpoint:</b> URL on the browser's push service where your server sends the push.</li>
                    <li><b>Keys (p256dh/auth):</b> per-subscription public keys used to encrypt the payload end-to-end.</li>
                    <li><b>Scope:</b> URL path range the SW controls (affects which pages it can handle).</li>
                    <li><b>Tag:</b> identifier to group/replace notifications to prevent duplicates.</li>
                    <li><b>Actions:</b> buttons shown on a notification for quick responses.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Web Push = Permission + Subscription + Server Push + SW display.
                Keep requests user-initiated, store subscriptions securely, send meaningful,
                actionable messages, and always offer an easy opt-out.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default PushNotifs;
