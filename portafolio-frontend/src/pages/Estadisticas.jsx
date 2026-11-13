import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban, FlaskConical, BriefcaseBusiness, Users, MessageSquareText,
  Eye, ShieldCheck, Layers, ArrowUpRight, BarChart3
} from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler } from 'chart.js';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import LoadingState from '../components/LoadingState';
import ErrorMessage from '../components/ErrorMessage';
import ActivityCalendar from '../components/ActivityCalendar';
import estadisticasService from '../services/estadisticasService';
import consultasService from '../services/consultasService';
import proyectosService from '../services/proyectosService';
import demosService from '../services/demosService';
import serviciosService from '../services/serviciosService';
import usuariosService from '../services/usuariosService';
import { apiConfig } from '../services/api';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler);

// Colores de los gráficos tomados de la paleta del sistema visual.
const palette = {
  primary: '#4338CA',
  accent: '#22D3EE',
  indigoLight: '#818CF8',
  slate: '#17243A',
  indigoPale: '#C7D2FE',
  cyanPale: '#A5F3FC',
  text: '#475569',
  grid: '#E2E8F0',
  tooltipBg: '#0B1220',
  tooltipTitle: '#F8FAFC',
  tooltipBody: '#CBD5E1'
};
Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
Chart.defaults.font.size = 13;
Chart.defaults.color = palette.text;

const baseTooltip = {
  backgroundColor: palette.tooltipBg,
  titleColor: palette.tooltipTitle,
  bodyColor: palette.tooltipBody,
  padding: 12,
  cornerRadius: 8,
  displayColors: false
};

// Relleno en degradado índigo → cian bajo la línea. Se calcula cuando el área del gráfico existe.
function areaFill(context) {
  const { chart } = context;
  const { ctx, chartArea } = chart;
  if (!chartArea) return 'rgba(67, 56, 202, 0.10)';
  const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
  gradient.addColorStop(0, 'rgba(67, 56, 202, 0.45)');
  gradient.addColorStop(1, 'rgba(34, 211, 238, 0.06)');
  return gradient;
}

const sum = list => list.reduce((total, item) => total + Number(item.value || 0), 0);

