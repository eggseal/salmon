import React, { Component } from "react";
import { abs, evaluate } from "mathjs";

import { InlineMath } from "react-katex";
import Method, { AbstractInput, MethodReturn } from "../../components/methods/RootFinding";

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
      xn = xn1 - (f(xn1) * (xn1 - xn2)) / (f(xn1) - f(xn2));
      err = abs(xn - xn1);

      Method.addResult(table, i, xn, f(xn), err);
      xn2 = xn1;
      xn1 = xn;
    }

    return new MethodReturn({
      table,
      labels: ["i", "x_n", "f(x_n)", "E"],
      anotherones: [],
      sol0: xn,
      sol1: undefined,
    });
  };

  render = () => {
    const inputs = [
      new AbstractInput("Function", "f(x)", "The function to solve", true, null),
      new AbstractInput("Point 0", "x_0", "The point where the method starts", true, null),
      new AbstractInput("Point 1", "x_1", "The point where the method ends", true, null),
      new AbstractInput("Tolerance", "Tol", "Presicion of the result", true),
      new AbstractInput("Iterations", "N", "Amount of allowed iterations", false, 100),
    ];

    const helps = [
      <p>
        <InlineMath math="f(x)" /> must be continuous
      </p>,
      <p>
        <InlineMath math="N" /> must be greater than <InlineMath math="0" />
      </p>,
    ];

    return <Method id="secant" inputs={inputs} method={this.method} helps={helps}></Method>;
  };
}

export default Secant;
