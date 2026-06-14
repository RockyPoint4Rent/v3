import { STATUS_LABELS, STATUS_COLORS } from '../../lib/supabase';
import type { BookingStatus } from '../../lib/supabase';

type Props = { status: BookingStatus };

export default function StatusBadge({ status }: Props) {
  const { bg, text, border } = STATUS_COLORS[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-sans font-semibold uppercase tracking-wide border ${bg} ${text} ${border} whitespace-nowrap`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${text.replace('text-', 'bg-')}`} />
      {STATUS_LABELS[status]}
    </span>
  );
}
