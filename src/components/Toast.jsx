import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => { if (!toast) return undefined; const timer = setTimeout(onClose, 3800); return () => clearTimeout(timer); }, [toast, onClose]);
  if (!toast) return null;
  const Icon = toast.type === 'error' ? AlertCircle : CheckCircle2;
  return <div className={`toast toast-${toast.type || 'success'}`} role="status"><Icon size={18} /><span>{toast.message}</span><button onClick={onClose} aria-label="Cerrar"><X size={16} /></button></div>;
}
