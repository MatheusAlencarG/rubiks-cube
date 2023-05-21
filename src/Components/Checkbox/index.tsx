import React from "react";
import "./styles.css"

interface CheckboxProps {
  text?: string;
  checked: boolean;
  functionEvent?: () => void;
}

function Checkbox({ text, checked, functionEvent }: CheckboxProps) {
  return(
    <div className="checkboxContainer">
      <label onClick={functionEvent}>
        <input checked={checked} type="checkbox" />
        {text}
      </label>
    </div>
  )
}

export default Checkbox;