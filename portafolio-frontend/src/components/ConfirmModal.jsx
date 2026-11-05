import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ open, title = '¿Confirmar acción?', message, confirmText = 'Confirmar', onConfirm, onCancel, danger = false, loading = false }) {
  if (!open) return null;
  return <div className="modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onCancel(); }}><section className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title"><button className="modal-close icon-button" onClick={onCancel} aria-label="Cerrar"><X size={18} /></button><div className={`modal-symbol ${danger ? 'modal-symbol-danger' : ''}`}><AlertTriangle size={22} /></div><h3 id="confirm-title">{title}</h3><p>{message}</p><div className="modal-actions"><button className="button button-secondary" onClick={onCancel} disabled={loading}>Cancelar</button><button className={`button ${danger ? 'button-danger' : 'button-primary'}`} onClick={onConfirm} disabled={loading}>{loading ? 'Procesando...' : confirmText}</button></div></section></div>;
}
