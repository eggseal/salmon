import React, { Component } from "react";
import LinearEquation, {
  AbstractInput,
  MethodReturn,
  Types,
} from "../../components/methods/LinearEquation";
import { diag, add, transpose, multiply, norm, subtract, inv } from "mathjs";
import App from "../../layout/App";

class GaussSeidel extends Component {
  method = (a, b, x0, tol, n) => {
    a = LinearEquation.parseFloatMatrix(a);
    b = LinearEquation.parseFloatMatrix(transpose(b));
    x0 = LinearEquation.parseFloatMatrix(transpose(x0));
    tol = parseFloat(tol);
    n = parseInt(n);

    const size = a.length;
    const D = diag(diag(a));
    const L = multiply(-1, LinearEquation.tril(a, -1));
    const U = multiply(-1, LinearEquation.triu(a, +1));

    const T = multiply(inv(subtract(D, L)), U);
    const C = multiply(inv(subtract(D, L)), b);

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
      new AbstractInput("Tolerance", "Tol", "The maximum error", false, 0.5e-15, Types.Regular),
      new AbstractInput("Iterations", "N", "The number of iterations", false, 100, Types.Regular),
    ];

    const helps = [<p>hola</p>, <p>hola</p>, <p>hola</p>];

    return <LinearEquation id="gauss-seidel" inputs={inputs} method={this.method} helps={helps} />;
  };
}

export default GaussSeidel;
