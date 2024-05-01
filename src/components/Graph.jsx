import React, { Component } from "react";
import plot from "function-plot";

import "./Graph.css";

class ParentGraph extends Component {
  constructor(props) {
    super(props);
    this.colors = [
      "#EBAB06",
      "#EB3727",
      "#942894",
      "#00C70C",
      "#ACEB7D",
      "#275BE8",
      "#3A9492",
      "#755947",
      "#FAFA46",
      "#571BD1",
    ];
    this.state = {
      rem: null,
      functions: ["x"],
    };
  }

  handleInput = (e) => {
    const { name, value } = e.target;
    const index = parseInt(name.split("-")?.[1]);

    const functions = this.state.functions;
    if (!isNaN(index)) functions[index] = value;

    this.setState({
      functions: functions,
    });
  };

  addFunction = () => {
    const functions = this.state.functions;
    if (functions.length < 10) {
      let pos = functions.push("");
      functions[pos-1] = `x^${pos}`
    } else return;

    this.setState({
      functions,
    });
  };

  render = () => {
    const { withInput, id } = this.props;
    const input = (
      <GraphInput
        data={this.state.functions}
        colors={this.colors}
        handleInput={this.handleInput}
        addFunction={this.addFunction}
      />
    );

    return (
      <div className="parent-graph">
        {withInput ? input : ""}
        <Graph id={id} colors={this.colors} functions={this.state.functions}></Graph>
      </div>
    );
  };
}

class Graph extends Component {
  constructor(props) {
    super(props);

    this.graphElement = null;
    this.colors = props.colors;
    this.state = {
      remSize: null,
    };
  }

  getRemSize = () => {
    const div = document.createElement("div");
    div.style.fontSize = "1rem";
    document.body.appendChild(div);

    const size = window.getComputedStyle(div).fontSize;
    document.body.removeChild(div);

    return parseInt(size);
  };

  updatePlot = () => {
    if (!this.graphElement) return;
    const target = `#${this.props.id}`;
    const height = this.state.remSize * 27.75;
    const width = parseInt(window.getComputedStyle(this.graphElement).width);

    const domY = 30;
    const domX = domY * (width / height);
    const fnData = [];
    let i = 0;
    for (const fun of this.props.functions) {
      if (!fun) continue;
      fnData.push({ fn: fun, color: this.colors[i], sampler: "builtIn", graphType: "polyline" });
      i++;
    }

    try {
      plot({
        target,
        height,
        width,
        yAxis: { domain: [-domY, domY] },
        xAxis: { domain: [-domX, domX] },
        data: fnData,
        grid: true,
      });
    } catch (e) {}
  };

  componentDidMount = () => {
    const rem = this.getRemSize();
    this.setState({ remSize: rem }, this.updatePlot);
  };

  render = () => {
    const { id, functions } = this.props;
    this.updatePlot();

    return <div ref={(e) => (this.graphElement = e)} id={id} className="graph"></div>;
  };
}

class GraphInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputs: 1,
    };
  }

  addFunction = (callback) => {
    this.setState({ inputs: this.state.inputs + 1 }, callback);
  };

  render = () => {
    const { data, colors, handleInput, addFunction } = this.props;
    return (
      <div className="graph-inputs">
        <div className="graph-input-wrapper">
          {data.map((fn, index) => (
            <div className="graph-input-wrapper2">
              <div className="function-color" style={{ background: colors[index] }}></div>
              <span>{String.fromCharCode(102 + index)}() = </span>
              <input
                type="text"
                className="graph-input"
                name={`graphin-${index}`}
                value={fn}
                key={index}
                onChange={handleInput}
              />
            </div>
          ))}
        </div>
        <button onClick={() => this.addFunction(addFunction)}>+</button>
      </div>
    );
  };
}

export { GraphInput, ParentGraph };
export default Graph;
