import { Styled } from "./styled";

const ProdMonitoring = () => {
    return (
        <Styled.Page>
            <Styled.Title>Production Monitoring (React)</Styled.Title>

            <Styled.Lead>
                <b>Production monitoring</b> means continuously observing your live app to catch errors,
                performance regressions, outages, and UX issues before users are affected. In practice it
                combines <i>logs</i>, <i>metrics</i>, <i>traces</i>, <i>real-user data</i>,
                <i>synthetic checks</i>, and <i>alerts</i> tied to clear reliability goals.
            </Styled.Lead>

            {/* 1) Why & goals */}
            <Styled.Section>
                <Styled.H2>Why monitor? 3 concrete goals</Styled.H2>
                <Styled.List>
                    <li><b>Detect</b> problems fast (errors, slow pages, downtime).</li>
                    <li><b>Diagnose</b> root cause (which release, which route, which API?).</li>
                    <li><b>Decide</b> actions (roll back, hotfix, raise an incident, adjust capacity).</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Core concepts (definitions) */}
            <Styled.Section>
                <Styled.H2>Core concepts (clear definitions)</Styled.H2>
                <Styled.List>
                    <li><b>Log:</b> timestamped text record of something that happened (e.g., "/api/cart 500").</li>
                    <li><b>Metric:</b> a numeric time-series (e.g., error_rate=1.2%, LCP=2.4s).</li>
                    <li><b>Trace:</b> a request's path across services with spans/timings (helps find slow hop).</li>
                    <li><b>RUM (Real User Monitoring):</b> data from real users in the field (Core Web Vitals, JS errors, device info).</li>
                    <li><b>Synthetic monitoring:</b> scripted "robots" that visit pages or ping endpoints on a schedule to catch issues even when no users are active.</li>
                    <li><b>Uptime check:</b> simple "is it up?" HTTP check for 200 OK.</li>
                    <li><b>Health check:</b> an endpoint that reports service health (e.g., dependencies OK, build info).</li>
                    <li><b>Alert:</b> an automated notification when a metric crosses a threshold (e.g., error_rate &gt; 2%).</li>
                    <li><b>SLO/SLA:</b> target reliability (e.g., "99.9% monthly uptime"); SLA is the external promise, SLO is the internal objective.</li>
                    <li><b>Core Web Vitals:</b> key UX metrics—<b>LCP</b> (loading), <b>CLS</b> (visual stability), <b>INP</b> (interactivity; replaced FID), plus <b>TTFB</b>.</li>
                    <li><b>Source maps:</b> files that map minified code to your source so stack traces are readable.</li>
                    <li><b>Release tag:</b> a version label attached to errors/metrics so you can pinpoint which deploy introduced a problem.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) What to monitor in a React app */}
            <Styled.Section>
                <Styled.H2>What to monitor in a React app</Styled.H2>
                <Styled.List>
                    <li><b>JavaScript errors</b>: runtime errors, unhandled promise rejections, React error boundaries.</li>
                    <li><b>Performance</b>: Core Web Vitals (LCP/CLS/INP), TTFB, hydration time, route transition times.</li>
                    <li><b>API calls</b>: failure rates, latency percentiles (p95/p99), timeouts, bad responses.</li>
                    <li><b>Availability</b>: uptime checks for the site and key APIs; status page.</li>
                    <li><b>User flows</b>: synthetic checks for "Login → Dashboard," "Add to Cart → Pay," etc.</li>
                    <li><b>Releases</b>: which version is live, error rate by release.</li>
                    <li><b>Frontend-edge signals</b>: CDN cache hit ratio, 4xx/5xx by path, asset download errors.</li>
                </Styled.List>
            </Styled.Section>

            {/* 4) Errors: boundaries + global listeners */}
            <Styled.Section>
                <Styled.H2>Capturing errors (boundaries + global listeners)</Styled.H2>
                <Styled.Pre>
                    {`// Error Boundary: catches render errors in its child tree
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // send to your logger/monitor here
    navigator.sendBeacon?.("/monitor/error", JSON.stringify({
      type: "render_error",
      message: error?.message,
      stack: error?.stack,
      info
    }));
  }

  render() {
    if (this.state.hasError) {
      return <div role="alert">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}

// Global listeners: runtime errors & unhandled rejections
window.addEventListener("error", (e) => {
  navigator.sendBeacon?.("/monitor/error", JSON.stringify({
    type: "window_error",
    message: e.error?.message || e.message,
    stack: e.error?.stack,
    source: e.filename, line: e.lineno, col: e.colno
  }));
});

window.addEventListener("unhandledrejection", (e) => {
  navigator.sendBeacon?.("/monitor/error", JSON.stringify({
    type: "unhandled_rejection",
    reason: String(e.reason)
  }));
});`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Error Boundary</b> catches render errors; global listeners catch runtime errors and rejected promises.
                    <b>sendBeacon</b> ships data reliably even during page unload.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Performance: Core Web Vitals */}
            <Styled.Section>
                <Styled.H2>Performance (Core Web Vitals)</Styled.H2>
                <Styled.List>
                    <li><b>LCP</b>: time to largest element (image/text) becoming visible—keep &lt;2.5s.</li>
                    <li><b>CLS</b>: sum of unexpected layout shifts—keep &lt;0.1.</li>
                    <li><b>INP</b>: overall interaction latency for clicks/typing—keep &lt;200ms (good).</li>
                    <li><b>TTFB</b>: server response start—affects all downstream performance.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Collect Web Vitals (client) and send to your endpoint
