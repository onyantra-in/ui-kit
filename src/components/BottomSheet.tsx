import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  /** Optional node rendered in a fixed header area above the scrollable content. */
  header?: React.ReactNode;
  /** Optional node rendered in a fixed footer area below the scrollable content. */
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function BottomSheet({ open, onClose, title, header, footer, children, className, contentClassName }: BottomSheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="bottom-sheet-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className={cn('bottom-sheet', className)}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              >
                {/* Drag handle */}
                <div className="flex justify-center pt-3 pb-1">
                  <div className="w-8 h-1 rounded-full bg-border" />
                </div>

                {(title || header) && (
                  <div className="flex-none">
                    {title && (
                      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                        <Dialog.Title className="text-base font-semibold text-foreground">
                          {title}
                        </Dialog.Title>
                        <Dialog.Close asChild>
                          <button
                            className="touch-target flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors"
                            aria-label="Close"
                          >
                            <X size={20} />
                          </button>
                        </Dialog.Close>
                      </div>
                    )}
                    {header && (
                      <div className="px-4 pt-3 border-b border-border">{header}</div>
                    )}
                  </div>
                )}

                <div className={cn('flex-1 overflow-y-auto px-4 pb-6 pt-3', contentClassName)}>{children}</div>

                {footer && (
                  <div className="flex-none px-4 py-3 border-t border-border bg-card">
                    {footer}
                  </div>
                )}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
