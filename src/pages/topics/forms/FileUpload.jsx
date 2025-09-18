// src/pages/topics/forms/FileUpload.jsx
import React from "react";
import { Styled } from "./styled";

/**
 * Forms & Validation → File Upload
 * Learn the anatomy of <input type="file">, controlled vs uncontrolled behavior,
 * validation (type/size), previews, drag-and-drop, progress, cancelation, a11y, and pitfalls.
 */
const FileUpload = () => {
    return (
        <Styled.Page>
            <Styled.Title>File Upload</Styled.Title>

            <Styled.Lead>
                A file upload lets users pick files from their device and send them to your app or server.
                In the browser you’ll work with the <b>File</b>, <b>FileList</b>, and <b>FormData</b> APIs and React handlers
                to validate, preview, and upload files. File inputs are effectively <b>uncontrolled</b> in React.
            </Styled.Lead>

            {/* 1) Core concepts */}
            <Styled.Section>
                <Styled.H2>Core Concepts & Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>File input:</b> <Styled.InlineCode>{`<input type="file">`}</Styled.InlineCode> opens the OS picker.
                        Use <Styled.InlineCode>multiple</Styled.InlineCode> to allow more than one file and{" "}
                        <Styled.InlineCode>accept</Styled.InlineCode> to hint allowed types (e.g.{" "}
                        <Styled.InlineCode>accept="image/*,.pdf"</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>File:</b> an object representing a user-selected file with{" "}
                        <Styled.InlineCode>name</Styled.InlineCode>, <Styled.InlineCode>type</Styled.InlineCode> (MIME),
                        <Styled.InlineCode>size</Styled.InlineCode> (bytes), and <Styled.InlineCode>lastModified</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>FileList:</b> array-like collection of <Styled.InlineCode>File</Styled.InlineCode> from
                        <Styled.InlineCode>e.target.files</Styled.InlineCode> or <Styled.InlineCode>DataTransfer.files</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>FormData:</b> a key/value payload for uploads:{" "}
                        <Styled.InlineCode>form.append("file", file)</Styled.InlineCode> then send via <i>XHR</i> or <i>fetch</i>.
                    </li>
                    <li>
                        <b>Uncontrolled:</b> you can’t “set” an input’s file list via React state. Read via refs or change handlers,
                        and clear by setting <Styled.InlineCode>inputRef.current.value = ""</Styled.InlineCode>.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Basic file input */}
            <Styled.Section>
                <Styled.H2>Basic File Input (Single/Multiple)</Styled.H2>
                <Styled.Pre>
                    {`function BasicFileInput() {
  const inputRef = React.useRef(null);
  const [files, setFiles] = React.useState([]);

  function onChange(e) {
    const picked = Array.from(e.target.files || []);
    setFiles(picked);
  }

  function clear() {
    setFiles([]);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="resume">Upload files</label>
      <input
        id="resume"
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,.pdf"
        onChange={onChange}
      />
      <ul>
        {files.map((f) => (
          <li key={f.name}>{f.name} — {(f.size/1024).toFixed(1)} KB — {f.type || "unknown"}</li>
        ))}
      </ul>
      <button type="button" onClick={clear}>Clear</button>
    </form>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Use <Styled.InlineCode>accept</Styled.InlineCode> as a hint only—always validate on the client <i>and</i> the server.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Validation */}
            <Styled.Section>
                <Styled.H2>Client-Side Validation (Type, Size, Extension)</Styled.H2>
                <Styled.List>
                    <li>
                        <b>MIME type:</b> use <Styled.InlineCode>file.type</Styled.InlineCode> (e.g., <i>image/png</i>) — not 100% trustworthy.
                    </li>
                    <li>
                        <b>Extension:</b> check <Styled.InlineCode>file.name</Styled.InlineCode> endings (<i>.png, .jpg</i>) — can be spoofed.
                    </li>
                    <li>
                        <b>Size:</b> enforce a max in bytes (e.g., 5&nbsp;MB = 5 * 1024 * 1024).
                    </li>
                    <li>
                        <b>Server must re-validate.</b> Client checks are UX niceties, not security.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME = ["image/jpeg", "image/png", "application/pdf"];
const ALLOWED_EXT = [".jpg", ".jpeg", ".png", ".pdf"];

function validateFiles(files) {
  const errors = [];
  const ok = [];

  for (const file of files) {
    const ext = (file.name.match(/\\.[^.]+$/)?.[0] || "").toLowerCase();
    if (!ALLOWED_MIME.includes(file.type) || !ALLOWED_EXT.includes(ext)) {
      errors.push(\`Type not allowed: \${file.name}\`);
      continue;
    }
    if (file.size > MAX_BYTES) {
      errors.push(\`Too large (&gt;5MB): \${file.name}\`);
      continue;
    }
    ok.push(file);
  }
  return { ok, errors };
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Image previews */}
            <Styled.Section>
                <Styled.H2>Image Previews (Object URLs)</Styled.H2>
                <Styled.List>
                    <li>
                        Use <Styled.InlineCode>URL.createObjectURL(file)</Styled.InlineCode> for a fast local preview.{" "}
                        Always call <Styled.InlineCode>URL.revokeObjectURL(url)</Styled.InlineCode> in cleanup to avoid leaks.
                    </li>
                    <li>
                        Alternatively, <Styled.InlineCode>FileReader.readAsDataURL</Styled.InlineCode> yields base64 strings (slower for large files).
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function ImagePreview({ file, alt = "" }) {
  const [src, setSrc] = React.useState("");
  React.useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  if (!file) return null;
  return <img src={src} alt={alt || file.name} style={{ maxWidth: 200, height: "auto" }} />;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Drag & drop */}
            <Styled.Section>
                <Styled.H2>Drag &amp; Drop Zone</Styled.H2>
                <Styled.List>
                    <li>Add <Styled.InlineCode>onDragOver</Styled.InlineCode> (prevent default) and <Styled.InlineCode>onDrop</Styled.InlineCode> on a container.</li>
                    <li>Retrieve files from <Styled.InlineCode>e.dataTransfer.files</Styled.InlineCode>.</li>
                    <li>Keep the hidden input for keyboard and screen reader accessibility.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function Dropzone({ onFiles }) {
  const inputRef = React.useRef(null);

  function onKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
  }
  function onClick() {
    inputRef.current?.click();
  }
  function onChange(e) {
    onFiles(Array.from(e.target.files || []));
  }
  function onDragOver(e) {
    e.preventDefault(); // allow drop
  }
  function onDrop(e) {
    e.preventDefault();
    onFiles(Array.from(e.dataTransfer.files || []));
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onClick={onClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
      aria-label="Upload files by clicking or dragging and dropping"
      style={{
        border: "2px dashed #555",
        padding: 16,
        borderRadius: 12,
        textAlign: "center",
      }}
    >
      <p>Click or drag files here to upload</p>
      <input
        ref={inputRef}
        type="file"
        multiple
        onChange={onChange}
        accept="image/*,.pdf"
        style={{ display: "none" }}
      />
    </div>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Upload with progress + cancel */}
            <Styled.Section>
                <Styled.H2>Uploading with Progress &amp; Cancel</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Progress:</b> use <Styled.InlineCode>XMLHttpRequest</Styled.InlineCode> for reliable{" "}
                        <Styled.InlineCode>upload.onprogress</Styled.InlineCode> events. (Standard <i>fetch</i> lacks upload progress.)
                    </li>
                    <li>
                        <b>Cancel:</b> call <Styled.InlineCode>xhr.abort()</Styled.InlineCode>. You can wire a{" "}
                        <Styled.InlineCode>signal</Styled.InlineCode> from <Styled.InlineCode>AbortController</Styled.InlineCode> to coordinate.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`function uploadFiles({ url, files, onProgress, signal }) {
  return Promise.all(
    files.map((file) => new Promise((resolve, reject) => {
      const form = new FormData();
      form.append("file", file);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", url);

      xhr.upload.addEventListener("progress", (e) => {
        if (!e.lengthComputable) return;
        const pct = Math.round((e.loaded / e.total) * 100);
        onProgress?.(file.name, pct);
      });

      xhr.onload = () => {
        const ok = xhr.status >= 200 && xhr.status < 300;
        if (ok) resolve({ file, response: xhr.responseText });
        else reject(new Error(\`Upload failed (\${xhr.status}) for \${file.name}\`));
      };

      xhr.onerror = () => reject(new Error("Network error"));
      signal?.addEventListener("abort", () => xhr.abort());

      xhr.send(form);
    }))
  );
}

// Usage
function UploadWithProgress({ files }) {
  const [progress, setProgress] = React.useState({});
  const ac = React.useRef(null);

  function start() {
    ac.current = new AbortController();
    uploadFiles({
      url: "/api/upload",
      files,
      signal: ac.current.signal,
      onProgress: (name, pct) => setProgress((p) => ({ ...p, [name]: pct })),
    }).catch(console.error);
  }
  function cancel() {
    ac.current?.abort();
  }

  return (
    <div>
      <button onClick={start}>Upload</button>
      <button onClick={cancel}>Cancel</button>
      <ul>
        {files.map(f => (
          <li key={f.name}>{f.name}: {progress[f.name] ?? 0}%</li>
        ))}
      </ul>
    </div>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Accessibility */}
            <Styled.Section>
                <Styled.H2>Accessibility (A11y)</Styled.H2>
                <Styled.List>
                    <li>Always pair inputs with a <Styled.InlineCode>{`<label htmlFor="file">`}</Styled.InlineCode>.</li>
                    <li>Use a visible button or dropzone with keyboard support (<Styled.InlineCode>role="button"</Styled.InlineCode>, <Styled.InlineCode>tabIndex=0</Styled.InlineCode>, Enter/Space).</li>
                    <li>Announce constraints (types, size) via helper text linked by <Styled.InlineCode>aria-describedby</Styled.InlineCode>.</li>
                    <li>Show validation errors inline, near the control, with clear text.</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don’t</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> validate type/size on the client for UX; <b>also do</b> re-validate on the server.</li>
                    <li><b>Do</b> preview images with object URLs and revoke them on cleanup.</li>
                    <li><b>Do</b> show progress and allow cancel on long uploads.</li>
                    <li><b>Don’t</b> trust <Styled.InlineCode>accept</Styled.InlineCode> alone; it’s only a hint.</li>
                    <li><b>Don’t</b> read massive files fully into memory unless necessary; stream or chunk on the server.</li>
                    <li><b>Don’t</b> block keyboard-only users—always keep a hidden real input with a label.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Security & server notes */}
            <Styled.Section>
                <Styled.H2>Security & Server Notes</Styled.H2>
                <Styled.List>
                    <li>Sanitize filenames and store server-generated names. Never execute uploaded content.</li>
                    <li>Check MIME type server-side and (ideally) sniff file signatures for critical types.</li>
                    <li>Limit size and number of files server-side; rate limit abusive clients.</li>
                    <li>Serve user uploads from a separate domain or with strict Content-Type/Disposition headers.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: treat file inputs as uncontrolled, validate early, preview safely, upload with feedback and cancelation,
                and always re-validate on the server. Favor accessibility and security at every step.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default FileUpload;
