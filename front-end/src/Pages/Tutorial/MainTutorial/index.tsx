import React, { useContext } from 'react';
import { Context } from '../../../Contexts/GeneralConfigContext/Context';
import { useTutorials } from '../../../api/hooks';
import RemoteContent, { RichText } from '../../../Components/RemoteContent';
import { ACTIONS, actionLabel, displayKey } from '../../../preferences';

function MainTutorial() {
  const { data, error, isLoading, mutate } = useTutorials();
  const overview = data?.find(item => item.kind === 'overview');
  const {
    language: { currentLanguage },
    preferences: { ui },
  } = useContext(Context);
  const en = currentLanguage === 'en-us';
  if (!overview) return <RemoteContent loading={isLoading} error={error} empty retry={mutate} />;
  return (
    <div className="tutorialContainer box-border flex w-full flex-1 flex-col gap-5 overflow-auto px-[35px] py-5 mobile:px-5">
      <h2 className="m-0 text-center font-medium">{overview.title}</h2>
      <div className="tutorialDescription text-center">
        <RichText value={overview.description} />
      </div>
      <p className="m-0 text-center">
        {en
          ? 'Each face command turns it 90°. These are your current keyboard controls:'
          : 'Cada comando de face gira 90°. Estes são os seus comandos atuais:'}
      </p>
      <div className="tutorialContent grid grid-cols-2 gap-5 mobile:grid-cols-1">
        {[ACTIONS.slice(0, 6), ACTIONS.slice(6)].map((group, index) => (
          <section key={index}>
            <h3 className="mt-0">
              {index === 0
                ? en
                  ? 'Cube faces'
                  : 'Faces do cubo'
                : en
                  ? 'View rotation'
                  : 'Rotação da visualização'}
            </h3>
            <dl className="m-0 grid grid-cols-[80px_1fr] gap-x-3 gap-y-2">
              {group.map(action => (
                <React.Fragment key={action}>
                  <dt>
                    <kbd className="keyboard-key">{displayKey(ui.keyboardBindings[action])}</kbd>
                  </dt>
                  <dd className="m-0">{actionLabel(action, en)}</dd>
                </React.Fragment>
              ))}
            </dl>
          </section>
        ))}
      </div>
      <p className="m-0 text-center">
        <kbd className="keyboard-key">Shift</kbd> +{' '}
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
export default MainTutorial;
