import React, { Component } from "react";
import { abs, derivative, evaluate } from "mathjs";

import { InlineMath } from "react-katex";
import Method, { AbstractInput, MethodReturn } from "../../components/Method";

class NewtonRaphson extends Component {
  method = (fun, x, tol, n) => {
    const dfun = derivative(fun, "x").toString();
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

    return new MethodReturn({
      table,
      labels: ["i", "x_n", "f(x_n)", "Δf(x_n)", "E"],
      anotherones: [dfun],
      sol0: xn,
      sol1: undefined,
    });
  };

  render = () => {
    const inputs = [
      new AbstractInput("Function", "f(x)", "The function to solve", true, null),
      new AbstractInput("Start", "x_0", "The point where the method starts", true, null),
      new AbstractInput("Tolerance", "Tol", "Presicion of the result", true),
      new AbstractInput("Iterations", "N", "Amount of allowed iterations", false, 100),
    ];

    const helps = [
      <p>
        <InlineMath math="f(x)" /> must be continuous
      </p>,
      <p>
        <InlineMath math="f(x)" /> must be twice differentiable on <InlineMath math="(a,b)" />
      </p>,
      <p>
        For a <InlineMath math="x_v" />, <InlineMath math="f(x_v)=0" /> and for any{" "}
        <InlineMath math="x_w" />, <InlineMath math="f'(x_w) \neq 0" />
      </p>,
      <p>
        <InlineMath math="N" /> must be greater than <InlineMath math="0" />
      </p>,
    ];

    return <Method id="newton-raphson" inputs={inputs} method={this.method} helps={helps}></Method>;
  };
}

export default NewtonRaphson;
