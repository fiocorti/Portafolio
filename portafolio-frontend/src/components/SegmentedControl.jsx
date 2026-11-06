import React from 'react';

// Selector segmentado (reemplaza al <select> para estados). Usa radios reales
// ocultos visualmente, así que el teclado y los lectores de pantalla funcionan igual.
export default function SegmentedControl({ name, label, value, onChange, options }) {
  return (
    <fieldset className="form-field segmented-field">
      <legend>{label}</legend>
      <div className="segmented">
        {options.map(option => {
          const active = value === option.value;
          return (
            <label key={option.value} className={`segment segment-${option.tone || 'neutral'}${active ? ' is-active' : ''}`}>
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={active}
                onChange={() => onChange(name, option.value)}
              />
              <span className="segment-dot" aria-hidden="true" />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
