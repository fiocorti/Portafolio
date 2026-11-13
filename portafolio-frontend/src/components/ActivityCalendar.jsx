import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, MessageSquareText, Layers, Users } from 'lucide-react';

// Calendario mensual de actividad. Recibe eventos ya normalizados:
// { id, date: 'YYYY-MM-DD', type: 'consulta' | 'contenido' | 'usuario', label }
const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const TYPES = {
  consulta: { label: 'Consultas', icon: MessageSquareText },
  contenido: { label: 'Contenido', icon: Layers },
  usuario: { label: 'Usuarios', icon: Users }
};

const pad = n => String(n).padStart(2, '0');
const keyOf = (year, monthIndex, day) => `${year}-${pad(monthIndex + 1)}-${pad(day)}`;
const monthKey = ({ y, m }) => `${y}-${pad(m + 1)}`;

export default function ActivityCalendar({ events = [], loading = false, today = new Date() }) {
  const [cursor, setCursor] = useState(() => ({ y: today.getFullYear(), m: today.getMonth() }));
  const [selected, setSelected] = useState(null);

  const todayKey = keyOf(today.getFullYear(), today.getMonth(), today.getDate());
  const monthTitle = useMemo(
    () => new Date(cursor.y, cursor.m, 1).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }),
    [cursor]
  );

  const byDay = useMemo(() => {
    const map = {};
    events.forEach(event => { (map[event.date] = map[event.date] || []).push(event); });
    return map;
  }, [events]);

  // Celdas del mes: null para los huecos antes del día 1 y después del último día.
  const cells = useMemo(() => {
    const offset = (new Date(cursor.y, cursor.m, 1).getDay() + 6) % 7;
    const days = new Date(cursor.y, cursor.m + 1, 0).getDate();
    const list = Array(offset).fill(null);
    for (let d = 1; d <= days; d += 1) list.push(d);
    while (list.length % 7) list.push(null);
    return list;
  }, [cursor]);

  const monthEvents = useMemo(
    () => events.filter(event => event.date.startsWith(monthKey(cursor))),
    [events, cursor]
  );
  const monthCounts = useMemo(() => {
    const counts = { consulta: 0, contenido: 0, usuario: 0 };
    monthEvents.forEach(event => { counts[event.type] = (counts[event.type] || 0) + 1; });
    return counts;
  }, [monthEvents]);

  const shiftMonth = delta => {
    setSelected(null);
    setCursor(current => {
      const next = new Date(current.y, current.m + delta, 1);
      return { y: next.getFullYear(), m: next.getMonth() };
    });
  };
  const goToday = () => {
    setSelected(todayKey);
    setCursor({ y: today.getFullYear(), m: today.getMonth() });
  };

  const selectedEvents = selected ? (byDay[selected] || []) : [];
  const selectedLabel = selected
    ? new Date(`${selected}T12:00:00`).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
    : '';

  return (
    <article className="panel calendar-panel tint-indigo reveal" style={{ '--i': 12 }}>
      <div className="calendar-main">
        <div className="panel-heading calendar-heading">
          <div>
            <h3>Calendario de actividad</h3>
            <p>Consultas recibidas y contenido publicado por día</p>
          </div>
          <div className="cal-nav" role="group" aria-label="Cambiar de mes">
            <button type="button" onClick={() => shiftMonth(-1)} aria-label="Mes anterior"><ChevronLeft size={18} aria-hidden="true" /></button>
            <span className="cal-title" aria-live="polite">{monthTitle}</span>
            <button type="button" onClick={() => shiftMonth(1)} aria-label="Mes siguiente"><ChevronRight size={18} aria-hidden="true" /></button>
          </div>
        </div>

        <div className="cal-summary">
          {Object.entries(TYPES).map(([type, meta]) => {
            const Icon = meta.icon;
            return (
              <span key={type} className={`cal-chip cal-chip-${type}`}>
                <Icon size={14} aria-hidden="true" />
                {meta.label}
                <strong>{monthCounts[type] || 0}</strong>
              </span>
            );
          })}
          <button type="button" className="cal-today-btn" onClick={goToday}>
            <CalendarDays size={14} aria-hidden="true" /> Hoy
          </button>
        </div>

        {loading ? (
          <p className="muted-text">Cargando calendario...</p>
        ) : (
          <div className="cal-grid" role="grid" aria-label={`Días de ${monthTitle}`}>
            {WEEKDAYS.map(day => <div key={day} className="cal-weekday" role="columnheader">{day}</div>)}
            {cells.map((day, index) => {
              if (!day) return <div key={`empty-${index}`} className="cal-day is-empty" aria-hidden="true" />;
              const key = keyOf(cursor.y, cursor.m, day);
              const dayEvents = byDay[key] || [];
              const types = [...new Set(dayEvents.map(event => event.type))];
              const classes = ['cal-day'];
              if (dayEvents.length) classes.push('has-events');
              if (key === todayKey) classes.push('is-today');
              if (key === selected) classes.push('is-selected');
              return (
                <button
                  key={key}
                  type="button"
                  role="gridcell"
                  className={classes.join(' ')}
                  aria-pressed={key === selected}
                  aria-label={`${day} de ${monthTitle}${dayEvents.length ? `, ${dayEvents.length} eventos` : ''}`}
                  onClick={() => setSelected(key === selected ? null : key)}
                >
                  <span className="cal-day-number">{day}</span>
                  {types.length > 0 && (
                    <span className="cal-dots" aria-hidden="true">
                      {types.map(type => <span key={type} className={`cal-dot cal-dot-${type}`} />)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <aside className="cal-detail" aria-live="polite">
        {!selected && (
          <div className="cal-empty">
            <CalendarDays size={28} aria-hidden="true" />
            <p>Seleccioná un día para ver qué pasó.</p>
            {monthEvents.length === 0 && !loading && <small>No hay actividad registrada en este mes.</small>}
          </div>
        )}
        {selected && (
          <>
            <h4 className="cal-detail-title">{selectedLabel}</h4>
            {selectedEvents.length === 0 ? (
              <p className="muted-text">Sin actividad este día.</p>
            ) : (
              <ul className="cal-detail-list">
                {selectedEvents.map(event => {
                  const Icon = TYPES[event.type]?.icon || Layers;
                  return (
                    <li key={event.id} className={`cal-detail-item cal-chip-${event.type}`}>
                      <Icon size={16} aria-hidden="true" />
                      <div>
                        <strong>{event.label}</strong>
                        <small>{TYPES[event.type]?.label || 'Actividad'}</small>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </aside>
    </article>
  );
}
