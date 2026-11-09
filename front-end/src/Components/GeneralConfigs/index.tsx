import React, { useContext } from 'react';
import { Languages, Settings } from 'lucide-react';

import { Context } from '../../Contexts/GeneralConfigContext/Context';
import { useAuth } from '../../Contexts/AuthContext';
import AppModal from '../AppModal';
import AppPreferences from '../AppPreferences';
import Checkbox from '../Checkbox';
import { buttonClass } from '../controlStyles';
import SettingsSection from './SettingsSection';

export default function GeneralConfigs() {
  const { currentLanguage, allLanguages } = useContext(Context).language;
  const { configurations } = allLanguages[currentLanguage].global;
  const closeLabel = currentLanguage === 'en-us' ? 'Close settings' : 'Fechar configurações';

  return (
    <AppModal
      title={configurations}
      closeLabel={closeLabel}
      triggerClass="absolute right-[15px] top-[15px] grid h-[40px] w-[40px] cursor-pointer place-items-center border-0 bg-transparent p-0 text-on-canvas"
      panelClass="h-1/2 w-1/2 mobile:h-4/5 mobile:w-4/5"
      overlayClass="generalConfigPopup"
      keepMounted
      trigger={<Settings className="h-8 w-8" aria-hidden="true" />}
    >
      <div className="flex flex-col items-center justify-between gap-[20px] pb-[20px]">
        <AppPreferences />
        <LanguageSettings />
        <PreferenceSyncStatus />
      </div>
    </AppModal>
  );
}

function LanguageSettings() {
  const { setLanguage, currentLanguage, allLanguages } = useContext(Context).language;
  const { language } = allLanguages[currentLanguage].global;

  return (
    <SettingsSection title={language} icon={Languages} variant="language">
      <Checkbox
        checked={currentLanguage === 'pt-br'}
        functionEvent={() => setLanguage('pt-br')}
        text="Português"
      />
      <Checkbox
        checked={currentLanguage === 'en-us'}
        functionEvent={() => setLanguage('en-us')}
        text="English"
      />
    </SettingsSection>
  );
}

function PreferenceSyncStatus() {
  const { language, preferences } = useContext(Context);
  const { user } = useAuth();
  const en = language.currentLanguage === 'en-us';

  if (!preferences.loading && !preferences.error) return null;

  function retrySync() {
    void preferences.save({ ...preferences.ui, language: en ? 'en-US' : 'pt-BR' }).catch(() => {});
  }

  return (
    <div className="w-4/5">
      {preferences.loading && (
        <p role="status">{en ? 'Syncing preferences…' : 'Sincronizando preferências…'}</p>
      )}
      {preferences.error && <p role="alert">{preferences.error}</p>}
      {preferences.error && user && (
        <button className={buttonClass} disabled={preferences.loading} onClick={retrySync}>
          {en ? 'Retry sync' : 'Tentar sincronizar novamente'}
        </button>
      )}
    </div>
  );
}
