import { Styled } from "./styled";

const ImageOptim = () => {
    return (
        <Styled.Page>
            <Styled.Title>Image Optimization (ImageOptim)</Styled.Title>

            <Styled.Lead>
                <b>Image optimization</b> is the practice of delivering the <i>smallest, correctly-sized, and
                    right-format</i> image for a device so pages load fast and look sharp. Well-optimized images reduce
                data usage, improve <Styled.InlineCode>LCP</Styled.InlineCode>, and prevent layout jank.
            </Styled.Lead>

            {/* 0) Goals */}
            <Styled.Section>
                <Styled.H2>Goals</Styled.H2>
                <Styled.List>
                    <li><b>Small transfer size:</b> compress and choose efficient formats.</li>
                    <li><b>Correct dimensions:</b> send just enough pixels for the display/device.</li>
                    <li><b>Predictable layout:</b> reserve space to avoid <Styled.InlineCode>CLS</Styled.InlineCode>.</li>
                    <li><b>Fast display:</b> decode/paint quickly; prioritize hero images for <Styled.InlineCode>LCP</Styled.InlineCode>.</li>
                    <li><b>Accessible content:</b> always include meaningful <Styled.InlineCode>alt</Styled.InlineCode> text.</li>
                </Styled.List>
            </Styled.Section>

            {/* 1) Formats */}
            <Styled.Section>
                <Styled.H2>Choose the right format</Styled.H2>
                <Styled.List>
                    <li><b>JPEG/JPG:</b> lossy, great for <i>photos</i>. Small and widely supported.</li>
                    <li><b>PNG:</b> lossless, supports transparency (<Styled.InlineCode>alpha</Styled.InlineCode>); good for <i>UI/flat graphics</i>, screenshots, logos (when vector not possible).</li>
                    <li><b>WebP:</b> modern lossy/lossless; usually smaller than JPEG/PNG at similar quality.</li>
                    <li><b>AVIF:</b> newer, often <i>smallest files</i> for photos; supports HDR/alpha; decoding can be slower on some devices.</li>
                    <li><b>SVG:</b> vector graphics; sharp at any size; ideal for logos/icons/illustrations.</li>
                </Styled.List>
                <Styled.Small>Rule of thumb: SVG for logos/icons; AVIF/WebP for photos; PNG when you need crisp lossless with transparency.</Styled.Small>
            </Styled.Section>

            {/* 2) Lossy vs Lossless */}
            <Styled.Section>
                <Styled.H2>Compression types</Styled.H2>
                <Styled.List>
                    <li><b>Lossy:</b> throws away some detail (e.g., JPEG, WebP, AVIF). Tuned via <i>quality</i> (e.g., 40-80). Much smaller.</li>
                    <li><b>Lossless:</b> preserves exact pixels (e.g., PNG, WebP-lossless, AVIF-lossless). Larger; best for UI/diagrams.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Prevent layout shift */}
            <Styled.Section>
                <Styled.H2>Reserve space to prevent CLS</Styled.H2>
                <Styled.List>
                    <li>
                        Set <Styled.InlineCode>width</Styled.InlineCode> and <Styled.InlineCode>height</Styled.InlineCode> attributes on{" "}
                        <Styled.InlineCode>&lt;img&gt;</Styled.InlineCode>. Browsers compute the aspect ratio and reserve space before the file loads.
                    </li>
                    <li>
                        Or use CSS <Styled.InlineCode>aspect-ratio</Styled.InlineCode> on a wrapper. Keep dimensions consistent across breakpoints.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`/* HTML with intrinsic size */
<img
  src="/images/hero.avif"
  width="1200"
  height="800"
  alt="Team working at a whiteboard"
/>

/* Or CSS aspect ratio */
.figure {
  aspect-ratio: 3 / 2;   /* 1200x800 */
  overflow: hidden;
}
.figure > img { width: 100%; height: 100%; object-fit: cover; }`}
                </Styled.Pre>
            </Styled.Section>

            {/* 4) Responsive images (srcset/sizes) */}
            <Styled.Section>
                <Styled.H2>Responsive images: <code>srcset</code> &amp; <code>sizes</code></Styled.H2>
                <Styled.List>
                    <li>
                        <b><Styled.InlineCode>srcset</Styled.InlineCode> (width descriptors):</b> provide multiple widths; the browser picks the best file for the viewport and{" "}
                        <Styled.InlineCode>DPR</Styled.InlineCode>.
                    </li>
                    <li>
                        <b><Styled.InlineCode>sizes</Styled.InlineCode>:</b> tell the browser how wide the image will <i>render</i> at various breakpoints (CSS-like hints).
                    </li>
                    <li>
                        <b>DPR (Device Pixel Ratio):</b> ratio of device pixels to CSS pixels (e.g., 2x "Retina"). Higher DPR needs more source pixels for sharpness.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`<!-- Image renders ~100vw on phones, ~50vw on tablets, 33vw on desktops -->
<img
  src="/images/card-800.avif"
  srcSet="/images/card-400.avif 400w,
          /images/card-800.avif 800w,
          /images/card-1200.avif 1200w"
  sizes="(max-width: 600px) 100vw,
         (max-width: 1024px) 50vw,
         33vw"
  width="1200" height="800"
  alt="Product teaser"
/>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 5) Art direction + format fallback (<picture>) */}
            <Styled.Section>
                <Styled.H2>Format fallback & art direction with <code>&lt;picture&gt;</code></Styled.H2>
                <Styled.List>
                    <li>
                        <b>Format fallback:</b> offer AVIF/WebP first, then JPEG/PNG fallback via{" "}
                        <Styled.InlineCode>&lt;source type="image/avif"&gt;</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Art direction:</b> swap <i>different crops</i> per breakpoint (e.g., tight portrait on mobile, wide landscape on desktop).
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`<picture>
  <!-- Prefer AVIF, then WebP, then fallback -->
  <source type="image/avif"
          srcSet="/hero-800.avif 800w, /hero-1200.avif 1200w, /hero-1600.avif 1600w" />
  <source type="image/webp"
          srcSet="/hero-800.webp 800w, /hero-1200.webp 1200w, /hero-1600.webp 1600w" />
  <img
    src="/hero-1200.jpg"
    srcSet="/hero-800.jpg 800w, /hero-1200.jpg 1200w, /hero-1600.jpg 1600w"
    sizes="(max-width: 600px) 100vw, 80vw"
    width="1600" height="900"
    alt="Hero team collaborating"
