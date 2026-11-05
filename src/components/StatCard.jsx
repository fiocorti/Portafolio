import React from 'react';

export default function StatCard({ label, value, detail, icon: Icon, tone = 'purple' }) {
  return <article className={`stat-card stat-${tone}`}><div className="stat-card-top"><span>{label}</span><div className="stat-icon">{Icon && <Icon size={19} />}</div></div><strong className="stat-value">{value ?? '—'}</strong>{detail && <span className="stat-detail">{detail}</span>}</article>;
}
