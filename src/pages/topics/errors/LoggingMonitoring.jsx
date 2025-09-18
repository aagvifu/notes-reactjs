import { Styled } from "./styled";

const LoggingMonitoring = () => {
    return (
        <Styled.Page>
            <Styled.Title>Logging &amp; Monitoring</Styled.Title>

            <Styled.Lead>
                <b>Logging</b> is recording facts about what the app did (events, errors, context).
                <b> Monitoring</b> is observing those logs/metrics over time to detect problems early and act.
                Together they give you visibility into crashes, failed API calls, and user-impacting issues.
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>Definitions &amp; Goals</Styled.H2>
                <Styled.List>
                    <li><b>Error:</b> A problem in code or the environment that prevents expected behavior.</li>
                    <li><b>Exception:</b> A runtime error object thrown by JavaScript (e.g., <Styled.InlineCode>throw new Error()</Styled.InlineCode>).</li>
                    <li><b>Handled error:</b> You anticipated it and responded (UI fallback, retry).</li>
                    <li><b>Unhandled error:</b> It escaped code paths and bubbles to global handlers.</li>
                    <li><b>Logging:</b> Persisting structured information about events (message, stack, context).</li>
                    <li><b>Monitoring:</b> Tracking rates/trends of errors/latency and alerting on thresholds.</li>
                    <li><b>Telemetry:</b> Automatic capture of metrics (error rate, API failures, performance).</li>
                    <li><b>Observability:</b> Ability to answer “what's wrong?” using logs, metrics, and traces.</li>
                    <li><b>Breadcrumbs:</b> A recent trail of user actions/state (e.g., route changes, clicks) captured to give error context.</li>
                    <li><b>Correlation/Trace ID:</b> An ID you attach to related logs (front-end ↔ back-end) to follow one request end-to-end.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) What to capture */}
            <Styled.Section>
                <Styled.H2>What should a front-end log?</Styled.H2>
                <Styled.List>
                    <li><b>Error details:</b> name, message, stack, component/page/route.</li>
                    <li><b>Environment:</b> app version/commit, build date, feature flags.</li>
                    <li><b>Device:</b> OS, browser, viewport, timezone, locale (safe subset).</li>
                    <li><b>Network/API:</b> method, URL (redacted), status, duration, response size (approx).</li>
                    <li><b>Breadcrumbs:</b> last N user actions (route changed, clicked X, submitted Y).</li>
                    <li><b>User context:</b> a hashed or anonymous ID (avoid raw PII).</li>
                    <li><b>Correlation ID:</b> pass the same ID in <Styled.InlineCode>X-Request-Id</Styled.InlineCode> headers to backend.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Levels */}
            <Styled.Section>
                <Styled.H2>Log levels (when to use what)</Styled.H2>
                <Styled.List>
                    <li><b>debug</b>: noisy, for local dev or temporary diagnostics.</li>
                    <li><b>info</b>: high-level app events (login succeeded, page loaded).</li>
                    <li><b>warn</b>: unexpected but non-fatal (fallback used, retry scheduled).</li>
                    <li><b>error</b>: a failure that impacted the user (unhandled rejection, API 500).</li>
                    <li><b>fatal</b>: app can't continue (boot failed, essential resource missing).</li>
                </Styled.List>
            </Styled.Section>

            {/* 4) Structured logging */}
            <Styled.Section>
                <Styled.H2>Structured logging (JSON)</Styled.H2>
                <Styled.Pre>
                    {`// Keep a consistent schema. Avoid free-form strings only.
const log = {
  ts: new Date().toISOString(),
  level: "error",
  event: "api.request.failed",
  route: "/cart",
  message: "Add to cart failed",
  error: { name: "TypeError", message: "c is not a function", stack },
  http: { method: "POST", url: "/api/cart", status: 500, duration_ms: 812 },
  device: { ua: navigator.userAgent, viewport: [innerWidth, innerHeight] },
  app: { version: APP_VERSION, commit: APP_COMMIT },
  user: { id_anonymous: "6f2c...e9" },        // avoid raw PII
  trace: { id: "c2c5-...-a91" },
  breadcrumbs: [
    { t: -1200, type: "route", path: "/product/123" },
    { t: -800, type: "click", label: "AddToCart" }
  ]
};`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Privacy & safety */}
            <Styled.Section>
                <Styled.H2>Privacy, Safety &amp; Performance</Styled.H2>
                <Styled.List>
                    <li><b>PII redaction:</b> never log emails, phone numbers, addresses in clear text.</li>
                    <li><b>Sampling:</b> send 100% of <i>errors</i>, sample <i>info/debug</i> (e.g., 10%).</li>
                    <li><b>Rate limiting:</b> avoid flooding the server during loops/spikes.</li>
                    <li><b>Compression/batching:</b> batch logs to reduce network overhead.</li>
                    <li><b>Consent:</b> honor user consent and regional regulations.</li>
                </Styled.List>
            </Styled.Section>

            {/* 6) Minimal logger utility */}
            <Styled.Section>
                <Styled.H2>Example: Minimal Logger Utility</Styled.H2>
                <Styled.Pre>
                    {`// logger.js (example shape)
// Usage: const logger = createLogger({ app: { version, commit } });

export function createLogger({ app, transport, sample = { debug: 0, info: 0.1, warn: 1, error: 1, fatal: 1 } } = {}) {
  const state = {
    app,
    breadcrumbs: [],
    traceId: crypto?.randomUUID?.() ?? String(Math.random()).slice(2),
  };

  function shouldSend(level) {
    const p = sample[level] ?? 1;
    return Math.random() < p;
  }

  function redact(obj) {
    // naive redaction for emails/phones inside strings
    const s = JSON.stringify(obj);
    const redacted = s
      .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}/gi, "[email]")
      .replace(/\\b\\+?\\d[\\d\\s()-]{7,}\\b/g, "[phone]");
    return JSON.parse(redacted);
  }

  function base(level, event, payload = {}) {
    return {
      ts: new Date().toISOString(),
      level,
      event,
      app: state.app,
      trace: { id: state.traceId },
      breadcrumbs: [...state.breadcrumbs],
      ...payload,
    };
  }

  async function send(level, event, payload) {
    const entry = redact(base(level, event, payload));
    if (!shouldSend(level)) return;
    try {
      if (transport) await transport(entry);
      else console[level === "debug" ? "log" : level]?.("[log]", entry);
    } catch { /* swallow */ }
  }

  const api = {
    addBreadcrumb(bc) {
      state.breadcrumbs.push({ ...bc, t: Date.now() });
      state.breadcrumbs = state.breadcrumbs.slice(-20);
    },
    setTrace(id) { state.traceId = id; },

    debug: (event, payload) => send("debug", event, payload),
    info:  (event, payload) => send("info",  event, payload),
    warn:  (event, payload) => send("warn",  event, payload),
    error: (event, payload) => send("error", payload?.event || event, payload),
    fatal: (event, payload) => send("fatal", payload?.event || event, payload),
  };

  // Global handlers
  if (typeof window !== "undefined") {
    window.addEventListener("error", (e) => {
      api.error("unhandled.error", {
        message: e?.message, 
        error: { name: e?.error?.name, message: e?.error?.message, stack: e?.error?.stack },
        where: "window.onerror",
      });
    });
    window.addEventListener("unhandledrejection", (e) => {
      const err = e?.reason instanceof Error ? e.reason : new Error(String(e?.reason));
      api.error("unhandled.rejection", {
        message: err.message,
        error: { name: err.name, message: err.message, stack: err.stack },
        where: "unhandledrejection",
      });
    });
  }

  return api;
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Transport</b> is a function that actually ships the log (e.g., POST to <Styled.InlineCode>/api/logs</Styled.InlineCode>).
                    <b> Redaction</b> removes obvious PII patterns. For production, refine with stricter rules.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Transport example */}
            <Styled.Section>
                <Styled.H2>Example: Transport (send logs to server)</Styled.H2>
                <Styled.Pre>
                    {`// transport.js
export async function httpTransport(entry) {
  await fetch("/api/logs", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Request-Id": entry?.trace?.id },
    body: JSON.stringify(entry),
    keepalive: true, // allows send during unload on some browsers
  });
}

