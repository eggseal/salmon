import React, { Component } from "react";

import { transpose, zeros } from "mathjs";
import { InlineMath } from "react-katex";
import Interpolation, { MethodReturn, AbstractInput } from "../../components/methods/Interpolation";

class Newton extends Component {
  method = (x, y) => {
    x = x.map(parseFloat);
    y = y.map(parseFloat);
    const n = x.length;
    const table = zeros(n, n + 1).toArray();

    for (let i = 0; i < n; i++) {
      table[i][0] = x[i];
      table[i][1] = y[i];
    }

    let sol = [y[0]];

    for (let j = 2; j < n + 1; j++) {
      sol[j - 1] =
        (table[j - 1][j - 1] - table[j - 2][j - 1]) / (table[j - 1][0] - table[j - 1 - j + 1][0]);

      for (let i = j - 1; i < n; i++) {
        table[i][j] = (table[i][j - 1] - table[i - 1][j - 1]) / (table[i][0] - table[i - j + 1][0]);
      }
    }

    const p = [];
    sol.forEach((v, i) => {
      if (v === 0) return;
      p.push([]);
      p[i].push(`(${v})`);
      for (let j = 0; j < i; j++) {
        p[i].push(`(x - ${x[j]})`);
      }
    });
    const pol = p.map((p_) => p_.join("*")).join("+");
    const latex = p.map((p_) => p_.join(" \\cdot ")).join("+");

    for (let i = 0; i < n; i++) {
      for (let j = n; j >= 0; j--) {
        table[i][j + 1] = table[i][j];
      }
      table[i][0] = i;
    }

    return new MethodReturn({
      pol,
      latex,
      table: transpose(table),
      labels: ["i", "x_i", "f[x_i]", ...Array.from({ length: n - 1 }, (_, i) => `${i + 1}°`)],
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

    return <Interpolation id="newton" method={this.method} inputs={inputs} helps={helps} />;
  };
}

export default Newton;
