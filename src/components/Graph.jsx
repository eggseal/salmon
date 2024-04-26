import React, { Component } from "react";
import plot from "function-plot";

import "./Graph.css";

class ParentGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rem: null,
      functions: ["x^2"],
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
    if (functions.length < 10) functions.push("");

    this.setState({
      functions,
    });
  };

  render = () => {
    const { withInput, id } = this.props;
    const input = (
      <GraphInput
        data={this.state.functions}
        handleInput={this.handleInput}
        addFunction={this.addFunction}
      />
    );

    return (
      <div className="parent-graph">
        {withInput ? input : ""}
        <Graph id={id} functions={this.state.functions}></Graph>
      </div>
    );
  };
}

class Graph extends Component {
  constructor(props) {
    super(props);

    this.graphElement = null;
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
    const height = this.state.remSize * 35;
    const width = parseInt(window.getComputedStyle(this.graphElement).width);

    const domY = 30;
    const domX = domY * (width / height);
    const fnData = [];
    for (const fun of this.props.functions) {
      if (!fun) continue;
      fnData.push({ fn: fun });
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
    } catch(e) {}
  };

  componentDidMount = () => {
    const rem = this.getRemSize();
    this.setState({ remSize: rem }, this.updatePlot);
  };

  render = () => {
    const { id, functions } = this.props;
    this.updatePlot()

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
    const { data, handleInput, addFunction } = this.props;
    return (
      <div className="graph-inputs">
        <form className="graph-input-wrapper">
          {data.map((fn, index) => (
            <input
              type="text"
              className="graph-input"
              name={`graphin-${index}`}
              value={fn}
              key={index}
              onChange={handleInput}
            />
          ))}
        </form>
        <button onClick={() => this.addFunction(addFunction)}>+</button>
      </div>
    );
  };
}

export { GraphInput, ParentGraph };
export default Graph;
