import React, { Component } from "react";
import { abs, evaluate } from "mathjs";

import Method, { AbstractInput } from "../../components/Method";

class NewtonRaphson extends Component {
  method = (fun, dfun, x, tol, n) => {
    const f = (x) => evaluate(fun, { x });
    const df = (x) => evaluate(dfun, { x });
    x = parseFloat(x);
    tol = parseFloat(tol);
    n = parseInt(n);

    let i = 0,
      xn = x,
      err = 100;
    const table = [[], [], [], [], []];
    Method.addResult(table, i, xn, f(xn), df(xn), err);
    for (i = 1; i <= n && err > tol; i++) {
      let oldXn = xn;
      xn = oldXn - f(oldXn) / df(oldXn);
      err = abs(xn - oldXn);
      Method.addResult(table, i, xn, f(xn), df(xn), err);
    }

    return {
      table,
      labels: ["i", "xn", "f(xn)", "f'(xn)", "E"],
      interval: false,
      anotherone: true,
      sol: xn,
    }
  };

  render = () => {
    const inputs = [
      new AbstractInput("Function", "f(x)", "The function to solve", true, null),
      new AbstractInput("Derivative", "f'(x)", "The derivative of f", true, null),
      new AbstractInput("Start", "x", "The point where the method starts", true, null),
      new AbstractInput("Tolerance", "Tol", "Presicion of the result", true),
      new AbstractInput("Iterations", "N", "Amount of allowed iterations", false, 100),
    ];

    return <Method id="newton-raphson" inputs={inputs} method={this.method}></Method>;
  };
}

export default NewtonRaphson;
