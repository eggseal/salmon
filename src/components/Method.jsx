import React, { Component } from "react";

import "./Method.css";
import "./Section.css";
import "./Graph.css";
import { transpose } from "mathjs";
import functionPlot from "function-plot";

class Method extends Component {
  constructor(props) {
    super(props);
    this.graphElement = null;
    this.state = {
      inputValues: [],
      res: {
        table: null,
        labels: null,
        interval: null,
        sol: null,
      },
      remSize: 1,
    };
  }

  static addResult = (table, ...values) => {
    let i = 0;
    for (const value of values) {
      table[i].push(value);
      i++;
    }
  };

  componentDidMount = () => {
    let values = new Array(this.props.inputs.length).fill("");
    this.setState({ inputValues: values, remSize: this.getRemSize() });
  };

  getRemSize = () => {
    const div = document.createElement("div");
    div.style.fontSize = "1rem";
    document.body.appendChild(div);

    const size = window.getComputedStyle(div).fontSize;
    document.body.removeChild(div);

    return parseInt(size);
  };

  updateValue = (e, idx) => {
    const newArr = this.state.inputValues;
    newArr[idx] = e.target.value;
    this.setState({
      inputValues: newArr,
    });
  };

  solve = () => {
    const res = this.props.method(...this.state.inputValues);
    this.setState({ res: { ...res } }, () => {
      const width = parseInt(window.getComputedStyle(this.graphElement).width);
      const height = parseInt(window.getComputedStyle(this.graphElement).height);

      const res = this.state.res;

      functionPlot({
        target: "#method-graph",
        width: Math.max(Math.min(width, height), this.state.remSize * 20),
        height: Math.max(Math.min(width, height), this.state.remSize * 20),
        xAxis: {
          domain: res.interval
            ? [Math.round(res.sol[0]) - 20, Math.round(res.sol[1]) + 20]
            : [Math.round(res.sol) - 20, Math.round(res.sol) + 20],
        },
        yAxis: {
          domain: [-20, 20],
        },
        data: [
          {
            fn: this.state.inputValues[0],
            sampler: "builtIn",
            graphType: "polyline",
            color: "#FA8072",
          },
          res.anotherone ? {
            fn: this.state.inputValues[1],
            sampler: "builtIn",
            graphType:"polyline",
            color: "#057F8D"
          } : {
            fn: "-999999999",
            sampler: "builtIn",
            graphType: "polyline",
            color: "#00000000"
          }, // empty, add nothing,
          res.interval
            ? {
                points: [
                  [res.sol[0], 0],
                  [res.sol[1], 0],
                ],
                fnType: "points",
                graphType: "scatter",
              }
            : { points: [res.sol, 0], fnType: "points", graphType: "scatter" },
        ],
        annotations: res.interval
          ? [
              { x: res.sol[0], text: `x=${res.sol[0]}` },
              { x: res.sol[1], text: `x=${res.sol[1]}` },
            ]
          : [{ x: res.sol, text: `x≈${res.sol}` }],
        grid: true,
      });
    });
  };

  render = () => {
    const { id, inputs } = this.props;
    const { res } = this.state;

    let resTable = transpose(res.table);
    if (resTable && resTable.length > 12) {
      resTable = resTable
        .slice(0, 6)
        .concat([new Array(res.labels.length).fill("...")])
        .concat(resTable.slice(-4));
    }

    console.log(resTable);

    return (
      <div className="method-wrapper" id={id}>
        <div className="method-block input-wrapper">
          <h2 className="section-header">Inputs</h2>
          <table style={{ tableLayout: "auto", width: "100%" }}>
            <tbody>
              {inputs.map?.((inp, idx) => {
                const id = inp.name.toLowerCase();
                return (
                  <tr key={id}>
                    <td className="input-label">
                      <label htmlFor={id}></label> {inp.label}:
                    </td>
                    <td>
                      <input
                        id={id}
                        name={id}
                        placeholder={inp.name}
                        onChange={(e) => this.updateValue(e, idx)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button id="solve-btn" className="button-primary" onClick={this.solve}>
            Solve
          </button>
        </div>
        {res.table !== null ? (
          <div style={{ display: "flex", alignItems: "center", color: "#5f5f5f" }}>&#8811;</div>
        ) : (
          ""
        )}
        {res.table !== null ? (
          <div className="method-block table-wrapper">
            <h2 className="section-header">Table</h2>
            <table className="result-table">
              <thead>
                <tr>
                  {res.labels?.map((lbl) => (
                    <td key={lbl}>{lbl}</td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {resTable.map((row) => (
                  <tr>
                    {row.map((val, idx) =>
                      idx === 0 || val === "..." ? (
                        <td>{val}</td>
                      ) : (
                        <td>{parseFloat(val).toPrecision(15)}</td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {res.interval ? (
              <p className="result-answer">
                Root:{" "}
                <span className="real-answer">
                  X ∈ [{res.sol[0]}, {res.sol[1]}]
                </span>
              </p>
            ) : (
              <p className="result-answer">
                Root: <span className="real-answer">X ≈ {res.sol}</span>
              </p>
            )}
          </div>
        ) : (
          ""
        )}
        {res.table !== null ? (
          <div className="method-block graph-wrapper">
            <h2 className="section-header">Graph</h2>
            <div className="graph" id="method-graph" ref={(e) => (this.graphElement = e)}></div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  };
}

export class AbstractInput {
  constructor(name, label, desc, req, def) {
    this.name = name;
    this.label = label;
    this.desc = desc;
    this.req = req;
    this.def = def;
  }
}

export default Method;