// npm i web-vitals
import { onLCP, onCLS, onINP, onTTFB } from "web-vitals";

function report(name, value, id) {
  const body = JSON.stringify({ name, value, id, url: location.href, ts: Date.now(), release: window.__BUILD_ID__ });
  navigator.sendBeacon?.("/monitor/vitals", body) || fetch("/monitor/vitals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body
  });
}

onLCP((m) => report("LCP", m.value, m.id));
onCLS((m) => report("CLS", m.value, m.id));
onINP((m) => report("INP", m.value, m.id));
onTTFB((m) => report("TTFB", m.value, m.id));`}
                </Styled.Pre>
                <Styled.Small>
                    Store vitals as time-series (e.g., p50/p75/p95). Alert on regressions per route or per release.
                </Styled.Small>
            </Styled.Section>

            {/* 6) API monitoring (simple fetch wrapper) */}
            <Styled.Section>
                <Styled.H2>API monitoring (client-side)</Styled.H2>
                <Styled.Pre>
                    {`// Wrap fetch to log failures & latency
export async function api(url, opts) {
  const start = performance.now();
  try {
    const res = await fetch(url, opts);
    const ok = res.ok;
    const latency = performance.now() - start;

    if (!ok) {
      navigator.sendBeacon?.("/monitor/api", JSON.stringify({
        url, status: res.status, latency, method: (opts?.method || "GET")
      }));
    }
    return res;
  } catch (err) {
    const latency = performance.now() - start;
    navigator.sendBeacon?.("/monitor/api", JSON.stringify({
      url, status: "network_error", latency, message: err?.message
    }));
    throw err;
  }
}`}
                </Styled.Pre>
                <Styled.Small>
                    Record <b>status</b>, <b>latency</b>, and <b>route</b>. Correlate spikes with deploys and traffic.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Releases & source maps */}
            <Styled.Section>
                <Styled.H2>Releases & Source Maps</Styled.H2>
                <Styled.List>
                    <li><b>Release tag:</b> embed a build ID (commit hash/CI run) in the page (e.g., <Styled.InlineCode>window.__BUILD_ID__</Styled.InlineCode>). Send it with every error/metric.</li>
                    <li><b>Source maps:</b> generate during build so stack traces de-minify to readable file/line.</li>
                    <li><b>Privacy:</b> upload source maps to your monitoring tool, avoid exposing them publicly.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Vite tip (in build config): generate source maps for error de-minification
// export default defineConfig({ build: { sourcemap: true } })
//
// In index.html (injected by CI):
// <script>window.__BUILD_ID__ = "2025-09-19T12:34:56Z-commit_abcd1234";</script>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Synthetic checks & health */}
            <Styled.Section>
                <Styled.H2>Synthetic checks & Health endpoints</Styled.H2>
                <Styled.List>
                    <li><b>Uptime check:</b> hit your home page and key routes every minute.</li>
                    <li><b>Journey checks:</b> script critical flows (login, add-to-cart, checkout) to run every 5-15 min.</li>
                    <li><b>Health endpoint:</b> backend route that returns dependency status, build, and time.</li>
                    <li><b>Status page:</b> public "current status" + incidents history for transparency.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Example health response (server-side pseudo):
// GET /health -> { ok: true, build: __BUILD_ID__, db: "ok", cache: "ok", time: Date.now() }`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Alerts & SLOs */}
            <Styled.Section>
                <Styled.H2>Alerts & SLOs (good defaults)</Styled.H2>
                <Styled.List>
                    <li><b>Error rate</b> &gt; 1% for 5 min (per release) ⇒ alert.</li>
                    <li><b>LCP p75</b> &gt; 2.5s for 15 min (per route) ⇒ alert.</li>
                    <li><b>Uptime</b> &lt; 99.9% monthly ⇒ incident review.</li>
                    <li><b>APIs p95 latency</b> &gt; 800ms for 10 min ⇒ alert.</li>
                </Styled.List>
                <Styled.Small>
                    Start lenient; tighten after baseline is known. Always link alerts to runbooks ("what to do next").
                </Styled.Small>
            </Styled.Section>

            {/* 10) Security & PII */}
            <Styled.Section>
                <Styled.H2>Security & PII (don't leak data)</Styled.H2>
                <Styled.List>
                    <li><b>Scrub</b> emails, tokens, addresses from logs/errors before sending.</li>
                    <li><b>Rate-limit</b> telemetry endpoints; accept only your domain (CORS).</li>
                    <li><b>Batch</b> non-urgent signals; prefer <Styled.InlineCode>sendBeacon</Styled.InlineCode> to reduce user-visible overhead.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Do & Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> tag data with release, route, and device; it makes triage 10× faster.</li>
                    <li><b>Do</b> ship source maps privately; de-minified stacks save hours.</li>
                    <li><b>Do</b> add an Error Boundary high in the tree and per "risky" areas (editors, 3rd-party widgets).</li>
                    <li><b>Don't</b> alert on single events; alert on rates and windows to avoid noise.</li>
                    <li><b>Don't</b> log sensitive user data or full request bodies.</li>
                </Styled.List>
            </Styled.Section>

            {/* 12) Small glossary */}
            <Styled.Section>
                <Styled.H2>Glossary (quick recap)</Styled.H2>
                <Styled.List>
                    <li><b>p50/p75/p95/p99:</b> percentiles (e.g., p95 latency = 95% of requests are faster than this).</li>
                    <li><b>Anomaly detection:</b> automatic outlier detection versus a learned baseline.</li>
                    <li><b>Runbook:</b> documented steps to handle a specific alert (who, what, how).</li>
                    <li><b>On-call:</b> rotation for handling alerts quickly at any hour.</li>
                    <li><b>Feature flag:</b> switch features on/off at runtime to mitigate incidents without redeploy.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                <b>Bottom line:</b> measure what users feel (Web Vitals), catch what breaks (errors), and
                wire alerts to actions. Tag data with your release, keep source maps private, and use
                simple synthetic checks to catch issues before your users do.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default ProdMonitoring;
