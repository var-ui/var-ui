/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    framework: import('./lib/framework').DocsFramework;
  }
}
