import React, { Component } from "react";
import { abs, evaluate } from "mathjs";

import Method, { AbstractInput } from "../../components/Method";

class MultipleRoots extends Component {
  method = (fun, dfun, x, m, tol, n) => {
    const f = (x) => evaluate(fun, { x });
    const df = (x) => evaluate(dfun, { x });
    x = parseFloat(x);
    m = parseFloat(m);
    tol = parseFloat(tol);
    n = parseInt(n);

    let i = 0,
      err = 100,
      xn = x;
    const table = [[], [], [], [], []];
    Method.addResult(table, i, xn, f(xn), df(xn), err);
    for (i = 1; i < n && err > tol && df(xn) !== 0; i++) {
      let oldXn = xn;
      xn = xn - (m * f(xn)) / df(xn);
      err = abs(xn - oldXn);
      Method.addResult(table, i, xn, f(xn), df(xn), err);

      if (abs(f(xn)) === Infinity || abs(df(xn)) === Infinity) break;
    }

    console.log({
      table,
      labels: ["i", "xn", "f(xn)", "df(xn)", "err"],
      anotherone: true,
      interval: false,
      sol: xn,
    });

    return {
      table,
      labels: ["i", "xn", "f(xn)", "df(xn)", "err"],
      anotherone: true,
      interval: false,
      sol: xn,
    };
  };

  render = () => {
    const inputs = [
      new AbstractInput("Function", "f(x)", "The function to solve", true, null),
      new AbstractInput("Derivative", "f'(x)", "The derivative of the function", true, null),
      new AbstractInput("Point X0", "x0", "The starting point of the function", true, null),
      new AbstractInput("Multiplicity", "m", "The multiplicity value of the function", true, null),
      new AbstractInput("Tolerance", "Tol", "Presicion of the result", true),
      new AbstractInput("Iterations", "N", "Amount of allowed iterations", false, 100),
    ];

    return <Method id="multiple-roots" inputs={inputs} method={this.method}></Method>;
  };
}

export default MultipleRoots;
