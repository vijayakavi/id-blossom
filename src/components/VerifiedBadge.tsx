import { CheckCircle2 } from 'lucide-react';

const VerifiedBadge = () => {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-verified-light text-verified animate-fade-in">
      <CheckCircle2 className="w-5 h-5" />
      <span className="font-semibold">Verified</span>
    </div>
  );
};

export default VerifiedBadge;
