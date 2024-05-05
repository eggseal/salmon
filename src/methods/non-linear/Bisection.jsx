import React, { Component } from "react";
import { abs, evaluate } from "mathjs";

import Method, { AbstractInput } from "../../components/Method";

class Bisection extends Component {
  method = (fun, a, b, tol, n) => {
    const f = (x) => evaluate(fun, { x });
    a = parseFloat(a);
    b = parseFloat(b);
    tol = parseFloat(tol);
    n = parseInt(n);

    let m,
      i = 0,
      err = 100;
    const table = [[], [], [], []];

    if (f(a) === 0) {
      Method.addResult(table, 0, a, f(a), 0);
      m = a;
    } else if (f(b) === 0) {
      Method.addResult(table, 0, b, f(b), 0);
      m = b;
    } else if (f(a) * f(b) > 0) {
      Method.addResult(table, -1, -1, -1, -1);
      m = 0;
    } else {
      m = (a + b) / 2;
      Method.addResult(table, i, m, f(m), err);
      for (i = 1; i < n && err > tol && f(m) !== 0; i++) {
        if (f(a) * f(m) < 0) b = m;
        else a = m;

        let oldM = m;
        m = (a + b) / 2;
        err = abs(m - oldM);
        Method.addResult(table, i, m, f(m), err);
      }
    }
    return {
      table,
      labels: ["i", "xm", "f(xm)", "E"],
      interval: false,
      sol: m,
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

    return <Method id="bisection" inputs={inputs} method={this.method}></Method>;
  };
}

export default Bisection;
