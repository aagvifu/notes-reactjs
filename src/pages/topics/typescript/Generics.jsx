import { Styled } from "./styled";

const Generics = () => {
    return (
        <Styled.Page>
            <Styled.Title>TypeScript: Generics</Styled.Title>

            <Styled.Lead>
                <b>Generics</b> let you write <i>reusable, type-safe</i> code that works with many kinds of
                values while keeping the exact types. A generic is a function, type, or class that takes
                <b> type parameters</b> like <Styled.InlineCode>&lt;T&gt;</Styled.InlineCode>—placeholders for
                real types supplied by the compiler (inferred) or by you (explicit).
            </Styled.Lead>

            {/* 1) Core definitions */}
            <Styled.Section>
                <Styled.H2>Core Definitions</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Type parameter:</b> a type variable (e.g., <Styled.InlineCode>T</Styled.InlineCode>,
                        <Styled.InlineCode>K</Styled.InlineCode>) declared in angle brackets that stands for an
                        unknown type.
                    </li>
                    <li>
                        <b>Generic function/type/class:</b> something that declares type parameters and uses
                        them in its signature so it can adapt to different input/output types.
                    </li>
                    <li>
                        <b>Inference:</b> TypeScript often figures out <Styled.InlineCode>T</Styled.InlineCode>{" "}
                        automatically from arguments, so you don't have to write it.
                    </li>
                    <li>
                        <b>Constraint:</b> using <Styled.InlineCode>T extends X</Styled.InlineCode> to restrict
                        what types are allowed (e.g., "<i>T must be an object with a name</i>").
                    </li>
                    <li>
                        <b>Default type parameter:</b> give a fallback like{" "}
                        <Styled.InlineCode>&lt;T = string&gt;</Styled.InlineCode> if no type is inferred/passed.
                    </li>
                    <li>
                        <b>Indexed access type:</b> <Styled.InlineCode>T[K]</Styled.InlineCode> — the type of
                        property <Styled.InlineCode>K</Styled.InlineCode> on <Styled.InlineCode>T</Styled.InlineCode>.
                    </li>
                    <li>
                        <b><code>keyof</code>:</b> produces a union of property names of{" "}
                        <Styled.InlineCode>T</Styled.InlineCode> (e.g.,{" "}
                        <Styled.InlineCode>keyof {`{ id: string; age: number }`}</Styled.InlineCode> is{" "}
                        <Styled.InlineCode>"id" | "age"</Styled.InlineCode>).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 2) First example: identity */}
            <Styled.Section>
                <Styled.H2>First Example: Identity Function</Styled.H2>
                <Styled.Pre>
                    {`// Generic identity function: it returns the same value it receives.
function identity<T>(value: T): T {
  return value;
}

const a = identity(42);          // a: number
const b = identity("hello");     // b: string
const c = identity({ id: 1 });   // c: { id: number }`}
                </Styled.Pre>
                <Styled.Small>
                    The type parameter <Styled.InlineCode>T</Styled.InlineCode> "captures" the input type and
                    carries it to the output—so TypeScript preserves exact types.
                </Styled.Small>
            </Styled.Section>

            {/* 3) Arrays and helpers */}
            <Styled.Section>
                <Styled.H2>Working with Arrays</Styled.H2>
                <Styled.Pre>
                    {`// Return the first item of an array; if empty, return undefined.
function first<T>(arr: T[]): T | undefined {
  return arr.length ? arr[0] : undefined;
}

const n = first([10, 20, 30]);        // number | undefined
const s = first(["a", "b"]);          // string | undefined
const u = first([] as boolean[]);     // boolean | undefined`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Tip:</b> Avoid <Styled.InlineCode>any[]</Styled.InlineCode>. Use generics so callers
                    keep their element types.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Generic types (aliases & interfaces) */}
            <Styled.Section>
                <Styled.H2>Generic Type Aliases & Interfaces</Styled.H2>
                <Styled.Pre>
                    {`// A generic API response wrapper.
type ApiResponse<T> = {
  ok: boolean;
  data: T | null;
  error?: string;
};

type User = { id: string; name: string };

const res1: ApiResponse<User> = { ok: true, data: { id: "u1", name: "Ashish" } };
const res2: ApiResponse<string[]> = { ok: true, data: ["x", "y"] };`}
                </Styled.Pre>
                <Styled.Small>
                    A <b>generic alias</b> or <b>interface</b> lets you parameterize shapes that contain other
                    types (here, the <i>data</i> field).
                </Styled.Small>
            </Styled.Section>

            {/* 5) Constraints: T extends ... */}
            <Styled.Section>
                <Styled.H2>Constraints: <code>T extends …</code></Styled.H2>
                <Styled.Pre>
                    {`// Only accept items that have an "id: string" property.
type WithId = { id: string };

function indexById<T extends WithId>(items: T[]): Record<string, T> {
  return items.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {} as Record<string, T>);
}

indexById([{ id: "a", name: "A" }, { id: "b", count: 2 }]); // OK`}
                </Styled.Pre>
                <Styled.Small>
                    <b>Constraint</b> narrows what <Styled.InlineCode>T</Styled.InlineCode> can be, enabling
                    safe property access (e.g., <Styled.InlineCode>item.id</Styled.InlineCode>).
                </Styled.Small>
            </Styled.Section>

            {/* 6) key picking with keyof + indexed access */}
            <Styled.Section>
                <Styled.H2>Selecting Keys Safely (<code>keyof</code> + Indexed Access)</Styled.H2>
                <Styled.Pre>
                    {`// Pluck values for the given keys; keys must exist on T.
function pluck<T, K extends keyof T>(obj: T, keys: K[]): T[K][] {
  return keys.map(k => obj[k]);
}

const person = { id: 1, name: "Ashish", active: true };
const names = pluck(person, ["name"]);        // string[]
const flags = pluck(person, ["active"]);      // boolean[]
// pluck(person, ["missing"]);   // ❌ error: "missing" is not a key of person`}
                </Styled.Pre>
                <Styled.Small>
                    We restrict <Styled.InlineCode>K</Styled.InlineCode> to keys of{" "}
                    <Styled.InlineCode>T</Styled.InlineCode>, and return{" "}
                    <Styled.InlineCode>T[K][]</Styled.InlineCode> (the value types of those keys).
                </Styled.Small>
            </Styled.Section>

            {/* 7) Defaults & explicit args */}
            <Styled.Section>
                <Styled.H2>Default Type Parameters & Explicit Arguments</Styled.H2>
                <Styled.Pre>
                    {`// Default T to string when it can't be inferred.
function makeSet<T = string>(...items: T[]): Set<T> {
  return new Set(items);
}

const s1 = makeSet("a", "b");    // Set<string> (inferred)
const s2 = makeSet<number>(1, 2); // Set<number> (explicit)`}
                </Styled.Pre>
                <Styled.Small>
                    You can <b>pass</b> type parameters explicitly (e.g.,{" "}
                    <Styled.InlineCode>makeSet&lt;number&gt;()</Styled.InlineCode>) or rely on{" "}
                    <b>inference</b> when arguments reveal the type.
                </Styled.Small>
            </Styled.Section>

            {/* 8) Generic classes (brief) */}
            <Styled.Section>
                <Styled.H2>Generic Classes (Brief)</Styled.H2>
                <Styled.Pre>
                    {`class Box<T> {
  constructor(public value: T) {}
  map<U>(fn: (x: T) => U): Box<U> {
    return new Box(fn(this.value));
  }
}

const boxed = new Box(10);          // Box<number>
const next = boxed.map(n => n * 2); // Box<number>`}
                </Styled.Pre>
                <Styled.Small>
                    Classes can also be generic; methods may introduce new parameters like{" "}
                    <Styled.InlineCode>U</Styled.InlineCode> for transformations.
                </Styled.Small>
            </Styled.Section>

            {/* 9) React examples with generics */}
            <Styled.Section>
                <Styled.H2>React Examples with Generics</Styled.H2>
                <Styled.Pre>
                    {`// 9a) Generic List component (props typed with T)
type ListProps<T> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
};

function List<T>({ items, renderItem }: ListProps<T>) {
  return <ul>{items.map((it, i) => <li key={i}>{renderItem(it)}</li>)}</ul>;
}

// Usage:
// <List items={[{ id: 1, name: "Ashish" }]} renderItem={u => <>{u.name}</>} />


// 9b) Generic hook (e.g., fetching)
type AsyncState<T> = { status: "idle" | "loading" | "success" | "error"; data: T | null; error?: unknown; };

function useAsync<T>(fn: () => Promise<T>, deps: React.DependencyList = []): AsyncState<T> {
  const [state, setState] = React.useState<AsyncState<T>>({ status: "idle", data: null });

  React.useEffect(() => {
    let cancelled = false;
    setState({ status: "loading", data: null });
    fn()
      .then(d => !cancelled && setState({ status: "success", data: d }))
      .catch(e => !cancelled && setState({ status: "error", data: null, error: e }));
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}`}
                </Styled.Pre>
                <Styled.Small>
                    The hook's caller decides the <Styled.InlineCode>T</Styled.InlineCode> (via inference from{" "}
                    <Styled.InlineCode>fn</Styled.InlineCode>), so{" "}
                    <Styled.InlineCode>data</Styled.InlineCode> is strongly typed when used.
                </Styled.Small>
            </Styled.Section>

            {/* 10) When to use (vs unions/overloads) */}
            <Styled.Section>
                <Styled.H2>When to Use Generics (vs. Unions or Overloads)</Styled.H2>
                <Styled.List>
                    <li>
                        Choose <b>generics</b> when input and output types are <i>linked</i> (e.g., "return the
                        same type as input").
                    </li>
                    <li>
                        Choose <b>unions</b> when you accept several fixed alternatives (e.g.,{" "}
                        <Styled.InlineCode>"success" | "error"</Styled.InlineCode>).
                    </li>
                    <li>
                        Choose <b>overloads</b> when the return type depends on the <i>specific</i> call
                        signature (multiple distinct cases).
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 11) Common pitfalls */}
            <Styled.Section>
                <Styled.H2>Common Pitfalls</Styled.H2>
                <Styled.List>
                    <li>
                        Using <Styled.InlineCode>any</Styled.InlineCode> inside a generic defeats type safety.
                        Prefer constraints or more precise types.
                    </li>
                    <li>
                        Over-generic APIs (<i>too many</i> type parameters) hurt readability. Keep the minimal
                        set that expresses your relationships.
                    </li>
                    <li>
                        Forgetting constraints when you need safe property access (use{" "}
                        <Styled.InlineCode>T extends ...</Styled.InlineCode>).
                    </li>
                    <li>
                        Returning fresh object/array instances from hooks/components without memoization may
                        cause unnecessary re-renders—pair generics with{" "}
                        <Styled.InlineCode>useMemo</Styled.InlineCode>/<Styled.InlineCode>useCallback</Styled.InlineCode>{" "}
                        when identity stability matters.
                    </li>
                </Styled.List>
            </Styled.Section>

            {/* 12) Quick glossary */}
            <Styled.Section>
                <Styled.H2>Quick Glossary</Styled.H2>
                <Styled.List>
                    <li>
                        <b>Generic:</b> parameterized type/logic that adapts to the types it's used with.
                    </li>
                    <li>
                        <b>Type parameter:</b> placeholder for a type (e.g., <Styled.InlineCode>T</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Constraint:</b> limit allowed types (e.g., <Styled.InlineCode>T extends object</Styled.InlineCode>).
                    </li>
                    <li>
                        <b>Inference:</b> the compiler deduces type arguments from the values you pass.
                    </li>
                    <li>
                        <b>Indexed access:</b> <Styled.InlineCode>T[K]</Styled.InlineCode>, the type of property{" "}
                        <Styled.InlineCode>K</Styled.InlineCode> on <Styled.InlineCode>T</Styled.InlineCode>.
                    </li>
                    <li>
                        <b><code>keyof</code>:</b> union of property names of a type.
                    </li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: Use generics to express <i>type relationships</i> (inputs ↔ outputs ↔ internal data)
                while keeping code reusable and safe. Constrain when needed, rely on inference when possible,
                and keep APIs simple and predictable.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default Generics;
