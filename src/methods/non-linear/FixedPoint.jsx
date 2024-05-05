import React, { Component } from "react";
import { abs, evaluate } from "mathjs";

import Method, { AbstractInput } from "../../components/Method";

class FixedPoint extends Component {
  method = (fun, gun, x, tol, ni) => {
    const f = (x) => evaluate(fun, { x });
    const g = (x) => evaluate(gun, { x });
    x = parseFloat(x);
    tol = parseFloat(tol);
    ni = parseInt(ni);

    let n = x, i = 0, err = 100; 
    const table = [[], [], [], []];
    Method.addResult(table, i, x, f(x), err)
    for (i = 1; i <= n, err > tol; i++) {
      let oldN = n;
      n = g(n);
      err = abs(oldN - n)
      Method.addResult(table, i, g(oldN), f(n), err)
    }

    return {
      table,
      labels: ["i", "n", "f(n)", "E"],
      interval: false,
      anotherone: true,
      sol: n,
    };
  };

  render = () => {
    const inputs = [
      new AbstractInput("Function", "f(x)", "The function to solve", true, null),
      new AbstractInput("Alternative", "g(x)", "The function when equal to X", true, null),
      new AbstractInput("Start", "x", "The point where the method starts", true, null),
      new AbstractInput("Tolerance", "Tol", "Presicion of the result", true),
      new AbstractInput("Iterations", "N", "Amount of allowed iterations", false, 100),
    ];

    return <Method id="regula-falsi" inputs={inputs} method={this.method}></Method>;
  };
}

export default FixedPoint;
