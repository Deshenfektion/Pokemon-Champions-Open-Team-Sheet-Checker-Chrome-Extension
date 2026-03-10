import type { Severity } from '../../../shared/types/validation';

export interface SeverityStyle {
  readonly symbol: string;
  readonly badge: string;
  readonly text: string;
}

export const SEVERITY_STYLES: Readonly<Record<Severity, SeverityStyle>> = {
  error: {
    symbol: '✕',
    badge: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
    text: 'text-red-700 dark:text-red-300',
  },
  warning: {
    symbol: '⚠',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    text: 'text-amber-700 dark:text-amber-300',
  },
  info: {
    symbol: 'ℹ',
    badge: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
    text: 'text-sky-700 dark:text-sky-300',
  },
};

export const SEVERITY_LABELS: Readonly<Record<Severity, string>> = {
  error: 'Error',
  warning: 'Warning',
  info: 'Suggestion',
};
