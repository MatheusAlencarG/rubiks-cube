import React from 'react';
import { compactButtonClass, compactInputClass } from '../../../shared/ui/controlStyles';
import type { Appearance, Preset } from '../model/cubeTypes';

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
  ['widthPx', 'Cube size (px)', 'Tamanho do cubo (px)', 80, 600],
  ['transitionMs', 'Animation (ms)', 'Animação (ms)', 0, 5000],
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
    <section className="rounded-lg border border-solid border-detail bg-canvas p-3 text-on-canvas">
      <h3 className="m-0 mb-2 text-sm font-semibold">
        {en ? 'Cube appearance' : 'Aparência do cubo'}
      </h3>

      <div className="flex flex-wrap items-end gap-2">
        <label className="min-w-0 flex-1 text-xs" htmlFor="active-cube-preset">
          {en ? 'Active preset (starts a new game)' : 'Preset ativo (inicia nova partida)'}
          <select
            id="active-cube-preset"
            className={compactInputClass + ' mt-1'}
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
        </label>
        {activePreset && (
          <button
            type="button"
            className={compactButtonClass}
            disabled={disabled}
            onClick={onDelete}
          >
            {en ? 'Delete preset' : 'Excluir preset'}
          </button>
        )}
      </div>

      <form
        key={`${activePreset?.documentId}-${appearance.widthPx}`}
        onSubmit={submit}
        className="mt-3 grid gap-3 border-0 border-t border-solid border-detail pt-3 text-xs"
      >
        <label className="max-w-[240px]">
          <span className="mb-1 block">{en ? 'Preset name' : 'Nome do preset'}</span>
          <input
            className={compactInputClass}
            name="name"
            required
            maxLength={80}
            defaultValue={activePreset?.name ?? (en ? 'My preset' : 'Meu preset')}
          />
        </label>
        <fieldset className="m-0 min-w-0 border-0 p-0" disabled={disabled}>
          <legend className="mb-2 p-0 font-semibold">
            {en ? 'Face colors' : 'Cores das faces'}
          </legend>
          <div className="grid w-fit grid-cols-3 gap-x-3 gap-y-2 sm:grid-cols-6">
            {colors.map(([key, english, portuguese]) => (
              <label key={key} className="flex min-w-[36px] flex-col items-center gap-1">
                <input
                  className="box-border h-7 w-7 cursor-pointer overflow-hidden rounded border border-solid border-detail bg-transparent p-0 disabled:cursor-not-allowed [&::-moz-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0"
                  name={key}
                  type="color"
                  defaultValue={appearance[key]}
                />
                {en ? english : portuguese}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="m-0 min-w-0 border-0 p-0" disabled={disabled}>
          <legend className="mb-2 p-0 font-semibold">
            {en ? 'Size and motion' : 'Tamanho e movimento'}
          </legend>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {dimensions.map(([key, english, portuguese, min, max]) => (
              <label key={key} className="flex flex-col gap-1">
                {en ? english : portuguese}
                <input
                  className={compactInputClass + ' !w-20'}
                  name={key}
                  type="number"
                  min={min}
                  max={max}
                  required
                  defaultValue={appearance[key]}
                />
              </label>
            ))}
          </div>
          <p className="mb-0 mt-2 text-muted-ink">
            {en
              ? 'Size scales the entire cube. Use 0 ms for instant turns.'
              : 'O tamanho redimensiona o cubo inteiro. Use 0 ms para giros instantâneos.'}
          </p>
        </fieldset>

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            className={compactButtonClass}
            disabled={disabled}
            name="action"
            value="create"
          >
            {en ? 'Create preset' : 'Criar preset'}
          </button>
          {activePreset && (
            <button
              type="submit"
              className={compactButtonClass}
              disabled={disabled}
              name="action"
              value="update"
            >
              {en ? 'Update preset' : 'Atualizar preset'}
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

function readAppearance(appearance: Appearance, values: FormData) {
  const widthPx = Number(values.get('widthPx'));
  const transitionMs = Number(values.get('transitionMs'));
  const nextAppearance = {
    ...appearance,
    widthPx,
    transitionMs,
    pieceRadiusPx: appearance.pieceRadiusPx * (widthPx / appearance.widthPx),
  };

  for (const [key] of colors) {
    nextAppearance[key] = String(values.get(key));
  }

  return nextAppearance;
}
