import React from 'react';
import EmptyState from './EmptyState';
import LoadingState from './LoadingState';

export default function DataTable({ columns, rows, loading, emptyTitle = 'No hay registros', emptyDescription = 'Cuando agregues información, aparecerá aquí.', rowKey = 'id' }) {
  if (loading) return <LoadingState label="Cargando información..." />;
  if (!rows?.length) return <EmptyState title={emptyTitle} description={emptyDescription} />;
  return <div className="table-scroll"><table className="data-table"><thead><tr>{columns.map(column => <th key={column.key} className={column.className || ''}>{column.label}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={row[rowKey] || index}>{columns.map(column => <td key={column.key} data-label={column.label}>{column.render ? column.render(row) : (row[column.key] ?? '—')}</td>)}</tr>)}</tbody></table></div>;
}
