/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    framework?: import('./framework').DocsFramework;
  }
}
