import React from "react";
import { Styled } from "./styled";

const Maps = () => {
    return (
        <Styled.Page>
            <Styled.Title>Maps (External Integrations)</Styled.Title>

            <Styled.Lead>
                In React apps, “maps” usually means embedding an interactive web map (pan/zoom, markers, popups)
                from a mapping library or API. You'll often combine a map with data (e.g., store locations),
                geocoding (find coordinates for an address), and UI (filters, search, clustering).
            </Styled.Lead>

            {/* 1) What & Why */}
            <Styled.Section>
                <Styled.H2>What is a web map integration?</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Web map:</b> An interactive 2D (or 3D) map rendered in the browser. Users can pan, zoom,
                        and interact with layers/markers.
                    </li>
                    <li>
                        <b>Integration:</b> Connecting React components to a mapping library (e.g., Leaflet,
                        MapLibre GL, Google Maps) and data sources (tiles, GeoJSON, APIs).
                    </li>
                    <li>
                        <b>Typical uses:</b> location finder, delivery tracking, heatmaps, territory overlays,
                        store/ATM locator, route visualizations.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Core Concepts (Glossary) */}
            <Styled.Section>
                <Styled.H2>Glossary (plain-English)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Tile:</b> A square image (usually 256×256 px) that is one piece of the map. Many tiles
                        form the full map at a given zoom.
                    </li>
                    <li>
                        <b>Tile server:</b> A server that provides map tiles. Can serve <i>raster</i> (PNG/JPEG) or
                        <i> vector</i> tiles (PBF).
                    </li>
                    <li>
                        <b>Raster vs vector tiles:</b> Raster tiles are pre-rendered images. Vector tiles are raw
                        geometry styled in the browser (crisper labels, dynamic styling).
                    </li>
                    <li>
                        <b>CRS / Projection:</b> Mathematical way to flatten Earth onto a 2D map. Most web maps use
                        Web Mercator (EPSG:3857).
                    </li>
                    <li>
                        <b>Slippy map:</b> The common pan/zoom map UX with tiles loading as you move.
                    </li>
                    <li>
                        <b>Layer:</b> A visual set of features (e.g., roads, buildings, your markers) drawn on top
                        of the base map.
                    </li>
                    <li>
                        <b>Marker:</b> A point on the map (e.g., a pin). Often clickable to show details.
                    </li>
                    <li>
                        <b>Popup / InfoWindow:</b> A small panel attached to a marker or coordinate that shows info.
                    </li>
                    <li>
                        <b>GeoJSON:</b> A JSON format for geographic data (Points, LineStrings, Polygons).
                    </li>
                    <li>
                        <b>Geocoding:</b> Convert an address/place name → coordinates. <b>Reverse geocoding:</b>
                        coordinates → human-readable address.
                    </li>
                    <li>
                        <b>Rate limit:</b> The maximum calls per time window allowed by an API provider.
                    </li>
                    <li>
                        <b>Clustering:</b> Group nearby markers into one symbol at lower zooms to improve performance/clarity.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Library choices */}
            <Styled.Section>
                <Styled.H2>Popular Libraries & When to Use</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Leaflet:</b> Lightweight, raster-first mapping. Simple API, huge plugin ecosystem. Great
                        for quick store locators and simple overlays.
                    </li>
                    <li>
                        <b>MapLibre GL:</b> Open-source vector maps (Mapbox GL fork). Crisp labels, dynamic styling,
                        3D buildings, good for modern vector tile pipelines.
                    </li>
                    <li>
                        <b>Google Maps JS API:</b> Familiar basemap + built-in extras (Places, Directions). Commercial
                        terms and billing apply; easy geocoding/places search.
                    </li>
                    <li>
                        <b>OpenLayers:</b> Powerful GIS-focused toolkit if you need advanced projections and heavy
                        analysis layers.
                    </li>
                </Styled.List>
                <Styled.Small>
                    Rule of thumb: <i>Leaflet</i> for simple, <i>MapLibre GL</i> for vector style control,
                    <i> Google Maps</i> for Places/Directions integration.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Environment & Keys */}
            <Styled.Section>
                <Styled.H2>Environment & API Keys (Vite)</Styled.H2>
                <Styled.List>
                    <li>
                        Use <b>.env</b> files and Vite's <Styled.InlineCode>import.meta.env</Styled.InlineCode> to store keys.
                        Prefix public keys with <Styled.InlineCode>VITE_</Styled.InlineCode>.
                    </li>
                    <li>
                        Never hardcode secrets in the repo. For server-only secrets (e.g., paid geocoding),
                        proxy via your backend.
                    </li>
                    <li>
                        Respect provider <b>usage caps</b> and <b>rate limits</b>; cache where possible.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// .env
VITE_MAPTILES_URL="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
VITE_GOOGLE_MAPS_API_KEY="your_public_key"`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Example: Leaflet (notes demo) */}
            <Styled.Section>
                <Styled.H2>Example: Minimal Leaflet (conceptual)</Styled.H2>
                <Styled.List>
                    <li><b>What it shows:</b> init map, add tile layer, place a marker, attach popup.</li>
                    <li>
                        <b>Install (outside of notes):</b> <Styled.InlineCode>npm i leaflet</Styled.InlineCode> and
                        include the Leaflet CSS.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`import L from "leaflet";
import React from "react";

