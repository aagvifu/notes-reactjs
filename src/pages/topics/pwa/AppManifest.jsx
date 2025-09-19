import React from "react";
import { Styled } from "./styled";

const AppManifest = () => {
    return (
        <Styled.Page>
            <Styled.Title>App Manifest (PWA)</Styled.Title>

            <Styled.Lead>
                A <b>Web App Manifest</b> is a small JSON file that tells the browser how to treat your site
                like an app: its name, icons, colors, launch page, and more. Adding a manifest is a key step
                toward a <b>Progressive Web App (PWA)</b> experience (installable, app-like).
            </Styled.Lead>

            {/* 1) What is a manifest? */}
            <Styled.Section>
                <Styled.H2>Definition & Purpose</Styled.H2>
                <Styled.List>
                    <li>
                        <b>PWA (Progressive Web App):</b> a website that uses modern web capabilities (install,
                        offline, push, etc.) to feel like a native app.
                    </li>
                    <li>
                        <b>Web App Manifest:</b> a JSON file the browser reads to get metadata about your app:
                        <Styled.InlineCode>name</Styled.InlineCode>, <Styled.InlineCode>icons</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>start_url</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>display</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>theme_color</Styled.InlineCode>, etc.
                    </li>
                    <li>
                        <b>Outcome:</b> Enables the “Install” experience and determines app icon, splash colors,
                        how it opens (standalone vs in a browser tab), and related quick actions.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Where to put it (Vite) */}
            <Styled.Section>
                <Styled.H2>Where does it live? (Vite)</Styled.H2>
                <Styled.List>
                    <li>
                        Place <Styled.InlineCode>manifest.webmanifest</Styled.InlineCode> in{" "}
                        <Styled.InlineCode>public/</Styled.InlineCode> so Vite copies it to the output root.
                    </li>
                    <li>
                        Link it in <Styled.InlineCode>index.html</Styled.InlineCode>:
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`<!-- index.html -->
<link rel="manifest" href="\${import.meta.env.BASE_URL}manifest.webmanifest" />`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Tip (GitHub Pages):</b> <Styled.InlineCode>BASE_URL</Styled.InlineCode> becomes{" "}
                    <Styled.InlineCode>"/your-repo/"</Styled.InlineCode> on project pages, keeping the link
                    correct in dev and prod.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Minimal example */}
            <Styled.Section>
                <Styled.H2>Minimal Manifest Example</Styled.H2>
                <Styled.Pre>
                    {`{
  "id": "/",
  "name": "Notes — ReactJS",
  "short_name": "Notes React",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "description": "Learner-friendly ReactJS notes with examples and clear explanations.",
  "background_color": "#000000",
  "theme_color": "#0ea5e9",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "/icons/icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}`}
                </Styled.Pre>
                <Styled.Small>
                    Put icons inside <Styled.InlineCode>public/icons/</Styled.InlineCode>. PNG is recommended.
                    Include at least 192×192 and 512×512. Add a <b>maskable</b> icon for better Android badges.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Important fields (with definitions) */}
            <Styled.Section>
                <Styled.H2>Important Fields (with definitions)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>id:</b> a stable identifier for your app (often the root path). Used by browsers to
                        recognize an installed PWA instance.
                    </li>
                    <li>
                        <b>name:</b> the full name shown on install prompts and app launchers.
                    </li>
                    <li>
                        <b>short_name:</b> a shorter label used where space is limited (home screen).
                    </li>
                    <li>
                        <b>start_url:</b> the URL opened when the user launches the installed app (e.g.,
                        <Styled.InlineCode>"/"</Styled.InlineCode> or{" "}
                        <Styled.InlineCode>"/?source=pwa"</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>scope:</b> the URL path range considered “inside” your app. The{" "}
                        <Styled.InlineCode>start_url</Styled.InlineCode> must be inside this scope.
                    </li>
                    <li>
                        <b>display:</b> how the app window appears:
                        <Styled.List>
                            <li>
                                <b>browser:</b> regular tab with full browser UI.
                            </li>
                            <li>
                                <b>minimal-ui:</b> fewer controls (back/refresh).
                            </li>
                            <li>
                                <b>standalone:</b> app-like window (no address bar). <i>Common for PWAs.</i>
                            </li>
                            <li>
                                <b>fullscreen:</b> occupies the entire screen (kiosk/games).
                            </li>
                        </Styled.List>
                    </li>
                    <li>
                        <b>background_color:</b> color of the splash screen/background while the app loads.
                    </li>
                    <li>
                        <b>theme_color:</b> color for UI elements like the title bar in some environments.
                    </li>
                    <li>
                        <b>icons:</b> array of icon objects:
                        <Styled.List>
                            <li>
                                <b>src:</b> image path; <b>sizes:</b> pixel dimensions; <b>type:</b> MIME type.
                            </li>
                            <li>
                                <b>purpose:</b> <Styled.InlineCode>"any"</Styled.InlineCode> (default),{" "}
                                <Styled.InlineCode>"maskable"</Styled.InlineCode> (safe cropping for badges), or{" "}
                                <Styled.InlineCode>"monochrome"</Styled.InlineCode> (single-color glyph).
                            </li>
                        </Styled.List>
                    </li>
                    <li>
                        <b>orientation:</b> preferred screen orientation (e.g.,{" "}
                        <Styled.InlineCode>"portrait"</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>"landscape"</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>lang / dir:</b> default language and text direction (e.g.,{" "}
                        <Styled.InlineCode>"en"</Styled.InlineCode>,{" "}
                        <Styled.InlineCode>"ltr"</Styled.InlineCode>).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 5) Helpful optional features */}
            <Styled.Section>
                <Styled.H2>Helpful Optional Features</Styled.H2>
                <Styled.List>
                    <li>
                        <b>shortcuts:</b> quick actions when long-pressing the app icon.
                    </li>
                    <li>
                        <b>screenshots:</b> images used in install experiences to preview the app.
                    </li>
                    <li>
                        <b>categories:</b> hints like <Styled.InlineCode>["education","productivity"]</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>protocol_handlers:</b> make your app handle custom links (e.g.,{" "}
                        <Styled.InlineCode>web+notes:</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>share_target:</b> receive shared content (text/files) from the system share sheet.
                    </li>
                    <li>
                        <b>related_applications / prefer_related_applications:</b> links to native app listings.
                    </li>
                </Styled.List>

                <Styled.Pre>
                    {`{
  "shortcuts": [
    { "name": "Open Home", "url": "/?from=shortcut", "icons": [{ "src": "/icons/shortcut.png", "sizes": "96x96", "type": "image/png" }] }
  ],
  "screenshots": [
    { "src": "/screens/home.png", "sizes": "1280x720", "type": "image/png" }
  ],
  "protocol_handlers": [
    { "protocol": "web+notes", "url": "/protocol?data=%s" }
  ],
  "share_target": {
    "action": "/share",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": { "title": "title", "text": "text", "url": "url", "files": [{ "name": "files", "accept": ["text/*"] }] }
  }
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common Pitfalls (and fixes)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Wrong paths:</b> URLs in the manifest are relative to the manifest file's location.
                        On GitHub Pages project sites, consider absolute paths with the repo base or use{" "}
                        <Styled.InlineCode>BASE_URL</Styled.InlineCode> when linking.
                    </li>
                    <li>
                        <b>Missing sizes/purpose:</b> provide 192×192 and 512×512, include a{" "}
                        <Styled.InlineCode>maskable</Styled.InlineCode> icon for best Android rendering.
                    </li>
                    <li>
                        <b>start_url outside scope:</b> ensure <Styled.InlineCode>start_url</Styled.InlineCode>{" "}
                        is within <Styled.InlineCode>scope</Styled.InlineCode>, or the app may not be treated as
                        a single PWA.
                    </li>
                    <li>
                        <b>No service worker:</b> installability + offline usually requires a registered{" "}
                        <b>Service Worker</b> (even a simple one). The manifest alone doesn't provide offline.
                    </li>
                    <li>
                        <b>MIME type:</b> use <Styled.InlineCode>.webmanifest</Styled.InlineCode> or ensure your
                        server serves <Styled.InlineCode>application/manifest+json</Styled.InlineCode>.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 7) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> keep <Styled.InlineCode>name</Styled.InlineCode> and <Styled.InlineCode>short_name</Styled.InlineCode> clear and human-friendly.</li>
                    <li><b>Do</b> supply crisp PNG icons (192 & 512) and a maskable version.</li>
                    <li><b>Do</b> pick <Styled.InlineCode>display: "standalone"</Styled.InlineCode> for an app-like feel.</li>
                    <li><b>Don't</b> forget <Styled.InlineCode>theme_color</Styled.InlineCode> and <Styled.InlineCode>background_color</Styled.InlineCode>—they control splash and UI accents.</li>
                    <li><b>Don't</b> assume manifest == offline; you still need a Service Worker + caching strategy.</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Manifest:</b> JSON file describing app metadata for installability and UI.</li>
                    <li><b>Service Worker:</b> background script that can intercept network requests, cache files, and enable offline/updates.</li>
                    <li><b>Scope:</b> URL boundary that defines what's “inside” the app.</li>
                    <li><b>Start URL:</b> the entry page when the installed PWA is launched.</li>
                    <li><b>Display Mode:</b> window chrome level (browser, minimal-ui, standalone, fullscreen).</li>
                    <li><b>Maskable Icon:</b> icon with safe padding so systems can crop/shape without losing content.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: add a <b>manifest.webmanifest</b> in <b>public/</b>, link it with{" "}
                <Styled.InlineCode>{"<link rel=\"manifest\" href=\"${import.meta.env.BASE_URL}manifest.webmanifest\" />"}</Styled.InlineCode>,
                include proper icons, colors, and display settings, and pair it with a Service Worker for
                offline. That's the foundation of a solid PWA.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default AppManifest;
