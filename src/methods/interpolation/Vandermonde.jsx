import React, { Component } from "react";
import { InlineMath } from "react-katex";
import { matrix, inv, multiply } from "mathjs";

import App from "../../layout/App";
import Interpolation, { AbstractInput, MethodReturn } from "../../components/methods/Interpolation";

class Vandermonde extends Component {
  method = (x, y) => {
    const n = x.length;

    const V = [];
    for (let i = 0; i < n; i++) {
      V[i] = [];
      for (let j = 0; j < n; j++) {
        V[i][j] = Math.pow(x[i], j);
      }
    }

    const VMatrix = matrix(V);
    const yMatrix = matrix(y);

    const coefficients = multiply(inv(VMatrix), yMatrix).valueOf();

    const table = [...Array.from({ length: n }, () => []), [], []];
    coefficients.forEach((c, i) => {
      console.log(VMatrix.toArray()[i], c, yMatrix.toArray()[i]);
      App.addResult(table, ...VMatrix.toArray()[i].reverse(), c, yMatrix.toArray()[i]);
    });

    let pol = "";
    let latex = "";
    coefficients.reverse().forEach((coef, i) => {
      if (i > 0 && coef >= 0) {
        pol += " + ";
        latex += " + ";
      }
      if (i > 0 && coef < 0) {
        pol += " - ";
        latex += " - ";
      }
      pol += `${Math.abs(coef)}`;
      latex += `${Math.abs(coef)}`;
      if (i < n - 1) {
        pol += ` * x^${n - i - 1}`;
        latex += ` x^{${n - i - 1}}`;
      }
    });

    return new MethodReturn({
      pol: [pol],
      latex,
      table,
      labels: [...Array.from({ length: n }, (_, k) => `A_${k + 1}`), "x", "b"],
    });
  };

  render = () => {
    const inputs = [
      new AbstractInput("Vector-X", "\\vec{x}", "The vector of points in x", true),
      new AbstractInput("Vector-Y", "\\vec{y}", "The vector of points in y", true),
    ];

    const helps = [
      <p>
        Values on <InlineMath math="\vec{x}" /> can't have duplicates
      </p>,
      <p>
        All fields on <InlineMath math="\vec{x}" /> and <InlineMath math="\vec{y}" /> must be filled
      </p>,
    ];

    return <Interpolation id="vandermonde" method={this.method} inputs={inputs} helps={helps} />;
  };
}

export default Vandermonde;
