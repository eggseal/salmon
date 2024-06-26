import React, { Component } from "react";
import LinearEquation, {
  AbstractInput,
  MethodReturn,
  Types,
} from "../../components/methods/LinearEquation";
import { diag, add, transpose, multiply, norm, subtract, inv } from "mathjs";
import App from "../../layout/App";
import { InlineMath } from "react-katex";

class SOR extends Component {
  method = (a, b, x0, w, tol, n) => {
    a = LinearEquation.parseFloatMatrix(a);
    b = LinearEquation.parseFloatMatrix(transpose(b));
    x0 = LinearEquation.parseFloatMatrix(transpose(x0));
    w = parseFloat(w);
    tol = parseFloat(tol);
    n = parseInt(n);

    const size = a.length;
    const D = diag(diag(a));
    const L = multiply(-1, LinearEquation.tril(a, -1));
    const U = multiply(-1, LinearEquation.triu(a, +1));

    const T = multiply(inv(subtract(D, multiply(w, L))), add(multiply(1 - w, D), multiply(w, U)));
    const C = multiply(multiply(w, inv(subtract(D, multiply(w, L)))), b);

    let err = 100;
    let i = 0;
    const table = Array.from({ length: size + 2 }, () => []);
    for (i = 0; i < n && err > tol; i++) {
      const x1 = add(multiply(T, x0), C);

      err = norm(subtract(x1, x0), "inf");
      App.addResult(table, i, ...transpose(x0)[0], err);

      x0 = x1;
    }

    return new MethodReturn({
      table,
      labels: ["i", ...Array.from({ length: size }, (_, k) => `x_${k + 1}`), "E"],
      A: a,
      x: x0.map((value) => value[0]),
      b: transpose(b)[0],
    });
  };

  render = () => {
    const inputs = [
      new AbstractInput("Matrix A", "A", "The equation matrix", true, null, Types.Matrix),
      new AbstractInput("Vector b", "b", "The resulting vector", true, null, Types.Vector),
      new AbstractInput("Initial Vector", "x_0", "The starting vector", true, null, Types.Vector),
      new AbstractInput("Weight", "w", "Weight of relaxation", false, 1, Types.Regular),
      new AbstractInput("Tolerance", "Tol", "The maximum error", false, 0.5e-15, Types.Regular),
      new AbstractInput("Iterations", "N", "The number of iterations", false, 100, Types.Regular),
    ];

    const helps = [
      <p>
        <InlineMath math="A" /> must not have a <InlineMath math="0" /> in the diagonal
      </p>,
      <p>
        The determinant of <InlineMath math="A" /> must be different from <InlineMath math="0" />
      </p>,
      <p>
        <InlineMath math="N" /> and <InlineMath math="Tol" /> must be greater than{" "}
        <InlineMath math="0" />
      </p>,
      <p>
        <InlineMath math="w" /> must be between <InlineMath math="0" /> and <InlineMath math="2" />{" "}
        (exclusive)
      </p>,
      <p>
        <InlineMath math="w=1" /> is Gauss-Seidel, <InlineMath math="w<1" /> is for systems that
        didn't converge, and <InlineMath math="w>1" /> is for faster converging
      </p>,
    ];

    return <LinearEquation id="sor" inputs={inputs} method={this.method} helps={helps} />;
  };
}

export default SOR;
