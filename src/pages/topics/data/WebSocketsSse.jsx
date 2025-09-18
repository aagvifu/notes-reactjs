import { Styled } from "./styled";

const WebSocketsSse = () => {
    return (
        <Styled.Page>
            <Styled.Title>WebSockets &amp; Server-Sent Events (SSE)</Styled.Title>

            <Styled.Lead>
                Real-time UIs need updates <i>without</i> manual refresh. Two browser-native options:
                <b> WebSockets</b> (two-way, full-duplex) and <b>SSE</b> (one-way, server ➜ client). Choose based on
                whether the browser must <em>send</em> live messages or only <em>receive</em> them.
            </Styled.Lead>

            {/* 1) Definitions */}
            <Styled.Section>
                <Styled.H2>Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>WebSocket:</b> a persistent, full-duplex connection between browser and server. After an HTTP
                        <Styled.InlineCode>Upgrade</Styled.InlineCode> handshake, both sides can send messages anytime.
                    </li>
                    <li>
                        <b>Full-duplex:</b> both directions can transmit simultaneously (browser ⇄ server).
                    </li>
                    <li>
                        <b>SSE (Server-Sent Events):</b> a long-lived HTTP response (MIME:{" "}
                        <Styled.InlineCode>text/event-stream</Styled.InlineCode>) where the <em>server pushes</em> messages
                        to the browser using the <Styled.InlineCode>EventSource</Styled.InlineCode> API.
                    </li>
                    <li>
                        <b>Unidirectional:</b> with SSE, traffic is server ➜ client only. The browser cannot send messages
                        on the same stream (use <Styled.InlineCode>fetch</Styled.InlineCode> or another channel for client ➜ server).
                    </li>
                    <li>
                        <b>Heartbeat:</b> low-cost “ping” messages that keep connections alive and detect disconnects.
                    </li>
                    <li>
                        <b>Reconnection / Backoff:</b> reconnecting after drops using delays that grow (e.g., 1s, 2s, 4s…).
                    </li>
                    <li>
                        <b>Last-Event-ID:</b> SSE field that lets the server resume from the last delivered event on reconnect.
                    </li>
                    <li>
                        <b>Subprotocol:</b> an agreed message protocol on WebSocket (e.g., <Styled.InlineCode>json</Styled.InlineCode>,
                        <Styled.InlineCode>graphql-ws</Styled.InlineCode>) negotiated via <Styled.InlineCode>Sec-WebSocket-Protocol</Styled.InlineCode>.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) When to use what */}
            <Styled.Section>
                <Styled.H2>When to Use WebSockets vs. SSE</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Use WebSockets</b> for chats, collaborative editors, multiplayer games, or anything needing
                        <em>client ➜ server</em> messages in real time (typing, presence, acks).
                    </li>
                    <li>
                        <b>Use SSE</b> for one-way streams: live dashboards, notifications, log/metrics feeds, server progress,
                        or LLM streaming tokens. It's simpler and auto-reconnects with built-in browser support.
                    </li>
                    <li>
                        <b>Binary data?</b> WebSockets support binary frames. SSE is text-only (UTF-8).
                    </li>
                    <li>
                        <b>Proxies/CDN:</b> SSE uses standard HTTP and often plays nicer with intermediaries; WebSockets need
                        proxy/CDN support for the Upgrade path.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 3) WebSocket: Browser client */}
            <Styled.Section>
                <Styled.H2>WebSocket - Browser Client</Styled.H2>
                <Styled.Pre>
                    {`// Minimal WebSocket client with safe reconnection and heartbeat
function connect({ url, protocols, onMessage, onOpen, onClose, onError }) {
  let ws;
  let attempts = 0;
  let heartbeat;

  function start() {
    ws = new WebSocket(url, protocols);
    ws.addEventListener("open", () => {
      attempts = 0;
      onOpen?.();
      // Heartbeat: ping every 25s (server should reply or echo)
      heartbeat = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: "ping" }));
      }, 25000);
    });

    ws.addEventListener("message", (e) => {
      // Messages are strings or ArrayBuffer/Blob
      try { onMessage?.(JSON.parse(e.data)); }
      catch { onMessage?.(e.data); }
    });

    ws.addEventListener("close", (e) => {
      clearInterval(heartbeat);
      onClose?.(e);
      // Exponential backoff, max 10s
      const delay = Math.min(10000, 1000 * 2 ** attempts++);
      setTimeout(start, delay);
    });

    ws.addEventListener("error", (err) => onError?.(err));
  }

  start();
  return {
    send(data) {
      if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify(data));
    },
    close() { clearInterval(heartbeat); ws?.close(); },
  };
}

// Usage:
const socket = connect({
  url: "wss://example.com/chat",
  protocols: ["json"], // optional
  onMessage: (msg) => console.log("server:", msg),
});`}
                </Styled.Pre>
                <Styled.Small>
                    You can't set custom headers in browser <Styled.InlineCode>WebSocket</Styled.InlineCode>.
                    Send tokens via cookies, query params, or a prior authenticated fetch that issues a signed URL.
                </Styled.Small>
            </Styled.Section>

            {/* 4) WebSocket: Message design */}
            <Styled.Section>
                <Styled.H2>WebSocket Message Design</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Envelope:</b> send objects like{" "}
                        <Styled.InlineCode>{`{ type: "chat.message", payload: {...} }`}</Styled.InlineCode> to route logic.
                    </li>
                    <li>
                        <b>Ordering & idempotency:</b> include <Styled.InlineCode>id</Styled.InlineCode> and timestamps; handle duplicates.
                    </li>
                    <li>
                        <b>Acks:</b> confirm receipt for at-least-once delivery semantics if needed.
                    </li>
                    <li>
                        <b>Backpressure:</b> if sending too fast, buffer and drop old updates (e.g., keep last state snapshot).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 5) SSE: Browser client */}
            <Styled.Section>
                <Styled.H2>SSE - Browser Client</Styled.H2>
                <Styled.Pre>
                    {`// EventSource automatically reconnects and supports Last-Event-ID
const es = new EventSource("https://example.com/events"); // cookies are sent by default
es.onmessage = (e) => {
  // default "message" event
  const data = JSON.parse(e.data);
  console.log("update:", data);
};
// Custom event type
es.addEventListener("price-tick", (e) => {
  const tick = JSON.parse(e.data);
  console.log("tick:", tick);
});
es.onerror = (err) => {
  // Temporary errors trigger auto reconnect; server can include "retry:" to control delay
  console.warn("sse error", err);
};
// Close when no longer needed
// es.close();`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Headers:</b> you can't add custom headers in <Styled.InlineCode>EventSource</Styled.InlineCode>.
                    Use cookies or query params for auth. The server can read <Styled.InlineCode>Last-Event-ID</Styled.InlineCode> to resume.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Server sketches (for understanding) */}
            <Styled.Section>
                <Styled.H2>Server Sketches (for Understanding)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>WebSocket server:</b> accepts the HTTP Upgrade and emits/broadcasts messages.
                    </li>
                    <li>
                        <b>SSE endpoint:</b> keeps an HTTP response open and sends lines prefixed with{" "}
                        <Styled.InlineCode>data:</Styled.InlineCode>, ending each event with a blank line.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// Node (Express) + ws: extremely simplified
