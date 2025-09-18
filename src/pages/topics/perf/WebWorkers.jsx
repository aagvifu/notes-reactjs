import React from "react";
import { Styled } from "./styled";

const WebWorkers = () => {
    return (
        <Styled.Page>
            <Styled.Title>Web Workers</Styled.Title>

            <Styled.Lead>
                <b>Web Workers</b> let you run JavaScript on a background thread so heavy CPU work
                doesn't block the UI (scrolling, typing, animations). You send messages to a worker,
                it computes, and sends results back—keeping the <b>main thread</b> responsive.
            </Styled.Lead>

            {/* 1) What & why */}
            <Styled.Section>
                <Styled.H2>Definition & Purpose</Styled.H2>
                <Styled.List>
                    <li><b>Main thread:</b> the browser's UI thread. It runs React rendering, layout, painting, and most JS.</li>
                    <li><b>Web Worker:</b> a separate JS thread (no DOM access) for CPU-intensive tasks (parsing, encoding, math, AI inference, etc.).</li>
                    <li><b>Goal:</b> offload expensive work and keep interactions smooth (avoid “page is unresponsive”).</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Worker types */}
            <Styled.Section>
                <Styled.H2>Worker Types (Know the differences)</Styled.H2>
                <Styled.List>
                    <li><b>Dedicated Worker:</b> one page ↔ one worker instance. Best for component-local tasks.</li>
                    <li><b>Shared Worker:</b> multiple tabs/windows can talk to the same worker (shared context).</li>
                    <li><b>Service Worker:</b> background proxy between app and network (caching, offline, push). <i>Not</i> a compute worker for components.</li>
                    <li><b>Module Worker:</b> a worker whose script is an ES module (<Styled.InlineCode>{`{ type: "module" }`}</Styled.InlineCode>)—supports imports and strict mode by default.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Communication model */}
            <Styled.Section>
                <Styled.H2>How Workers Communicate</Styled.H2>
                <Styled.List>
                    <li><b>postMessage / onmessage:</b> send JSON-serializable data between main thread and worker.</li>
                    <li><b>Structured clone:</b> the algorithm the browser uses to copy complex objects (Map, Set, ArrayBuffer, File, etc.) safely between threads.</li>
                    <li><b>Transferable objects:</b> pass ownership (zero-copy) of certain objects like <Styled.InlineCode>ArrayBuffer</Styled.InlineCode>, <Styled.InlineCode>MessagePort</Styled.InlineCode>, <Styled.InlineCode>ImageBitmap</Styled.InlineCode> to avoid cloning cost.</li>
                </Styled.List>
                <Styled.Small>
                    <b>Tip:</b> Prefer <i>transfer</i> large binary data instead of cloning it for better performance.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Vite setup pattern */}
            <Styled.Section>
                <Styled.H2>Vite Import Pattern (ES Modules)</Styled.H2>
                <Styled.Pre>
                    {`// Main thread (React component file)
const worker = new Worker(
  new URL("./prime.worker.js", import.meta.url),
  { type: "module" }
);`}
                </Styled.Pre>
                <Styled.Small>
                    Vite resolves the worker script at build time. Use <Styled.InlineCode>type: "module"</Styled.InlineCode> so you can import inside the worker.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Example: dedicated worker with progress */}
            <Styled.Section>
                <Styled.H2>Example: Dedicated Worker with Progress Updates</Styled.H2>
                <Styled.Pre>
                    {`// prime.worker.js (module worker)
self.onmessage = (e) => {
  const { max } = e.data;
  try {
    const primes = [];
    const isPrime = (n) => {
      if (n < 2) return false;
      for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
      return true;
    };

    const step = Math.max(1, Math.floor(max / 100));
    for (let n = 2; n <= max; n++) {
      if (isPrime(n)) primes.push(n);
      if (n % step === 0) {
        // stream progress to main thread
        self.postMessage({ type: "progress", value: Math.round((n / max) * 100) });
      }
    }
    self.postMessage({ type: "done", primes });
  } catch (err) {
    self.postMessage({ type: "error", message: String(err) });
  }
};`}
                </Styled.Pre>
                <Styled.Pre>
                    {`// React (main thread): create, talk, cleanup
import React from "react";

export function PrimeFinder() {
  const [progress, setProgress] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const workerRef = React.useRef(null);

  React.useEffect(() => {
    const w = new Worker(new URL("./prime.worker.js", import.meta.url), { type: "module" });
    workerRef.current = w;

    w.onmessage = (e) => {
      const msg = e.data;
      if (msg.type === "progress") setProgress(msg.value);
      if (msg.type === "done") { setCount(msg.primes.length); setProgress(100); }
      if (msg.type === "error") console.error("Worker error:", msg.message);
    };

    w.onerror = (ev) => console.error("Uncaught worker error:", ev.message);
    w.onmessageerror = (ev) => console.error("Message data could not be cloned:", ev);

    return () => { w.terminate(); };
  }, []);

  function start() {
    workerRef.current?.postMessage({ max: 250000 }); // heavy work off the main thread
  }

  return (
    <div>
      <button onClick={start}>Find primes</button>
      <p>Progress: {progress}% • Count: {count}</p>
    </div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>Pattern: create worker in <Styled.InlineCode>useEffect</Styled.InlineCode>, send a message to start, show progress, terminate on unmount.</Styled.Small>
            </Styled.Section>

            {/* 6) Transferable objects */}
            <Styled.Section>
                <Styled.H2>Transferable Objects (Zero-copy)</Styled.H2>
                <Styled.List>
                    <li><b>Definition:</b> a <i>transferable</i> can move across threads without cloning. Ownership changes hands; the sender's buffer becomes unusable.</li>
                    <li><b>Common:</b> <Styled.InlineCode>ArrayBuffer</Styled.InlineCode>, <Styled.InlineCode>MessagePort</Styled.InlineCode>, <Styled.InlineCode>ImageBitmap</Styled.InlineCode>.</li>
                    <li><b>Why:</b> large binary data (images, audio, numeric arrays) becomes fast to pass around.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Main thread - transfer a Float64Array buffer
const buf = new Float64Array(1_000_000);
worker.postMessage({ type: "data", buffer: buf.buffer }, [buf.buffer]); // transfer list
// buf.buffer is now "neutered" on the main thread (no longer usable)`}
                </Styled.Pre>
                <Styled.Pre>
                    {`// Worker - receive, wrap, and process
self.onmessage = (e) => {
  if (e.data.type === "data") {
    const view = new Float64Array(e.data.buffer);
    // ... compute ...
    // send results back (optionally transfer again)
    self.postMessage({ ok: true });
  }
};`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Limitations & gotchas */}
            <Styled.Section>
                <Styled.H2>Limitations & Gotchas</Styled.H2>
                <Styled.List>
                    <li><b>No DOM access:</b> workers can't touch the document, window layout, or React tree. Use messages to request UI updates.</li>
                    <li><b>Same-origin rules:</b> worker scripts must be served with proper CORS/headers.</li>
                    <li><b>Heavy messaging:</b> too many messages can bottleneck. Batch updates or send progress at intervals.</li>
                    <li><b>Memory:</b> large clones are expensive. Prefer transferables for big binary payloads.</li>
                    <li><b>Termination:</b> call <Styled.InlineCode>worker.terminate()</Styled.InlineCode> to free resources when done/unmounting.</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Patterns: pools, batching, cancel */}
            <Styled.Section>
                <Styled.H2>Patterns: Worker Pools, Batching, Cancellation</Styled.H2>
                <Styled.List>
                    <li><b>Worker pool:</b> keep N workers and dispatch jobs in round-robin for parallelism on multi-core CPUs.</li>
                    <li><b>Cancellation:</b> define a <Styled.InlineCode>{`{ type: "cancel", jobId }`}</Styled.InlineCode> message; the worker checks flags and stops work.</li>
                    <li><b>Backpressure:</b> when a worker is busy, queue jobs; avoid flooding it with messages.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Tiny cancellable protocol
