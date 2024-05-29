import React, { Component } from "react";
import { InlineMath, BlockMath } from "react-katex";

import { isNumber, transpose } from "mathjs";

import "./Interpolation.css";
import functionPlot from "function-plot";
import App from "../../layout/App";

class Interpolation extends Component {
  constructor(props) {
    super(props);
    this.graphElement = null;
    this.state = {
      // Inputs are treated as matrices, regular inputs are a 1x1, vector inputs are nx1 and matrix inputs are nxn
      inputs: [],
      size: 4,
      result: new MethodReturn({}),
    };
  }

  componentDidMount() {
    const { inputs } = this.props; // Get inputs from props
    const { size } = this.state; // Get size from state

    if (inputs && size) {
      // Ensure inputs and size are defined
      const values = Array.from({ length: inputs.length }, () => Array(size).fill(""));
      this.setState({ inputs: values });
    }
  }

  resizeArray = (array) => {
    const newSize = this.state.size;
    const newArray = Array(newSize).fill("");

    // Copy existing values to the new array
    for (let i = 0; i < Math.min(array.length, newSize); i++) {
      newArray[i] = array[i];
    }

    return newArray;
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.size === this.state.size) return;

    this.setState({ inputs: prevState.inputs.map(this.resizeArray) });
  };

  updateValue = (event, index, position) => {
    const { inputs } = this.state;

    inputs[index][position] = event.target.value;
    this.setState({ inputs });
  };

  changeSize = (change) => {
    let { size } = this.state;
    size += change;

    this.setState({ size });
  };

  increaseSize = () => this.changeSize(1);

  reduceSize = () => this.changeSize(-1);

  solve = () => {
    const { method } = this.props;
    const { inputs } = this.state;

    const res = method(...inputs);
    console.log(res);

    this.setState({ result: res }, () => {
      // Element size in pixels
      const width = parseInt(window.getComputedStyle(this.graphElement).width);
      const height = parseInt(window.getComputedStyle(this.graphElement).height);

      const { max, min } = Math;
      const clamp = (val, bot, top) => max(min(val, top), bot);

      const colors = ["#FA8072", "#057F8D", "#4230F0", "#F0D430", "#30F08B", "#9B9053"];
      const generateData = (fn, colorIdx) => ({
        fn,
        sampler: "builtIn",
        graphType: "polyline",
        color: colors[colorIdx],
      });
      const { polynomial } = this.state.result;
      console.log(polynomial);
      const remSize = App.getRem();

      const extra = 20;
      functionPlot({
        target: "#polynomial-graph",
        width: clamp(width, 30 * remSize, height),
        height: clamp(width, 30 * remSize, height),
        xDomain: [-extra, extra],
        yDomain: [-extra, extra],
        grid: true,
        data: polynomial.map(generateData),
      });
    });
  };

  downloadAnswer = () => {
    const { result: res } = this.state;
    const results = transpose(res.table);
    if (results.length === 0) return;

    let table = "";

    // Get the maximum column length
    let max = 0;
    for (const row of results) {
      for (const value of row) {
        const len = value.toPrecision?.(20) ?? value;
        max = Math.max(max, len.length + 1);
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
        const num = isNumber(row[col]);
        const value = col === 0 || !num ? String(row[col]) : row[col].toPrecision(20);
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
    if (res.polynomial.length === 0) return;

    let equation = "Polynomial:\n";
    equation += res.polynomial.join("\n");
    equation += "\n\nLaTeX Format:\n";
    equation += res.latexPol;

    const blob = new Blob([equation], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${this.props.id}-polynomial.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Convert a AbtractInput into a HTML Element
   * @param {AbstractInput} inp
   * @param {number} idx
   */
  inputToTableBody = (inp, idx) => {
    const { size: length } = this.state;
    const id = inp.name.toLowerCase();

    return (
      <tr key={id}>
        <td className="input-label">
          <label htmlFor={id}>
            <InlineMath math={inp.label} />:
          </label>
        </td>
        <td id={id} className={`${id === "type" ? "regular" : "vector"}-input-wrapper`}>
          {Array.from({ length: length ** (id === "type" ? 0 : 1) }, (_, pos) => (
            <input key={`pos-${pos}`} onChange={(e) => this.updateValue(e, idx, pos)} />
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
      <InlineMath math={lbl} />
    </td>
  );

  /**
   * Convert an array of string into a table row
   * @param {string[]} row
   * @returns {React.JSX.Element}
   */
  tableToTableBodyRow = (row) => (
    <tr>
      {row.map((val) => (
        <td>
          <BlockMath math={String(val)} />
        </td>
      ))}
    </tr>
  );

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

    let inputSeparator, tableWrapper, graphElement;
    if (result.table.length > 0) {
      inputSeparator = (
        <div style={{ display: "flex", alignItems: "center", color: "#5f5f5f" }}>&#8811;</div>
      );

      console.log(result);

      tableWrapper = (
        <div className="method-block table-wrapper">
          <h2 className="section-header">Table</h2>
          <table className="result-table">
            <thead>
              <tr>{result.labels.map(this.labelsToBlockMath)}</tr>
            </thead>
            <tbody>{resTable.map(this.tableToTableBodyRow)}</tbody>
          </table>
          <h2 className="section-header">Polynomial</h2>
          <div className="polynomial-container">
            <BlockMath math={result.latexPol} />
          </div>
          <span>
            <button className="download-btn" onClick={this.downloadAnswer}>
              Download Table
            </button>
            <button className="download-btn" onClick={this.downloadEquation}>
              Download Polynomial
            </button>
          </span>
        </div>
      );

      graphElement = (
        <div className="method-block graph-wrapper">
          <h2 className="section-header">Graph</h2>
          <div className="graph" id="polynomial-graph" ref={(e) => (this.graphElement = e)}></div>
        </div>
      );
    }

    return (
      <div className="method-wrapper" id={id}>
        {inputWrapper}
        {inputSeparator ?? ""}
        {tableWrapper ?? ""}
        {graphElement ?? ""}
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
   */
  constructor(name, label, desc, req) {
    this.name = name;
    this.label = label;
    this.desc = desc;
    this.req = req;
  }
}

export class MethodReturn {
  /**
   * @param {{
   *  pol: string,
   *  latex: string,
   *  L: string[],
   *  table: (string|number)[][],
   *  labels: string[]
   * }} param0
   */
  constructor({ pol, latex, L, table, labels }) {
    this.polynomial = pol ?? [];
    this.latexPol = latex ?? "";
    this.L = L ?? [];
    this.table = table ?? [];
    this.labels = labels ?? [];
  }
}

export default Interpolation;
