import React, { Component } from "react";
import { abs, evaluate } from "mathjs";

import Method, { AbstractInput } from "../../components/Method";

class RegulaFalsi extends Component {
  method = (fun, a, b, tol, n) => {
    const f = (x) => evaluate(fun, { x });
    a = parseFloat(a);
    b = parseFloat(b);
    tol = parseFloat(tol);
    n = parseInt(n);

    let xr,
      i = 0,
      err = 100;
    const table = [[], [], [], []];
    if (f(a) === 0) {
      Method.addResult(table, 0, a, f(a), 0);
      xr = a;
    } else if (f(b) === 0) {
      Method.addResult(table, 0, b, f(b), 0);
      xr = b;
    } else if (f(a) * f(b) > 0) {
      Method.addResult(table, -1, -1, -1, -1);
      xr = 0;
    } else {
      xr = b - (f(b) * (a - b)) / (f(a) - f(b));
      Method.addResult(table, i, xr, f(xr), err);
      for (i = 1; i <= n && err > tol; i++) {
        if (f(a) * f(xr) < 0) b = xr;
        else a = xr;

        let oldXr = xr;
        xr = b - (f(b) * (a - b)) / (f(a) - f(b));
        err = abs(oldXr - xr);
        Method.addResult(table, i, xr, f(xr), err);
      }
    }
    return {
      table,
      labels: ["i", "xr", "f(xr)", "E"],
      interval: false,
      sol: xr,
    };
  };

  render = () => {
    const inputs = [
      new AbstractInput("Function", "f(x)", "The function to solve", true, null),
      new AbstractInput("Start", "a", "The point where the method starts", true, null),
      new AbstractInput("End", "b", "The point where the method ends", true, null),
      new AbstractInput("Tolerance", "Tol", "Presicion of the result", true),
      new AbstractInput("Iterations", "N", "Amount of allowed iterations", false, 100),
    ];

    return <Method id="regula-falsi" inputs={inputs} method={this.method}></Method>;
  };
}

export default RegulaFalsi;
