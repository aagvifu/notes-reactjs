import React from "react";
import { Styled } from "./styled";

const DragDrop = () => {
    return (
        <Styled.Page>
            <Styled.Title>Drag &amp; Drop (Forms)</Styled.Title>

            <Styled.Lead>
                <b>Drag &amp; Drop (DnD)</b> lets users move items or drop files into a form. In React you can use
                the native <Styled.InlineCode>HTML5 Drag and Drop API</Styled.InlineCode> (mouse/trackpad),
                or build custom interactions with Pointer/Touch events. For accessibility, always provide a
                keyboard-friendly alternative (buttons or inputs).
            </Styled.Lead>

            {/* 1) What & Why */}
            <Styled.Section>
                <Styled.H2>Definition &amp; Purpose</Styled.H2>
                <Styled.List>
                    <li><b>Drag source:</b> element the user picks up (e.g., a list item).</li>
                    <li><b>Drop target:</b> element that accepts the item or files (e.g., a dropzone).</li>
                    <li><b>DataTransfer:</b> the object that carries data during a drag (<Styled.InlineCode>event.dataTransfer</Styled.InlineCode>).</li>
                    <li><b>Use cases in forms:</b> file upload (dropzone), reordering items (e.g., form sections), moving chips/tags between lists.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Native DnD fundamentals */}
            <Styled.Section>
                <Styled.H2>Native HTML5 DnD — fundamentals</Styled.H2>
                <Styled.List>
                    <li>Make a thing draggable with <Styled.InlineCode>draggable</Styled.InlineCode> and handle <Styled.InlineCode>onDragStart</Styled.InlineCode>.</li>
                    <li>Allow dropping by calling <Styled.InlineCode>e.preventDefault()</Styled.InlineCode> in <Styled.InlineCode>onDragOver</Styled.InlineCode>.</li>
                    <li>Complete the drop in <Styled.InlineCode>onDrop</Styled.InlineCode> (read <Styled.InlineCode>dataTransfer</Styled.InlineCode> or <Styled.InlineCode>files</Styled.InlineCode>).</li>
                    <li>Mobile/touch: native DnD has limited support — consider Pointer events or a library.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Minimal pattern:
function Draggable() {
  function onDragStart(e) {
    // carry some identifier
    e.dataTransfer.setData("text/plain", "item-123");
    e.dataTransfer.effectAllowed = "move";
  }
  return <div draggable onDragStart={onDragStart}>Drag me</div>;
}

function DropTarget() {
  function onDragOver(e) { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }
  function onDrop(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    console.log("Dropped:", id);
  }
  return <div onDragOver={onDragOver} onDrop={onDrop}>Drop here</div>;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 3) Example: Reorder list (mouse) */}
            <Styled.Section>
                <Styled.H2>Example: Reorder list (mouse, native DnD)</Styled.H2>
                <Styled.Small>Beginner-friendly reordering using <code>draggable</code>. Also provide buttons for keyboard users (see a11y).</Styled.Small>
                <Styled.Pre>
                    {`import React from "react";

export function ReorderList() {
  const [items, setItems] = React.useState(["Alpha", "Bravo", "Charlie", "Delta"]);
  const dragIndexRef = React.useRef(null);

  function onDragStart(e, index) {
    dragIndexRef.current = index;
    e.dataTransfer.effectAllowed = "move";
    // Optional ghost image, else browser uses a snapshot
    // const img = new Image(); img.src = "data:image/svg+xml,..."; e.dataTransfer.setDragImage(img, 0, 0);
  }

  function onDragOver(e) {
    e.preventDefault(); // MUST have this to allow drop
  }

  function onDrop(e, dropIndex) {
    e.preventDefault();
    const from = dragIndexRef.current;
    if (from == null || from === dropIndex) return;
    setItems(prev => {
      const copy = [...prev];
      const [moved] = copy.splice(from, 1);
      copy.splice(dropIndex, 0, moved);
      return copy;
    });
    dragIndexRef.current = null;
  }

  return (
    <ul onDragOver={onDragOver}>
      {items.map((label, i) => (
        <li
          key={label}
          draggable
          onDragStart={(e) => onDragStart(e, i)}
          onDrop={(e) => onDrop(e, i)}
          style={{ padding: 8, border: "1px solid hsl(0 0% 100% / 0.14)", marginBottom: 6, borderRadius: 8, cursor: "grab" }}
          aria-grabbed="false"
        >
          {label}
        </li>
      ))}
    </ul>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    Note: Keep drag visuals subtle; avoid heavy reflows in <code>onDragOver</code>.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Example: File dropzone (with click-to-select) */}
            <Styled.Section>
                <Styled.H2>Example: File Dropzone (with click-to-select)</Styled.H2>
                <Styled.List>
                    <li>Users can <b>drop files</b> or <b>click</b> to open the file picker.</li>
                    <li>Read files from <Styled.InlineCode>e.dataTransfer.files</Styled.InlineCode> on drop.</li>
                    <li>Validate type/size before accepting.</li>
                </Styled.List>
                <Styled.Pre>
                    {`import React from "react";

export function FileDropzone({ accept = ["image/png", "image/jpeg"], maxSizeMB = 5 }) {
  const [files, setFiles] = React.useState([]);
  const [isActive, setIsActive] = React.useState(false);
  const inputRef = React.useRef(null);
  const maxBytes = maxSizeMB * 1024 * 1024;

  function openPicker() { inputRef.current?.click(); }

  function validate(list) {
    const accepted = [];
    const errors = [];
    for (const f of list) {
      if (accept.length && !accept.includes(f.type)) errors.push(\`Unsupported type: \${f.name}\`);
      else if (f.size > maxBytes) errors.push(\`Too large (> \${maxSizeMB} MB): \${f.name}\`);
      else accepted.push(f);
    }
    return { accepted, errors };
  }

  function onInputChange(e) {
    const { accepted, errors } = validate(e.target.files);
    if (errors.length) alert(errors.join("\\n"));
    if (accepted.length) setFiles(prev => [...prev, ...accepted]);
  }

  function onDragOver(e) { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; }
  function onDragEnter(e) { e.preventDefault(); setIsActive(true); }
  function onDragLeave(e) { e.preventDefault(); setIsActive(false); }

  function onDrop(e) {
    e.preventDefault();
    setIsActive(false);
    const { accepted, errors } = validate(e.dataTransfer.files);
    if (errors.length) alert(errors.join("\\n"));
    if (accepted.length) setFiles(prev => [...prev, ...accepted]);
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openPicker()}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        aria-label="File dropzone: click or drop files"
        style={{
          padding: 24,
          border: "2px dashed hsl(0 0% 100% / 0.25)",
          borderRadius: 16,
          outline: isActive ? "4px solid hsl(200 80% 60% / 0.35)" : "none",
        }}
      >
        <p><b>Drop files here</b> or click to choose (PNG/JPEG, up to {maxSizeMB} MB each)</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept.join(",")}
          onChange={onInputChange}
          style={{ display: "none" }}
        />
      </div>

      {files.length > 0 && (
        <ul style={{ marginTop: 12 }}>
          {files.map((f, i) => (
            <li key={i}>{f.name} — {(f.size / 1024).toFixed(0)} KB</li>
          ))}
        </ul>
      )}
    </div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    For server upload, append to <code>FormData</code> and POST; for previews, render object URLs via <code>URL.createObjectURL</code>.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Accessibility & keyboard alternatives */}
            <Styled.Section>
                <Styled.H2>Accessibility: keyboard &amp; screen readers</Styled.H2>
                <Styled.List>
                    <li><b>Always offer a button alternative</b> to reorder (Move Up/Down) and a visible “Browse files” control.</li>
                    <li><b>Announce changes</b> with <Styled.InlineCode>aria-live</Styled.InlineCode> (e.g., “Moved Bravo to position 2”).</li>
                    <li>Avoid deprecated ARIA like <Styled.InlineCode>aria-dropeffect</Styled.InlineCode>. Use clear labels and instructions instead.</li>
                    <li>Ensure focus is never trapped while dragging; keep tab order predictable.</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Simple keyboard fallback for reordering:
function ReorderWithButtons() {
  const [items, setItems] = React.useState(["Alpha", "Bravo", "Charlie"]);
  const liveRef = React.useRef(null);

  function move(i, dir) {
    setItems(prev => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const copy = [...prev];
      const [m] = copy.splice(i, 1);
      copy.splice(j, 0, m);
      // Announce
      queueMicrotask(() => {
        liveRef.current.textContent = \`\${m} moved to position \${j + 1}\`;
      });
      return copy;
    });
  }

  return (
    <>
      <ul>
        {items.map((label, i) => (
          <li key={label}>
            {label}
            <button onClick={() => move(i, -1)} aria-label={"Move " + label + " up"}>↑</button>
            <button onClick={() => move(i, +1)} aria-label={"Move " + label + " down"}>↓</button>
          </li>
        ))}
      </ul>
      <div aria-live="polite" ref={liveRef} style={{position:"absolute",left:-9999}} />
    </>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Patterns, pitfalls, and tips */}
            <Styled.Section>
                <Styled.H2>Patterns, Pitfalls, Tips</Styled.H2>
                <Styled.List>
                    <li><b>Drag enter/leave flicker:</b> they fire when entering/leaving children. Track a <em>counter</em> or use <Styled.InlineCode>pointerenter/leave</Styled.InlineCode> for custom pointer DnD.</li>
                    <li><b>Prevent default on dragover:</b> otherwise dropping won’t work.</li>
                    <li><b>Security:</b> do not inject dropped HTML; treat strings as untrusted.</li>
                    <li><b>Mobile:</b> prefer Pointer events or a library (e.g., dnd-kit) for robust touch support.</li>
                    <li><b>State updates:</b> keep them minimal during drag to avoid jank (no heavy work in <code>onDragOver</code>).</li>
                </Styled.List>
            </Styled.Section>

            {/* 7) Integrate with form libs */}
            <Styled.Section>
                <Styled.H2>Integrating with Form Libraries</Styled.H2>
                <Styled.List>
                    <li><b>react-hook-form:</b> use <Styled.InlineCode>Controller</Styled.InlineCode> or <Styled.InlineCode>setValue</Styled.InlineCode> to register dropped files (<Styled.InlineCode>File[]</Styled.InlineCode>).</li>
                    <li><b>Formik:</b> call <Styled.InlineCode>setFieldValue("files", files)</Styled.InlineCode> inside drop handler.</li>
                    <li><b>Schema (Yup/Zod):</b> validate file count, MIME, size in a custom test.</li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>draggable:</b> boolean attribute enabling native DnD on an element.</li>
                    <li><b>DataTransfer:</b> carries data/files during drag (<code>setData/getData/files</code>).</li>
                    <li><b>dropEffect/effectAllowed:</b> hint the allowed operation (copy/move/link/none).</li>
                    <li><b>Pointer events:</b> input model that unifies mouse/touch/pen; useful for custom DnD.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: start with native DnD for mouse + a keyboard fallback. For touch and complex layouts,
                prefer Pointer events or a well-supported library. Always validate files and keep forms accessible.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default DragDrop;
