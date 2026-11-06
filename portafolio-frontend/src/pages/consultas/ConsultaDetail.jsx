import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MessageSquareText, Reply } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import LoadingState from '../../components/LoadingState';
import ErrorMessage from '../../components/ErrorMessage';
import consultasService from '../../services/consultasService';

export default function ConsultaDetail() {
  const { id } = useParams(); const [item, setItem] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => { consultasService.get(id).then(setItem).catch(e => setError(e.message)).finally(() => setLoading(false)); }, [id]);
  return <><PageHeader icon={MessageSquareText} title="Detalle de consulta" description="Mensaje recibido desde el portfolio público." backTo="/admin/consultas" action={item?.estado !== 'Respondida' && <Link className="button button-primary" to={`/admin/consultas/${id}/responder`}><Reply size={16} /> Responder</Link>} />{loading ? <LoadingState /> : error ? <ErrorMessage message={error} /> : item && <article className="panel message-detail"><div className="message-top"><div><h3>{item.asunto || 'Consulta sin asunto'}</h3><p>{item.nombre} · {item.email}</p></div><StatusBadge status={item.estado} /></div><div className="message-body">{item.mensaje}</div><small className="muted-text">Recibida: {item.fecha ? new Date(item.fecha).toLocaleString('es-AR') : 'Fecha no disponible'}</small>{item.respuesta && <div className="reply-preview"><strong>Respuesta registrada</strong><p>{item.respuesta}</p></div>}</article>}</>;
}
