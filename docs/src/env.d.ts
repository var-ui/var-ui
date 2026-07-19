/// <reference types="astro/client" />

declare module '*.astro' {
  const Component: import('astro').AstroComponentFactory;
  export default Component;
}

declare namespace App {
  interface Locals {
    framework: import('./lib/framework').DocsFramework;
  }
}
