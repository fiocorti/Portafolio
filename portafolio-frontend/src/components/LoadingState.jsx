import React from 'react';

export default function LoadingState({ label = 'Cargando...' }) { return <div className="loading-state"><span className="spinner" /><span>{label}</span></div>; }