import express from "express";
import { WebSocketServer } from "ws";
const app = express();
const server = app.listen(8080);
const wss = new WebSocketServer({ server });

wss.on("connection", (socket, req) => {
  socket.on("message", (raw) => {
    const msg = JSON.parse(raw.toString());
    // Echo or broadcast:
    wss.clients.forEach(c => c.readyState === 1 && c.send(JSON.stringify(msg)));
  });
  // heartbeat
  const ping = setInterval(() => socket.readyState === 1 && socket.send(JSON.stringify({ type: "ping" })), 25000);
  socket.on("close", () => clearInterval(ping));
});

// SSE: Express endpoint
app.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const send = (event, data, id) => {
    if (id) res.write(\`id: \${id}\\n\`);
    if (event !== "message") res.write(\`event: \${event}\\n\`);
    res.write(\`data: \${JSON.stringify(data)}\\n\\n\`);
  };

  // heartbeat every 15s
  const hb = setInterval(() => res.write(": keep-alive\\n\\n"), 15000);

  // example stream
  let n = 0;
  const iv = setInterval(() => send("price-tick", { price: 100 + ++n }, String(n)), 1000);

  req.on("close", () => { clearInterval(iv); clearInterval(hb); });
});`}
                </Styled.Pre>
                <Styled.Small>
                    These are learning snippets-don't paste into your app as-is. In production, add auth, limits,
                    and resiliency (see below).
                </Styled.Small>
            </Styled.Section>

            {/* 7) Reliability, Auth, and Production Notes */}
            <Styled.Section>
                <Styled.H2>Reliability, Auth &amp; Production Notes</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Auth:</b> browsers can't set custom headers for WS/SSE. Use cookies, query params, or a signed URL.
                        Validate the <Styled.InlineCode>Origin</Styled.InlineCode> header on the server.
                    </li>
                    <li>
                        <b>Reconnect:</b> implement exponential backoff (WebSockets). SSE auto-reconnects and supports{" "}
                        <Styled.InlineCode>retry:</Styled.InlineCode> and <Styled.InlineCode>Last-Event-ID</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Heartbeat:</b> ping/pong (WS) or comments (<Styled.InlineCode>:</Styled.InlineCode> lines in SSE) to keep intermediaries from timing out.
                    </li>
                    <li>
                        <b>Fan-out:</b> for many clients, publish events to a broker (Redis Pub/Sub, NATS, Kafka) and broadcast from there.
                    </li>
                    <li>
                        <b>Serialization:</b> prefer JSON for readability; consider binary (WS) or compressed payloads for heavy streams.
                    </li>
                    <li>
                        <b>Mobile & flaky networks:</b> keep messages small; make updates idempotent so duplicates don't break state.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> pick SSE if you only need server ➜ client updates-simpler, built-in reconnect.</li>
                    <li><b>Do</b> use WebSockets when the client must push events instantly (chat, cursor, presence).</li>
                    <li><b>Do</b> design a clear message envelope with <Styled.InlineCode>type</Styled.InlineCode> + <Styled.InlineCode>payload</Styled.InlineCode>.</li>
                    <li><b>Don't</b> block the main thread in message handlers; update state efficiently.</li>
                    <li><b>Don't</b> forget heartbeats and reconnect logic (for WS).</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Handshake (WS):</b> initial HTTP Upgrade that switches to the WebSocket protocol.</li>
                    <li><b>Event stream (SSE):</b> a continuous HTTP response containing <Styled.InlineCode>id</Styled.InlineCode>, <Styled.InlineCode>event</Styled.InlineCode>, and <Styled.InlineCode>data</Styled.InlineCode> lines.</li>
                    <li><b>Broadcast:</b> send the same message to many clients.</li>
                    <li><b>Backoff:</b> progressively increasing delay between reconnect attempts.</li>
                    <li><b>Idempotent:</b> performing the same update multiple times yields the same final state.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: <b>WebSockets</b> = two-way, low-latency streams; requires your own reconnection strategy.
                <b> SSE</b> = one-way, simpler, auto-reconnect with resume via <i>Last-Event-ID</i>. Pick the lightest tool
                that satisfies your directionality and reliability needs.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default WebSocketsSse;
