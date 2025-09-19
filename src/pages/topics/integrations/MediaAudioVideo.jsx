import React from "react";
import { Styled } from "./styled";

const MediaAudioVideo = () => {
    return (
        <Styled.Page>
            <Styled.Title>Media / Audio / Video</Styled.Title>

            <Styled.Lead>
                This page covers working with <b>&lt;audio&gt;</b> and <b>&lt;video&gt;</b> in React:
                how to load media, control playback, add captions, handle autoplay, record from mic/camera,
                and when to reach for the Web Audio API or streaming (HLS/DASH).
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>Core Definitions</Styled.H2>
                <Styled.List>
                    <li><b>HTMLMediaElement:</b> The DOM interface implemented by <Styled.InlineCode>&lt;audio&gt;</Styled.InlineCode> and <Styled.InlineCode>&lt;video&gt;</Styled.InlineCode> providing properties like <Styled.InlineCode>currentTime</Styled.InlineCode>, <Styled.InlineCode>paused</Styled.InlineCode>, <Styled.InlineCode>volume</Styled.InlineCode>, and methods such as <Styled.InlineCode>play()</Styled.InlineCode>/<Styled.InlineCode>pause()</Styled.InlineCode>.</li>
                    <li><b>Source selection:</b> Using multiple <Styled.InlineCode>&lt;source type="...; codecs=..."&gt;</Styled.InlineCode> allows the browser to pick a playable format. Check support with <Styled.InlineCode>canPlayType()</Styled.InlineCode>.</li>
                    <li><b>Autoplay policy:</b> Most browsers block autoplay with sound. Use <Styled.InlineCode>muted</Styled.InlineCode> + user gesture or show an obvious “Play” button.</li>
                    <li><b>Tracks:</b> Subtitles/captions via <Styled.InlineCode>&lt;track kind="subtitles" ... /&gt;</Styled.InlineCode> (e.g., WebVTT files).</li>
                    <li><b>Web Audio API:</b> Low-level audio graph for effects, analysis (spectrum), mixing, and visualization.</li>
                    <li><b>MSE / HLS / DASH:</b> For long videos or live streams, use a streaming protocol and a player library (e.g., hls.js for HLS in browsers without native support).</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Minimal audio example */}
            <Styled.Section>
                <Styled.H2>Audio: Minimal Player</Styled.H2>
                <Styled.Pre>
                    {`function AudioPlayer() {
  const ref = React.useRef(null);

  function play() {
    // play() returns a Promise that may reject if autoplay is disallowed
    ref.current?.play().catch(() => {
      // Show UI asking the user to click Play
    });
  }
  function pause() { ref.current?.pause(); }

  return (
    <div>
      <audio
        ref={ref}
        controls
        preload="metadata"
        src="/media/lofi.mp3"
      />
      <div>
        <button onClick={play}>Play</button>
        <button onClick={pause}>Pause</button>
      </div>
    </div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Tip:</b> Use <Styled.InlineCode>preload="metadata"</Styled.InlineCode> to load only duration/metadata—faster initial paint.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Video with multiple sources, poster, captions */}
            <Styled.Section>
                <Styled.H2>Video: Sources, Poster, and Captions</Styled.H2>
                <Styled.Pre>
                    {`function VideoLesson() {
  return (
    <video
      controls
      playsInline
      poster="/media/intro-poster.jpg"
      width={800}
      preload="metadata"
      // If you must attempt autoplay, set muted and still handle rejections.
      // muted
      // autoPlay
    >
      <source src="/media/intro-720.mp4" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
      <source src="/media/intro-720.webm" type='video/webm; codecs="vp9, vorbis"' />
      <track
        kind="subtitles"
        srcLang="en"
        src="/media/intro.en.vtt"
        label="English"
        default
      />
      {/* Fallback text for very old browsers */}
      Your browser does not support HTML5 video.
    </video>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Captions:</b> Use WebVTT (<Styled.InlineCode>.vtt</Styled.InlineCode>) files. Toggle via the built-in “CC” control or JS APIs.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Programmatic control */}
            <Styled.Section>
                <Styled.H2>Programmatic Control (Refs)</Styled.H2>
                <Styled.List>
                    <li><b>Common props:</b> <Styled.InlineCode>controls</Styled.InlineCode>, <Styled.InlineCode>loop</Styled.InlineCode>, <Styled.InlineCode>muted</Styled.InlineCode>, <Styled.InlineCode>playsInline</Styled.InlineCode>, <Styled.InlineCode>controlsList</Styled.InlineCode> (e.g., <Styled.InlineCode>nodownload</Styled.InlineCode>), <Styled.InlineCode>crossOrigin</Styled.InlineCode>.</li>
                    <li><b>Useful methods:</b> <Styled.InlineCode>play()</Styled.InlineCode>, <Styled.InlineCode>pause()</Styled.InlineCode>, <Styled.InlineCode>load()</Styled.InlineCode> and setting <Styled.InlineCode>currentTime</Styled.InlineCode>, <Styled.InlineCode>playbackRate</Styled.InlineCode>, <Styled.InlineCode>volume</Styled.InlineCode>.</li>
                    <li><b>Events:</b> <Styled.InlineCode>onLoadedMetadata</Styled.InlineCode>, <Styled.InlineCode>onTimeUpdate</Styled.InlineCode>, <Styled.InlineCode>onEnded</Styled.InlineCode>, <Styled.InlineCode>onError</Styled.InlineCode>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function ScrubExample() {
  const ref = React.useRef(null);
  const [time, setTime] = React.useState(0);

  function onTimeUpdate() {
    setTime(ref.current?.currentTime ?? 0);
  }
  function seek(e) {
    const t = Number(e.target.value);
    if (ref.current) ref.current.currentTime = t;
  }

  return (
    <div>
      <video ref={ref} src="/media/clip.mp4" onTimeUpdate={onTimeUpdate} controls />
      <input
        type="range"
        min={0}
        max={60}
        value={time}
        onChange={seek}
        aria-label="Scrub playback position"
      />
    </div>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Autoplay policy & UX */}
            <Styled.Section>
                <Styled.H2>Autoplay Policy & Good UX</Styled.H2>
                <Styled.List>
                    <li>Most browsers block autoplay with sound. If you must, set <Styled.InlineCode>muted</Styled.InlineCode> and start playback after a user gesture (click/tap).</li>
                    <li>Always render a visible Play control; tell users why playback didn't start if it's blocked.</li>
                    <li>Respect user settings (reduced motion, prefers-reduced-data if available).</li>
                </Styled.List>
            </Styled.Section>

            {/* 6) Picture-in-Picture & Fullscreen */}
            <Styled.Section>
                <Styled.H2>Picture-in-Picture & Fullscreen</Styled.H2>
                <Styled.Pre>
                    {`async function togglePip(video) {
  // Some browsers require a direct user gesture for PiP
  if (document.pictureInPictureElement) {
    await document.exitPictureInPicture();
  } else if (video && document.pictureInPictureEnabled) {
    await video.requestPictureInPicture();
  }
}

async function toggleFullscreen(el) {
  if (document.fullscreenElement) {
    await document.exitFullscreen();
  } else {
    await el?.requestFullscreen();
  }
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Note:</b> Safari/iOS may have differences; test across devices.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Capturing mic/camera (getUserMedia) */}
            <Styled.Section>
                <Styled.H2>Capture from Mic/Camera (<code>getUserMedia</code>)</Styled.H2>
                <Styled.List>
                    <li><b>getUserMedia:</b> Asks for permission to use the microphone/camera and returns a <b>MediaStream</b>.</li>
                    <li><b>MediaStream:</b> A stream of audio/video tracks; you can assign it to <Styled.InlineCode>video.srcObject</Styled.InlineCode>.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function CameraPreview() {
  const ref = React.useRef(null);

  React.useEffect(() => {
    let stream;
    async function setup() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (ref.current) ref.current.srcObject = stream;
      } catch (err) {
        console.error("Permission or device error:", err);
      }
    }
    setup();
    return () => {
      stream?.getTracks().forEach(t => t.stop());
    };
  }, []);

  return <video ref={ref} autoPlay playsInline />;
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Security:</b> Requires HTTPS (or localhost) and explicit user permission.
                </Styled.Small>
            </Styled.Section>

            {/* 8) Recording media (MediaRecorder) */}
            <Styled.Section>
                <Styled.H2>Recording (<code>MediaRecorder</code>)</Styled.H2>
                <Styled.List>
                    <li><b>MediaRecorder:</b> Encodes a <b>MediaStream</b> to chunks (e.g., WebM) you can save or upload.</li>
                    <li>Works well with <Styled.InlineCode>getUserMedia</Styled.InlineCode> streams.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function MicRecorder() {
  const [rec, setRec] = React.useState(null);
  const [url, setUrl] = React.useState("");

  async function start() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks = [];
    recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      setUrl(URL.createObjectURL(blob));
      stream.getTracks().forEach(t => t.stop());
    };
    recorder.start();
    setRec(recorder);
  }

  function stop() { rec?.stop(); }

  return (
    <div>
      <button onClick={start} disabled={!!rec}>Start</button>
      <button onClick={stop} disabled={!rec}>Stop</button>
      {url && <audio controls src={url} />}
    </div>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) Web Audio API at a glance */}
            <Styled.Section>
                <Styled.H2>Web Audio API (At a Glance)</Styled.H2>
                <Styled.List>
                    <li><b>AudioContext:</b> The engine. Create nodes (sources, gains, filters, analyzers) and connect them into a graph.</li>
                    <li><b>AnalyserNode:</b> Real-time frequency/time-domain data for visualizations (e.g., canvas bars/waveforms).</li>
                    <li><b>Use cases:</b> Volume normalization, effects, mixing multiple audio sources, visualizers.</li>
                </Styled.List>
                <Styled.Pre>
                    {`async function basicWebAudio(bufferArrayBuffer) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const buffer = await ctx.decodeAudioData(bufferArrayBuffer);
  const src = ctx.createBufferSource();
  src.buffer = buffer;

  const gain = ctx.createGain();
  gain.gain.value = 0.8; // 80% volume

  src.connect(gain).connect(ctx.destination);
  src.start();
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 10) Streaming overview */}
            <Styled.Section>
                <Styled.H2>Streaming Overview (HLS/DASH)</Styled.H2>
                <Styled.List>
                    <li><b>Why streaming:</b> Better startup time, adaptive bitrate, seeking without pre-downloading the entire file.</li>
                    <li><b>HLS:</b> Widely used; Safari supports natively. For other browsers, use a JS player (e.g., hls.js) + a simple <Styled.InlineCode>&lt;video&gt;</Styled.InlineCode>.</li>
                    <li><b>DASH:</b> Similar idea with different packaging; use dash.js or a commercial player.</li>
                    <li><b>MSE:</b> Media Source Extensions allow JavaScript to feed media segments to the video element.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Performance & delivery */}
            <Styled.Section>
                <Styled.H2>Performance & Delivery</Styled.H2>
                <Styled.List>
                    <li><b>Preload wisely:</b> <Styled.InlineCode>preload="none"</Styled.InlineCode> when media shouldn't load until user interacts; <Styled.InlineCode>metadata</Styled.InlineCode> for duration/size only.</li>
                    <li><b>File size:</b> Compress audio (AAC/Opus) and video (H.264/VP9/AV1). Provide reasonable resolutions.</li>
                    <li><b>Caching/CDN:</b> Serve via CDN with proper cache headers. Use <Styled.InlineCode>crossOrigin</Styled.InlineCode> when drawing frames to <Styled.InlineCode>&lt;canvas&gt;</Styled.InlineCode>.</li>
                    <li><b>Seekability:</b> For long MP4 files, ensure a <i>fast start</i> (moov atom at the beginning) so the browser can seek without downloading the whole file.</li>
                </Styled.List>
            </Styled.Section>

            {/* 12) Accessibility */}
            <Styled.Section>
                <Styled.H2>Accessibility</Styled.H2>
                <Styled.List>
                    <li>Always provide captions/subtitles for spoken content (<Styled.InlineCode>&lt;track kind="subtitles"&gt;</Styled.InlineCode>).</li>
                    <li>Ensure controls are keyboard operable; labels should be clear and visible.</li>
                    <li>Respect <b>reduced motion</b> preferences on heavy visualizations.</li>
                    <li>Provide transcripts for audio-only content when possible.</li>
                </Styled.List>
            </Styled.Section>

            {/* 13) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> use multiple sources and check <Styled.InlineCode>canPlayType()</Styled.InlineCode> if formats vary.</li>
                    <li><b>Do</b> handle <Styled.InlineCode>play()</Styled.InlineCode> promise rejections (autoplay/permissions).</li>
                    <li><b>Do</b> clean up streams (<Styled.InlineCode>getTracks().forEach(t =&gt; t.stop())</Styled.InlineCode>).</li>
                    <li><b>Don't</b> hide controls without offering equivalent custom controls.</li>
                    <li><b>Don't</b> rely on autoplay with sound; it will likely be blocked.</li>
                </Styled.List>
            </Styled.Section>

            {/* 14) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>MediaStream:</b> Live stream of audio/video tracks (from camera/mic or screen).</li>
                    <li><b>MediaRecorder:</b> API to record a <b>MediaStream</b> into encoded chunks (e.g., WebM).</li>
                    <li><b>WebVTT:</b> Text format for captions/subtitles in web video (<Styled.InlineCode>.vtt</Styled.InlineCode> files).</li>
                    <li><b>HLS/DASH:</b> Adaptive streaming protocols delivering media in small segments at multiple bitrates.</li>
                    <li><b>MSE:</b> Media Source Extensions—JS feeds segments directly to the media element for custom streaming.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Start with native <b>&lt;audio&gt;</b>/<b>&lt;video&gt;</b>, add captions, control playback via refs,
                and handle autoplay/permissions gracefully. For real-time input, use <b>getUserMedia</b> and
                <b> MediaRecorder</b>. For complex audio work, try the <b>Web Audio API</b>. For long or live
                video, use a streaming protocol and a player library.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default MediaAudioVideo;
