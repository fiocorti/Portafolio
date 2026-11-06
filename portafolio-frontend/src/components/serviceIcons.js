import { Briefcase, Code2, Database, LifeBuoy, Palette, Plug, Workflow } from 'lucide-react';

// Los servicios guardan el nombre del ícono como texto (ej. 'Code2'). Si el nombre no existe, usa un maletín.
const SERVICE_ICONS = { Code2, Plug, Palette, Database, Workflow, LifeBuoy };

export default function serviceIcon(name) {
  return SERVICE_ICONS[name] || Briefcase;
}
