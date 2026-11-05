import React from 'react';

export default function FormField({ label, name, value, onChange, error, type = 'text', placeholder, required, help, as = 'input', options = [], rows = 4, ...props }) {
  const common = { id: name, name, value: value ?? '', onChange: event => onChange(name, event.target.value), required, placeholder, 'aria-invalid': !!error, 'aria-describedby': error ? `${name}-error` : undefined, ...props };
  return <div className="form-field"><label htmlFor={name}>{label}{required && <span className="required-mark"> *</span>}</label>{as === 'textarea' ? <textarea {...common} rows={rows} /> : as === 'select' ? <select {...common}><option value="">Seleccionar...</option>{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select> : <input {...common} type={type} />}{help && !error && <small className="field-help">{help}</small>}{error && <small className="field-error" id={`${name}-error`}>{error}</small>}</div>;
}
