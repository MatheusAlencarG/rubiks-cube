import React, { useContext, useState } from 'react';
import { useAuth } from '../Contexts/AuthContext';
import { Context } from '../Contexts/GeneralConfigContext/Context';

export default function Account() {
  const auth = useAuth();
  const { language, preferences } = useContext(Context);
  const en = language.currentLanguage === 'en-us';
  const [register, setRegister] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setBusy(true);
    setError('');
    try {
      const password = String(data.get('password'));
      if (register)
        await auth.register({
          username: String(data.get('username')),
          email: String(data.get('identifier')),
          password,
        });
      else await auth.login({ identifier: String(data.get('identifier')), password });
      form.reset();
    } catch (failure) {
      setError((failure as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="w-4/5" aria-label={en ? 'Account' : 'Conta'}>
      <h4>{en ? 'Account' : 'Conta'}</h4>
      {auth.loading ? (
        <p role="status">{en ? 'Loading account…' : 'Carregando conta…'}</p>
      ) : auth.user ? (
        <>
          <p>{auth.user.username}</p>
          <button className="app-button" onClick={auth.logout}>
            {en ? 'Sign out' : 'Sair'}
          </button>
          <p>
            {en
              ? 'Your preferences and games are saved to your account.'
              : 'Suas preferências e partidas ficam salvas na sua conta.'}
          </p>
        </>
      ) : (
        <>
          <p>
            {en
              ? 'Sign in to sync preferences and save games.'
              : 'Entre para sincronizar preferências e salvar partidas.'}
          </p>
          <form className="flex flex-col gap-3 text-left" onSubmit={submit}>
            {register && (
              <label>
                {en ? 'Username' : 'Nome de usuário'}
                <input
                  className="app-input"
                  name="username"
                  autoComplete="username"
                  required
                  maxLength={80}
                />
              </label>
            )}
            <label>
              {en ? 'Email' : 'E-mail'}
              <input
                className="app-input"
                name="identifier"
                type="email"
                autoComplete={register ? 'email' : 'username'}
                required
              />
            </label>
            <label>
              {en ? 'Password' : 'Senha'}
              <input
                className="app-input"
                name="password"
                type="password"
                autoComplete={register ? 'new-password' : 'current-password'}
                minLength={6}
                required
              />
            </label>
            <button className="app-button" disabled={busy}>
              {busy
                ? en
                  ? 'Please wait…'
                  : 'Aguarde…'
                : register
                  ? en
                    ? 'Create account'
                    : 'Criar conta'
                  : en
                    ? 'Sign in'
                    : 'Entrar'}
            </button>
          </form>
          <button
            type="button"
            className="app-button mt-3"
            disabled={busy}
            onClick={() => {
              setRegister(!register);
              setError('');
            }}
          >
            {register
              ? en
                ? 'I already have an account'
                : 'Já tenho conta'
              : en
                ? 'Register'
                : 'Cadastrar'}
          </button>
        </>
      )}
      {preferences.loading && (
        <p role="status">{en ? 'Syncing preferences…' : 'Sincronizando preferências…'}</p>
      )}
      {(error || preferences.error) && <p role="alert">{error || preferences.error}</p>}
      {preferences.error && auth.user && (
        <button
          className="app-button"
          disabled={preferences.loading}
          onClick={() =>
            void preferences
              .save({ ...preferences.ui, language: en ? 'en-US' : 'pt-BR' })
              .catch(() => {})
          }
        >
          {en ? 'Retry sync' : 'Tentar sincronizar novamente'}
        </button>
      )}
    </section>
  );
}
