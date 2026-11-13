import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function FormField({
  label, name, value, onChange, error, type = 'text', placeholder, required, help,
  as = 'input', options = [], rows = 4, valid = false, count, recommended, ...props
}) {
  const helpId = help ? `${name}-help` : undefined;
  const common = {
    id: name,
    name,
    value: value ?? '',
    onChange: event => onChange(name, event.target.value),
    required,
    placeholder,
    'aria-invalid': !!error,
    'aria-describedby': error ? `${name}-error` : helpId,
    ...props
  };
  const showCounter = typeof count === 'number' && typeof recommended === 'number';
  const overLimit = showCounter && count > recommended;
  const hasMessages = Boolean(error || (valid && !error) || (help && !error));

  return (
    <div className="form-field">
      <label htmlFor={name}>{label}{required && <span className="required-mark"> *</span>}</label>
      {as === 'textarea' ? <textarea {...common} rows={rows} /> : as === 'select' ? <select {...common}><option value="">Seleccionar...</option>{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select> : <input {...common} type={type} />}
      {(hasMessages || showCounter) && (
        <div className="field-footer">
          <div className="field-messages">
            {help && !error && <small className="field-help" id={helpId}>{help}</small>}
            {error && <small className="field-error" id={`${name}-error`}><AlertCircle size={15} aria-hidden="true" />{error}</small>}
            {valid && !error && <small className="field-valid"><CheckCircle2 size={15} aria-hidden="true" /><span className="sr-only">Campo válido</span></small>}
          </div>
          {showCounter && <small className={`field-counter${overLimit ? ' is-over' : ''}`}>{count} / {recommended}</small>}
        </div>
      )}
    </div>
  );
}
