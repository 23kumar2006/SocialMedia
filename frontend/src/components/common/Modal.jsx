import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-xl',
  className = '',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Dialog Card */}
      <div
        className={cn(
          'relative w-full glass-modal rounded-2xl border border-slate-700/80 shadow-2xl z-10 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200',
          maxWidth,
          className
        )}
      >
        {/* Modal Header */}
        {(title || subtitle) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80">
            <div>
              {title && <h3 className="text-lg font-bold text-slate-100">{title}</h3>}
              {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Modal Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
