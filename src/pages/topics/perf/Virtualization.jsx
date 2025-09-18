import { Styled } from "./styled";

const Virtualization = () => {
    return (
        <Styled.Page>
            <Styled.Title>Virtualization (Windowing)</Styled.Title>

            <Styled.Lead>
                <b>Virtualization</b>-also called <b>windowing</b>-is a rendering technique where only the
                <i>visible</i> items (plus a small buffer) are mounted to the DOM. Instead of creating
                thousands of DOM nodes, you render just a “window” around the viewport. This drastically
                reduces memory and improves scroll performance for large lists, tables, and grids.
            </Styled.Lead>

            {/* 1) Core ideas */}
            <Styled.Section>
                <Styled.H2>Core Concepts</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Viewport:</b> the currently visible scrollable area of a list or grid (what the user
                        can see without scrolling).
                    </li>
                    <li>
                        <b>Window (render window):</b> a set of items around the viewport that are rendered.
                        Usually includes a small <i>overscan</i> buffer above/below to avoid blank gaps while
                        scrolling quickly.
                    </li>
                    <li>
                        <b>Overscan:</b> extra rows/columns rendered just outside the viewport to keep scrolling
                        smooth. Larger overscan = smoother scroll but slightly more work.
                    </li>
                    <li>
                        <b>Cell measurement:</b> determining each item's size (fixed or dynamic). Accurate
                        measurement avoids layout jumps during scroll.
                    </li>
                    <li>
                        <b>Item key:</b> a stable identifier for each row/cell. Stable keys prevent expensive
                        mounts/unmounts as the user scrolls.
                    </li>
                    <li>
                        <b>Recycling:</b> reusing DOM nodes for scrolled-out items (handled internally by libs).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) When to use */}
            <Styled.Section>
                <Styled.H2>When Should You Virtualize?</Styled.H2>
                <Styled.List>
                    <li>Long lists/tables (hundreds to 100k+ items).</li>
                    <li>Grids with many cells (photo galleries, dashboards).</li>
                    <li>Any UI where full render causes sluggish scroll, high memory, or long TTI.</li>
                </Styled.List>
                <Styled.Small>
                    For small lists (e.g., &lt; 100 items), plain rendering is usually simpler and fast enough.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Minimal example (react-window) */}
            <Styled.Section>
                <Styled.H2>Example: Fixed-height List with <code>react-window</code></Styled.H2>
                <Styled.Pre>
                    {`// Install: npm i react-window
import { FixedSizeList as List } from "react-window";

const Row = React.memo(({ index, style, data }) => {
  // style is required: it positions the row for virtualization
  const item = data.items[index];
  return (
    <div style={style} data-index={index}>
      #{index} - {item.title}
    </div>
  );
});

export default function Messages({ items }) {
  return (
    <List
      height={480}          // viewport height
      itemCount={items.length}
      itemSize={44}         // fixed row height (px)
      width={"100%"}
      overscanCount={6}     // buffer above/below viewport
      itemData={{ items }}  // pass data to Row
    >
      {Row}
    </List>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Why this is fast:</b> Only ~20-40 rows exist in the DOM at once instead of thousands.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Variable size example */}
            <Styled.Section>
                <Styled.H2>Example: Variable-height Rows</Styled.H2>
                <Styled.List>
                    <li>
                        Use <Styled.InlineCode>VariableSizeList</Styled.InlineCode> when row heights differ (e.g.,
                        chat messages). You must provide a <i>height getter</i> or measure rows and update sizes.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`import { VariableSizeList as List } from "react-window";

export function Chat({ messages }) {
  const listRef = React.useRef(null);
  const getSize = React.useCallback(
    (index) => Math.min(200, 24 + messages[index].text.length * 0.6), // naive estimate
    [messages]
  );

  return (
    <List
      ref={listRef}
      height={520}
      width={"100%"}
      itemCount={messages.length}
      itemSize={getSize}     // function: (index) => number
      overscanCount={8}
      itemKey={(index) => messages[index].id} // stable keys!
      itemData={{ messages }}
    >
      {({ index, style, data }) => (
        <div style={style}><b>{data.messages[index].author}:</b> {data.messages[index].text}</div>
      )}
    </List>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    For precise sizing, measure with <b>ResizeObserver</b> or a library helper, then call{" "}
                    <Styled.InlineCode>listRef.current.resetAfterIndex(index)</Styled.InlineCode> when a row's
                    height changes.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Grid example */}
            <Styled.Section>
                <Styled.H2>Example: Grid (Photos, Cards)</Styled.H2>
                <Styled.Pre>
                    {`import { FixedSizeGrid as Grid } from "react-window";

export function PhotoGrid({ items, columnWidth = 220, rowHeight = 180 }) {
  const columns = Math.max(1, Math.floor(window.innerWidth / columnWidth));
  const rows = Math.ceil(items.length / columns);

  return (
    <Grid
      columnCount={columns}
      columnWidth={columnWidth}
      height={560}
      rowCount={rows}
      rowHeight={rowHeight}
      width={Math.min(window.innerWidth, columns * columnWidth)}
      overscanRowCount={3}
      overscanColumnCount={1}
      itemData={{ items, columns }}
    >
      {({ columnIndex, rowIndex, style, data }) => {
        const index = rowIndex * data.columns + columnIndex;
        const item = data.items[index];
        if (!item) return <div style={style} />;
        return (
          <div style={style}>
            <img src={item.src} alt={item.alt} loading="lazy" />
          </div>
        );
      }}
    </Grid>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Tip:</b> Combine virtualization with <b>lazy-loaded images</b> (<i>loading="lazy"</i>) to
                    minimize network + decode cost.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Infinite loading */}
            <Styled.Section>
                <Styled.H2>Pattern: Infinite Loading</Styled.H2>
                <Styled.List>
                    <li>
                        Load the next page when the user scrolls near the end. With <code>react-window</code>, you
                        can use the companion <code>react-window-infinite-loader</code> or your own logic via{" "}
                        <code>onItemsRendered</code>.
                    </li>
                </Styled.List>
                <Styled.Pre>
                    {`// npm i react-window react-window-infinite-loader
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";

function Mailbox({ items, loadMore, hasNextPage }) {
  const itemCount = hasNextPage ? items.length + 1 : items.length;
  const isItemLoaded = (index) => index < items.length;

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMore}
      threshold={6} // start prefetching when 6 rows from the end
    >
      {({ onItemsRendered, ref }) => (
        <List
          height={520}
          itemCount={itemCount}
          itemSize={48}
          width={"100%"}
          onItemsRendered={onItemsRendered}
          ref={ref}
        >
          {({ index, style }) =>
            isItemLoaded(index) ? (
              <div style={style}>Message {index}</div>
            ) : (
              <div style={style}>Loading…</div>
            )
          }
        </List>
      )}
    </InfiniteLoader>
  );
}`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) A11y & UX considerations */}
            <Styled.Section>
                <Styled.H2>Accessibility & UX</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Find-in-page:</b> browser search (<kbd>Ctrl/Cmd+F</kbd>) won't search items not in the
                        DOM. Provide in-app search/filter or server-side search.
                    </li>
                    <li>
                        <b>ARIA roles:</b> for listbox/table patterns, set proper roles and{" "}
                        <Styled.InlineCode>aria-rowcount</Styled.InlineCode>/<Styled.InlineCode>aria-colcount</Styled.InlineCode>{" "}
                        if needed so assistive tech knows the total size.
                    </li>
                    <li>
                        <b>Keyboard nav:</b> keep a stable tab order; maintain focus on item change. Scroll the
                        active item into view programmatically when needed.
                    </li>
                    <li>
                        <b>Sticky headers/footers:</b> render outside the virtualized body; if inside, use the
                        component's <Styled.InlineCode>outerElementType</Styled.InlineCode> + CSS to pin.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 8) Performance tips */}
            <Styled.Section>
                <Styled.H2>Performance Tips</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Prefer fixed sizes</b> when possible (simpler math, fewer reflows). If variable, cache
                        measurements and call reset methods when heights change.
                    </li>
                    <li>
                        <b>Memoize rows/cells</b> (<Styled.InlineCode>React.memo</Styled.InlineCode>) and avoid
                        recreating handlers; pass data via <Styled.InlineCode>itemData</Styled.InlineCode>.
                    </li>
                    <li>
                        <b>Right-size overscan</b>: too small = blanking; too big = more work. Tune based on
                        device and row size.
                    </li>
                    <li>
                        <b>Stable item keys</b>: use an ID, not the array index, especially with insertions/deletions.
                    </li>
                    <li>
                        <b>Avoid heavy content</b> in each row (e.g., big images, complex charts). Defer or
                        progressively enhance.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Do & Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> virtualize large collections; <b>don't</b> virtualize tiny lists.</li>
                    <li><b>Do</b> combine with lazy images and request batching.</li>
                    <li><b>Do</b> expose in-app search; <b>don't</b> rely on browser find for hidden items.</li>
                    <li><b>Do</b> keep keys stable; <b>don't</b> mutate arrays without rekeying.</li>
                    <li><b>Do</b> test on low-end devices and long data sets.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Virtualization / Windowing:</b> render a subset of items near the viewport.</li>
                    <li><b>Viewport:</b> the visible scroll region of a list/grid.</li>
                    <li><b>Overscan:</b> buffer of off-screen items to prevent blanking during fast scroll.</li>
                    <li><b>Cell measurement:</b> determining item size (fixed or dynamic) for layout.</li>
                    <li><b>Recycling:</b> reusing DOM nodes for scrolled-out items, reducing mounts.</li>
                    <li><b>TTI (Time to Interactive):</b> how quickly the UI becomes usable after load.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Virtualization keeps UIs fast by rendering only what's visible. Use fixed sizes when
                you can, measure when you must, tune overscan, keep keys stable, and design with accessibility
                in mind (search, roles, focus).
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Virtualization;
