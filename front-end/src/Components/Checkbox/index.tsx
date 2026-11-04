import React from 'react';
import './styles.css';

interface CheckboxProps {
  text?: string;
  checked: boolean;
  functionEvent?: () => void;
}

function Checkbox({ text, checked, functionEvent }: CheckboxProps) {
  return (
    <div className="checkboxContainer">
      <label>
        <input
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
