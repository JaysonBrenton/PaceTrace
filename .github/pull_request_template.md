## Summary
- 

## Auth Story Links
Provide the Chromatic or Storybook URLs and mark whether the implementation conforms to the spec or documents an intentional deviation.

| Story | Link | Status (Conforms / Intentional deviation) |
| --- | --- | --- |
| Auth/Login/Default |  |  |
| Auth/Login/Loading |  |  |
| Auth/Login/Error |  |  |
| Auth/Login/ProviderInProgress |  |  |
| Auth/Login/SuccessRedirect |  |  |
| Auth/Register/Default |  |  |
| Auth/Register/Loading |  |  |
| Auth/Register/Error |  |  |
| Auth/Register/ProviderInProgress |  |  |
| Auth/Register/Success |  |  |
| Auth/Forgot/Default |  |  |
| Auth/Forgot/Loading |  |  |
| Auth/Forgot/Sent |  |  |

## Verification
- [ ] Storybook renders the auth surfaces with the defined tokens
- [ ] Chromatic checks are passing (unexpected diffs resolved)
- [ ] Confirm no raw hex values are used in components (tokens only)
- [ ] Accessibility pass: focus order, labels, and announcements verified
