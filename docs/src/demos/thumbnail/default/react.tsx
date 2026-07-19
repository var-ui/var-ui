import { Thumbnail } from '@var-ui/react';

const PREVIEW_URL =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Crect width="64" height="64" fill="%236c8"/%3E%3C/svg%3E';

export default function Preview() {
  return <Thumbnail src={PREVIEW_URL} alt="Preview image" />;
}
