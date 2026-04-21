import { DonationStatus, STATUS_LABEL } from "@/lib/annaStore";

const styles: Record<DonationStatus, string> = {
  posted: "bg-accent/20 text-accent-foreground border-accent/40",
  accepted: "bg-primary/15 text-primary border-primary/40",
  assigned: "bg-terracotta/15 text-terracotta border-terracotta/40",
  picked_up: "bg-maroon/15 text-maroon border-maroon/40",
  delivered: "bg-primary/20 text-primary border-primary/50",
};

export const StatusBadge = ({ status }: { status: DonationStatus }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${styles[status]}`}>
    <span className="w-1.5 h-1.5 rounded-full bg-current" />
    {STATUS_LABEL[status]}
  </span>
);
