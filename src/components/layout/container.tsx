import * as React from 'react';
import { cn } from '@/lib/utils';

type ContainerProps = React.HTMLAttributes<HTMLDivElement>;

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('mx-auto w-full max-w-6xl px-6', className)}
        {...props}
      />
    );
  }
);
Container.displayName = 'Container';

export { Container };
