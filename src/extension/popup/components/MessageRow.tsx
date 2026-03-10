import type { ValidationMessage } from '../../../shared/types/validation';
import { SEVERITY_LABELS, SEVERITY_STYLES } from './severityStyles';

interface MessageRowProps {
  readonly message: ValidationMessage;
}

export const MessageRow = ({ message }: MessageRowProps) => {
  const style = SEVERITY_STYLES[message.severity];
  return (
    <li className="flex gap-2.5 px-3 py-2">
      <span
        aria-label={SEVERITY_LABELS[message.severity]}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${style.badge}`}
      >
        {style.symbol}
      </span>
      <div className="min-w-0">
        <p className={`text-sm font-medium ${style.text}`}>{message.title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          {message.description}
        </p>
      </div>
    </li>
  );
};
