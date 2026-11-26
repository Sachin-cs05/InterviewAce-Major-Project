import React from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button';

/**
 * Reusable Empty State Display Component (White & Emerald Theme)
 */
export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No items found',
  description = 'There is currently no data to display.',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white border border-dashed border-slate-200 rounded-2xl ${className}`}
    >
      <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 shadow-xs">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-slate-800">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button onClick={onAction} size="sm">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
