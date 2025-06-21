import { Menu } from "lucide-react";

interface MobileMenuButtonProps {
  isVisible: boolean;
  onClick: () => void;
}

export default function MobileMenuButton({
  isVisible,
  onClick,
}: MobileMenuButtonProps) {
  if (!isVisible) return null;

  return (
    <button
      onClick={onClick}
      className="fixed top-4 left-4 z-40 h-11 w-11 p-0 flex items-center justify-center rounded-lg bg-[--nav-active-bg] text-[--nav-active-text] shadow-lg transition-transform duration-200 hover:scale-105"
    >
      <Menu className="w-5 h-5" />
    </button>
  );
}
