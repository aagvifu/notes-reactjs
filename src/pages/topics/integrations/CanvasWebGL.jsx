import { Styled } from "./styled";

const CanvasWebGL = () => {
    return (
        <Styled.Page>
            <Styled.Title>Canvas &amp; WebGL</Styled.Title>

            <Styled.Lead>
                The HTML <Styled.InlineCode>&lt;canvas&gt;</Styled.InlineCode> gives you a drawable bitmap
                for pixels (2D) and a GPU-backed surface (WebGL) for fast graphics. Use Canvas for
                programmatic drawing (charts, games, effects) and WebGL/WebGL2 when you need hardware
                acceleration, 3D, or massive 2D throughput.
            </Styled.Lead>

            {/* 1) Core Definitions */}
            <Styled.Section>
                <Styled.H2>Core Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Canvas element:</b> an HTML element that exposes a <em>drawing surface</em>. You get a{" "}
                        <Styled.InlineCode>context</Styled.InlineCode> from it to draw.
                    </li>
                    <li>
                        <b>Bitmap:</b> a 2D grid of pixels held by the canvas. Drawing changes pixel values.
                    </li>
                    <li>
                        <b>Context:</b> the API you draw with. Common types:{" "}
                        <Styled.InlineCode>"2d"</Styled.InlineCode> (Canvas 2D) and{" "}
                        <Styled.InlineCode>"webgl"</Styled.InlineCode>/<Styled.InlineCode>"webgl2"</Styled.InlineCode> (GPU).
                    </li>
                    <li>
                        <b>Immediate-mode vs retained-mode:</b> Canvas is <em>immediate-mode</em>—you manually
                        redraw each frame. SVG is <em>retained-mode</em>—the browser keeps objects in a scene.
                    </li>
                    <li>
                        <b>WebGL:</b> a browser's JavaScript binding to OpenGL ES 2.0/3.0. You write small GPU
                        programs (<em>shaders</em>) to control how vertices and pixels are processed.
                    </li>
                    <li>
                        <b>Shader:</b> a tiny GPU program. <em>Vertex shader</em> positions geometry;{" "}
                        <em>fragment shader</em> colors pixels. Passed as GLSL source strings.
                    </li>
                    <li>
                        <b>Buffer:</b> GPU memory storing vertex data. <b>Attribute:</b> per-vertex input.{" "}
                        <b>Uniform:</b> constant-per-draw input (e.g., color, time).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Canvas 2D: setup & pixels */}
            <Styled.Section>
                <Styled.H2>Canvas 2D: Setup &amp; First Draw</Styled.H2>
                <Styled.Pre>
                    {`// HTML
<canvas id="c" width="600" height="300"></canvas>

// JS (put in a useEffect in React)
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');

// Fill background
ctx.fillStyle = '#0d1117';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Draw a rectangle with stroke
ctx.fillStyle = '#58a6ff';
ctx.fillRect(20, 20, 160, 90);
ctx.lineWidth = 2;
ctx.strokeStyle = '#c9d1d9';
ctx.strokeRect(20, 20, 160, 90);

// Text
ctx.fillStyle = '#c9d1d9';
ctx.font = '16px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
ctx.fillText('Canvas 2D — Hello Pixels', 20, 140);`}
                </Styled.Pre>
                <Styled.Small>
                    The canvas's <em>display</em> size (CSS) and <em>drawing buffer</em> size (width/height
                    attributes) are different. For crisp lines on high-DPI screens, scale the buffer by{" "}
                    <Styled.InlineCode>devicePixelRatio</Styled.InlineCode> (see below).
                </Styled.Small>
            </Styled.Section>

            {/* 3) High-DPI (retina) scaling */}
            <Styled.Section>
                <Styled.H2>High-DPI (Retina) Scaling</Styled.H2>
                <Styled.Pre>
                    {`function resizeCanvasForDPR(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;
  canvas.width = Math.round(displayWidth * dpr);
  canvas.height = Math.round(displayHeight * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // scale drawing to CSS pixels
  return ctx;
}

// Usage:
// <canvas id="c" style="width:600px; height:300px"></canvas>
// const ctx = resizeCanvasForDPR(document.getElementById('c'));`}
                </Styled.Pre>
                <Styled.Small>
                    Always set CSS size (layout) and scale the backing store to avoid blurriness on retina
                    screens.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Animation loop */}
            <Styled.Section>
                <Styled.H2>Animation with <code>requestAnimationFrame</code></Styled.H2>
                <Styled.Pre>
                    {`let raf = 0;
let t0 = performance.now();

function loop() {
  const t = performance.now() - t0; // ms since start
  // clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw a moving circle
  const x = 50 + Math.sin(t * 0.002) * 30;
  ctx.beginPath();
  ctx.arc(100 + x, 80, 24, 0, Math.PI * 2);
  ctx.fillStyle = '#3fb950';
  ctx.fill();

  raf = requestAnimationFrame(loop);
}
raf = requestAnimationFrame(loop);

// later: cancelAnimationFrame(raf)`}
                </Styled.Pre>
                <Styled.Small>
                    In React, start/stop this loop in <Styled.InlineCode>useEffect</Styled.InlineCode> and
                    clean it up on unmount to avoid hanging animations.
                </Styled.Small>
            </Styled.Section>

            {/* 5) WebGL: minimal triangle */}
            <Styled.Section>
                <Styled.H2>WebGL: Minimal Triangle</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Context:</b> <Styled.InlineCode>canvas.getContext('webgl')</Styled.InlineCode> or{" "}
                        <Styled.InlineCode>'webgl2'</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Pipeline:</b> create shaders → link program → upload vertex buffer → set attributes →
                        draw.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`const gl = canvas.getContext('webgl');
if (!gl) throw new Error('WebGL not supported');

// GLSL shaders
const vs = \`
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}\`;

const fs = \`
precision mediump float;
uniform vec3 u_color;
void main() { gl_FragColor = vec4(u_color, 1.0); }
\`;

// Compile & link
function compile(type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
    throw new Error(gl.getShaderInfoLog(s));
  return s;
}
const prog = gl.createProgram();
gl.attachShader(prog, compile(gl.VERTEX_SHADER, vs));
gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fs));
gl.linkProgram(prog);
if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
  throw new Error(gl.getProgramInfoLog(prog));
gl.useProgram(prog);

// Triangle data
const vertices = new Float32Array([
  0,  0.7,    // top
 -0.7, -0.7,  // left
  0.7, -0.7   // right
]);
const vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// Hook up a_pos
const a_pos = gl.getAttribLocation(prog, 'a_pos');
gl.enableVertexAttribArray(a_pos);
gl.vertexAttribPointer(a_pos, 2, gl.FLOAT, false, 0, 0);

// Uniform color
const u_color = gl.getUniformLocation(prog, 'u_color');
gl.uniform3f(u_color, 0.35, 0.67, 1.0);

// Clear & draw
gl.clearColor(0.05, 0.07, 0.09, 1);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLES, 0, 3);`}
                </Styled.Pre>
                <Styled.Small>
                    WebGL coordinates in clip space go from <code>-1</code> to <code>+1</code> on both axes.
                    The vertex shader maps your inputs into that space.
                </Styled.Small>
            </Styled.Section>

            {/* 6) WebGL terms explained */}
            <Styled.Section>
                <Styled.H2>WebGL Glossary (plain words)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Clip space:</b> a normalized coordinate system where the GPU expects final positions
                        (<code>-1..1</code>).
                    </li>
                    <li>
                        <b>Draw call:</b> a single command (e.g.,{" "}
                        <Styled.InlineCode>gl.drawArrays</Styled.InlineCode>) asking the GPU to render.
                    </li>
                    <li>
                        <b>Attribute:</b> per-vertex data stream (position, UV, normal).
                    </li>
                    <li>
                        <b>Uniform:</b> a single value (or small struct) used by all vertices/fragments in one
                        draw (e.g., color).
                    </li>
                    <li>
                        <b>VBO/IBO:</b> vertex/index buffers stored on GPU for speed.
                    </li>
                    <li>
                        <b>Texture:</b> an image or data grid sampled in the fragment shader for colors or
                        lookups.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 7) React patterns */}
            <Styled.Section>
                <Styled.H2>React Patterns for Canvas/WebGL</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Refs:</b> store the canvas node in <Styled.InlineCode>useRef</Styled.InlineCode> and
                        initialize contexts in <Styled.InlineCode>useEffect</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Imperative islands:</b> isolate drawing logic so React reconciliation stays fast and
                        you control the render loop explicitly.
                    </li>
                    <li>
                        <b>Cleanup:</b> cancel animation frames and free WebGL resources (buffers, textures,
                        programs) on unmount.
                    </li>
                    <li>
                        <b>Data in, pixels out:</b> keep props/state as <em>inputs</em>; the effect translates
                        them into drawing commands.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function ChartCanvas({ data }) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const canvas = ref.current;
    const ctx = resizeCanvasForDPR(canvas);
    // draw based on "data"
    // ...
    return () => {
      // cleanup if you started loops/listeners
    };
  }, [data]);

  return <canvas ref={ref} style={{ width: 600, height: 300 }} />;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common Pitfalls</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Forgetting DPR scaling:</b> leads to blurry graphics on high-DPI screens.
                    </li>
                    <li>
                        <b>Redrawing in render:</b> never draw in the component body; use{" "}
                        <Styled.InlineCode>useEffect</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Memory leaks:</b> not cancelling <Styled.InlineCode>requestAnimationFrame</Styled.InlineCode> or not deleting WebGL resources.
                    </li>
                    <li>
                        <b>Overdraw:</b> clearing/painting entire screen with expensive effects every frame
                        unnecessarily—measure first.
                    </li>
                    <li>
                        <b>Blocking the main thread:</b> heavy CPU loops will stutter rendering. Consider
                        moving CPU work to Web Workers (and <em>optionally</em> OffscreenCanvas).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Do</b> set CSS size and scale the drawing buffer for retina clarity.
                    </li>
                    <li>
                        <b>Do</b> isolate drawing as an imperative effect and keep React state minimal.
                    </li>
                    <li>
                        <b>Do</b> precompute geometry/text metrics outside the hot loop where possible.
                    </li>
                    <li>
                        <b>Don't</b> mutate React DOM during drawing—draw to the canvas only.
                    </li>
                    <li>
                        <b>Don't</b> start multiple RAF loops for the same canvas; centralize the timeline.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Accessibility & fallback */}
            <Styled.Section>
                <Styled.H2>Accessibility &amp; Fallback</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Canvas has no semantic structure:</b> provide off-screen text or ARIA live regions
                        for important information (e.g., chart summaries).
                    </li>
                    <li>
                        <b>Keyboard access:</b> if the canvas is interactive, mirror interactions with standard
                        controls or manage focus and key handlers yourself.
                    </li>
                    <li>
                        <b>Fallback:</b> include helpful fallback content between{" "}
                        <Styled.InlineCode>&lt;canvas&gt;...fallback...&lt;/canvas&gt;</Styled.InlineCode>.
                    </li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Use Canvas 2D for pixel-level control and WebGL/WebGL2 when you need GPU power.
                In React, treat the canvas like an imperative island—initialize once, draw per frame, and
                clean up diligently.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default CanvasWebGL;
