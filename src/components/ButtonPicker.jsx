import React from "react";

import "./ButtonPicker.css";

function ButtonPicker(props) {
  const { options } = props;
  return (
    <div className="button-picker">
      {options?.map((opt) => (
        <button key={opt} className="picker-element">{opt}</button>
      ))}
    </div>
  );
}

export default ButtonPicker;
