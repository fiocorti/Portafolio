import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function ErrorMessage({ message, onRetry }) { if (!message) return null; return <div className="error-message"><AlertCircle size={18} /><span>{message}</span>{onRetry && <button type="button" onClick={onRetry}>Reintentar</button>}</div>; }
