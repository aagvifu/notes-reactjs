import React from "react";
import { Styled } from "./styled";

const WebSockets = () => {
    return (
        <Styled.Page>
            <Styled.Title>WebSockets</Styled.Title>

            <Styled.Lead>
                <b>WebSocket</b> is a persistent, full-duplex connection between a client and a server.
                Unlike HTTP (request → response), WebSockets allow <i>both sides</i> to send messages
                anytime over a single TCP connection (<Styled.InlineCode>ws://</Styled.InlineCode> or
                <Styled.InlineCode>wss://</Styled.InlineCode>).
            </Styled.Lead>

            {/* 1) What & Why */}
            <Styled.Section>
                <Styled.H2>Definition & Use Cases</Styled.H2>
                <Styled.List>
                    <li><b>WebSocket:</b> a protocol that upgrades an HTTP connection to a long-lived, two-way channel.</li>
                    <li><b>Full-duplex:</b> both client and server can send messages independently at any time.</li>
                    <li><b>Use cases:</b> chats, live dashboards/price feeds, multiplayer games, collaborative editors, notifications.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) How it works */}
            <Styled.Section>
                <Styled.H2>How WebSockets Work (Handshake → Messages)</Styled.H2>
                <Styled.List>
                    <li><b>Handshake (HTTP Upgrade):</b> the browser sends an HTTP request with headers like
                        <Styled.InlineCode>Upgrade: websocket</Styled.InlineCode> and
                        <Styled.InlineCode>Connection: Upgrade</Styled.InlineCode>. The server responds with
                        <Styled.InlineCode>101 Switching Protocols</Styled.InlineCode>. After this, it’s no longer HTTP.</li>
                    <li><b>Subprotocols:</b> optional application-level protocols (e.g., <Styled.InlineCode>graphql-ws</Styled.InlineCode>) negotiated via
                        <Styled.InlineCode>Sec-WebSocket-Protocol</Styled.InlineCode>.</li>
                    <li><b>Frames & Messages:</b> data flows as frames that form text or binary messages. The browser gives you full messages.</li>
                    <li><b>Lifecycle:</b> <Styled.InlineCode>CONNECTING → OPEN → CLOSING → CLOSED</Styled.InlineCode> (via <Styled.InlineCode>readyState</Styled.InlineCode>).</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary (Key Terms)</Styled.H2>
                <Styled.List>
                    <li><b>ws://</b> vs <b>wss://</b>: insecure vs TLS-encrypted WebSockets (use <b>wss</b> in production).</li>
                    <li><b>Full-duplex:</b> both ends can send/receive simultaneously (unlike HTTP request/response).</li>
                    <li><b>Subprotocol:</b> a higher-level contract on top of WebSocket (e.g., message shapes, ack rules).</li>
                    <li><b>Backoff:</b> strategy to gradually delay reconnection attempts to avoid server overload.</li>
                    <li><b>Heartbeat:</b> periodic “ping/pong” or app-level “ping” messages to detect dead connections.</li>
                    <li><b>Binary type:</b> client setting (<Styled.InlineCode>socket.binaryType</Styled.InlineCode>) to receive blobs/array buffers.</li>
                    <li><b>Close codes:</b> short numeric reasons for closure (e.g., <Styled.InlineCode>1000</Styled.InlineCode> normal, <Styled.InlineCode>1001</Styled.InlineCode> going away, <Styled.InlineCode>1009</Styled.InlineCode> message too big).</li>
                </Styled.List>
            </Styled.Section>

            {/* 4) Basic client example */}
            <Styled.Section>
                <Styled.H2>Basic Client (Connect, Listen, Send)</Styled.H2>
                <Styled.Pre>
                    {`function BasicFeed() {
  const [log, setLog] = React.useState([]);
  const socketRef = React.useRef(null);

  React.useEffect(() => {
    const url = "wss://example.com/feed";
    const ws = new WebSocket(url);
    socketRef.current = ws;

    ws.addEventListener("open", () => {
      setLog(l => [...l, "OPEN"]);
      // Example: announce presence
      ws.send(JSON.stringify({ type: "hello", from: "client-123" }));
    });

    ws.addEventListener("message", (e) => {
      // e.data can be string or Blob/ArrayBuffer depending on server & binaryType
      setLog(l => [...l, "MSG: " + e.data]);
    });

    ws.addEventListener("error", () => {
      setLog(l => [...l, "ERROR"]);
    });

    ws.addEventListener("close", (e) => {
      setLog(l => [...l, "CLOSE " + e.code]);
    });

    return () => {
      // Important: clean up when component unmounts
      ws.close(1000, "page change");
    };
  }, []);

  function sendPing() {
    socketRef.current?.readyState === WebSocket.OPEN &&
      socketRef.current.send(JSON.stringify({ type: "ping", t: Date.now() }));
  }

  return (
    <div>
      <button onClick={sendPing}>Send Ping</button>
      <pre>{log.join("\\n")}</pre>
    </div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Always close the socket on unmount to avoid leaks and “ghost” connections.
                </Styled.Small>
            </Styled.Section>

            {/* 5) JSON messages & types */}
            <Styled.Section>
                <Styled.H2>Sending JSON Messages (Type Field)</Styled.H2>
                <Styled.Pre>
                    {`// A simple convention is to send JSON with a "type" and "payload"
socket.send(JSON.stringify({ type: "chat:send", payload: { text: "Hello" } }));

// Handling incoming:
ws.addEventListener("message", (e) => {
  const msg = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
  // msg = { type: "chat:new", payload: {...} }
});`}
                </Styled.Pre>
                <Styled.Small>Define a small message schema early (type, payload) to keep clients/servers in sync.</Styled.Small>
            </Styled.Section>

            {/* 6) Reconnection with backoff */}
            <Styled.Section>
                <Styled.H2>Reconnection Pattern (Exponential Backoff)</Styled.H2>
                <Styled.Pre>
                    {`function useWebSocketWithRetry(url, { maxDelayMs = 10000 } = {}) {
  const wsRef = React.useRef(null);
  const [status, setStatus] = React.useState("idle");
  const backoffRef = React.useRef(500); // start small

  const connect = React.useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    setStatus("connecting");
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("open");
      backoffRef.current = 500; // reset on success
    };
    ws.onmessage = () => {};
    ws.onerror = () => {};
    ws.onclose = () => {
      setStatus("closed");
      // schedule retry
      const delay = Math.min(backoffRef.current, maxDelayMs);
      setTimeout(() => {
        backoffRef.current = Math.min(backoffRef.current * 2, maxDelayMs);
        connect();
      }, delay);
    };
  }, [url, maxDelayMs]);

  React.useEffect(() => {
    connect();
    return () => wsRef.current?.close(1000, "unmount");
  }, [connect]);

  return { status, socket: wsRef.current };
}`}
                </Styled.Pre>
                <Styled.Small>Backoff prevents “thundering herd” reconnect storms and gives the server breathing room.</Styled.Small>
            </Styled.Section>

            {/* 7) Heartbeats */}
            <Styled.Section>
                <Styled.H2>Heartbeats & Timeouts</Styled.H2>
                <Styled.List>
                    <li><b>Why:</b> detect dead connections (e.g., network drop, sleeping tabs) and trigger reconnects.</li>
                    <li><b>How (browser):</b> send a periodic app-level <Styled.InlineCode>{"{ type: 'ping' }"}</Styled.InlineCode> and expect a <Styled.InlineCode>{"{ type: 'pong' }"}</Styled.InlineCode> from the server.</li>
                    <li><b>How (server):</b> some servers use protocol-level ping/pong frames; browsers don’t expose these, so rely on app-level pings if needed.</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Security & Auth */}
            <Styled.Section>
                <Styled.H2>Security & Authentication</Styled.H2>
                <Styled.List>
                    <li><b>Use wss://</b> in production to encrypt traffic.</li>
                    <li><b>Auth:</b> typically via cookies (same origin) or a bearer/JWT token sent as a query param or
                        negotiated during handshake; rotate/refresh as needed.</li>
                    <li><b>Origin checks:</b> servers can enforce allowed <Styled.InlineCode>Origin</Styled.InlineCode> to mitigate abuse.</li>
                    <li><b>Rate limits & message size limits:</b> protect your server from floods and huge payloads.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) When to use WS vs SSE vs Polling */}
            <Styled.Section>
                <Styled.H2>WebSockets vs SSE vs Polling</Styled.H2>
                <Styled.List>
                    <li><b>WebSockets:</b> two-way, low-latency streams; ideal for chats, games, collaborative apps.</li>
                    <li><b>SSE (Server-Sent Events):</b> one-way server→client updates over HTTP; simpler when only pushing updates (news feed, notifications).</li>
                    <li><b>Polling/Long-polling:</b> easiest to set up; higher overhead/latency; okay for low-frequency updates.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common Pitfalls</Styled.H2>
                <Styled.List>
                    <li>Creating multiple sockets per page accidentally (e.g., in each render) — <b>always</b> keep the instance in a ref and initialize in <Styled.InlineCode>useEffect</Styled.InlineCode>.</li>
                    <li>Forgetting to close on unmount → memory leaks and duplicate messages.</li>
                    <li>Blocking the main thread (heavy work) in <Styled.InlineCode>message</Styled.InlineCode> handlers; offload parsing or heavy CPU via Web Workers if needed.</li>
                    <li>Sending raw objects without a schema → versioning hell. Define <Styled.InlineCode>{`{ type, payload }`}</Styled.InlineCode> early.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Tiny server example (for understanding) */}
            <Styled.Section>
                <Styled.H2>For Context: Minimal Node Server (ws)</Styled.H2>
                <Styled.Pre>
                    {`// npm i ws
