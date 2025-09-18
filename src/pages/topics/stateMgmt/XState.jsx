import { Styled } from "./styled";

const XState = () => {
    return (
        <Styled.Page>
            <Styled.Title>XState (State Machines &amp; Statecharts)</Styled.Title>

            <Styled.Lead>
                <b>XState</b> lets you model UI logic as a <i>state machine/statechart</i>—a graph of
                <b> states</b> and <b>events</b> with strict, predictable transitions. Instead of
                “if/else soup,” you enumerate valid states and how the app moves between them.
            </Styled.Lead>

            {/* 1) Why XState */}
            <Styled.Section>
                <Styled.H2>Why use XState?</Styled.H2>
                <Styled.List>
                    <li><b>Clarity:</b> You list allowed states and transitions explicitly.</li>
                    <li><b>Predictability:</b> No “impossible” states (e.g., <code>loading &amp; success</code> at once).</li>
                    <li><b>Async made sane:</b> Model loading, success, error, and retries as first-class states.</li>
                    <li><b>Composition:</b> Nest machines, run them in parallel, and spawn child actors.</li>
                    <li><b>Testability:</b> You can unit-test transitions without rendering UI.</li>
                </Styled.List>
            </Styled.Section>

            {/* 2) Core vocabulary */}
            <Styled.Section>
                <Styled.H2>Core vocabulary (precise definitions)</Styled.H2>
                <Styled.List>
                    <li><b>State machine:</b> A finite set of <i>states</i> and <i>events</i> with rules (transitions) for moving between states.</li>
                    <li><b>Statechart:</b> A richer machine supporting <i>hierarchical</i> (nested) and <i>parallel</i> states, entry/exit actions, and history.</li>
                    <li><b>State:</b> A named mode like <code>idle</code>, <code>loading</code>, <code>success</code>, <code>failure</code>.</li>
                    <li><b>Event:</b> A signal that something happened, e.g. <code>{"{ type: 'SUBMIT' }"}</code>.</li>
                    <li><b>Transition:</b> How a state reacts to an event (target state + optional guard/actions).</li>
                    <li><b>Guard:</b> A boolean condition that decides whether a transition is allowed.</li>
                    <li><b>Action:</b> Synchronous effect (e.g., log, assign to context) performed during a transition.</li>
                    <li><b>Context:</b> Extended data carried by the machine (e.g., form values, fetched data).</li>
                    <li><b>Service / Invocation:</b> An async task the machine runs (e.g., fetch). Handles <code>onDone/onError</code>.</li>
                    <li><b>Entry / Exit:</b> Actions that run when a state is <i>entered</i> or <i>exited</i>.</li>
                    <li><b>Actor:</b> A running unit (machine or promise/observable/callback). Actors can <i>spawn</i> other actors.</li>
                </Styled.List>
            </Styled.Section>

            {/* 3) Minimal machine */}
            <Styled.Section>
                <Styled.H2>Minimal machine (toggle)</Styled.H2>
                <Styled.Pre>
                    {`// xstate-style pseudo (works with createMachine from 'xstate')
import { createMachine } from 'xstate';

export const toggleMachine = createMachine({
  id: 'toggle',
  initial: 'inactive',
  states: {
    inactive: { on: { TOGGLE: 'active' } },
    active:   { on: { TOGGLE: 'inactive' } }
  }
});`}
                </Styled.Pre>
                <Styled.Small>
                    A machine is just a config object. No UI here—pure behavior you can test.
                </Styled.Small>
            </Styled.Section>

            {/* 4) Using in React */}
            <Styled.Section>
                <Styled.H2>Using a machine in React</Styled.H2>
                <Styled.Pre>
                    {`import { useMachine } from '@xstate/react';
import { toggleMachine } from './machines/toggleMachine';

function ToggleButton() {
  const [state, send] = useMachine(toggleMachine);
  const isActive = state.matches('active');

  return (
    <button onClick={() => send({ type: 'TOGGLE' })}>
      {isActive ? 'On' : 'Off'}
    </button>
  );
}`}
                </Styled.Pre>
                <Styled.Small>
                    <b>state.matches('active')</b> checks the current state by name. <b>send(event)</b> dispatches events.
                </Styled.Small>
            </Styled.Section>

            {/* 5) Guards, actions, context */}
            <Styled.Section>
                <Styled.H2>Guards, actions, context (extended state)</Styled.H2>
                <Styled.Pre>
                    {`import { createMachine, assign } from 'xstate';

export const counterMachine = createMachine({
  id: 'counter',
  context: { count: 0, min: 0, max: 5 },        // extended data
  initial: 'ready',
  states: {
    ready: {
      on: {
        INC: { guard: 'canInc', actions: 'inc' },
        DEC: { guard: 'canDec', actions: 'dec' },
        SET: { actions: 'setTo' }
      }
    }
  }
}, {
  guards: {
    canInc: (ctx) => ctx.count < ctx.max,
    canDec: (ctx) => ctx.count > ctx.min
  },
  actions: {
    inc: assign({ count: (ctx) => ctx.count + 1 }),
    dec: assign({ count: (ctx) => ctx.count - 1 }),
    setTo: assign({ count: (ctx, evt) => Number(evt.value) ?? ctx.count })
  }
});`}
                </Styled.Pre>
                <Styled.Small>
                    <b>assign</b> updates context immutably. <b>guards</b> control whether a transition is allowed.
                </Styled.Small>
            </Styled.Section>

            {/* 6) Async with invoke */}
            <Styled.Section>
                <Styled.H2>Async work with <code>invoke</code></Styled.H2>
                <Styled.List>
                    <li><b>invoke:</b> attach an async service to a state. It runs when the state is entered and can transition on success/error.</li>
                    <li><b>onDone/onError:</b> handle completion using data from the promise.</li>
                </Styled.List>
                <Styled.Pre>
                    {`import { createMachine, assign } from 'xstate';

export const userMachine = createMachine({
  id: 'user',
  context: { user: null, error: null },
  initial: 'idle',
  states: {
    idle:    { on: { FETCH: 'loading' } },
    loading: {
      invoke: {
        src: 'fetchUser',                 // a function that returns a Promise
        onDone: {
          target: 'success',
          actions: assign({ user: (_, e) => e.data })
        },
        onError: {
          target: 'failure',
          actions: assign({ error: (_, e) => e.data ?? e.message })
        }
      }
    },
    success: { on: { REFRESH: 'loading' } },
    failure: { on: { RETRY: 'loading' } }
  }
}, {
  services: {
    fetchUser: () => fetch('/api/user').then(r => r.json())
  }
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 7) Hierarchical (nested) states */}
            <Styled.Section>
                <Styled.H2>Hierarchical (nested) states</Styled.H2>
                <Styled.Pre>
                    {`const authMachine = createMachine({
  id: 'auth',
  initial: 'signedOut',
  states: {
    signedOut: { on: { LOGIN: 'signingIn' } },
    signingIn: {
      initial: 'form',
      states: {
        form:    { on: { SUBMIT: 'verifying' } },
        verifying: {
          invoke: { src: 'verify', onDone: '#auth.signedIn', onError: 'form' }
        }
      }
    },
    signedIn: { id: 'signedIn', on: { LOGOUT: 'signedOut' } }
  }
});`}
                </Styled.Pre>
                <Styled.Small>
                    Nested states organize complex flows. Note the absolute target <code>#auth.signedIn</code>.
                </Styled.Small>
            </Styled.Section>

            {/* 8) Parallel states */}
            <Styled.Section>
                <Styled.H2>Parallel states</Styled.H2>
                <Styled.Pre>
                    {`const editorMachine = createMachine({
  type: 'parallel',                 // run child states simultaneously
  states: {
    network: { initial: 'idle', states: { idle: {}, saving: {}, error: {} }},
    ui:      { initial: 'clean', states: { clean: {}, dirty: {} }},
    panel:   { initial: 'preview', states: { preview: {}, code: {} }}
  }
});`}
                </Styled.Pre>
                <Styled.Small>
                    Useful when independent concerns (network, UI dirtiness, active panel) evolve separately.
                </Styled.Small>
            </Styled.Section>

            {/* 9) Actors & spawn */}
            <Styled.Section>
                <Styled.H2>Actors &amp; spawn (multiple concurrent tasks)</Styled.H2>
                <Styled.List>
                    <li><b>Actor:</b> a running process (machine/service) you can send events to.</li>
                    <li><b>spawn:</b> start a child actor from a parent to manage many items (e.g., a list of upload tasks).</li>
                </Styled.List>
                <Styled.Pre>
                    {`// Concept: a parent machine that spawns a child per upload
const uploadsMachine = createMachine({
  context: { items: [] },
  on: {
    ADD_UPLOAD: { actions: 'spawnUpload' }
  }
}, {
  actions: {
    spawnUpload: assign({
      items: (ctx, evt) => [
        ...ctx.items,
        /* spawn(uploadMachine.withContext({ file: evt.file })) */
      ]
    })
  }
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 10) Time, delays, transient */}
            <Styled.Section>
                <Styled.H2>Time, delays, transient transitions</Styled.H2>
                <Styled.List>
                    <li><b>after:</b> send an event/transition after a delay.</li>
                    <li><b>transient:</b> immediate transition based on a guard (event type <code>''</code>).</li>
                </Styled.List>
                <Styled.Pre>
                    {`const splashMachine = createMachine({
  initial: 'show',
  states: {
    show: {
      after: { 1500: 'go' }     // move after 1.5s
    },
    go: {}
  }
});

const routeGuard = createMachine({
  initial: 'check',
  states: {
    check: {
      // transient transition (no event) based on a guard
      on: { '': [{ target: 'auth', guard: 'isAuthed' }, { target: 'login' }] }
    },
    auth: {}, login: {}
  }
});`}
                </Styled.Pre>
            </Styled.Section>

            {/* 11) Do & Don't */}
            <Styled.Section>
                <Styled.H2>Do &amp; Don't</Styled.H2>
                <Styled.List>
                    <li><b>Do</b> name states clearly; avoid overloaded “flags” in context.</li>
                    <li><b>Do</b> keep async work in <code>invoke</code>, not inside actions.</li>
                    <li><b>Do</b> test transitions without rendering UI—machines are pure data.</li>
                    <li><b>Don't</b> duplicate UI state in context that can be derived from <code>state.matches()</code>.</li>
                    <li><b>Don't</b> mutate context directly—use <code>assign</code>.</li>
                </Styled.List>
            </Styled.Section>

            {/* 12) When to choose XState */}
            <Styled.Section>
                <Styled.H2>When should I use XState?</Styled.H2>
                <Styled.List>
                    <li><b>Great fit:</b> multi-step flows (auth, checkout), complex async (retry/cancel), multi-pane editors, complex toggles.</li>
                    <li><b>Maybe overkill:</b> very small local UI where a simple <code>useReducer</code> or <code>useState</code> is enough.</li>
                </Styled.List>
            </Styled.Section>

            {/* 13) Quick checklist */}
            <Styled.Section>
                <Styled.H2>Quick checklist</Styled.H2>
                <Styled.List>
                    <li>List the <b>states</b> of your feature first.</li>
                    <li>List the <b>events</b> that can happen.</li>
                    <li>Draw transitions; add <b>guards</b> where needed.</li>
                    <li>Move side effects to <b>invoke</b> or explicit <b>actions</b>.</li>
                    <li>Use <b>state.matches()</b> in components to render intent-based UI.</li>
                </Styled.List>
            </Styled.Section>

            {/* 14) Glossary */}
            <Styled.Section>
                <Styled.H2>Glossary</Styled.H2>
                <Styled.List>
                    <li><b>Initial state:</b> the first state when the machine starts.</li>
                    <li><b>Final state:</b> a terminal state (the machine/branch stops when reached).</li>
                    <li><b>Entry/Exit action:</b> code that runs when entering/leaving a state.</li>
                    <li><b>History state:</b> pseudo-state that remembers the last sub-state in a region.</li>
                    <li><b>Parallel state:</b> a node where multiple child states are active together.</li>
                </Styled.List>
            </Styled.Section>

            <Styled.Callout>
                Summary: XState helps you <b>model before you code</b>. By enumerating states and events,
                you get a predictable system that's easier to test, discuss, and evolve.
            </Styled.Callout>
        </Styled.Page>
    );
};

export default XState;
