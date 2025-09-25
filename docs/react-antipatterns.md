# React Antipatterns and Best Practices

This document captures a set of React patterns and recommendations that should be avoided or followed in this project. The guidance was provided by the team and is stored here for easy reference across future conversations.

## How to read this guide

The antipatterns are grouped by concern and annotated with:

- **What to avoid** – the behavior that causes issues.
- **Better approach** – the preferred pattern (often enforced by lint rules).
- **Exception cues** – situations where the rule may be relaxed, with links to the relevant ESLint configuration so you can justify the deviation in code review.

## State & data flow

| What to avoid | Better approach | Exception cues |
| --- | --- | --- |
| Declaring mutable values as plain variables inside components. | Reach for `useState`, `useReducer`, or module-level constants to persist data across renders. | Non-reactive constants should live outside the component. Lint: [`react/function-component-definition`](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/function-component-definition.md). |
| Complex state managed via many independent setters. | Consolidate with `useReducer` and export an `initialState()` factory to avoid accidental mutation. | Simple boolean toggles can remain discrete. Lint: [`@typescript-eslint/prefer-readonly`](https://typescript-eslint.io/rules/prefer-readonly/) when available. |
| Storing values in state that never trigger UI updates (e.g., timers). | Use `useRef` for mutable, non-rendering data. | If the value drives rendering, state is correct. |

### Counter example

```tsx
// ❌ Will reset on every render
function AuthForm() {
  const errors: string[] = [];
  // ...
}

// ✅ Stable across renders
function AuthForm() {
  const [errors, setErrors] = useState<string[]>([]);
  // ...
}
```

## Hooks & effects

| What to avoid | Better approach | Exception cues |
| --- | --- | --- |
| Omitting dependencies from `useEffect`/`useCallback`/`useMemo`. | Include every referenced value and refactor internals if the effect runs too often. | Disable `react-hooks/exhaustive-deps` only when an explanatory comment is added and a reviewer agrees. |
| Recreating callbacks that are passed to memoized children. | Wrap them in `useCallback` with a stable dependency list. | Stateless children that do not memoize props can accept inline callbacks. |
| Memoizing constant expressions with `useMemo(() => value, [])`. | Hoist constants outside the component. | Heavy computations that depend on environment data (e.g., `window`) can remain in a `useMemo` gated behind guards. |
| Running initialization logic in effects when it can live at module scope. | Move single-run setup outside React. | Effects remain appropriate when initialization depends on props or state. |

### Counter example

```tsx
// ❌ Missing dependency, effect never updates when provider changes
useEffect(() => {
  analytics.track('auth_provider', { provider });
}, []);

// ✅ Lint-compliant and explicit
useEffect(() => {
  analytics.track('auth_provider', { provider });
}, [provider]);
```

## Components & rendering

| What to avoid | Better approach | Exception cues |
| --- | --- | --- |
| Defining child components inside parent render bodies. | Lift them to the module scope to preserve identity. | Inline render functions are acceptable when memoization is unnecessary and the child is trivial. Lint: [`react/no-unstable-nested-components`](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-unstable-nested-components.md). |
| Rendering different hook sets conditionally. | Call hooks at the top level in every render path. | None – violating [`react-hooks/rules-of-hooks`](https://react.dev/learn/rules-of-hooks) is always a bug. |
| Toggling children by unmounting the component from the parent. | Let the child own its visibility via props so its state survives toggles. | Use `key` changes intentionally when you want to reset child state. |

### Counter example

```tsx
// ❌ Nested component resets on every render
function Providers() {
  const providers = ['google', 'apple', 'facebook'];

  const ProviderButton = ({ provider }: { provider: string }) => (
    <button>{provider}</button>
  );

  return providers.map((provider) => (
    <ProviderButton key={provider} provider={provider} />
  ));
}

// ✅ Stable component definition
const ProviderButton = ({ provider }: { provider: string }) => (
  <button>{provider}</button>
);

function Providers() {
  const providers = ['google', 'apple', 'facebook'];
  return providers.map((provider) => (
    <ProviderButton key={provider} provider={provider} />
  ));
}
```

## Styling & tokens

| What to avoid | Better approach | Exception cues |
| --- | --- | --- |
| Inlining raw hex values or recreating Tailwind classes ad hoc. | Consume the design tokens declared in `web/src/styles/tokens.css` via Tailwind utilities or CSS variables. | Temporary palette exploration should happen in Storybook branches and document the rationale in PRs. |
| Declaring style objects inside component bodies. | Move them to module scope or convert them into Tailwind utility classes. | Inline styles with runtime-dependent values (e.g., dynamic gradients) are fine but document the reasoning. |

## Additional references

- **Lint rules** – `react-hooks/rules-of-hooks`, `react-hooks/exhaustive-deps`, and `react/no-unstable-nested-components` enforce most items in this guide.
- **Design tokens** – see `README.md` and `docs/authentication.md` for how the Storybook workspace validates token usage.
- **Exceptions** – when you must disable a lint rule, include a comment describing the trade-off so reviewers can approve it explicitly.

