import React, { Component } from "react";

import "./_method.css";
import "./LinearEquation.css";
import { InlineMath } from "react-katex";

/**
 * @enum {number}
 */
export const Types = { Regular: 0, Vector: 1, Matrix: 2 };
const TypeLabels = ["regular", "vector", "matrix"];

class LinearEquation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Inputs are treated as matrices, regular inputs are a 1x1, vector inputs are nx1 and matrix inputs are nxn
      inputs: [],
      size: 4,
    };
  }

  /**
   * Convers a string matrix into a float matrix
   * @param {string[][]} matrix
   * @returns {number[][]}
   */
  static parseFloatMatrix = (matrix) => matrix.map((row) => row.map((val) => parseFloat(val)));

  componentDidMount = () => {
    let { inputs } = this.props;
    const { size: length } = this.state;

    let values = [];
    for (const input of inputs) {
      switch (input.type) {
        case Types.Matrix:
          values.push(Array.from({ length }, () => Array(length).fill("")));
          break;
        case Types.Vector:
          values.push(Array.from({ length: 1 }, () => Array(length).fill("")));
          break;
        case Types.Regular:
        default:
          values.push(Array.from({ length: 1 }, () => Array(1).fill("")));
      }
    }

    this.setState({ inputs: values });
  };

  resizeMatrix = (matrix) => {
    const { size } = this.state;

    let cols = matrix.length === 1 ? 1 : size;
    let rows = matrix[0].length === 1 ? 1 : size;
    console.log(matrix, cols, rows);
    return Array.from({ length: rows }, (_, row) =>
      Array.from({ length: cols }, (_, col) =>
        matrix[row]?.[col] !== undefined ? matrix[row][col] : ""
      )
    );
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.size === this.state.size) return;

    this.setState({ inputs: prevState.inputs.map(this.resizeMatrix) });
  };

  changeSize = (change) => {
    let { size } = this.state;
    const clamp = (bot, value, top) => Math.min(top, Math.max(bot, value));
    size = clamp(1, size + change, 8);

    this.setState({ size });
  };

  increaseSize = () => this.changeSize(1);

  reduceSize = () => this.changeSize(-1);

  /**
   * Update the value of the input elements
   * @param {React.ChangeEvent<HTMLInputElement>} event
   * @param {number} index
   * @param {number} position
   */
  updateValue = (event, index, position) => {
    const { inputs, size } = this.state;
    const col = Math.floor(position % size);
    const row = Math.floor(position / size);

    inputs[index][row][col] = event.target.value;
    this.setState({ inputs });
  };

  render = () => {
    const { id, inputs, method } = this.props;
    const { size, inputs: ins } = this.state;

    console.log(ins);

    /**
     * Convert a AbtractInput into a HTML Element
     * @param {AbstractInput} inp
     * @param {number} idx
     */
    const inputToTableBody = (inp, idx) => {
      const id = inp.name.toLowerCase();
      const tdClass = TypeLabels[inp.type];

      return (
        <tr key={id}>
          <td className="input-label">
            <label htmlFor={id}>
              <InlineMath math={inp.label} />:
            </label>
          </td>
          <td id={id} className={`${tdClass}-input-wrapper`} style={{ "--size": size }}>
            {Array.from({ length: size ** inp.type }, (_, pos) => (
              <input
                key={`pos-${pos % size}-${Math.floor(pos / size)}`}
                onChange={(e) => this.updateValue(e, idx, pos)}
              />
            ))}
          </td>
        </tr>
      );
    };

    const inputWrapper = (
      <div className="method-block input-wrapper">
        <h3 className="section-header">Inputs</h3>
        <table>
          <tbody>
            <tr key="size-changer">
              <td className="input-label">
                <InlineMath math="n" />:
              </td>
              <td className="regular-input-wrapper size-changer-wrapper">
                <button className="size-changer" onClick={this.reduceSize}>
                  &minus;
                </button>
                <input type="text" disabled="disabled" value={size} />
                <button className="size-changer" onClick={this.increaseSize}>
                  &#43;
                </button>
              </td>
            </tr>
            {inputs.map(inputToTableBody)}
          </tbody>
        </table>

        <button onClick={() => method(...ins)}></button>
      </div>
    );

    return (
      <div className="method-wrapper" id={id}>
        {inputWrapper}
      </div>
    );
  };
}

export class AbstractInput {
  /**
   * @param {string} name
   * @param {string} label
   * @param {string} desc
   * @param {boolean} req
   * @param {any} def
   * @param {Types} type
   */
  constructor(name, label, desc, req, def, type) {
    this.name = name;
    this.label = label;
    this.desc = desc;
    this.req = req;
    this.def = def;
    this.type = type;
  }
}

export default LinearEquation;
