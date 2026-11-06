import React, { useState } from 'react';
import { X } from 'lucide-react';

const splitList = text => String(text || '').split(',').map(item => item.trim()).filter(Boolean);
const uniqueList = list => list.filter((item, index) => list.findIndex(other => other.toLowerCase() === item.toLowerCase()) === index);

// Campo de chips. Internamente mantiene el mismo texto separado por comas que usaba el formulario,
// así el payload enviado al servicio no cambia.
// Enter o coma agregan; la X quita; Backspace con el campo vacío quita el último.
export default function TagInput({ name, label, value, onChange, placeholder = 'Escribí y presioná Enter', help, required = false }) {
  const tags = splitList(value);
  const [draft, setDraft] = useState('');
  const helpId = `${name}-help`;

  const commit = next => onChange(name, uniqueList(next).join(', '));
  const flush = () => {
    const incoming = splitList(draft);
    if (incoming.length) commit([...tags, ...incoming]);
    setDraft('');
  };

  const handleChange = event => {
    const text = event.target.value;
    if (text.includes(',')) {
      const parts = text.split(',');
      const pending = parts.pop();
      commit([...tags, ...splitList(parts.join(','))]);
      setDraft(pending);
      return;
    }
    setDraft(text);
  };

  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      flush();
    } else if (event.key === 'Backspace' && !draft && tags.length) {
      commit(tags.slice(0, -1));
    }
  };

  return (
    <div className="form-field tag-field">
      <label htmlFor={`${name}-input`}>{label}{required && <span className="required-mark"> *</span>}</label>
      <div className="tag-input">
        {tags.map(tag => (
          <span key={tag.toLowerCase()} className="tech-chip tech-chip-removable">
            {tag}
            <button type="button" aria-label={`Quitar ${tag}`} onClick={() => commit(tags.filter(item => item !== tag))}>
              <X size={13} aria-hidden="true" />
            </button>
          </span>
        ))}
        <input
          id={`${name}-input`}
          value={draft}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={flush}
          placeholder={tags.length ? 'Agregar otra…' : placeholder}
          autoComplete="off"
          aria-describedby={help ? helpId : undefined}
        />
      </div>
      {help && <small className="field-help" id={helpId}>{help}</small>}
    </div>
  );
}
