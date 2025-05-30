import React, { forwardRef, ReactNode } from 'react';

interface PrintContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * A container component that ensures content is print-friendly
 * and avoids problematic color functions like oklch
 */
export const PrintContainer = forwardRef<HTMLDivElement, PrintContainerProps>(
  ({ children, className = '' }, ref) => {
    // Basic print-friendly styles as inline styles to avoid any theme color issues
    const printStyles: React.CSSProperties = {
      backgroundColor: 'white',
      color: 'black',
      fontFamily: 'Arial, sans-serif',
    };

    return (
      <div 
        ref={ref}
        className={`print-container ${className}`}
        style={printStyles}
      >
        {children}
      </div>
    );
  }
);

PrintContainer.displayName = 'PrintContainer'; 