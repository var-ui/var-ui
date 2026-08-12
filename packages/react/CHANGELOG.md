# @var-ui/react

## 0.0.2

### Patch Changes

- [#3](https://github.com/var-ui/var-ui/pull/3) [`5607a30`](https://github.com/var-ui/var-ui/commit/5607a30a0efb5e6565b4281b9c3c59713d4a9c89) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Add an optional `portalContainer` prop to `Select` and `Dialog`, forwarded to
  their internal overlay's `UNSTABLE_portalContainer`. Lets consumers render a
  Select's dropdown or a Dialog's modal inside a specific themed subtree
  instead of `document.body`, so the overlay picks up that subtree's CSS
  custom properties instead of the page's ambient theme.
