import React, { Component } from "react";

import "./_method.css";
import "./RootFinding.css";
import "../Section.css";
import "../Graph.css";
import "katex/dist/katex.min.css";

import { InlineMath, BlockMath } from "react-katex";
import { transpose } from "mathjs";
import functionPlot from "function-plot";
import App from "../../layout/App";

class Method extends Component {
  constructor(props) {
    super(props);
    this.graphElement = null;
    this.state = {
      inputs: [],
      result: new MethodReturn({}),
      remSize: 0,
    };
  }

  /**
   * Add a row of values to the result table where each vector is a column
   * @param {number[][]} table
   * @param  {...number} values
   */
  static addResult = (table, ...values) => {
    for (let i = 0; i < values.length; i++) table[i].push(values[i]);
  };

  /**
   * Initialize the state with default values
   */
  componentDidMount = () => {
    const { inputs } = this.props;
    const values = new Array(inputs.length).fill("");
    this.setState({ inputs: values, remSize: App.getRem() });
  };

  /**
   * Update the value of the input elements
   * @param {React.ChangeEvent<HTMLInputElement>} event
   * @param {number} index
   */
  updateValue = (event, index) => {
    const { inputs } = this.state;
    inputs[index] = event.target.value;
    this.setState({ inputs });
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
   * Get the solution from the chosen method and display the graph
   */
  solveAndGraph = () => {
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

      const { result, remSize } = this.state;
      const { sol0: x0, sol1: x1, anotherones: extraFn } = result;
      const extra = 20;

      const colors = ["#FA8072", "#057F8D", "#4230F0", "#F0D430", "#30F08B", "#9B9053"];
      const generateData = (fn, colorIdx) => ({
        fn,
        sampler: "builtIn",
        graphType: "polyline",
        color: colors[colorIdx + 1],
      });

      functionPlot({
        target: "#method-graph",
        width: clamp(width, 20 * remSize, height),
        height: clamp(width, 20 * remSize, height),
        xDomain: [x0 - extra, (x1 ?? x0) + extra],
        yDomain: [-extra, extra],
        grid: true,
        annotations: [
          { x: x0, text: `x=${x0}` },
          { x: x1 ?? x0, text: `x=${x1 ?? x0}` },
        ],
        data: [generateData(inputs[0], -1), ...extraFn.map(generateData)],
      });
    });
  };

  render = () => {
    const { id, inputs, helps } = this.props;
    const { result: res } = this.state;

    // If a solution has been generated and exceeds 12 rows, collapse the middle results
    let resTable = transpose(res.table);
    if (resTable.length > 9) {
      resTable = resTable
        .slice(0, 4)
        .concat([new Array(res.labels.length).fill("…")])
        .concat(resTable.slice(-4));
    }

    const inputToTableBody = (inp, idx) => {
      const id = inp.name.toLowerCase();
      return (
        <tr key={id}>
          <td className="input-label">
            <label htmlFor={id}>
              <InlineMath math={inp.label} />:
            </label>
          </td>
          <td className="regular-input-wrapper">
            <input
              id={id}
              name={id}
              placeholder={inp.name}
              onChange={(e) => this.updateValue(e, idx)}
            />
          </td>
        </tr>
      );
    };

    const helpsToSpan = (help) => <span>{help}</span>;

    const labelsToBlockMath = (lbl) => (
      <td key={lbl}>
        <BlockMath math={lbl} />
      </td>
    );

    const tableToTableBodyRow = (row) => (
      <tr>
        {row.map((val, index) => {
          const small = index === 0 || val === "…";
          const value = small ? val.toString() : parseFloat(val).toPrecision(21);

          return <td>{value}</td>;
        })}
      </tr>
    );

    let inputWrapper = (
      <div className="method-block input-wrapper">
        <h2 className="section-header">Inputs</h2>
        <table>
          <tbody>{inputs.map(inputToTableBody)}</tbody>
        </table>

        <span className="method-hints">{helps?.map(helpsToSpan)}</span>

        <button id="solve-btn" className="button-primary" onClick={this.solveAndGraph}>
          Solve
        </button>
      </div>
    );

    let inputSeparator, tableWrapper, graphElement;
    if (res.table.length > 0) {
      console.log(resTable);
      inputSeparator = (
        <div style={{ display: "flex", alignItems: "center", color: "#5f5f5f" }}>&#8811;</div>
      );

      const x0 = res.sol0.toPrecision(20);
      const x1 = res.sol1?.toPrecision(20);
      const answer = x1 ? `x ∈ [${x0}, ${x1}]` : `x ≈ ${x0}`;
      tableWrapper = (
        <div className="method-block table-wrapper">
          <h2 className="section-header">Table</h2>
          <table className="result-table">
            <thead>
              <tr>{res.labels.map(labelsToBlockMath)}</tr>
            </thead>
            <tbody>{resTable.map(tableToTableBodyRow)}</tbody>
          </table>

          <span>
            <p className="result-answer">
              <span>Root: </span>
              <div className="real-answer">
                <InlineMath math={answer} />
              </div>
            </p>
            <button onClick={this.downloadAnswer}>Download .txt</button>
          </span>
        </div>
      );

      graphElement = (
        <div className="method-block graph-wrapper">
          <h2 className="section-header">Graph</h2>
          <div className="graph" id="method-graph" ref={(e) => (this.graphElement = e)}></div>
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
   * @param {number} def
   */
  constructor(name, label, desc, req, def) {
    this.name = name;
    this.label = label;
    this.desc = desc;
    this.req = req;
    this.def = def;
  }
}

export class MethodReturn {
  /**
   * @param {{
   *   table: number[][],
   *   labels: string[],
   *   anotherones: string[],
   *   sol0: number,
   *   sol1: number,
   * }} param0
   */
  constructor({ table, labels, sol0, sol1, anotherones }) {
    this.table = table ?? [];
    this.labels = labels ?? [];
    this.sol0 = sol0 ?? undefined;
    this.sol1 = sol1 ?? undefined;
    this.anotherones = anotherones ?? [];
  }
}

export default Method;
