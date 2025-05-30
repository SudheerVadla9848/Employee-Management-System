import React from 'react';
import clsx from 'clsx';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

interface AlertProps {
  children: React.ReactNode;
  variant: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ children, variant, title, onClose }) => {
  const baseClasses = 'p-4 rounded-md';
  
  const variantClasses = {
    success: 'bg-green-50 text-green-800 border border-green-200',
    error: 'bg-red-50 text-red-800 border border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border border-blue-200',
  };
  
  const iconMap = {
    success: <CheckCircle className="h-5 w-5 text-green-400" />,
    error: <XCircle className="h-5 w-5 text-red-400" />,
    warning: <AlertCircle className="h-5 w-5 text-yellow-400" />,
    info: <Info className="h-5 w-5 text-blue-400" />,
  };
  
  return (
    <div className={clsx(baseClasses, variantClasses[variant])}>
      <div className="flex">
        <div className="flex-shrink-0">
          {iconMap[variant]}
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={clsx('text-sm font-medium', {
              'text-green-800': variant === 'success',
              'text-red-800': variant === 'error',
              'text-yellow-800': variant === 'warning',
              'text-blue-800': variant === 'info',
            })}>
              {title}
            </h3>
          )}
          <div className={clsx('text-sm', {
            'text-green-700': variant === 'success',
            'text-red-700': variant === 'error',
            'text-yellow-700': variant === 'warning',
            'text-blue-700': variant === 'info',
          })}>
            {children}
          </div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className={clsx('inline-flex rounded-md p-1.5', {
                  'bg-green-50 text-green-500 hover:bg-green-100': variant === 'success',
                  'bg-red-50 text-red-500 hover:bg-red-100': variant === 'error',
                  'bg-yellow-50 text-yellow-500 hover:bg-yellow-100': variant === 'warning',
                  'bg-blue-50 text-blue-500 hover:bg-blue-100': variant === 'info',
                })}
              >
                <span className="sr-only">Dismiss</span>
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;