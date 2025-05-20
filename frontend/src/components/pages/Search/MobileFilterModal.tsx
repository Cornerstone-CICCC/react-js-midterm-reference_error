import type React from "react";
import { IoMdClose, IoMdFunnel } from "react-icons/io";

type MobileFilterModalProps = {
  open: boolean;
  onClose: () => void;
  onClear: () => void;
  onApply: () => void;
  children: React.ReactNode;
};

export function MobileFilterModal({
  open,
  onClose,
  onClear,
  onApply,
  children,
}: MobileFilterModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 bg-black/50 flex items-end md:hidden">
      <div className="relative w-full rounded-t-2xl bg-white shadow-lg flex flex-col h-[80vh] animate-slideUp">
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-300 sticky top-0 bg-white z-10">
          <span className="font-bold text-lg flex items-center gap-2 text-gray-500">
            <IoMdFunnel size={22} />
            Filter
          </span>
          <button
            className="text-gray-500 hover:text-gray-800"
            onClick={onClose}
            aria-label="Close filter"
          >
            <IoMdClose fontSize="28px" />
          </button>
        </div>
        {/* フィルター条件部分のみスクロール */}
        <div className="flex-1 overflow-y-auto px-2 py-2">{children}</div>
        {/* フッター（Apply/Clearボタン） */}
        <div className="sticky bottom-0 bg-white px-4 py-3 border-t border-gray-300 flex gap-3 z-10">
          <button
            className="py-2 px-4 rounded-lg border border-orange-500 text-orange-500 font-bold hover:bg-orange-50 transition"
            onClick={onClear}
          >
            Clear
          </button>
          <button
            className="flex-1 py-2 rounded-lg bg-orange-500 text-white font-bold hover:bg-orange-600 transition shadow"
            onClick={onApply}
          >
            Apply
          </button>
        </div>
      </div>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.25s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
}