export default function Estadisticas() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    estadisticasService.get().then(setData).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  // Eventos para el calendario: se toman de los listados existentes. Si un listado falla,
  // los demás igual se muestran (allSettled).
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  useEffect(() => {
    let active = true;
    const sources = [
      { type: 'consulta', service: consultasService, date: x => x.fecha, label: x => x.asunto || x.nombre || 'Consulta' },
      { type: 'contenido', service: proyectosService, date: x => x.fecha, label: x => `Proyecto: ${x.titulo || 'sin título'}` },
      { type: 'contenido', service: demosService, date: x => x.fecha, label: x => `Demo: ${x.titulo || x.nombre || 'sin título'}` },
      { type: 'contenido', service: serviciosService, date: x => x.fecha, label: x => `Servicio: ${x.titulo || x.nombre || 'sin título'}` },
      { type: 'usuario', service: usuariosService, date: x => x.fechaRegistro, label: x => `Alta: ${x.nombre || x.email || 'usuario'}` }
    ];
    Promise.allSettled(sources.map(s => s.service.list())).then(results => {
      if (!active) return;
      const collected = [];
      results.forEach((result, i) => {
        if (result.status !== 'fulfilled' || !Array.isArray(result.value)) return;
        const src = sources[i];
        result.value.forEach((item, j) => {
          const raw = src.date(item);
          if (!raw) return;
          collected.push({ id: `${src.type}-${i}-${item.id ?? j}`, date: String(raw).slice(0, 10), type: src.type, label: src.label(item) });
        });
      });
      setEvents(collected);
      setEventsLoading(false);
    });
    return () => { active = false; };
  }, []);

  const counts = data?.counts || {};
  const visits = data?.visits || [];
  const dist = data?.distribution || [];
  const activity = data?.activity || [];
  const totalVisits = sum(visits);
  const totalContent = sum(dist);
  const averageVisits = visits.length ? Math.round(totalVisits / visits.length) : 0;

  // Los datos disponibles son de 7 días, así que el selector de período no se muestra:
  // en su lugar el tooltip compara cada día contra el promedio semanal.
  const lineData = {
    labels: visits.map(x => x.label),
    datasets: [{
      label: 'Visitas',
      data: visits.map(x => x.value),
      borderColor: palette.primary,
      backgroundColor: areaFill,
      fill: true,
      tension: 0.38,
      borderWidth: 2.5,
      pointRadius: 4,
      pointHoverRadius: 7,
      pointBackgroundColor: '#FFFFFF',
      pointBorderColor: palette.primary,
      pointBorderWidth: 2
    }]
  };
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        ...baseTooltip,
        callbacks: {
          title: items => items[0]?.label ?? '',
          label: ctx => ` ${ctx.parsed.y} visitas`,
          afterLabel: ctx => {
            if (!averageVisits) return '';
            const delta = Math.round(((ctx.parsed.y - averageVisits) / averageVisits) * 100);
            return `${delta >= 0 ? '+' : ''}${delta}% vs. promedio diario (${averageVisits})`;
          }
        }
      }
    },
    scales: {
      x: { grid: { display: false }, border: { display: false } },
      y: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: palette.grid }, border: { display: false } }
    }
  };

  const doughnutData = {
    labels: dist.map(x => x.label),
    datasets: [{
      data: dist.map(x => x.value),
      backgroundColor: [palette.primary, palette.accent, palette.slate, palette.indigoLight, palette.cyanPale],
      borderColor: '#FFFFFF',
      borderWidth: 3,
      hoverOffset: 8
    }]
  };
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, padding: 16 } },
      tooltip: {
        ...baseTooltip,
        callbacks: {
          label: ctx => {
            const share = totalContent ? Math.round((ctx.parsed / totalContent) * 100) : 0;
            return ` ${ctx.parsed} · ${share}% del contenido`;
          }
        }
      }
    }
  };

  const modeTag = (
    <span className={`mode-tag ${apiConfig.mocksEnabled ? 'mode-demo' : 'mode-live'}`}>
      {apiConfig.mocksEnabled ? 'Modo demostración' : 'Conectado a API'}
    </span>
  );

  return (
    <>
      <PageHeader title="Estadísticas" description="Resumen del contenido, el uso y la actividad de tu portfolio." action={modeTag} icon={BarChart3} />
      {loading ? <LoadingState label="Cargando estadísticas..." /> : (
        <>
          <ErrorMessage message={error} onRetry={load} />

          <section className="stats-section" aria-labelledby="stats-resumen">
            <h2 className="section-title" id="stats-resumen">Resumen</h2>
            <div className="stats-grid">
              <StatCard index={0} tone="primary" label="Proyectos" value={counts.proyectos ?? '—'} icon={FolderKanban} />
              <StatCard index={1} tone="accent" label="Demos" value={counts.demos ?? '—'} icon={FlaskConical} />
              <StatCard index={2} tone="slate" label="Servicios" value={counts.servicios ?? '—'} icon={BriefcaseBusiness} />
              <StatCard index={3} tone="primary" label="Usuarios" value={counts.usuarios ?? '—'} icon={Users} />
              <StatCard index={4} tone="brand" label="Visitas registradas" value={totalVisits || '—'} detail="Según datos de la API" icon={Eye} />
              <StatCard index={5} tone="accent" label="Accesos autenticados" value={data?.authenticatedAccesses ?? 'No disponible'} icon={ShieldCheck} />
              <StatCard index={6} tone="slate" label="Registros de contenido" value={totalContent || '—'} icon={Layers} />
              <StatCard index={7} tone="brand" label="Consultas pendientes" value={counts.consultasPendientes ?? 0} detail="Revisá los mensajes recibidos" icon={MessageSquareText} to="/admin/consultas" />
            </div>
          </section>

          <section className="stats-section" aria-labelledby="stats-graficos">
            <h2 className="section-title" id="stats-graficos">Visitas y contenido</h2>
            <div className="dashboard-grid">
              <article className="panel chart-panel chart-wide reveal" style={{ '--i': 8 }}>
                <div className="panel-heading">
                  <div><h3>Evolución de visitas</h3><p>Serie temporal recibida del backend</p></div>
                  <div className="chart-chips">
                    <span className="chart-period">Últimos 7 días</span>
                    {averageVisits > 0 && <span className="chart-period chart-period-accent">Prom. {averageVisits}/día</span>}
                  </div>
                </div>
                <div className="chart-area">
                  {visits.length ? <Line data={lineData} options={lineOptions} aria-label="Gráfico de línea con la evolución de visitas" role="img" /> : <p className="muted-text">No hay visitas registradas.</p>}
                </div>
              </article>
              <article className="panel chart-panel tint-cyan reveal" style={{ '--i': 9 }}>
                <div className="panel-heading">
                  <div><h3>Contenido</h3><p>Distribución por categoría</p></div>
                  {totalContent > 0 && <span className="chart-period">Total {totalContent}</span>}
                </div>
                <div className="doughnut-area">
                  {dist.length ? <Doughnut data={doughnutData} options={doughnutOptions} aria-label="Gráfico circular con la distribución del contenido" role="img" /> : <p className="muted-text">No hay contenido para mostrar.</p>}
                </div>
              </article>
            </div>
          </section>

          <section className="stats-section" aria-labelledby="stats-calendario">
            <h2 className="section-title" id="stats-calendario">Calendario</h2>
            <ActivityCalendar events={events} loading={eventsLoading} />
          </section>

          <section className="stats-section" aria-labelledby="stats-actividad">
            <h2 className="section-title" id="stats-actividad">Actividad y accesos rápidos</h2>
            <div className="activity-grid">
              <article className="panel activity-panel tint-slate reveal" style={{ '--i': 10 }}>
                <div className="panel-heading">
                  <div><h3>Actividad reciente</h3><p>Últimos eventos disponibles</p></div>
                </div>
                {activity.length
                  ? activity.map(item => (
                    <div className="activity-item" key={item.id}>
                      <span className="activity-dot" aria-hidden="true" />
                      <div><strong>{item.text}</strong><small>{item.date}</small></div>
                    </div>
                  ))
                  : <p className="muted-text">No hay actividad registrada.</p>}
              </article>
              <article className="panel quick-panel panel-brand reveal" style={{ '--i': 11 }}>
                <div className="panel-heading">
                  <div><h3>Accesos rápidos</h3><p>Creá contenido nuevo</p></div>
                </div>
                <div className="quick-links">
                  <Link to="/admin/proyectos/nuevo"><span><FolderKanban size={18} aria-hidden="true" /></span><div><strong>Nuevo proyecto</strong><small>Agregar al portfolio</small></div><ArrowUpRight size={16} aria-hidden="true" /></Link>
                  <Link to="/admin/demos/nueva"><span><FlaskConical size={18} aria-hidden="true" /></span><div><strong>Nueva demo</strong><small>Crear demostración</small></div><ArrowUpRight size={16} aria-hidden="true" /></Link>
                  <Link to="/admin/servicios/nuevo"><span><BriefcaseBusiness size={18} aria-hidden="true" /></span><div><strong>Nuevo servicio</strong><small>Publicar un servicio</small></div><ArrowUpRight size={16} aria-hidden="true" /></Link>
                </div>
              </article>
            </div>
          </section>
        </>
      )}
    </>
  );
}
