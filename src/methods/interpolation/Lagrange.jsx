import React, { Component } from "react";
import { InlineMath } from "react-katex";

import App from "../../layout/App";
import Interpolation, { AbstractInput, MethodReturn } from "../../components/methods/Interpolation";

class Lagrange extends Component {
  method = (x, y) => {
    let xf = (k) => x.filter((x_, i) => i !== k);
    const numL = (k) => xf(k).map((x_) => `(x-${x_})`);
    const denL = (k) => xf(k).map((x_) => `(${x[k]}-${x_})`);

    let pol = "",
      latex = "";
    const table = [[], [], [], []];
    y.forEach((y, i) => {
      const num = numL(i).join("*");
      const den = denL(i).join("*");

      const polLk = `(${num}) / (${den})`;
      const latexLk = `\\frac{${num}}{${den}}`.replace(/\*+?/g, " \\cdot ");
      App.addResult(table, String(i), y, latexLk, polLk);

      if (i > 0) pol += "+";
      if (i > 0) latex += "+";

      pol += `(${y})*(${polLk})`;
      latex += `\\left(${y}\\right)${latexLk}`;
    });

    return new MethodReturn({
      pol: [pol],
      latex,
      table,
      labels: ["i", "y_i", "L_{i}(x)", "L_{i}(x)"],
    });
  };

  render = () => {
    const inputs = [
      new AbstractInput("Vector-X", "\\vec{x}", "The vector of point in x", true),
      new AbstractInput("Vector-Y", "\\vec{y}", "The vector of point in y", true),
    ];

    const helps = [
      <p>
        Values on <InlineMath math="\vec{x}" /> can't have duplicates
      </p>,
      <p>
        All fields on <InlineMath math="\vec{x}" /> and <InlineMath math="\vec{y}" /> must be filled
      </p>,
    ];

    return <Interpolation id="lagrange" method={this.method} inputs={inputs} helps={helps} />;
  };
}

export default Lagrange;
