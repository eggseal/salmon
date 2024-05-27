import React, { Component } from "react";
import { abs, evaluate } from "mathjs";

import { InlineMath } from "react-katex";
import RootFinding, { AbstractInput, MethodReturn } from "../../components/methods/RootFinding";
import App from "../../layout/App";

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
      App.addResult(table, 0, a, f(a), 0);
      xr = a;
    } else if (f(b) === 0) {
      App.addResult(table, 0, b, f(b), 0);
      xr = b;
    } else if (f(a) * f(b) > 0) {
      App.addResult(table, -1, -1, -1, -1);
      xr = 0;
    } else {
      xr = b - (f(b) * (a - b)) / (f(a) - f(b));
      App.addResult(table, i, xr, f(xr), err);
      for (i = 1; i <= n && err > tol; i++) {
        if (f(a) * f(xr) < 0) b = xr;
        else a = xr;

        let oldXr = xr;
        xr = b - (f(b) * (a - b)) / (f(a) - f(b));
        err = abs(oldXr - xr);
        App.addResult(table, i, xr, f(xr), err);
      }
    }

    return new MethodReturn({
      table,
      labels: ["i", "x_r", "f(x_r)", "E"],
      anotherones: [],
      sol0: xr,
      sol1: undefined,
    });
  };

  render = () => {
    const inputs = [
      new AbstractInput("Function", "f(x)", "The function to solve", true, null),
      new AbstractInput("Start", "x_a", "The point where the method starts", true, null),
      new AbstractInput("End", "x_b", "The point where the method ends", true, null),
      new AbstractInput("Tolerance", "Tol", "Presicion of the result", true),
      new AbstractInput("Iterations", "N", "Amount of allowed iterations", false, 100),
    ];

    const helps = [
      <p>
        <InlineMath math={"f(x)"} /> must be continous between <InlineMath math={"a"} /> and{" "}
        <InlineMath math={"b"} />
      </p>,
      <p>
        <InlineMath math="b" /> must be greater than <InlineMath math="a" />{" "}
      </p>,
      <p>
        <InlineMath math="f(a)" /> and <InlineMath math="f(b)" /> must have opposite signs
      </p>,
      <p>
        <InlineMath math="N" /> must be greater than <InlineMath math="0" />
      </p>,
    ];

    return <RootFinding id="regula-falsi" inputs={inputs} method={this.method} helps={helps}></RootFinding>;
  };
}

export default RegulaFalsi;
