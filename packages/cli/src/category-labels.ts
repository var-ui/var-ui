export const CATEGORY_LABELS: Record<string, string> = {
  action: 'Action',
  'data-input': 'Data Input',
  feedback: 'Feedback',
  overlay: 'Overlay',
  layout: 'Layout',
  content: 'Content',
  container: 'Container',
  chat: 'Chat',
};

export function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}
