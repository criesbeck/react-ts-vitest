import { useEffect } from 'react';
import type { ReactNode } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

const BottomSheet = ({ isOpen, onClose, children, title }: BottomSheetProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-purple-100 bg-opacity-40 z-[9998] transition-opacity backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Centered Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="bg-gradient-to-b from-white to-purple-50 rounded-2xl shadow-2xl max-h-[85vh] w-full max-w-2xl overflow-y-auto border-4 border-purple-400">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 rounded-t-2xl">
            {title && (
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
            )}
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    </>
  );
};

export default BottomSheet;
