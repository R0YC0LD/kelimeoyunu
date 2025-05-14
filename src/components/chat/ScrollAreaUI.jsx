
import React from 'react';
import { cn } from '@/lib/utils';

const ScrollAreaPrimitiveRoot = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("relative overflow-hidden", className)} {...props}>
      {children}
    </div>
  )
);
ScrollAreaPrimitiveRoot.displayName = "ScrollAreaPrimitiveRoot";

const ScrollAreaPrimitiveViewport = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("h-full w-full rounded-[inherit]", className)}
      {...props}
    >
      {children}
    </div>
  )
);
ScrollAreaPrimitiveViewport.displayName = "ScrollAreaPrimitiveViewport";

const ScrollBarPrimitiveThumb = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("relative flex-1 rounded-full bg-border", className)}
      {...props}
    />
  )
);
ScrollBarPrimitiveThumb.displayName = "ScrollBarPrimitiveThumb";

const ScrollBarPrimitive = React.forwardRef(
  ({ className, orientation = "vertical", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex touch-none select-none transition-colors",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent p-[1px]",
        orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent p-[1px]",
        className
      )}
      {...props}
    >
      <ScrollBarPrimitiveThumb />
    </div>
  )
);
ScrollBarPrimitive.displayName = "ScrollBarPrimitive";

const ScrollAreaUI = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <ScrollAreaPrimitiveRoot
      ref={ref}
      className={cn("rounded-md border border-slate-700", className)}
      {...props}
    >
      <ScrollAreaPrimitiveViewport>
        <div className="p-0">{children}</div>
      </ScrollAreaPrimitiveViewport>
      <ScrollBarPrimitive />
    </ScrollAreaPrimitiveRoot>
  )
);
ScrollAreaUI.displayName = "ScrollArea";

export default ScrollAreaUI;
  