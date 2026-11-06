import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import useCountUp from '../hooks/useCountUp';

// tone: primary (índigo) | accent (cian) | slate (gris azulado) | brand (degradado de marca)
export default function StatCard({ label, value, detail, icon: Icon, tone = 'primary', to, index = 0 }) {
  const counted = useCountUp(value);
  const display = (typeof value === 'number' ? counted : value) ?? '—';
  const isText = typeof display === 'string' && /[A-Za-zÁ-ú]/.test(display);
  const className = `stat-card stat-${tone} reveal hover-lift${to ? ' stat-card-link' : ''}`;
  const style = { '--i': index };
  const content = (
    <>
      <div className="stat-card-top">
        <span className="stat-label">{label}</span>
        {Icon && <span className="stat-icon" aria-hidden="true"><Icon size={20} /></span>}
      </div>
      <strong className={`stat-value${isText ? ' stat-value-text' : ''}`}>{display}</strong>
      {(detail || to) && (
        <span className="stat-detail">
          {detail}
          {to && <ArrowUpRight size={18} className="stat-link-icon" aria-hidden="true" />}
        </span>
      )}
    </>
  );
  return to
    ? <Link className={className} to={to} style={style}>{content}</Link>
    : <article className={className} style={style}>{content}</article>;
}
