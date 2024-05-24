import React from "react";

import "./ButtonPicker.css";

function ButtonPicker(props) {
  const { options, updateMethod, method } = props;

  return (
    <div className="button-picker">
      {options?.map((opt) => (
        <button
          key={opt}
          className={`picker-element${opt === method ? " selected" : ""}`}
          onClick={() => updateMethod(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export default ButtonPicker;
