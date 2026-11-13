import { Briefcase, FlaskConical, FolderKanban, MessageSquareText, Users } from 'lucide-react';

// Ícono de cada sección del menú. Se usa en la banda de encabezado.
const ICONS = [
  ['/admin/proyectos', FolderKanban],
  ['/admin/demos', FlaskConical],
  ['/admin/servicios', Briefcase],
  ['/admin/usuarios', Users],
  ['/admin/consultas', MessageSquareText]
];

export default function sectionIcon(path = '') {
  const match = ICONS.find(([prefix]) => path.startsWith(prefix));
  return match ? match[1] : null;
}

// Tono de color de cada sección (portadas, glifos y acentos).
const TONES = [
  ['/admin/demos', 'cyan'],
  ['/admin/servicios', 'slate']
];

export function sectionTone(path = '') {
  const match = TONES.find(([prefix]) => path.startsWith(prefix));
  return match ? match[1] : 'indigo';
}
