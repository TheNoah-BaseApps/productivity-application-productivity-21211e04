'use client';

import { useEffect } from 'react';
import { toast as sonnerToast } from 'sonner';

export function useToast() {
  return {
    toast: sonnerToast,
    success: sonnerToast.success,
    error: sonnerToast.error,
    info: sonnerToast.info,
    warning: sonnerToast.warning,
  };
}

export default function Toast({ message, type = 'info' }) {
  useEffect(() => {
    if (message) {
      sonnerToast[type](message);
    }
  }, [message, type]);

  return null;
}