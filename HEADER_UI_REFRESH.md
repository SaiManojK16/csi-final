# Header UI Refresh

## Summary
- Introduced a warm gradient header background with blurred glass effect to match the refreshed landing page palette.
- Upgraded navigation pills with rounded highlights and smoother hover/active states.
- Replaced the avatar-only trigger with a greeting chip that shows initials, name, and a caret indicator.
- Rebuilt the dropdown into distinct sections: quick actions, a friendly nudge, and a prominent sign-out button.

## Files Updated
- `src/components/Header.js`
- `src/components/Header.css`

## UX Benefits
- Clearer navigation hierarchy with more generous spacing.
- Profile menu now feels personal and aligned with the “friendly academic” tone.
- Dropdown actions are grouped logically, and sign-out stands out without feeling harsh.
- Responsive tweaks hide the greeting on smaller screens while keeping access to the profile options.

- Removed the motivational tip block from the dropdown to keep the menu focused on navigation and profile actions.
- Added support for an Account Overview link in the dropdown (placeholder route `/account`).
- Refreshed the profile edit dialog with grouped fields, helper hints, and consistent focus states (see `ProfileEditDialog.css`).
