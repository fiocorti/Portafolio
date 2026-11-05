import React, { useEffect, useState } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js';
import PageHeader from '../components/PageHeader';
import LoadingState from '../components/LoadingState';
import ErrorMessage from '../components/ErrorMessage';
import StatCard from '../components/StatCard';
import estadisticasService from '../services/estadisticasService';
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);
export default function Estadisticas() {
  const [data, setData] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const load = () => { setLoading(true); estadisticasService.get().then(setData).catch(e => setError(e.message)).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);
  const visits = data?.visits || []; const dist = data?.distribution || [];
  return <><PageHeader title="Estadísticas" description="Indicadores disponibles sobre el uso del portfolio." />{loading ? <LoadingState /> : <><ErrorMessage message={error} onRetry={load} /><div className="stats-grid stats-grid-three"><StatCard label="Visitas registradas" value={visits.reduce((sum, x) => sum + Number(x.value || 0), 0) || '—'} detail="Según datos de la API" /><StatCard label="Accesos autenticados" value={data?.authenticatedAccesses ?? 'No disponible'} /><StatCard label="Registros de contenido" value={dist.reduce((sum, x) => sum + Number(x.value || 0), 0) || '—'} /></div><div className="dashboard-grid"><section className="panel chart-panel chart-wide"><div className="panel-heading"><div><h3>Evolución de visitas</h3><p>Serie temporal recibida del backend</p></div></div><div className="chart-area"><Line data={{ labels: visits.map(x => x.label), datasets: [{ label: 'Visitas', data: visits.map(x => x.value), borderColor: '#8b70e8', backgroundColor: 'rgba(139,112,232,.12)', fill: true, tension: .35 }] }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} /></div></section><section className="panel chart-panel"><div className="panel-heading"><div><h3>Contenido</h3><p>Distribución por categoría</p></div></div><div className="doughnut-area"><Doughnut data={{ labels: dist.map(x => x.label), datasets: [{ data: dist.map(x => x.value), backgroundColor: ['#8468db', '#b4a1ed', '#29344d'], borderWidth: 0 }] }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} /></div></section></div></>}</>;
}
