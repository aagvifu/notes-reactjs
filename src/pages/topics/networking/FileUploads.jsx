import React from "react";
import { Styled } from "./styled";

const FileUploads = () => {
    return (
        <Styled.Page>
            <Styled.Title>File Uploads</Styled.Title>

            <Styled.Lead>
                Learn how to let users pick files, validate them, and upload safely using{" "}
                <b>FormData</b>, show <b>progress</b>, and even upload directly to cloud storage with{" "}
                <b>pre-signed URLs</b>. Well cover definitions, best practices, and pitfalls so beginners can build this confidently.
            </Styled.Lead>

            {/* 1) Why & when */}
            <Styled.Section>
                <Styled.H2>What is a file upload? Why does it need care?</Styled.H2>
                <Styled.List>
                    <li><b>Definition:</b> Sending user-selected files from the browser to a server or cloud bucket over HTTP.</li>
                    <li><b>Why care:</b> Files can be large, untrusted, and varied. You must validate type/size, show progress, handle errors, and protect your server.</li>
                    <li><b>Main approaches:</b> (1) Upload to <i>your backend</i> (proxy) or (2) upload <i>directly to cloud</i> via a <b>pre-signed URL</b>.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Basic picker */}
            <Styled.Section>
                <Styled.H2>Basic file picker + client-side validation</Styled.H2>
                <Styled.List>
                    <li><b>accept:</b> Hint to limit selectable types (e.g., <Styled.InlineCode>image/*</Styled.InlineCode> or <Styled.InlineCode>.pdf,.docx</Styled.InlineCode>).</li>
                    <li><b>multiple:</b> Allow selecting more than one file.</li>
                    <li><b>Note:</b> <i>accept</i> is not security; always re-validate on the server.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function BasicPicker() {
  const [file, setFile] = React.useState(null);
  const [error, setError] = React.useState("");
  const [previewUrl, setPreviewUrl] = React.useState("");

  function onChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;

    // Basic checks (example: images up to 5 MB)
    if (!f.type.startsWith("image/")) {
      setError("Only images are allowed.");
      setFile(null);
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("Max size is 5 MB.");
      setFile(null);
      return;
    }

    setError("");
    setFile(f);

    // Preview (for images)
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
  }

  React.useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  return (
    <>
      <input type="file" accept="image/*" onChange={onChange} />
      {error && <p style={{color:"tomato"}}>{error}</p>}
      {previewUrl && <img alt="preview" src={previewUrl} style={{maxWidth: 240}} />}
      {file && <p>Ready to upload: {file.name} ({Math.round(file.size/1024)} KB)</p>}
    </>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 3) Upload to your backend with FormData + fetch */}
            <Styled.Section>
                <Styled.H2>Upload to your backend (FormData + fetch)</Styled.H2>
                <Styled.List>
                    <li><b>FormData:</b> Build a <b>multipart/form-data</b> request that carries the file and fields.</li>
                    <li><b>Headers:</b> Dont set <Styled.InlineCode>Content-Type</Styled.InlineCode> manually; the browser adds the correct boundary.</li>
                    <li><b>Progress:</b> <Styled.InlineCode>fetch</Styled.InlineCode> does not expose upload progress; use XHR (next section) if you need it.</li>
                </Styled.List>
                <Styled.Pre>
                    {`async function uploadToBackend(file) {
  const fd = new FormData();
  fd.append("avatar", file);          // field name 'avatar' matches backend expectation
  fd.append("userId", "123");         // example extra fields

  const res = await fetch("/api/upload", {
    method: "POST",
    body: fd,                         // no explicit headers for Content-Type
    credentials: "include",           // if you need cookies/session
  });

  if (!res.ok) throw new Error("Upload failed");
  return res.json();                  // backend returns JSON with file URL, etc.
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Server-side (sketch):</b> Read <i>multipart/form-data</i>, validate <i>type/size</i>, scan if needed, store (disk/cloud), return a URL/ID.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Progress bar with XMLHttpRequest (XHR) */}
            <Styled.Section>
                <Styled.H2>Show upload progress (XHR)</Styled.H2>
                <Styled.List>
                    <li><b>Progress events:</b> Use <Styled.InlineCode>xhr.upload.onprogress</Styled.InlineCode> to get <i>loaded</i>/<i>total</i> bytes.</li>
                    <li><b>When to use:</b> Large files, UX polish, or multiple concurrent uploads.</li>
                </Styled.List>
                <Styled.Pre>
                    {`function uploadWithProgress(file, onProgress) {
  return new Promise((resolve, reject) => {
    const fd = new FormData();
    fd.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");

    xhr.upload.onprogress = (e) => {
      if (!e.lengthComputable) return;
      const pct = Math.round((e.loaded / e.total) * 100);
      onProgress?.(pct);
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try { resolve(JSON.parse(xhr.responseText)); }
        catch { resolve({ ok: true }); }
      } else reject(new Error("Upload failed"));
    };
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.send(fd);
  });
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Drag & drop + multiple files */}
            <Styled.Section>
                <Styled.H2>Drag & Drop + Multiple uploads</Styled.H2>
                <Styled.List>
                    <li><b>Drag events:</b> Prevent default in <Styled.InlineCode>onDragOver</Styled.InlineCode> to allow dropping.</li>
                    <li><b>DataTransfer.files:</b> Access dropped files from <Styled.InlineCode>e.dataTransfer.files</Styled.InlineCode>.</li>
                    <li><b>Concurrency:</b> Upload sequentially (simple) or in parallel (faster, watch server limits).</li>
                </Styled.List>
                <Styled.Pre>
                    {`function DropZone({ onFiles }) {
  function onDragOver(e) { e.preventDefault(); }
  function onDrop(e) {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    onFiles?.(files);
  }
  return (
    <div onDragOver={onDragOver} onDrop={onDrop} style={{padding:24, border:"2px dashed #888"}}>
      Drop files here or click the picker
      <input type="file" multiple onChange={(e)=> onFiles?.(Array.from(e.target.files||[]))} />
    </div>
  );
}

async function uploadAll(files) {
  for (const f of files) {
    // await uploadToBackend(f)            // simple sequential
    // or run Promise.all(...) carefully for parallel uploads
  }
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Direct-to-Cloud with a Pre-Signed URL */}
            <Styled.Section>
                <Styled.H2>Direct upload to cloud (Pre-Signed URL)</Styled.H2>
                <Styled.List>
                    <li><b>Flow:</b> Ask your backend for a <b>pre-signed URL</b> → upload file <i>directly</i> to cloud (S3/GCS/etc.).</li>
                    <li><b>Why:</b> Offloads bandwidth from your server and can be faster/cheaper.</li>
                    <li><b>CORS:</b> Must allow your sites origin to PUT/POST to the bucket.</li>
                </Styled.List>
                <Styled.Pre>
                    {`async function directToS3(file) {
  // 1) Ask backend to create a pre-signed URL for this file
  const meta = await fetch(\`/api/uploads/presign?name=\${encodeURIComponent(file.name)}&type=\${encodeURIComponent(file.type)}\`)
    .then(r => r.json()); // { url, method: "PUT" | "POST", fields? }

  // 2) Upload directly
  if (meta.method === "PUT") {
    // PUT style
    const res = await fetch(meta.url, {
      method: "PUT",
      headers: { "Content-Type": file.type || "application/octet-stream" },
      body: file,
    });
    if (!res.ok) throw new Error("Cloud upload failed");
  } else {
    // POST style (S3 form fields)
    const fd = new FormData();
    Object.entries(meta.fields || {}).forEach(([k, v]) => fd.append(k, v));
    fd.append("file", file);
    const res = await fetch(meta.url, { method: "POST", body: fd });
    if (!res.ok) throw new Error("Cloud upload failed");
  }

  // 3) Store final URL/ID in your DB via backend if needed
  // await fetch("/api/uploads/confirm", { method:"POST", body: JSON.stringify({ key: meta.key }) })
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Security:</b> Pre-signed URLs should expire quickly and be scoped to the exact key and size/type constraints you expect.
                </Styled.Small>
            </Styled.Section>

            {/* 7) Resumable / chunked (concept) */}
            <Styled.Section>
                <Styled.H2>Resumable / chunked uploads (concept)</Styled.H2>
                <Styled.List>
                    <li><b>Resumable:</b> Split large files into chunks. If the network drops, continue from the last confirmed chunk.</li>
                    <li><b>When:</b> Very large files (videos, archives) or unstable networks.</li>
                    <li><b>How:</b> Use a library or a server protocol (e.g., tus, S3 multipart) that coordinates chunk indexes and ETags.</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Security & validation checklist */}
            <Styled.Section>
                <Styled.H2>Security & Validation (must do)</Styled.H2>
                <Styled.List>
                    <li><b>Validate on server:</b> Enforce allowed <i>MIME types</i> and <i>size limits</i>. Never trust the client.</li>
                    <li><b>Sanitize filenames:</b> Generate your own safe keys; dont store user filenames directly as paths.</li>
                    <li><b>Scan if needed:</b> For public/user-visible content, consider antivirus scanning.</li>
                    <li><b>Rate/size limits:</b> Apply per-user limits and maximum body sizes to avoid abuse/DoS.</li>
                    <li><b>Serve safely:</b> For images/docs, set appropriate <i>Content-Type</i> and consider <i>Content-Disposition: attachment</i> for untrusted files.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Dont</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> show progress and clear errors; large files feel broken without feedback.</li>
                    <li><b>Do</b> compress or resize images on the client (Canvas/OffscreenCanvas) when appropriate.</li>
                    <li><b>Do</b> consider <i>pre-signed URLs</i> to reduce backend load.</li>
                    <li><b>Dont</b> rely on <i>accept</i> or client checks for security—always re-validate server-side.</li>
                    <li><b>Dont</b> set <i>Content-Type</i> manually on FormData requests; let the browser set the boundary.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>FormData:</b> Browser API to build multipart/form-data bodies conveniently.</li>
                    <li><b>multipart/form-data:</b> HTTP encoding composed of parts separated by boundaries; used for files.</li>
                    <li><b>Pre-signed URL:</b> Short-lived URL granting permission to upload directly to a storage bucket.</li>
                    <li><b>CORS:</b> Rules a browser uses to allow/block cross-origin requests.</li>
                    <li><b>Progress event:</b> Event exposing bytes loaded versus total; available on <i>XHR</i> uploads.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Pick files, validate, upload via <b>FormData</b>, show <b>progress</b>, and prefer
                <b> direct-to-cloud</b> with <b>pre-signed URLs</b> for scale. Always re-validate on the server and handle errors gracefully.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default FileUploads;
