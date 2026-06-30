import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";

type ChapterBackButtonProps = {
  children: ReactNode;
  className: string;
  onBack: () => void;
};

export function ChapterBackButton({ children, className, onBack }: ChapterBackButtonProps) {
  return (
    <button onClick={onBack} className={className}>
      <ChevronLeft className="icon-chevron" style={{ marginRight: 8 }} /> {children}
    </button>
  );
}
