import React, { useContext, useState } from 'react';
import { UserRound } from 'lucide-react';
import useSWR from 'swr';

import { api, mediaUrl } from '../api/client';
import type { User } from '../api/types';
import { useAuth } from '../Contexts/AuthContext';
import { Context } from '../Contexts/GeneralConfigContext/Context';
import AppModal from './AppModal';
import { buttonClass, inputClass } from './controlStyles';

const resetPath = '/local-password-reset';
const avatarTypes = ['image/jpeg', 'image/png', 'image/webp'];
type AccountMode = 'login' | 'register' | 'reset';

export default function Account() {
  const { currentLanguage } = useContext(Context).language;
  const { user } = useAuth();
  const en = currentLanguage === 'en-us';

  return (
    <AppModal
      title={en ? 'Account' : 'Conta'}
      closeLabel={en ? 'Close account' : 'Fechar conta'}
      triggerClass="absolute left-[15px] top-[15px] grid h-[40px] w-[40px] cursor-pointer place-items-center border-0 bg-transparent p-0 text-on-canvas"
      panelClass="box-border max-h-[85vh] w-[calc(100%-32px)] max-w-[440px] px-6 pb-6"
      trigger={<AccountAvatar user={user} />}
    >
      <AccountContent en={en} />
    </AppModal>
  );
}

function AccountAvatar({ user }: { user?: User }) {
  const url = user?.avatar?.url ? mediaUrl(user.avatar.url) : '';
  const [failedUrl, setFailedUrl] = useState('');

  if (!url || url === failedUrl) return <UserRound className="h-8 w-8" aria-hidden="true" />;

  return (
    <img
      src={url}
      alt=""
      className="box-border h-10 w-10 rounded-full border border-solid border-accent object-cover"
      onError={() => setFailedUrl(url)}
    />
  );
}

function AccountContent({ en }: { en: boolean }) {
  const { user, loading, logout } = useAuth();

  if (loading) return <p role="status">{en ? 'Loading account…' : 'Carregando conta…'}</p>;
  if (!user) return <AccountForm en={en} />;

  return <AccountProfile user={user} en={en} onLogout={logout} />;
}

