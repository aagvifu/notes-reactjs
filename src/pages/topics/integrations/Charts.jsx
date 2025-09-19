import React from "react";
import { Styled } from "./styled";

const Charts = () => {
    return (
        <Styled.Page>
            <Styled.Title>Charts (External Integrations)</Styled.Title>

            <Styled.Lead>
                Charts help us <b>visualize data</b> so patterns, comparisons, and trends become obvious.
                In React, you can use ready-made libraries (Chart.js, Recharts, ECharts) or wire D3 directly.
                This page explains the ecosystem, key terms, how to pick a library, and shows simple React-friendly patterns.
            </Styled.Lead>

            {/* 1) What & Why */}
            <Styled.Section>
                <Styled.H2>What is a Chart Integration & Why it matters</Styled.H2>
                <Styled.List>
                    <li><b>Chart integration:</b> Using a visualization library inside a React app to render graphs (line, bar, pie, etc.).</li>
                    <li><b>Why:</b> Communicate data clearly, enable interactivity (hover, zoom), and support decision-making.</li>
                    <li><b>Approaches:</b> <i>Declarative</i> (React components like Recharts) vs <i>Imperative</i> (Chart.js/D3 APIs).</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Key terms */}
            <Styled.Section>
                <Styled.H2>Key Terms (plain English)</Styled.H2>
                <Styled.List>
                    <li><b>Series:</b> A sequence of related data points (e.g., daily temperature).</li>
                    <li><b>Axis:</b> The reference line for values/categories; <i>x-axis</i> (horizontal) and <i>y-axis</i> (vertical).</li>
                    <li><b>Scale:</b> Function that maps data values to pixels (linear, time, log).</li>
                    <li><b>Domain:</b> Input range of a scale (e.g., min/max data values).</li>
                    <li><b>Range:</b> Output range of a scale (e.g., 0→width in pixels).</li>
                    <li><b>Legend:</b> A guide explaining colors/markers for each series.</li>
                    <li><b>Tooltip:</b> A small overlay showing details on hover/focus.</li>
                    <li><b>Canvas vs SVG vs WebGL:</b> Rendering technologies. <i>SVG</i> is DOM-based (great for small/medium data, crisp text); <i>Canvas</i> is pixel-based (faster when many points); <i>WebGL</i> is GPU-accelerated (huge datasets).</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Library landscape */}
            <Styled.Section>
                <Styled.H2>Popular Libraries & When to Use</Styled.H2>
                <Styled.List>
                    <li><b>Recharts (React + SVG, declarative):</b> Easy, composable components, great defaults; best for dashboards and typical charts.</li>
                    <li><b>Chart.js (Canvas, imperative; with react-chartjs-2 wrapper):</b> Simple API, polished defaults; good for quick results, many chart types.</li>
                    <li><b>ECharts (Canvas; React wrapper):</b> Feature-rich (zoom, brush, map), themeable; good for analytics dashboards.</li>
                    <li><b>D3 (low-level toolkit):</b> Full control of scales, layouts, interactions; steeper learning curve; often paired with React for custom visuals.</li>
                    <li><b>VisX/Nivo/Victory:</b> React-first ecosystems with strong theming and components.</li>
                </Styled.List>
            </Styled.Section>

            {/* 4) Choosing guide */}
            <Styled.Section>
                <Styled.H2>How to choose (quick guide)</Styled.H2>
                <Styled.List>
                    <li><b>Just need dashboards fast?</b> Start with <b>Recharts</b> or <b>Nivo</b>.</li>
                    <li><b>Familiar with Chart.js?</b> Use <b>react-chartjs-2</b>.</li>
                    <li><b>Advanced interactions / huge data?</b> Consider <b>ECharts</b> or <b>WebGL-backed</b> libs.</li>
                    <li><b>Custom, bespoke visuals?</b> Use <b>D3 + React</b> pattern.</li>
                </Styled.List>
            </Styled.Section>

            {/* 5) Data prep */}
            <Styled.Section>
                <Styled.H2>Data Preparation (the foundation)</Styled.H2>
                <Styled.List>
                    <li>Normalize your data: consistent keys (e.g., <code>{`{ date, value }`}</code>).</li>
                    <li>Parse dates up front (<i>not</i> in the render loop).</li>
                    <li>Sort by x-axis (time or category) to avoid jagged lines.</li>
                    <li>Handle <b>missing values</b> (nulls): drop, interpolate, or show gaps.</li>
                </Styled.List>
            </Styled.Section>

            {/* 6) React patterns */}
            <Styled.Section>
                <Styled.H2>React Integration Patterns</Styled.H2>
                <Styled.List>
                    <li><b>Controlled props:</b> Chart gets all its data/size via props; parent owns state.</li>
                    <li><b>Resize handling:</b> Observe container size (e.g., <i>ResizeObserver</i>) and re-render chart.</li>
                    <li><b>Memoization:</b> Use <code>useMemo</code>/<code>useCallback</code> for derived data and event handlers.</li>
                    <li><b>Uncontrolled refs (D3/imperative):</b> Mount chart into an empty <code>&lt;svg&gt;</code>/<code>&lt;canvas&gt;</code> via <code>useEffect</code>.</li>
                </Styled.List>
            </Styled.Section>

            {/* 7A) Example: Recharts */}
            <Styled.Section>
                <Styled.H2>Example 1 — Recharts (declarative, SVG)</Styled.H2>
                <Styled.Pre>
                    {`// Install: npm i recharts
// A simple responsive line chart (monthly sales)
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

const data = [
  { month: "Jan", sales: 1200 },
  { month: "Feb", sales: 980 },
  { month: "Mar", sales: 1320 },
  // ...
];

function SalesLineChart() {
  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="sales" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Declarative:</b> You compose charts using React components. <b>ResponsiveContainer</b> listens to parent size.
                </Styled.Small>
            </Styled.Section>

            {/* 7B) Example: Chart.js */}
            <Styled.Section>
                <Styled.H2>Example 2 — Chart.js via react-chartjs-2 (Canvas)</Styled.H2>
                <Styled.Pre>
                    {`// Install: npm i chart.js react-chartjs-2
// Quick bar chart (product counts)
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const labels = ["A", "B", "C", "D"];
const dataset = [12, 19, 8, 15];

const data = {
  labels,
  datasets: [
    { label: "Products", data: dataset, borderWidth: 1 }
  ]
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: { y: { beginAtZero: true } }
};

function ProductBarChart() {
  return (
    <div style={{ width: "100%", height: 280 }}>
      <Bar data={data} options={options} />
    </div>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Canvas:</b> Faster with larger datasets. <b>options</b> controls scales, tooltips, legends, etc.
                </Styled.Small>
            </Styled.Section>

            {/* 7C) Example: D3 in React */}
            <Styled.Section>
                <Styled.H2>Example 3 — D3 + React (custom SVG)</Styled.H2>
                <Styled.Pre>
                    {`// Install: npm i d3
// Pattern: useRef + useEffect; D3 draws inside <svg>
import * as d3 from "d3";

function TinyLine({ data, width = 320, height = 160, margin = 24 }) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!ref.current || !data?.length) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // clear

    const innerW = width - margin * 2;
    const innerH = height - margin * 2;

    const x = d3.scalePoint()
      .domain(data.map(d => d.label))
      .range([0, innerW]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .nice()
      .range([innerH, 0]);

    const g = svg.append("g").attr("transform", \`translate(\${margin},\${margin})\`);

    const line = d3.line()
      .x(d => x(d.label))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "currentColor")
      .attr("stroke-width", 2)
      .attr("d", line);

    g.append("g").attr("transform", \`translate(0,\${innerH})\`).call(d3.axisBottom(x));
    g.append("g").call(d3.axisLeft(y));
  }, [data, width, height, margin]);

  return <svg ref={ref} width={width} height={height} role="img" aria-label="Trend line chart" />;
}

// Usage:
// <TinyLine data={[{label:'Jan', value:12}, {label:'Feb', value:18}]} />
`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Imperative:</b> D3 manipulates the SVG directly. Great for custom visuals and full control.
                </Styled.Small>
            </Styled.Section>

            {/* 8) Accessibility */}
            <Styled.Section>
                <Styled.H2>Accessibility (must-have)</Styled.H2>
                <Styled.List>
                    <li><b>Provide text alternatives:</b> <code>aria-label</code> on the SVG/canvas and a short paragraph summary of the insight.</li>
                    <li><b>Keyboard:</b> Ensure focusable elements for legend toggles, zoom controls, and tooltips (if interactive).</li>
                    <li><b>Color:</b> High contrast, avoid relying only on color; use different markers/patterns for series.</li>
                    <li><b>Data table fallback:</b> Provide a small table link for screen readers if the chart is critical.</li>
                </Styled.List>
            </Styled.Section>

            {/* 9) Performance */}
            <Styled.Section>
                <Styled.H2>Performance Tips</Styled.H2>
                <Styled.List>
                    <li><b>Downsample large data:</b> show fewer points or aggregated buckets (e.g., daily → weekly).</li>
                    <li><b>Memoize derived values:</b> <code>useMemo</code> for scales, sorted arrays, computed series.</li>
                    <li><b>Throttle interactions:</b> debounce hover/brush handlers.</li>
                    <li><b>Choose Canvas/WebGL</b> for 10k+ points or heavy animations.</li>
                </Styled.List>
            </Styled.Section>

            {/* 10) Do & Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> label axes and units (e.g., “Sales (₹)”).</li>
                    <li><b>Do</b> pick correct chart type: line for trends, bar for comparisons, area for cumulative feel, pie/donut sparingly.</li>
                    <li><b>Do</b> show tooltips/legends clearly and keep the chart readable on mobile.</li>
                    <li><b>Don't</b> overload with effects; clarity beats decoration.</li>
                    <li><b>Don't</b> re-compute heavy transforms in every render.</li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common Pitfalls</Styled.H2>
                <Styled.List>
                    <li>Mixing controlled React state with imperative chart mutations (pick one source of truth).</li>
                    <li>Forgetting to clean up listeners on unmount (zoom/resize). </li>
                    <li>Parsing dates inside render (do it once when data loads).</li>
                    <li>Unreadable labels (overlap, tiny fonts, poor contrast).</li>
                </Styled.List>
            </Styled.Section>

            {/* 12) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Declarative chart:</b> You describe <i>what</i> to draw (components/props), library draws it.</li>
                    <li><b>Imperative chart:</b> You manually tell the library <i>how</i> to draw (functions that mutate).</li>
                    <li><b>Responsive chart:</b> Resizes with its container while keeping proportions readable.</li>
                    <li><b>Outliers:</b> Data points far from most values; may require special handling (clip/annotate).</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Pick a library that matches your needs and team skills. Keep data tidy, label clearly,
                ensure accessibility, and optimize for performance. Start simple, then add interactivity.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Charts;
