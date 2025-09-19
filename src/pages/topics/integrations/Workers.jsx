import { Styled } from "./styled";

const Workers = () => {
    return (
        <Styled.Page>
            <Styled.Title>Workers</Styled.Title>

            <Styled.Lead>
                <b>Workers</b> run JavaScript off the main UI thread so heavy work doesn't freeze your app.
                They use <Styled.InlineCode>postMessage</Styled.InlineCode> to talk with the main thread and
                can massively improve responsiveness for CPU-bound tasks (parsing, crunching, image transforms).
            </Styled.Lead>

            {/* 1) What & Why */}
            <Styled.Section>
                <Styled.H2>Definition & Purpose</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Web Worker:</b> a background script with its <em>own event loop</em> and <em>no DOM access</em>.
                        Ideal for CPU-heavy logic. Communicates via messages.
                    </li>
                    <li>
                        <b>SharedWorker:</b> like a Web Worker but shared by multiple tabs/windows of the same origin.
                        Good for multi-tab coordination or caching shared state.
                    </li>
                    <li>
                        <b>Service Worker:</b> a special worker that sits between your app and the network.
                        Enables offline, caching, and push. Runs even when the page is closed.
                    </li>
                    <li>
                        <b>Worklets:</b> small, specialized workers hosted by browser subsystems
                        (e.g., <Styled.InlineCode>AudioWorklet</Styled.InlineCode>, CSS Paint/Animation Worklet).
                        They run tiny, time-critical code off the main thread.
                    </li>
                    <li>
                        <b>Main thread:</b> the UI thread that renders DOM, runs React, handles input.
                        Keeping it free prevents jank, dropped frames, and input lag.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) React + Worker mental model */}
            <Styled.Section>
                <Styled.H2>React + Workers: Mental Model</Styled.H2>
                <Styled.List>
                    <li>
                        React stays on the main thread rendering UI. Heavy tasks go to a worker.
                        Send inputs to the worker; receive results; then update state.
                    </li>
                    <li>
                        Workers can't touch the DOM or React state directly—only message passing is allowed.
                    </li>
                    <li>
                        Prefer a <b>pure function</b> interface for worker logic; it's easier to test and reuse.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Vite-friendly Web Worker example */}
            <Styled.Section>
                <Styled.H2>Web Worker (Vite-friendly) — Example</Styled.H2>
                <Styled.Small>Use <Styled.InlineCode>new URL("./file.js", import.meta.url)</Styled.InlineCode> and <Styled.InlineCode>{`{ type: "module" }`}</Styled.InlineCode>.</Styled.Small>
                <Styled.Pre>
                    {`// src/pages/topics/integrations/examples/heavy.worker.js
// A simple CPU-heavy task (e.g., sum large array)
self.onmessage = (e) => {
  const { cmd, payload } = e.data || {};
  if (cmd === "sum") {
    const arr = payload || [];
    let total = 0;
    for (let i = 0; i < arr.length; i++) total += arr[i];
    self.postMessage({ ok: true, result: total });
  }
};

self.onerror = (err) => {
  // Errors inside the worker
  // You can also post back a structured error if desired
};

// Optional: handle malformed messages
self.onmessageerror = () => {
  self.postMessage({ ok: false, error: "Message could not be deserialized." });
};`}
                </Styled.Pre>

                <Styled.Pre>
                    {`// src/pages/topics/integrations/examples/WorkerDemo.jsx
import React from "react";

export default function WorkerDemo() {
  const [total, setTotal] = React.useState(null);
  const [status, setStatus] = React.useState("idle");

  React.useEffect(() => {
    // Create the worker (Vite-friendly URL + module type)
    const worker = new Worker(
      new URL("./heavy.worker.js", import.meta.url),
      { type: "module" }
    );

    worker.onmessage = (e) => {
      const { ok, result, error } = e.data || {};
      if (!ok) {
        setStatus("error");
        console.error(error);
      } else {
        setTotal(result);
        setStatus("done");
      }
    };

    worker.onerror = (err) => {
      setStatus("error");
      console.error("Worker error:", err);
    };

    // Send a big array once mounted
    setStatus("working");
    const big = Array.from({ length: 2_000_00 }, (_, i) => (i % 7) - 3);
    worker.postMessage({ cmd: "sum", payload: big });

    // Cleanup when component unmounts (terminate frees resources)
    return () => worker.terminate();
  }, []);

  return (
    <div>
      <p>Status: {status}</p>
      <p>Sum: {total ?? "…"}</p>
    </div>
  );
}`}
                </Styled.Pre>

                <Styled.Small>
                    <b>Key terms:</b> <i>terminate()</i> stops the worker; <i>postMessage()</i> sends data;{" "}
                    the <i>message</i> event receives results. Data is structured-cloned by default.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Transferables & performance */}
            <Styled.Section>
                <Styled.H2>Transferables for Speed (ArrayBuffer, OffscreenCanvas)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Structured clone:</b> the default way messages copy data. For large binary data, copying is expensive.
                    </li>
                    <li>
                        <b>Transferable:</b> objects like <Styled.InlineCode>ArrayBuffer</Styled.InlineCode> can be
                        <em>transferred</em> (moved, not copied) to the worker for zero-copy performance.
                    </li>
                    <li>
                        <b>OffscreenCanvas:</b> a canvas that can be used in a worker for rendering off the main thread.
                        Transfer it using <Styled.InlineCode>postMessage(canvas, [canvas])</Styled.InlineCode> after calling{" "}
                        <Styled.InlineCode>canvas.transferControlToOffscreen()</Styled.InlineCode>.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Transferring an ArrayBuffer (fast, no copy):
