import type { ToastTone } from '@var-ui/core';

export type ToastContentData = {
  title: string;
  description?: string;
  tone?: ToastTone;
};
