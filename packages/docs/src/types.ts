export type SidebarItem = {
  text: string;
  link: string;
};

export type SidebarSection = {
  title: string;
  items: readonly SidebarItem[];
};

export type TopNavItem = {
  text: string;
  link: string;
  match: string;
};

export type DocsSearchItem = {
  id: string;
  title: string;
  meta?: string;
  keywords?: string[];
  group?: string;
};

export type DocsBrand = {
  heading: string;
  href: string;
};