const buffer = new ArrayBuffer(1024 * 1024); // 1 MB
worker.postMessage({ cmd: "process", buffer }, [buffer]);
// After transfer, 'buffer' is detached (unusable) on the sender side.`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Using Comlink (optional ergonomic wrapper) */}
            <Styled.Section>
                <Styled.H2>Optional: Comlink (RPC-style API)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Comlink:</b> a tiny library that wraps <i>postMessage</i> and lets you call worker
                        functions as if they were local (Promises behind the scenes).
                    </li>
                    <li>
                        It makes workers feel like modules with async functions—great for readability.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Worker (math.worker.js)
import * as Comlink from "comlink";
const api = {
  async multiply(a, b) {
    // pretend it's expensive
    return a * b;
  }
};
Comlink.expose(api);

// Main thread
import * as Comlink from "comlink";
const w = new Worker(new URL("./math.worker.js", import.meta.url), { type: "module" });
const workerApi = Comlink.wrap(w);
const result = await workerApi.multiply(6, 7); // 42`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) SharedWorker sketch */}
            <Styled.Section>
                <Styled.H2>Shared Worker (multi-tab)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>SharedWorker:</b> one shared background script for all tabs of the same origin.
                        Communication uses <Styled.InlineCode>MessagePort</Styled.InlineCode>.
                    </li>
                    <li>Good for shared cache, presence indicators, or broadcasting messages across tabs.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// main.js
const shared = new SharedWorker(new URL("./shared.js", import.meta.url), { type: "module" });
shared.port.start();
shared.port.onmessage = (e) => console.log("From shared:", e.data);
shared.port.postMessage({ hello: "from tab" });

// shared.js
onconnect = (e) => {
  const port = e.ports[0];
  port.onmessage = (msg) => {
    // Broadcast to all connected ports if you store them
    port.postMessage({ pong: msg.data });
  };
};`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Service Worker overview */}
            <Styled.Section>
                <Styled.H2>Service Worker (offline, caching, push)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Service Worker:</b> a network proxy in your browser. Lets you cache assets/API responses,
                        serve offline, and receive push notifications.
                    </li>
                    <li>
                        Registered once per origin + scope; updates when files change. Works even if the page is closed.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Basic registration (in your app entry, guarded for support)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(console.error);
  });
}`}
                </Styled.Pre>
                <Styled.Small>
                    For Vite apps, consider a plugin (e.g., PWA) to generate and manage the service worker.
                </Styled.Small>
            </Styled.Section>

            {/* 8) Error handling & cleanup */}
            <Styled.Section>
                <Styled.H2>Error Handling & Cleanup</Styled.H2>
                <Styled.List>
                    <li>
                        Add <Styled.InlineCode>worker.onerror</Styled.InlineCode> and{" "}
                        <Styled.InlineCode>worker.onmessageerror</Styled.InlineCode> for diagnostics.
                    </li>
                    <li>
                        Always <b>terminate</b> workers you no longer need to free memory and threads.
                    </li>
                    <li>
                        Validate inputs inside the worker; never trust message shapes implicitly.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> move CPU-heavy logic (parsing, transform, crypto, image ops) into workers.</li>
                    <li><b>Do</b> keep the worker API small and pure; pass inputs, return outputs.</li>
                    <li><b>Do</b> use transferables for large binary data and consider OffscreenCanvas for rendering.</li>
                    <li><b>Don't</b> try to touch the DOM from a worker—it's not allowed.</li>
                    <li><b>Don't</b> spam the bridge with many tiny messages; batch them if possible.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>postMessage:</b> function to send data between threads (structured clone by default).</li>
                    <li><b>Structured Clone:</b> algorithm that copies complex objects between threads safely.</li>
                    <li><b>Transferable:</b> an object that can be moved (not copied) across threads (e.g., ArrayBuffer).</li>
                    <li><b>MessagePort:</b> object representing one end of a message channel (used in SharedWorkers).</li>
                    <li><b>OffscreenCanvas:</b> a canvas that can be rendered from a worker (no main-thread blocking).</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Workers keep React UIs smooth by offloading heavy work. Start with Web Workers for
                CPU-bound tasks, consider SharedWorker for multi-tab coordination, Service Worker for offline
                and caching, and Worklets for specialized, real-time pipelines.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Workers;
