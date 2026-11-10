import React from 'react';

interface CheckboxProps {
  text?: string;
  checked: boolean;
  functionEvent?: () => void;
}

function Checkbox({ text, checked, functionEvent }: CheckboxProps) {
  return (
    <div className="checkboxContainer">
      <label className="grid grid-cols-[1em_auto] gap-[0.5em] font-bold leading-[1.1]">
        <input
          className="m-0 grid h-[1.15em] w-[1.15em] appearance-none place-content-center border-[0.15em] border-solid border-current bg-white text-current [font:inherit] [transform:translateY(-0.075em)] before:h-[0.65em] before:w-[0.65em] before:content-[''] before:[box-shadow:inset_1em_1em_#b7ce38] before:[transform:scale(0)] before:[transition:120ms_transform_ease-in-out] checked:before:[transform:scale(1)]"
          checked={checked}
          type="checkbox"
          onChange={functionEvent}
          readOnly={!functionEvent}
        />
        {text}
      </label>
    </div>
  );
}

export default Checkbox;
