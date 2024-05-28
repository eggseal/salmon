import React, { Component } from "react";

import "./_method.css";
import "./LinearEquation.css";
import { BlockMath, InlineMath } from "react-katex";
import { transpose } from "mathjs";

/**
 * @enum {number}
 */
export const Types = { Regular: 0, Vector: 1, Matrix: 2 };
const TypeLabels = ["regular", "vector", "matrix"];

class LinearEquation extends Component {
  constructor(props) {
    super(props);

    /**
     * @type {{
     *  inputs: AbstractInput[],
     *  size: number,
     *  result: MethodReturn
     * }}
     */
    this.state = {
      // Inputs are treated as matrices, regular inputs are a 1x1, vector inputs are nx1 and matrix inputs are nxn
      inputs: [],
      size: 4,
      result: new MethodReturn({}),
    };
  }

  /**
   * Convers a string matrix into a float matrix
   * @param {string[][]} matrix
   * @returns {number[][]}
   */
  static parseFloatMatrix = (matrix) => matrix.map((row) => row.map((val) => parseFloat(val)));

  /**
   * Get the lower triangle of a square matrix
   * @param {number[][]} matrix
   * @param {number} k
   * @returns {number[][]}
   */
  static tril = (matrix, k) => matrix.map((row, j) => row.map((col, i) => (j >= i - k ? col : 0)));

  /**
   * Get the upper triangle of a square matrix
   * @param {number[][]} matrix
   * @param {number} k
   * @returns {number[][]}
   */
  static triu = (matrix, k) => matrix.map((row, j) => row.map((col, i) => (j <= i - k ? col : 0)));

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

  solve = () => {
    const { method } = this.props;
    const { inputs } = this.state;

    const res = method(...inputs);
    console.log(res);

    this.setState({ result: res });
  };