/>
</picture>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 6) Loading, decoding, priority */}
            <Styled.Section>
                <Styled.H2>Loading strategy & priority</Styled.H2>
                <Styled.List>
                    <li>
                        <b><Styled.InlineCode>loading="lazy"</Styled.InlineCode>:</b> defer off-screen images until scrolled into view (saves data).
                    </li>
                    <li>
                        <b><Styled.InlineCode>decoding="async"</Styled.InlineCode>:</b> decode off the main thread when possible; improves responsiveness.
                    </li>
                    <li>
                        <b><Styled.InlineCode>fetchpriority</Styled.InlineCode>:</b> hint priority (<Styled.InlineCode>"high"</Styled.InlineCode> for the LCP/hero).
                    </li>
                    <li>
                        <b>Preload hero:</b> in <Styled.InlineCode>&lt;head&gt;</Styled.InlineCode> you can{" "}
                        <Styled.InlineCode>&lt;link rel="preload" as="image"&gt;</Styled.InlineCode> a critical image.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`<!-- Head: preload the hero (exact URL you will use) -->
<link rel="preload" as="image" href="/images/hero-1200.avif" imagesrcset="/images/hero-800.avif 800w, /images/hero-1200.avif 1200w, /images/hero-1600.avif 1600w" imagesizes="100vw" />

<!-- Body: mark hero as high priority -->
<img
  src="/images/hero-1200.avif"
  width="1200" height="800"
  fetchpriority="high"
  alt="Hero"
/>

<!-- Lazy-load below-the-fold images -->
<img src="/images/gallery-1.webp" width="800" height="600" loading="lazy" decoding="async" alt="Gallery item" />`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Backgrounds & CSS image-set */}
            <Styled.Section>
                <Styled.H2>Background images & <code>image-set()</code></Styled.H2>
                <Styled.List>
                    <li><b>Backgrounds:</b> use when the image is decorative. Don't hide content that needs <Styled.InlineCode>alt</Styled.InlineCode>.</li>
                    <li><b><Styled.InlineCode>image-set()</Styled.InlineCode>:</b> provide multiple resolutions/formats in CSS for DPR and format support.</li>
                </Styled.List>
                <Styled.Pre>
                    {`.hero {
  background-image: image-set(
    url("/bg.avif") type("image/avif") 1x,
    url("/bg@2x.avif") type("image/avif") 2x,
    url("/bg.webp") type("image/webp") 1x
  );
  background-size: cover;
  background-position: center;
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 8) Placeholders (blur-up) */}
            <Styled.Section>
                <Styled.H2>Placeholders (blur-up)</Styled.H2>
                <Styled.List>
                    <li><b>Blur-up:</b> show a tiny blurred image first, then swap to the full image (perceived speed).</li>
                    <li><b>Solid/gradient:</b> fast lightweight placeholder that matches dominant colors.</li>
                </Styled.List>
                <Styled.Pre>
                    {`/* Example concept: tiny blurred data URL as placeholder */
<img
  src="/images/photo-800.avif"
  width="800" height="600"
  style={{ background: "url('data:image/jpeg;base64,/9j/4AAQ...') center/cover no-repeat" }}
  alt="Landscape"
/>`}
                </Styled.Pre>
            </Styled.Section>

            {/* 9) CDN & caching */}
            <Styled.Section>
                <Styled.H2>CDN transforms & caching</Styled.H2>
                <Styled.List>
                    <li><b>Image CDN:</b> services (e.g., Cloudinary/Imgix/etc.) can auto-convert, resize, and compress on the fly via URL params.</li>
                    <li><b>Caching:</b> fingerprint filenames (e.g., <Styled.InlineCode>hero.abc123.avif</Styled.InlineCode>) and set long <Styled.InlineCode>Cache-Control</Styled.InlineCode> headers.</li>
                    <li><b>Client Hints:</b> some CDNs use DPR/Width hints to serve optimal sizes automatically.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Accessibility */}
            <Styled.Section>
                <Styled.H2>Accessibility basics</Styled.H2>
                <Styled.List>
                    <li><b>Alt text:</b> describe the image's purpose; if purely decorative, use <Styled.InlineCode>alt=""</Styled.InlineCode>.</li>
                    <li><b>Do not</b> bake text into images for essential content—use real HTML text.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Testing & auditing */}
            <Styled.Section>
                <Styled.H2>Testing & auditing</Styled.H2>
                <Styled.List>
                    <li>Use Lighthouse/Pagespeed to check <Styled.InlineCode>LCP</Styled.InlineCode>/<Styled.InlineCode>CLS</Styled.InlineCode> and image hints.</li>
                    <li>Spot-check actual file sizes and chosen candidates in DevTools (<i>Network</i> + <i>Elements</i> → <code>CurrentSrc</code>).</li>
                </Styled.List>
            </Styled.Section>

            {/* 12) Do / Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> supply <Styled.InlineCode>width</Styled.InlineCode>/<Styled.InlineCode>height</Styled.InlineCode> (or aspect-ratio) to avoid CLS.</li>
                    <li><b>Do</b> use <Styled.InlineCode>srcset</Styled.InlineCode>/<Styled.InlineCode>sizes</Styled.InlineCode> for responsive images.</li>
                    <li><b>Do</b> pick modern formats (AVIF/WebP) with JPEG/PNG fallbacks when needed.</li>
                    <li><b>Don't</b> ship a single giant 4K image to all devices.</li>
                    <li><b>Don't</b> use background images for meaningful content that needs <Styled.InlineCode>alt</Styled.InlineCode>.</li>
                </Styled.List>
            </Styled.Section>

            {/* 13) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>LCP (Largest Contentful Paint):</b> time until the largest element (often the hero image) is visible.</li>
                    <li><b>CLS (Cumulative Layout Shift):</b> score of visual movement after load; images without reserved space cause shifts.</li>
                    <li><b>DPR (Device Pixel Ratio):</b> device pixels per CSS pixel (1x, 2x, 3x...). Higher DPR needs higher-res sources.</li>
                    <li><b>Art direction:</b> delivering <i>different crops</i> of the same asset for different screens.</li>
                    <li><b>Intrinsic size:</b> the natural pixel width/height of the source image.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: pick a modern format, provide multiple sizes with <i>srcset/sizes</i>, reserve space with
                width/height or aspect-ratio, and lazy-load non-critical images. Prioritize the hero image for fast LCP.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default ImageOptim;
