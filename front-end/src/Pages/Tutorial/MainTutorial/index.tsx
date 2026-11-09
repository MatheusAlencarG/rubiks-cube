import React, { useContext } from 'react';
import { Context } from '../../../Contexts/GeneralConfigContext/Context';
import { useTutorials } from '../../../api/hooks';
import RemoteContent, { RichText } from '../../../Components/RemoteContent';
import {
  ACTIONS,
  actionLabel,
  displayKey,
  KeyboardAction,
  UiPreferences,
} from '../../../preferences';

const faceActions = ACTIONS.slice(0, 6);
const viewActions = ACTIONS.slice(6, -1);
const keyClass =
  'inline-block min-w-[28px] rounded border border-solid border-accent bg-canvas px-2 py-1 text-center text-sm font-semibold text-on-canvas';

function MainTutorial() {
  const { data, error, isLoading, mutate } = useTutorials();
  const {
    language: { currentLanguage },
    preferences: { ui },
  } = useContext(Context);

  const overview = data?.find(item => item.kind === 'overview');
  const en = currentLanguage === 'en-us';

  if (!overview) return <RemoteContent loading={isLoading} error={error} empty retry={mutate} />;

  return (
    <div className="tutorialContainer box-border flex w-full flex-1 flex-col gap-5 overflow-auto px-[35px] py-5 mobile:px-5">
      <h2 className="m-0 text-center font-medium">{overview.title}</h2>
      <div className="tutorialDescription text-center">
        <RichText value={overview.description} />
      </div>
      <p className="m-0 text-center">
        <kbd className={keyClass}>{displayKey(ui.keyboardBindings.pause)}</kbd>{' '}
        {en ? 'pauses or resumes the timer.' : 'pausa ou retoma o cronômetro.'}
      </p>
      <p className="m-0 text-center">
        {en
          ? 'Each face command turns it 90°. These are your current keyboard controls:'
          : 'Cada comando de face gira 90°. Estes são os seus comandos atuais:'}
      </p>
      <div className="tutorialContent grid grid-cols-2 gap-5 mobile:grid-cols-1">
        <KeyboardCommands
          title={en ? 'Cube faces' : 'Faces do cubo'}
          actions={faceActions}
          bindings={ui.keyboardBindings}
          en={en}
        />
        <KeyboardCommands
          title={en ? 'View rotation' : 'Rotação da visualização'}
          actions={viewActions}
          bindings={ui.keyboardBindings}
          en={en}
        />
      </div>
      <p className="m-0 text-center">
        <kbd className={keyClass}>Shift</kbd> +{' '}
        {en
          ? 'a face key performs its inverse move. View rotations do not change the logical cube state.'
          : 'a tecla de uma face faz o movimento inverso. Girar a visualização não altera o estado lógico do cubo.'}
      </p>
      <p className="m-0 text-center">
        {en
          ? 'Change controls and appearance in settings. Keyboard shortcuts are paused while settings or input fields are active.'
          : 'Altere os comandos e o tema nas configurações. Os atalhos ficam pausados enquanto as configurações ou campos de entrada estão ativos.'}
      </p>
      <p className="m-0 text-center">
        {en
          ? 'Sign in to save and resume games, manage appearance presets and record solved attempts in “Games and appearance”.'
          : 'Entre na sua conta para salvar e retomar partidas, gerenciar presets de aparência e registrar tentativas resolvidas em “Partidas e aparência”.'}
      </p>
    </div>
  );
}

interface KeyboardCommandsProps {
  title: string;
  actions: KeyboardAction[];
  bindings: UiPreferences['keyboardBindings'];
  en: boolean;
}

function KeyboardCommands({ title, actions, bindings, en }: KeyboardCommandsProps) {
  return (
    <section>
      <h3 className="mt-0">{title}</h3>
      <dl className="m-0 grid grid-cols-[80px_1fr] gap-x-3 gap-y-2">
        {actions.map(action => (
          <React.Fragment key={action}>
            <dt>
              <kbd className={keyClass}>{displayKey(bindings[action])}</kbd>
            </dt>
            <dd className="m-0">{actionLabel(action, en)}</dd>
          </React.Fragment>
        ))}
      </dl>
    </section>
  );
}

export default MainTutorial;
