import React, { Component } from "react";
import { evaluate } from "mathjs";

import { InlineMath } from "react-katex";
import RootFinding, { AbstractInput, MethodReturn } from "../../components/methods/RootFinding";
import App from "../../layout/App";

class IncrementalSearch extends Component {
  method = (fun, x, dx, n) => {
    const f = (x) => evaluate(fun, { x });
    x = parseFloat(x);
    dx = parseFloat(dx);
    n = parseInt(n || "100");

    let x0 = x;
    let x1 = x + dx;
    const table = [[], [], []];

    let i;
    for (i = 0; i < n && f(x0) * f(x1) > 0; i++) {
      App.addResult(table, i, x0, f(x0));

      x0 += dx;
      x1 += dx;
    }
    if (i < n) App.addResult(table, i, x0, f(x0));

    return new MethodReturn({
      table,
      labels: ["i", "x_i", "f(x_i)"],
      anotherones: [],
      sol0: x0,
      sol1: x1,
    });
  };

  render = () => {
    const inputs = [
      new AbstractInput("Function", "f(x)", "The function to solve", true, null),
      new AbstractInput("Start", "x_0", "The point where the method starts", true, null),
      new AbstractInput("Increment", "Δx", "Step size for the search", true, null),
      new AbstractInput("Iterations", "N", "Amount of allowed iterations", false, 100),
    ];

    const helps = [
      <p>
        <InlineMath math="f(x)" /> must be continuous
      </p>,
      <p>
        <InlineMath math="\Delta x" /> must be greater than <InlineMath math="0" />
      </p>,
      <p>
        <InlineMath math="N" /> must be greater than <InlineMath math="0" />
      </p>,
    ];

    return (
      <RootFinding id="incremental-search" inputs={inputs} method={this.method} helps={helps}></RootFinding>
    );
  };
}

export default IncrementalSearch;