// File: server.js
import { WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (socket) => {
  socket.send(JSON.stringify({ type: "welcome", payload: Date.now() }));

  socket.on("message", (raw) => {
    let msg = null;
    try { msg = JSON.parse(raw); } catch {}
    if (msg?.type === "ping") {
      socket.send(JSON.stringify({ type: "pong", t: Date.now() }));
    }
    // Echo chat
    if (msg?.type === "chat:send") {
      const out = JSON.stringify({ type: "chat:new", payload: msg.payload });
      wss.clients.forEach(c => c.readyState === 1 && c.send(out));
    }
  });
});`}
                </Styled.Pre>
                <Styled.Small>This is only to visualize server behavior; your React notes app remains front-end.</Styled.Small>
            </Styled.Section>

            {/* 12) Subprotocols */}
            <Styled.Section>
                <Styled.H2>Subprotocols (Optional)</Styled.H2>
                <Styled.Pre>
                    {`// Client requesting a specific subprotocol:
const ws = new WebSocket("wss://example.com/realtime", "chat-v1");
// Server should accept or reject it during the handshake.`}
                </Styled.Pre>
            </Styled.Section>

            <Styled.Callout>
                <b>Summary:</b> WebSockets provide real-time, two-way communication. Learn the handshake,
                lifecycle, JSON message schema, reconnection with backoff, and heartbeats. Prefer
                <b> wss://</b> in production, close sockets on unmount, and document your message types.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default WebSockets;
