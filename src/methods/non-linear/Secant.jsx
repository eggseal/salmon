import React, { Component } from "react";
import { abs, evaluate } from "mathjs";

import Method, { AbstractInput } from "../../components/Method";

class Secant extends Component {
  method = (fun, x0, x1, tol, n) => {
    const f = (x) => evaluate(fun, { x });
    x0 = parseFloat(x0);
    x1 = parseFloat(x1);
    tol = parseFloat(tol);
    n = parseInt(n);

    let i = 0,
      err = 100,
      xn1 = x1,
      xn2 = x0,
      xn;
    const table = [[], [], [], []];
    Method.addResult(table, 0, x0, f(x0), err);
    Method.addResult(table, 1, x1, f(x1), abs(x0 - x1));
    for (i = 2; i < n + 2 && err > tol; i++) {
      xn = xn1 - (f(xn1) * (xn1 - xn2)) /  (f(xn1) - f(xn2));
      err = abs(xn - xn1);

      Method.addResult(table, i, xn, f(xn), err);
      xn2 = xn1;
      xn1 = xn
    }

    return {
      table,
      labels: ["i", "xn", "f(xn)", "E"],
      interval: false,
      sol: xn,
    };
  };

  render = () => {
    const inputs = [
      new AbstractInput("Function", "f(x)", "The function to solve", true, null),
      new AbstractInput("Point A", "a", "The point where the method starts", true, null),
      new AbstractInput("Point B", "b", "The point where the method ends", true, null),
      new AbstractInput("Tolerance", "Tol", "Presicion of the result", true),
      new AbstractInput("Iterations", "N", "Amount of allowed iterations", false, 100),
    ];

    return <Method id="secant" inputs={inputs} method={this.method}></Method>;
  };
}

export default Secant;
