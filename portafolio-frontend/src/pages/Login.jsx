import React, { useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { LockKeyhole, Mail, ArrowRight } from 'lucide-react';

import useAuth from '../hooks/useAuth';
import ErrorMessage from '../components/ErrorMessage';

export default function Login() {
  const { user, loading, login } = useAuth();
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  if (loading) {
    return (
      <div className="login-page">
        <div className="login-card">Verificando sesión...</div>
      </div>
    );
  }


  const rolActual = String(
    user?.rol || user?.role || ""
  ).toLowerCase();

  const puedeAcceder = [
    "administrador",
    "admin",
    "operador"
  ].includes(rolActual);

  if (user && puedeAcceder) {
    return <Redirect to="/admin" />;
  }


  const submit = async event => {
    event.preventDefault();
    setError('');

    if (!email.trim() || !contrasena) {
      setError('Ingresá tu correo y contraseña.');
      return;
    }

    setSending(true);

    try {
      const usuario = await login(email.trim(), contrasena);

      if (!['administrador', 'admin', 'operador'].includes(usuario.rol)) {
        setError('Tu cuenta no tiene permisos para ingresar al panel.');
        return;
      }

      history.replace('/admin');
    } catch (err) {
      setError(
        err?.message || 'No se pudo iniciar sesión. Revisá tus credenciales.'
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand">
          <span className="login-brand-icon">
            <LockKeyhole size={23} />
          </span>

          <div>
            <span className="login-eyebrow">PORTFOLIO PERSONAL</span>
            <h1>Panel administrativo</h1>
          </div>
        </div>

        <div className="login-heading">
          <h2>Bienvenido</h2>
          <p>Ingresá tus credenciales para continuar.</p>
        </div>

        {user && !puedeAcceder && (
          <p className="field-error" role="alert">
            Tenés una sesión iniciada como usuario común.
            Para acceder al panel administrativo,
            ingresá con una cuenta autorizada.
          </p>
        )}

        <form onSubmit={submit} className="login-form">
          <label htmlFor="login-email">Correo electrónico</label>

          <div className="login-input-wrap">
            <Mail size={18} />
            <input
              id="login-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={event => setEmail(event.target.value)}
              placeholder="tu@correo.com"
              required
            />
          </div>

          <label htmlFor="login-password">Contraseña</label>

          <div className="login-input-wrap">
            <LockKeyhole size={18} />
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={contrasena}
              onChange={event => setContrasena(event.target.value)}
              placeholder="Ingresá tu contraseña"
              required
            />
          </div>

          <ErrorMessage message={error} />

          <button
            type="submit"
            className="button button-primary login-submit"
            disabled={sending}
          >
            {sending ? 'Ingresando...' : 'Iniciar sesión'}
            {!sending && <ArrowRight size={17} />}
          </button>
        </form>

        <p className="login-footer">
          Acceso exclusivo para cuentas autorizadas.
        </p>
      </section>
    </main>
  );
}