function AccountProfile({ user, en, onLogout }: { user: User; en: boolean; onLogout: () => void }) {
  const { updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');

  function toggleEdit() {
    setEditing(previous => !previous);
    setError('');
    setSaved(false);
  }

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = String(data.get('username') ?? '').trim();
    const avatar = data.get('files');

    setError('');

    if (username.length < 3 || username.length > 80) {
      setError(
        en
          ? 'Use 3 to 80 characters for your username.'
          : 'Use de 3 a 80 caracteres no nome de usuário.'
      );
      return;
    }

    data.set('username', username);
    if (avatar instanceof File && avatar.size) {
      if (avatar.size > 5 * 1024 * 1024 || !avatarTypes.includes(avatar.type)) {
        setError(
          en
            ? 'Choose a PNG, JPEG or WebP image up to 5 MB.'
            : 'Escolha uma imagem PNG, JPEG ou WebP de até 5 MB.'
        );
        return;
      }
    } else {
      data.delete('files');
    }

    setBusy(true);

    try {
      await updateProfile(data);
      setEditing(false);
      setSaved(true);
    } catch (failure) {
      setError((failure as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="flex justify-center">
        <AccountAvatar user={user} />
      </div>
      <dl className="text-left [&_dd]:mb-3 [&_dd]:ml-0 [&_dd]:break-words [&_dt]:font-bold">
        {fullName && (
          <>
            <dt>{en ? 'Name' : 'Nome'}</dt>
            <dd>{fullName}</dd>
          </>
        )}
        <dt>{en ? 'Username' : 'Nome de usuário'}</dt>
        <dd>{user.username}</dd>
        <dt>{en ? 'Email' : 'E-mail'}</dt>
        <dd>{user.email}</dd>
      </dl>
      <p>
        {en
          ? 'Your preferences and games are saved to your account.'
          : 'Suas preferências e partidas ficam salvas na sua conta.'}
      </p>

      {editing && (
        <form className="mb-3 flex flex-col gap-3 text-left" onSubmit={saveProfile}>
          <label>
            {en ? 'Username' : 'Nome de usuário'}
            <input
              className={inputClass}
              name="username"
              autoComplete="username"
              defaultValue={user.username}
              minLength={3}
              maxLength={80}
              required
              disabled={busy}
            />
          </label>
          <label>
            {en ? 'Profile photo' : 'Foto de perfil'}
            <input
              className={inputClass}
              name="files"
              type="file"
              accept={avatarTypes.join(',')}
              disabled={busy}
            />
          </label>
          <p className="m-0 text-xs">PNG, JPEG, WebP · {en ? 'Up to 5 MB' : 'Até 5 MB'}</p>
          {error && (
            <p role="alert" className="m-0">
              {error}
            </p>
          )}
          <button type="submit" className={buttonClass} disabled={busy}>
            {busy ? (en ? 'Saving…' : 'Salvando…') : en ? 'Save profile' : 'Salvar perfil'}
          </button>
        </form>
      )}

      {saved && <p role="status">{en ? 'Profile saved.' : 'Perfil salvo.'}</p>}

      <div className="flex flex-wrap justify-center gap-2">
        <button type="button" className={buttonClass} disabled={busy} onClick={toggleEdit}>
          {editing ? (en ? 'Cancel' : 'Cancelar') : en ? 'Edit profile' : 'Editar perfil'}
        </button>
        <button type="button" className={buttonClass} disabled={busy} onClick={onLogout}>
          {en ? 'Sign out' : 'Sair'}
        </button>
      </div>
    </>
  );
}

function AccountForm({ en }: { en: boolean }) {
  const { login, register } = useAuth();
  const { data: resetStatus } = useSWR<{ enabled: boolean }>(resetPath, path => api(path), {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  const [mode, setMode] = useState<AccountMode>('login');
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  const isRegistering = mode === 'register';
  const isResetting = mode === 'reset';
  const submitLabels = {
    login: en ? 'Sign in' : 'Entrar',
    register: en ? 'Create account' : 'Criar conta',
    reset: en ? 'Save new password' : 'Salvar nova senha',
  };
  const passwordLabel = isResetting
    ? en
      ? 'New password'
      : 'Nova senha'
    : en
      ? 'Password'
      : 'Senha';

  function changeMode(next: AccountMode) {
    setMode(next);
    setError('');
    setPasswordUpdated(false);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);
    const password = String(data.get('password'));
    const passwordConfirmation = String(data.get('passwordConfirmation') ?? '');

    setError('');
    setPasswordUpdated(false);

    if (isResetting && password !== passwordConfirmation) {
      setError(en ? 'The passwords must match.' : 'As senhas precisam ser iguais.');
      return;
    }

    setBusy(true);

    try {
      if (isResetting) {
        await api(resetPath, { method: 'POST', body: { email, password, passwordConfirmation } });
        setMode('login');
        setPasswordUpdated(true);
      } else if (isRegistering) {
        await register({ username: String(data.get('username')), email, password });
      } else {
        await login({ identifier: email, password });
      }

      form.reset();
    } catch (failure) {
      setError((failure as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {isResetting ? (
        <p>
          {en
            ? 'Enter your account email and choose a new password.'
            : 'Informe o e-mail da sua conta e escolha uma nova senha.'}
        </p>
      ) : (
        <p>
          {en
            ? 'Sign in to sync preferences and save games.'
            : 'Entre para sincronizar preferências e salvar partidas.'}
        </p>
      )}

      {passwordUpdated && (
        <p role="status">
          {en
            ? 'Password updated. Sign in with your new password.'
            : 'Senha atualizada. Entre com a nova senha.'}
        </p>
      )}

      <form key={mode} className="flex flex-col gap-3 text-left" onSubmit={submit}>
        {isRegistering && (
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
            name="email"
            type="email"
            autoComplete={mode === 'login' ? 'username' : 'email'}
            value={email}
            onChange={event => setEmail(event.target.value)}
            required
          />
        </label>
        <label>
          {passwordLabel}
          <input
            className={inputClass}
            name="password"
            type="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            minLength={6}
            required
          />
        </label>
        {isResetting && (
          <label>
            {en ? 'Confirm new password' : 'Confirme a nova senha'}
            <input
              className={inputClass}
              name="passwordConfirmation"
              type="password"
              autoComplete="new-password"
              minLength={6}
              required
            />
          </label>
        )}
        <button type="submit" className={buttonClass} disabled={busy}>
          {busy ? (en ? 'Please wait…' : 'Aguarde…') : submitLabels[mode]}
        </button>
      </form>

      {error && <p role="alert">{error}</p>}

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {mode === 'login' ? (
          <>
            <button
              type="button"
              className={buttonClass}
              disabled={busy}
              onClick={() => changeMode('register')}
            >
              {en ? 'Register' : 'Cadastrar'}
            </button>
            {resetStatus?.enabled && (
              <button
                type="button"
                className={buttonClass}
                disabled={busy}
                onClick={() => changeMode('reset')}
              >
                {en ? 'Forgot my password' : 'Esqueci minha senha'}
              </button>
            )}
          </>
        ) : (
          <button
            type="button"
            className={buttonClass}
            disabled={busy}
            onClick={() => changeMode('login')}
          >
            {isResetting
              ? en
                ? 'Back to sign in'
                : 'Voltar para entrar'
              : en
                ? 'I already have an account'
                : 'Já tenho conta'}
          </button>
        )}
      </div>
    </>
  );
}
