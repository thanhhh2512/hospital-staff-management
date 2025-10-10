'use client';

import { Slot } from '@radix-ui/react-slot';
import { useState } from 'react';
import { useAuthStore } from '@/stores/use-auth-store';

interface LogoutButtonProps {
  asChild?: boolean;
  className?: string;
  onSuccess?: () => void;
  children?: React.ReactNode;
}

export default function LogoutButton({ 
  asChild = false, 
  className, 
  onSuccess, 
  children 
}: LogoutButtonProps) {
  const logout = useAuthStore((state) => state.logout);
  const [pending, setPending] = useState(false);
  
  const Comp: any = asChild ? Slot : 'button';

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (pending) return;
    
    setPending(true);
    try {
      await logout(); // This will handle routing to /login internally
      onSuccess?.();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setPending(false);
    }
  };

  return (
    <Comp 
      className={className} 
      onClick={handleClick} 
      aria-busy={pending}
      {...(asChild ? {} : { type: 'button' })}
    >
      {children ?? 'Logout'}
    </Comp>
  );
}