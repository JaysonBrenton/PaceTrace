# React Antipatterns and Best Practices

This document captures a set of React patterns and recommendations that should be avoided or followed in this project. The guidance was provided by the team and is stored here for easy reference across future conversations.

## Antipatterns to Avoid

1. **Use `useState` Instead of Plain Variables**  
   Never declare stateful values as local variables inside a component. Re-declaring on each render breaks memoization and effect dependencies. Prefer `useState`, `useReducer`, or external constants for values that do not change.
2. **Declare CSS Outside Components**  
   When using CSS-in-JS, lift style objects out of components to avoid recreating them on every render.
3. **Avoid Unmemoized Functions**  
   Unmemoized inline functions are recreated every render. Consider `useCallback` when dependencies are stable and downstream consumers rely on referential equality.
4. **Prevent Dependency Churn**  
   Wrap callbacks in `useCallback` when they are dependencies of other hooks (e.g., `useEffect`, `useMemo`) or passed to memoized children.
5. **Prevent Extraneous Effects**  
   Memoize callbacks used inside effects to avoid unnecessary effect executions.
6. **Include Dependency Arrays**  
   Always provide dependency arrays to hooks such as `useEffect`, `useCallback`, and `useMemo` when the logic relies on external values.
7. **List All Dependencies**  
   Do not omit dependencies from hook arrays. Handle conditional behavior within the hook body instead of removing dependencies.
8. **Do Not Initialize External Code in `useEffect`**  
   Invoke initialization code outside components unless it depends on component state. Include all dependencies if it must live in an effect.
9. **Do Not Wrap External Functions with `useCallback`**  
   Passing external functions directly avoids unnecessary dependency checks and is more concise.
10. **Avoid `useMemo` with Empty Dependencies**  
    Lift constant computations outside the component instead of memoizing them with empty arrays.
11. **Do Not Declare Components Inside Components**  
    Declare child components outside parents (or in separate files) to preserve identity across renders.
12. **No Conditional Hooks**  
    Do not place hooks inside conditionals or after early returns. Always call hooks at the top level of the component.
13. **Let Children Control Rendering**  
    When feasible, let child components decide whether to render to preserve their state across toggles.
14. **Prefer `useReducer` for Complex State**  
    When managing multiple related pieces of state, consider a reducer to consolidate logic.
15. **Provide Initial State Functions**  
    Export reducer initial states as functions to avoid accidental mutation.
16. **Use `useRef` for Non-Rendering State**  
    Prefer refs over state when a value should persist across renders without triggering rerenders.

## Additional Notes

* The guidance above is intentionally conservative: apply these practices thoughtfully rather than mechanically.
* When in doubt, favor solutions that keep React hooks predictable and avoid unnecessary re-renders or side effects.

