import React, { Component } from "react";

import App from "../../layout/App";
import Interpolation, { AbstractInput, MethodReturn } from "../../components/methods/Interpolation";
import { matrix, lusolve, zeros, subset, index, range } from "mathjs";
import { InlineMath } from "react-katex";

class Spline extends Component {
  static linear = (x, y) => {
    let pol = [];
    let latex = "\\begin{cases}\n";
    let table = [[], []];

    for (let i = 0; i < x.length - 1; i++) {
      const a = parseFloat(y[i]);
      const b = parseFloat(y[i + 1] - y[i]) / (x[i + 1] - x[i]);

      pol.push(`${b}x + (${a - b * parseFloat(x[i])})`);
      latex += `${b}x + (${a - b * parseFloat(x[i])})\\\\\n`;
      App.addResult(table, i, `${a} + ${b}(x - ${x[i]})`);
    }
    latex += "\\end{cases}";

    console.log(pol);
    return new MethodReturn({
      pol,
      latex,
      table,
      labels: ["i", "y"],
    });
  };

  static quadratic = (x, y) => {
    x = x.map(parseFloat);
    y = y.map(parseFloat);
    let polynomials = [];
    let latex = "";
    let table = [[], [], [], []];

    const n = x.length - 1;

    // System of equations Ax = B
    // A is a 3n x 3n matrix (n segments, each with 3 unknowns)
    // B is a 3n x 1 matrix
    const A = zeros(3 * n, 3 * n);
    const B = zeros(3 * n, 1);

    let equation = 0;

    for (let i = 0; i < n; i++) {
      // Equation for the polynomial at x[i]
      subset(A, index(equation, [3 * i, 3 * i + 1, 3 * i + 2]), [1, x[i], x[i] ** 2]);
      subset(B, index(equation), y[i]);
      equation++;

      // Equation for the polynomial at x[i + 1]
      subset(A, index(equation, [3 * i, 3 * i + 1, 3 * i + 2]), [1, x[i + 1], x[i + 1] ** 2]);
      subset(B, index(equation), y[i + 1]);
      equation++;
    }

    for (let i = 1; i < n; i++) {
      // Continuity of the first derivative at x[i]
      subset(
        A,
        index(equation, [
          3 * (i - 1),
          3 * (i - 1) + 1,
          3 * (i - 1) + 2,
          3 * i,
          3 * i + 1,
          3 * i + 2,
        ]),
        [0, 1, 2 * x[i], 0, -1, -2 * x[i]]
      );
      subset(B, index(equation), 0);
      equation++;
    }

    // Solve for the coefficients
    const coefficients = lusolve(A, B);

    for (let i = 0; i < n; i++) {
      const a = coefficients.get([3 * i, 0]);
      const b = coefficients.get([3 * i + 1, 0]);
      const c = coefficients.get([3 * i + 2, 0]);

      polynomials.push(`${a} + ${b}(x - ${x[i]}) + ${c}(x - ${x[i]})^2`);

      latex += `${a} + ${b}(x - ${x[i]}) + ${c}(x - ${x[i]})^2`;

      App.addResult(table, i, `y = ${a} + ${b}(x - ${x[i]}) + ${c}(x - ${x[i]})^2`);
    }

    return new MethodReturn({
      pol: polynomials,
      latex,
      table,
      labels: ["Segment", "Polynomial"],
    });
  };

  static cubic = (x, y) => {};

  method = (x, y, type = ["3"]) => {
    type = parseInt(type[0]);
    console.log(type);
    switch (type) {
      case 1:
        return Spline.linear(x, y);
      case 2:
        return Spline.quadratic(x, y);
      case 3:
      default:
        return Spline.cubic(x, y);
    }
  };

  render = () => {
    const inputs = [
      new AbstractInput("Vector-X", "\\vec{x}", "The vector of points in x", true),
      new AbstractInput("Vector-Y", "\\vec{y}", "The vector of points in y", true),
      new AbstractInput("Type", "Type", "Type of spline interpolation", false),
    ];

    const helps = [
      <p>
        Values on <InlineMath math="\vec{x}" /> can't have duplicates
      </p>,
      <p>
        All fields on <InlineMath math="\vec{x}" /> and <InlineMath math="\vec{y}" /> must be filled
      </p>,
      <p>
        <InlineMath math="Type" /> must be a number: 1 = Linear, 2 = Quadratic, 3 = Cubic
      </p>,
    ];

    return <Interpolation id="spline" method={this.method} inputs={inputs} helps={helps} />;
  };
}

export default Spline;
