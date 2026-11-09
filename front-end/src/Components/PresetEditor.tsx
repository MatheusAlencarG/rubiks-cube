import React from 'react';
import { buttonClass, inputClass } from './controlStyles';
import type { Appearance, Preset } from '../api/types';

export interface PresetInput {
  name: string;
  appearance: Appearance;
  update: boolean;
}

interface PresetEditorProps {
  en: boolean;
  appearance: Appearance;
  presets?: Preset[];
  activePreset?: Preset | null;
  disabled: boolean;
  onSelect: (preset?: Preset) => void;
  onDelete: () => void;
  onSave: (input: PresetInput) => void;
}

const colors = [
  ['frontColor', 'Front', 'Frente'],
  ['backColor', 'Back', 'Trás'],
  ['leftColor', 'Left', 'Esquerda'],
  ['rightColor', 'Right', 'Direita'],
  ['topColor', 'Top', 'Cima'],
  ['bottomColor', 'Bottom', 'Baixo'],
] as const;

const dimensions = [
  ['widthPx', 'Width (px)', 'Largura (px)', 80, 600],
  ['pieceRadiusPx', 'Corner radius (px)', 'Raio das peças (px)', 0, 80],
  ['transitionMs', 'Animation (ms)', 'Animação (ms)', 0, 5000],
  ['initialRotationX', 'Initial X rotation', 'Rotação X inicial', -360, 360],
  ['initialRotationY', 'Initial Y rotation', 'Rotação Y inicial', -360, 360],
  ['initialRotationZ', 'Initial Z rotation', 'Rotação Z inicial', -360, 360],
] as const;

export default function PresetEditor({
  en,
  appearance,
  presets,
  activePreset,
  disabled,
  onSelect,
  onDelete,
  onSave,
}: PresetEditorProps) {
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;

    onSave({
      name: String(values.get('name')),
      appearance: readAppearance(appearance, values),
      update: submitter?.value === 'update',
    });
  }

  return (
    <>
      <h3>Presets</h3>
      <label htmlFor="active-cube-preset">
        {en ? 'Active preset (starts a new game)' : 'Preset ativo (inicia nova partida)'}
      </label>
      <select
        id="active-cube-preset"
        className={inputClass}
        disabled={disabled}
        value={activePreset?.documentId ?? ''}
        onChange={event =>
          onSelect(presets?.find(preset => preset.documentId === event.target.value))
        }
      >
        <option value="">{en ? 'Default' : 'Padrão'}</option>
        {presets?.map(preset => (
          <option key={preset.documentId} value={preset.documentId}>
            {preset.name}
          </option>
        ))}
      </select>
      {activePreset && (
        <button className={`${buttonClass} mt-2`} disabled={disabled} onClick={onDelete}>
          {en ? 'Delete preset' : 'Excluir preset'}
        </button>
      )}
      <form
        key={`${activePreset?.documentId}-${appearance.widthPx}`}
        onSubmit={submit}
        className="my-4 grid grid-cols-2 gap-3 mobile:grid-cols-1"
      >
        <label>
          {en ? 'Preset name' : 'Nome do preset'}
          <input
            className={inputClass}
            name="name"
            required
            maxLength={80}
            defaultValue={activePreset?.name ?? (en ? 'My preset' : 'Meu preset')}
          />
        </label>
        {colors.map(([key, english, portuguese]) => (
          <label key={key}>
            {en ? english : portuguese}
            <input
              className={`${inputClass} h-10`}
              name={key}
              type="color"
              defaultValue={appearance[key]}
            />
          </label>
        ))}
        {dimensions.map(([key, english, portuguese, min, max]) => (
          <label key={key}>
            {en ? english : portuguese}
            <input
              className={inputClass}
              name={key}
              type="number"
              min={min}
              max={max}
              required
              defaultValue={appearance[key]}
            />
          </label>
        ))}
        <button className={buttonClass} disabled={disabled} name="action" value="create">
          {en ? 'Create preset' : 'Criar preset'}
        </button>
        {activePreset && (
          <button className={buttonClass} disabled={disabled} name="action" value="update">
            {en ? 'Update preset' : 'Atualizar preset'}
          </button>
        )}
      </form>
    </>
  );
}

function readAppearance(appearance: Appearance, values: FormData) {
  const nextAppearance = { ...appearance };

  for (const key of Object.keys(appearance) as (keyof Appearance)[]) {
    const raw = values.get(key);

    if (raw !== null) {
      Object.assign(nextAppearance, { [key]: key.endsWith('Color') ? String(raw) : Number(raw) });
    }
  }

  return nextAppearance;
}
