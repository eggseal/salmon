import React, { Component } from "react";
import { evaluate } from "mathjs";

import Method, { AbstractInput } from "../../components/Method";

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
      Method.addResult(table, i, x0, f(x0));

      x0 += dx;
      x1 += dx;
    }
    if (i < n) Method.addResult(table, i, x0, f(x0));

    return {
      table,
      labels: ["i", "xi", "f(xi)"],
      interval: true,
      sol: [x0, x1],
    };
  };

  render = () => {
    const inputs = [
      new AbstractInput("Function", "f(x)", "The function to solve", true, null),
      new AbstractInput("Start", "x", "The point where the method starts", true, null),
      new AbstractInput("Increment", "Δx", "Step size for the search", true, null),
      new AbstractInput("Iterations", "N", "Amount of allowed iterations", false, 100),
    ];

    return <Method id="incremental-search" inputs={inputs} method={this.method}></Method>;
  };
}

export default IncrementalSearch;