// main thread
const jobId = crypto.randomUUID();
worker.postMessage({ type: "start", jobId, payload: { /* ... */ } });
// later...
worker.postMessage({ type: "cancel", jobId });

// worker
let cancelled = new Set();
self.onmessage = (e) => {
  const { type, jobId } = e.data;
  if (type === "cancel") { cancelled.add(jobId); return; }
  if (type === "start") {
    for (let i = 0; i < 1e9; i++) {
      if (cancelled.has(jobId)) return; // stop early
      // work...
    }
    self.postMessage({ type: "done", jobId });
  }
};`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) OffscreenCanvas mention */}
            <Styled.Section>
                <Styled.H2>Graphics: OffscreenCanvas (Optional)</Styled.H2>
                <Styled.List>
                    <li><b>OffscreenCanvas:</b> draw on a canvas from a worker (no UI thread jank).</li>
                    <li><b>Flow:</b> get <Styled.InlineCode>canvas.transferControlToOffscreen()</Styled.InlineCode> on main thread, send it to worker as transferable.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Main
const off = canvas.transferControlToOffscreen();
worker.postMessage({ canvas: off }, [off]);
// Worker
self.onmessage = (e) => {
  const ctx = e.data.canvas.getContext("2d");
  // render loop here...
};`}
                </Styled.Pre>
            </Styled.Section>

            {/* 10) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary (Quick Reference)</Styled.H2>
                <Styled.List>
                    <li><b>Main thread:</b> the UI thread that paints and runs most JS.</li>
                    <li><b>Worker:</b> JS thread without DOM access for background work.</li>
                    <li><b>Dedicated worker:</b> private to a single page.</li>
                    <li><b>Shared worker:</b> shared by multiple browsing contexts.</li>
                    <li><b>Service worker:</b> background network proxy (offline, cache, push).</li>
                    <li><b>Module worker:</b> worker that runs an ES module.</li>
                    <li><b>Structured clone:</b> safe deep-copy algorithm used by <Styled.InlineCode>postMessage</Styled.InlineCode>.</li>
                    <li><b>Transferable:</b> objects whose ownership can move between threads (<Styled.InlineCode>ArrayBuffer</Styled.InlineCode>, etc.).</li>
                    <li><b>MessageChannel:</b> two connected <Styled.InlineCode>MessagePort</Styled.InlineCode>s for duplex messaging.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Do & Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> offload heavy, CPU-bound work (parsing, compression, crypto, simulation).</li>
                    <li><b>Do</b> stream progress and batch messages (avoid chatty loops).</li>
                    <li><b>Do</b> terminate workers when done and reuse via pools for frequent jobs.</li>
                    <li><b>Don't</b> try to manipulate the DOM from a worker (impossible by design).</li>
                    <li><b>Don't</b> clone huge buffers; <b>transfer</b> them.</li>
                    <li><b>Don't</b> create a new worker per keystroke—debounce or queue work.</li>
                </Styled.List>
            </Styled.Section>

            {/* 12) Step-by-step starter */}
            <Styled.Section>
                <Styled.H2>Step-by-Step: Add a Worker to a React Component</Styled.H2>
                <Styled.List>
                    <li><b>1.</b> Create <Styled.InlineCode>*.worker.js</Styled.InlineCode> with an <Styled.InlineCode>onmessage</Styled.InlineCode> handler.</li>
                    <li><b>2.</b> In the component, construct it via <Styled.InlineCode>new Worker(new URL(...), {`{ "{ type: 'module' }" }`})</Styled.InlineCode>.</li>
                    <li><b>3.</b> Hook up <Styled.InlineCode>onmessage</Styled.InlineCode>/<Styled.InlineCode>onerror</Styled.InlineCode>, send a <Styled.InlineCode>postMessage</Styled.InlineCode> to start.</li>
                    <li><b>4.</b> Update React state from messages; clean up with <Styled.InlineCode>terminate()</Styled.InlineCode> on unmount.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Use Web Workers to keep React apps smooth under heavy CPU load. Communicate with
                <i> postMessage </i> using structured clone, transfer big binary data, stream progress, and
                terminate workers when done. Start small with a dedicated worker, then evolve into pools and
                OffscreenCanvas as needs grow.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default WebWorkers;
