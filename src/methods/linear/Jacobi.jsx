import React, { Component } from "react";
import LinearEquation, { AbstractInput, Types } from "../../components/methods/LinearEquation";
import { diag, lup } from "mathjs";

class Jacobi extends Component {
  method = (a, b, x0, tol, n) => {
    a = LinearEquation.parseFloatMatrix(a);
    b = LinearEquation.parseFloatMatrix(b)[0];
    x0 = LinearEquation.parseFloatMatrix(x0)[0];
    tol = parseFloat(tol);
    n = parseInt(n);

    const D = diag(diag(a));
    const { L, U } = lup(a);
  };

  render = () => {
    const inputs = [
      new AbstractInput("Matrix A", "A", "The equation matrix", true, null, Types.Matrix),
      new AbstractInput("Vector b", "b", "The resulting vector", true, null, Types.Vector),
      new AbstractInput("Initial-vector", "x_0", "The starting vector", true, null, Types.Vector),
      new AbstractInput("Tolerance", "Tol", "The maximum error", false, 0.5e-15, Types.Regular),
      new AbstractInput("Iterations", "N", "The number of iterations", false, 100, Types.Regular),
    ];

    return <LinearEquation id="jacobi" inputs={inputs} method={this.method}></LinearEquation>;
  };
}

export default Jacobi;
