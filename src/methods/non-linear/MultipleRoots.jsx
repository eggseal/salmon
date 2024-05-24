import React, { Component } from "react";
import { abs, evaluate, derivative } from "mathjs";

import { InlineMath } from "react-katex";
import Method, { AbstractInput, MethodReturn } from "../../components/methods/RootFinding";

class MultipleRoots extends Component {
  method = (fun, x, m, tol, n) => {
    const dfun = derivative(fun, "x").toString();
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

    const diffs = [dfun];
    for (let der = 1; der < m+1; der++) {
      const lastDiff = diffs[der-1];
      diffs.push(derivative(lastDiff, 'x').toString())
    }

    console.log(xn)
    return new MethodReturn({
      table,
      labels: ["i", "x_n", "f(x_n)", "Δf(x_n)", "E"],
      anotherones: diffs,
      sol0: xn,
      sol1: undefined
    });
  };

  render = () => {
    const inputs = [
      new AbstractInput("Function", "f(x)", "The function to solve", true, null),
      new AbstractInput("Point X0", "x_0", "The starting point of the function", true, null),
      new AbstractInput("Multiplicity", "m", "The multiplicity value of the function", true, null),
      new AbstractInput("Tolerance", "Tol", "Presicion of the result", true),
      new AbstractInput("Iterations", "N", "Amount of allowed iterations", false, 100),
    ];

    const helps = [
      <p>
        <InlineMath math="f" /> must be continuous
      </p>,
      <p>
        <InlineMath math="f" /> must be differentiable <InlineMath math="m" /> times
      </p>,
      <p>
        <InlineMath math="m" /> and <InlineMath math="n" /> must be greater than{" "}
        <InlineMath math="0" />
      </p>,
    ];

    return <Method id="multiple-roots" inputs={inputs} method={this.method} helps={helps}></Method>;
  };
}

export default MultipleRoots;