  /**
   * Downloads the stored answer table as a text file
   */
  downloadAnswer = () => {
    // Stop if a table has not been generated
    const { result: res } = this.state;
    const results = transpose(res.table);
    if (results.length === 0) return;

    let table = "";

    // Get the maximum column length
    let max = 0;
    for (const row of results) {
      for (const value of row) {
        max = Math.max(max, value.toPrecision(20).length + 1);
      }
    }

    // Write the table headers
    for (let col = 0; col < res.labels.length; col++) {
      const header = res.labels[col];
      const padding = col === 0 ? 4 : max;
      table += `|$${header.padEnd(padding)}$`;
    }
    table += "|\n";

    // Write the header separator
    for (let col = 0; col < res.labels.length; col++) {
      const dash = "-";
      const repeat = col === 0 ? 4 : max;
      table += `| ${dash.repeat(repeat)} `;
    }
    table += "|\n";

    // Write the results
    for (const row of results) {
      for (let col = 0; col < row.length; col++) {
        // If the column is the iteration number, don't give it decimals and make the column small
        const value = col === 0 ? row[col].toString() : row[col].toPrecision(20);
        const padding = col === 0 ? 4 : max;

        if (value < 0) table += `| ${value.padEnd(padding + 1)}`;
        else table += `|  ${value.padEnd(padding)}`;
      }
      table += "|\n";
    }
    table += "|\n";

    // Create a blob url and click it to start the download
    const blob = new Blob([table], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${this.props.id}-table.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Downloads the stored answer table as a text file
   */
  downloadEquation = () => {
    const { result: res } = this.state;
    if (res.A.length === 0) return;

    let equation = this.latexEquation()
    equation += "\n\n";
    equation += this.latexSolution()

    const blob = new Blob([equation], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${this.props.id}-equation.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Convert a AbtractInput into a HTML Element
   * @param {AbstractInput} inp
   * @param {number} idx
   */
  inputToTableBody = (inp, idx) => {
    const { size } = this.state;

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

  /**
   * Surround an element with span tags
   * @param {React.JSX.Element} help
   * @returns {React.JSX.Element}
   */
  helpsToSpan = (help) => <span>{help}</span>;

  /**
   * Surround a text with td tags and place the text in a BlockMath element
   * @param {string} lbl
   * @returns {React.JSX.Element}
   */
  labelsToBlockMath = (lbl) => (
    <td key={lbl}>
      <BlockMath math={lbl} />
    </td>
  );

  /**
   * Convert an array of string into a table row
   * @param {string[]} row
   * @returns {React.JSX.Element}
   */
  tableToTableBodyRow = (row) => (
    <tr>
      {row.map((val, index) => {
        const small = index === 0 || val === "…";
        const value = small ? val.toString() : parseFloat(val).toPrecision(21);

        return <td>{value}</td>;
      })}
    </tr>
  );

  latexEquation = () => {
    const { result } = this.state;

    let equation = "\\begin{cases}\n";
    result.A.forEach((row, idx) => {
      let sum = 0;
      row.forEach((col, jdx) => {
        if (jdx > 0 && col >= 0) equation += "+";
        equation += `${col}x_{${jdx + 1}}`;
        sum += col * result.x[jdx];
      });
      equation += `= ${sum}`;
      if (idx < result.A.length - 1) equation += "\\\\\n";
    });
    equation += "\n\\end{cases}";

    return equation;
  };

  latexSolution = () => {
    const { result } = this.state;

    let equation = "\\begin{cases}\n";
    result.x.forEach((x, idx) => {
      equation += `x_{${idx + 1}} = ${x}`;
      if (idx < result.x.length - 1) equation += "\\\\\n";
    });
    equation += "\n\\end{cases}";

    return equation;
  };

  render = () => {
    const { id, inputs, helps } = this.props;
    const { size, result } = this.state;

    let resTable = transpose(result.table);
    if (resTable.length > 9) {
      resTable = resTable
        .slice(0, 4)
        .concat([new Array(result.labels.length).fill("…")])
        .concat(resTable.slice(-4));
    }

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
            {inputs.map(this.inputToTableBody)}
          </tbody>
        </table>

        <span className="method-hints">{helps?.map(this.helpsToSpan)}</span>

        <button className="button-primary" onClick={this.solve}>
          Solve
        </button>
      </div>
    );

    let inputSeparator, tableWrapper;
    if (result.table.length > 0) {
      console.log(resTable);
      inputSeparator = (
        <div style={{ display: "flex", alignItems: "center", color: "#5f5f5f" }}>&#8811;</div>
      );

      tableWrapper = (
        <div className="method-block table-wrapper">
          <h2 className="section-header">Table</h2>
          <table className="result-table">
            <thead>
              <tr>{result.labels.map(this.labelsToBlockMath)}</tr>
            </thead>
            <tbody>{resTable.map(this.tableToTableBodyRow)}</tbody>
          </table>
          <h2 className="section-header">Equation</h2>
          <div className="equation-container">
            <BlockMath math={this.latexEquation()} />
            <BlockMath math={this.latexSolution()} />
          </div>
          <span>
            <button className="download-btn" onClick={this.downloadAnswer}>
              Download Table
            </button>
            <button className="download-btn" onClick={this.downloadEquation}>
              Download Equation
            </button>
          </span>
        </div>
      );
    }

    return (
      <div className="method-wrapper" id={id}>
        {inputWrapper}
        {inputSeparator ?? ""}
        {tableWrapper ?? ""}
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

export class MethodReturn {
  /**
   * @param {{
   *   table: number[][],
   *   labels: string[],
   *   A: number[][],
   *   x: number[],
   *   b: number[],
   * }} param0
   */
  constructor({ table, labels, A, x, b }) {
    this.table = table ?? [];
    this.labels = labels ?? [];
    this.A = A ?? [];
    this.x = x ?? [];
    this.b = b ?? [];
  }
}

export default LinearEquation;
