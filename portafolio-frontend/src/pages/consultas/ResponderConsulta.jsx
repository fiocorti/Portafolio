import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Reply, Send } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import FormField from '../../components/FormField';
import LoadingState from '../../components/LoadingState';
import ErrorMessage from '../../components/ErrorMessage';
import Toast from '../../components/Toast';
import consultasService from '../../services/consultasService';

export default function ResponderConsulta() {
  const { id } = useParams(); const history = useHistory(); const [item, setItem] = useState(null); const [respuesta, setRespuesta] = useState(''); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [error, setError] = useState(''); const [toast, setToast] = useState(null);
  useEffect(() => { consultasService.get(id).then(setItem).catch(e => setError(e.message)).finally(() => setLoading(false)); }, [id]);
  const submit = async event => { event.preventDefault(); if (!respuesta.trim()) { setError('Escribí una respuesta antes de enviarla.'); return; } if (!window.confirm('¿Enviar esta respuesta?')) return; setSaving(true); setError(''); try { const result = await consultasService.reply(id, respuesta.trim()); setToast({ type: 'success', message: result?.message || 'Respuesta enviada correctamente.' }); setTimeout(() => history.push(`/admin/consultas/${id}`), 600); } catch (e) { setError(e.message); setSaving(false); } };
  return <><PageHeader icon={Reply} title="Responder consulta" description="Redactá una respuesta para el remitente." backTo={`/admin/consultas/${id}`} />{loading ? <LoadingState /> : error && !item ? <ErrorMessage message={error} /> : item && <><section className="panel original-message"><span className="eyebrow">Mensaje original</span><h3>{item.asunto || 'Consulta'}</h3><p>{item.mensaje}</p><small>{item.nombre} · {item.email}</small></section><form className="form-panel reply-form" onSubmit={submit}><FormField label="Tu respuesta" name="respuesta" value={respuesta} onChange={(_, value) => setRespuesta(value)} as="textarea" rows={7} required placeholder="Escribí tu respuesta..." /><ErrorMessage message={error} /><div className="form-footer"><button type="button" className="button button-secondary" onClick={() => history.goBack()}>Cancelar</button><button type="submit" className="button button-primary" disabled={saving}><Send size={16} />{saving ? 'Enviando...' : 'Enviar respuesta'}</button></div></form></>}<Toast toast={toast} onClose={() => setToast(null)} /></>;
}
