import React, { Component } from "react";
import { abs, evaluate } from "mathjs";

import { InlineMath } from "react-katex";
import Method, { AbstractInput, MethodReturn } from "../../components/Method";

class FixedPoint extends Component {
  method = (fun, gun, x, tol, ni) => {
    const f = (x) => evaluate(fun, { x });
    const g = (x) => evaluate(gun, { x });
    x = parseFloat(x);
    tol = parseFloat(tol);
    ni = parseInt(ni);

    let n = x,
      i = 0,
      err = 100;
    const table = [[], [], [], []];
    Method.addResult(table, i, x, f(x), err);
    for (i = 1; i <= n && err > tol; i++) {
      let oldN = n;
      n = g(n);
      err = abs(oldN - n);
      Method.addResult(table, i, g(oldN), f(n), err);
    }

    return new MethodReturn({
      table,
      labels: ["i", "x_n", "f(x_n)", "E"],
      anotherones: [],
      sol0: n,
      sol1: undefined,
    });
  };

  render = () => {
    const inputs = [
      new AbstractInput("Function", "f(x)", "The function to solve", true, null),
      new AbstractInput("Alternative", "g(x)", "The function when equal to X", true, null),
      new AbstractInput("Start", "x_0", "The point where the method starts", true, null),
      new AbstractInput("Tolerance", "Tol", "Presicion of the result", true),
      new AbstractInput("Iterations", "N", "Amount of allowed iterations", false, 100),
    ];

    const helps = [
      <p>
        <InlineMath math="f(x)" /> must be continuous
      </p>,
      <p>
        <InlineMath math="g(x)\in [a,b]" /> for every <InlineMath math="x\in (a,b)" />
      </p>,
      <p>
        <InlineMath math="g'(x)" /> exists on <InlineMath math="(a,b)" />
      </p>,
      <p>
        <InlineMath math="|g'(x)|\leq k<1" /> guarantees a point in <InlineMath math="[a,b]" />
      </p>,
      <p>
        <InlineMath math="N" /> must be greater than <InlineMath math="0" />
      </p>,
    ];

    return <Method id="regula-falsi" inputs={inputs} method={this.method} helps={helps}></Method>;
  };
}

export default FixedPoint;
