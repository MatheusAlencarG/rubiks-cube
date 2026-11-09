import React, { useContext, useState } from 'react';
import { buttonClass, inputClass } from './controlStyles';
import { useAuth } from '../Contexts/AuthContext';
import { Context } from '../Contexts/GeneralConfigContext/Context';

export default function Account() {
  const auth = useAuth();
  const { language, preferences } = useContext(Context);
  const en = language.currentLanguage === 'en-us';

  const [register, setRegister] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const accountLabel = en ? 'Account' : 'Conta';
  const signInLabel = en ? 'Sign in' : 'Entrar';
  const createAccountLabel = en ? 'Create account' : 'Criar conta';
  const submitLabel = register ? createAccountLabel : signInLabel;
  const toggleLabel = register
    ? en
      ? 'I already have an account'
      : 'Já tenho conta'
    : en
      ? 'Register'
      : 'Cadastrar';

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const identifier = String(data.get('identifier'));
    const password = String(data.get('password'));

    setBusy(true);
    setError('');

    try {
      if (register) {
        await auth.register({
          username: String(data.get('username')),
          email: identifier,
          password,
        });
      } else {
        await auth.login({ identifier, password });
      }

      form.reset();
    } catch (failure) {
      setError((failure as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function toggleRegistration() {
    setRegister(current => !current);
    setError('');
  }

  function retrySync() {
    void preferences.save({ ...preferences.ui, language: en ? 'en-US' : 'pt-BR' }).catch(() => {});
  }

  return (
    <section className="w-4/5" aria-label={accountLabel}>
      <h4>{accountLabel}</h4>
      {auth.loading ? (
        <p role="status">{en ? 'Loading account…' : 'Carregando conta…'}</p>
      ) : auth.user ? (
        <>
          <p>{auth.user.username}</p>
          <button className={buttonClass} onClick={auth.logout}>
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
                  className={inputClass}
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
                className={inputClass}
                name="identifier"
                type="email"
                autoComplete={register ? 'email' : 'username'}
                required
              />
            </label>
            <label>
              {en ? 'Password' : 'Senha'}
              <input
                className={inputClass}
                name="password"
                type="password"
                autoComplete={register ? 'new-password' : 'current-password'}
                minLength={6}
                required
              />
            </label>
            <button className={buttonClass} disabled={busy}>
              {busy ? (en ? 'Please wait…' : 'Aguarde…') : submitLabel}
            </button>
          </form>
          <button
            type="button"
            className={`${buttonClass} mt-3`}
            disabled={busy}
            onClick={toggleRegistration}
          >
            {toggleLabel}
          </button>
        </>
      )}
      {preferences.loading && (
        <p role="status">{en ? 'Syncing preferences…' : 'Sincronizando preferências…'}</p>
      )}
      {(error || preferences.error) && <p role="alert">{error || preferences.error}</p>}
      {preferences.error && auth.user && (
        <button className={buttonClass} disabled={preferences.loading} onClick={retrySync}>
          {en ? 'Retry sync' : 'Tentar sincronizar novamente'}
        </button>
      )}
    </section>
  );
}