// init
// const logger = createLogger({ app: { version: APP_VERSION }, transport: httpTransport });`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Instrument fetch */}
            <Styled.Section>
                <Styled.H2>Instrumenting <code>fetch</code> (network breadcrumbs)</Styled.H2>
                <Styled.Pre>
                    {`// fetch-instrumentation.js
export function instrumentFetch(logger) {
  if (typeof window === "undefined" || !window.fetch) return;
  const orig = window.fetch;
  window.fetch = async (...args) => {
    const started = Date.now();
    const [input, init] = args;
    const method = (init?.method || "GET").toUpperCase();
    const url = typeof input === "string" ? input : input.url;

    try {
      const res = await orig(...args);
      const duration = Date.now() - started;
      const ev = res.ok ? "api.request.ok" : "api.request.failed";
      logger.info(ev, { http: { method, url, status: res.status, duration_ms: duration } });
      return res;
    } catch (error) {
      const duration = Date.now() - started;
      logger.error("api.request.error", {
        message: error?.message,
        error: { name: error?.name, message: error?.message, stack: error?.stack },
        http: { method, url, duration_ms: duration }
      });
      throw error;
    }
  };
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Using in React */}
            <Styled.Section>
                <Styled.H2>Wiring into a React app</Styled.H2>
                <Styled.Pre>
                    {`// AppProviders.jsx (example)
import React from "react";
import { createLogger } from "./logger";
import { httpTransport } from "./transport";
import { instrumentFetch } from "./fetch-instrumentation";

export const LoggerContext = React.createContext(null);

export default function AppProviders({ children }) {
  const loggerRef = React.useRef(null);

  if (!loggerRef.current) {
    loggerRef.current = createLogger({
      app: { version: APP_VERSION, commit: APP_COMMIT },
      transport: httpTransport,
      sample: { debug: 0, info: 0.1, warn: 1, error: 1, fatal: 1 },
    });
    instrumentFetch(loggerRef.current);
  }

  // Example breadcrumbs: route changes, interactions
  React.useEffect(() => {
    function onClick(e) {
      const btn = e.target.closest("button, a");
      if (btn?.textContent) {
        loggerRef.current.addBreadcrumb({ type: "click", label: btn.textContent.trim() });
      }
    }
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  return (
    <LoggerContext.Provider value={loggerRef.current}>
      {children}
    </LoggerContext.Provider>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    In pages/components you can call <Styled.InlineCode>const logger = React.useContext(LoggerContext)</Styled.InlineCode> then
                    <Styled.InlineCode>logger.error("ui.failed", {`{{message, error}}`})</Styled.InlineCode>.
                </Styled.Small>
            </Styled.Section>

            {/* 10) Monitoring: what to watch */}
            <Styled.Section>
                <Styled.H2>Monitoring: what to watch &amp; alert on</Styled.H2>
                <Styled.List>
                    <li><b>JS exception rate:</b> errors per 1,000 sessions (spikes mean new bug).</li>
                    <li><b>API failure rate:</b> 4xx/5xx ratio per endpoint; alert on sustained 5xx &gt; 2%.</li>
                    <li><b>Cold start/boot failures:</b> bundle load errors, feature-flag misconfig.</li>
                    <li><b>Retry storms:</b> repeated retry loops indicate user pain and server strain.</li>
                    <li><b>Geography/version skew:</b> errors isolated to one country/browser/app version.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> log errors with stack, route, and correlation ID.</li>
                    <li><b>Do</b> redact PII and sample non-critical logs.</li>
                    <li><b>Do</b> batch/compress to save user bandwidth.</li>
                    <li><b>Don't</b> log entire responses/bodies unless essential (and never raw secrets).</li>
                    <li><b>Don't</b> rely on console alone; ship to a backend.</li>
                </Styled.List>
            </Styled.Section>

            {/* 12) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>PII:</b> Personally Identifiable Information (e.g., email, phone). Avoid logging raw PII.</li>
                    <li><b>Sampling:</b> Sending only a fraction of certain log levels to control volume.</li>
                    <li><b>Rate limiting:</b> Capping how many logs are sent per time window.</li>
                    <li><b>Keepalive:</b> Allows requests to continue during page unload on some browsers.</li>
                    <li><b>RUM:</b> Real User Monitoring—metrics gathered from real user sessions, not lab tests.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: capture errors with context, ship structured logs safely, and watch rates over time.
                Redact PII, sample non-critical logs, and correlate front-end ↔ back-end with a trace ID.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default LoggingMonitoring;
