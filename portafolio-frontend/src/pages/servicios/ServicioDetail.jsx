import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Pencil } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import LoadingState from '../../components/LoadingState';
import ErrorMessage from '../../components/ErrorMessage';
import sectionIcon from '../../components/sectionIcons';
import serviceIcon from '../../components/serviceIcons';
import serviciosService from '../../services/serviciosService';

const BASE = '/admin/servicios';
const TONES = ['indigo', 'cyan', 'slate'];

export default function ServicioDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    serviciosService.get(id).then(setItem).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, [id]);

  const Icon = serviceIcon(item?.icono);
  const features = Array.isArray(item?.caracteristicas) ? item.caracteristicas : [];

  return (
    <>
      <PageHeader
        title="Detalle del servicio"
        backTo={BASE}
        icon={sectionIcon(BASE)}
        action={<Link className="button button-primary" to={`${BASE}/${id}/editar`}><Pencil size={16} aria-hidden="true" /> Editar</Link>}
      />
      {loading ? <LoadingState /> : error ? <ErrorMessage message={error} /> : item && (
        <article className="svc-detail">
          <section className="svc-hero reveal" style={{ '--i': 0 }}>
            <span className="svc-hero-icon" aria-hidden="true"><Icon size={40} strokeWidth={1.6} /></span>
            <div className="svc-hero-body">
              {item.estado && <StatusBadge status={item.estado} />}
              <h2>{item.titulo}</h2>
              <p>{item.descripcion || 'Sin descripción.'}</p>
            </div>
          </section>

          <div className="svc-layout">
            <section className="svc-features panel reveal" style={{ '--i': 1 }} aria-labelledby="svc-features-title">
              <div className="svc-features-head">
                <h3 id="svc-features-title">Qué incluye</h3>
                <span className="svc-count">{features.length} {features.length === 1 ? 'característica' : 'características'}</span>
              </div>
              {features.length > 0 ? (
                <ol className="svc-feature-grid">
                  {features.map((feature, index) => (
                    <li key={`${feature}-${index}`} className={`svc-feature tone-${TONES[index % TONES.length]}`}>
                      <span className="svc-feature-num" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                      <CheckCircle2 size={18} aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="muted-text">Este servicio todavía no tiene características cargadas.</p>
              )}
            </section>

            <aside className="svc-side panel reveal" style={{ '--i': 2 }} aria-label="Ficha del servicio">
              <span className="card-eyebrow">Ficha</span>
              <dl className="detail-list">
                <div className="detail-row"><dt>Icono</dt><dd>{item.icono || '—'}</dd></div>
                <div className="detail-row"><dt>Estado</dt><dd>{item.estado || '—'}</dd></div>
                <div className="detail-row"><dt>Características</dt><dd>{features.length}</dd></div>
                <div className="detail-row"><dt>Identificador</dt><dd className="mono">{item.id}</dd></div>
              </dl>
            </aside>
          </div>
        </article>
      )}
    </>
  );
}