export function LeafletNote() {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!ref.current) return;
    const map = L.map(ref.current).setView([12.9716, 77.5946], 12);
    L.tileLayer(import.meta.env.VITE_MAPTILES_URL, { maxZoom: 19 }).addTo(map);

    const marker = L.marker([12.9716, 77.5946]).addTo(map);
    marker.bindPopup("Bengaluru");

    return () => map.remove();
  }, []);

  return <div ref={ref} style={{ height: 360, borderRadius: 12 }} />;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Leaflet works great with raster tiles (OpenStreetMap). For many markers, consider
                    a clustering plugin to avoid slowdowns.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Example: MapLibre GL (vector tiles) */}
            <Styled.Section>
                <Styled.H2>Example: MapLibre GL (vector tiles)</Styled.H2>
                <Styled.List>
                    <li><b>What it shows:</b> vector basemap and a symbol layer from GeoJSON.</li>
                    <li>
                        <b>Install (outside notes):</b> <Styled.InlineCode>npm i maplibre-gl</Styled.InlineCode>
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`import maplibregl from "maplibre-gl";
import React from "react";

export function MapLibreNote() {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!ref.current) return;
    const map = new maplibregl.Map({
      container: ref.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [77.5946, 12.9716],
      zoom: 11
    });

    map.on("load", () => {
      map.addSource("stores", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            { type: "Feature", geometry: { type: "Point", coordinates: [77.6, 12.97] }, properties: { name: "Store A" } },
            { type: "Feature", geometry: { type: "Point", coordinates: [77.59, 12.98] }, properties: { name: "Store B" } }
          ]
        }
      });

      map.addLayer({
        id: "stores-layer",
        type: "symbol",
        source: "stores",
        layout: { "icon-image": "marker-15", "text-field": ["get", "name"], "text-offset": [0, 1.2], "text-anchor": "top" }
      });
    });

    return () => map.remove();
  }, []);

  return <div ref={ref} style={{ height: 360, borderRadius: 12 }} />;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Vector tiles allow dynamic styling and crisp rendering at any zoom level.
                    Use a style JSON URL (self-hosted or provider-hosted).
                </Styled.Small>
            </Styled.Section>

            {/* 7) Example: Google Maps (minimal) */}
            <Styled.Section>
                <Styled.H2>Example: Google Maps JS API (minimal)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>What it shows:</b> loading the script, creating a map, and adding a marker.
                    </li>
                    <li>
                        <b>Billing:</b> Google Maps requires a billing-enabled project; watch quotas and costs.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Load script in index.html with your key:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY" async defer></script>

import React from "react";

export function GoogleMapsNote() {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!ref.current || !window.google) return;
    const map = new window.google.maps.Map(ref.current, {
      center: { lat: 12.9716, lng: 77.5946 },
      zoom: 12,
      disableDefaultUI: true
    });

    new window.google.maps.Marker({
      position: { lat: 12.9716, lng: 77.5946 },
      map,
      title: "Bengaluru"
    });
  }, []);

  return <div ref={ref} style={{ height: 360, borderRadius: 12 }} />;
}`}
                </Styled.Pre>
                <Styled.Small>
                    Prefer environment variables for keys. For places search/directions, consider server-side
                    proxies to protect quotas and enforce business rules.
                </Styled.Small>
            </Styled.Section>

            {/* 8) State → Markers (React pattern) */}
            <Styled.Section>
                <Styled.H2>React State → Markers (data-driven)</Styled.H2>
                <Styled.List>
                    <li>
                        Keep <b>location data</b> in React state. When the state changes, update markers on the map.
                    </li>
                    <li>
                        For many markers, throttle updates (e.g., on drag/zoom) and/or cluster to keep frame rates smooth.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Pseudocode pattern (library-agnostic)
function useVisibleStores(bounds, allStores) {
  // bounds: current map view box; filter stores within bounds
  return React.useMemo(
    () => allStores.filter(s => bounds.contains([s.lng, s.lat])),
    [bounds, allStores]
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Accessibility & UX */}
            <Styled.Section>
                <Styled.H2>Accessibility & UX</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Keyboard:</b> Expose non-map controls (filters, list, “Zoom to my location”).
                        Don't lock users inside the canvas only.
                    </li>
                    <li>
                        <b>Announcements:</b> When a marker is selected, update off-screen text for screen readers.
                    </li>
                    <li>
                        <b>Fallback:</b> Provide a list/table view for users on low-power devices or with JS disabled.
                    </li>
                    <li>
                        <b>No portals?</b> If you avoid React portals, render map popups using the library's native popup system,
                        and keep React for surrounding UI.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Performance Tips */}
            <Styled.Section>
                <Styled.H2>Performance Tips</Styled.H2>
                <Styled.List>
                    <li><b>Cluster markers</b> at low zooms; draw individual points only when zoomed in.</li>
                    <li>
                        <b>Debounce/throttle</b> heavy work (fetching, filtering) during <i>move</i> and <i>zoom</i> events.
                    </li>
                    <li>
                        <b>Memoize</b> derived data (visible points, styled features) to avoid recomputing on every render.
                    </li>
                    <li>
                        <b>Dispose</b> maps on unmount to prevent memory leaks.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> store keys in <Styled.InlineCode>.env</Styled.InlineCode> and use <Styled.InlineCode>import.meta.env</Styled.InlineCode>.</li>
                    <li><b>Do</b> read provider T&amp;Cs for attribution and usage limits.</li>
                    <li><b>Do</b> provide graceful fallbacks (errors, no-data, offline).</li>
                    <li><b>Don't</b> push secret keys to the client—proxy sensitive calls via backend.</li>
                    <li><b>Don't</b> render thousands of DOM markers—cluster or use canvas/WebGL layers.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Pick the right library for your use case, keep data in React state, update the map
                from state changes, and watch keys/quotas. Start simple with Leaflet, move to MapLibre GL for
                vector styling, or choose Google Maps when you need Places/Directions out of the box.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Maps;
