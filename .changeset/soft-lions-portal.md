---
'@var-ui/react': patch
---

Add an optional `portalContainer` prop to `Select` and `Dialog`, forwarded to
their internal overlay's `UNSTABLE_portalContainer`. Lets consumers render a
Select's dropdown or a Dialog's modal inside a specific themed subtree
instead of `document.body`, so the overlay picks up that subtree's CSS
custom properties instead of the page's ambient theme.
