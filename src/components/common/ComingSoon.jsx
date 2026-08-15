import { Construction } from 'lucide-react';
import EmptyState from './EmptyState.jsx';

export default function ComingSoon({ title, phase }) {
  return (
    <EmptyState
      icon={Construction}
      title={title}
      description={`This section is not built yet — it lands in ${phase} of the development roadmap.`}
    />
  );
}
