import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
      <div
          className="relative flex w-full"
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
      >
        {isVisible && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none">
              <div className="px-2.5 py-1.5 text-xs font-medium text-popover-foreground bg-popover rounded-md border border-border shadow-lg whitespace-nowrap">
                {content}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-0 h-0 border-4 border-transparent border-t-popover" />
              </div>
            </div>
        )}
        {children}
      </div>
  );
};
