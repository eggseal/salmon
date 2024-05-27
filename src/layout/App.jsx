import React from "react";

import "./App.css";
import Section from "../components/Section";
import ButtonPicker from "../components/ButtonPicker";
import IncrementalSearch from "../methods/non-linear/IncrementalSearch";
import Bisection from "../methods/non-linear/Bisection";
import RegulaFalsi from "../methods/non-linear/RegulaFalsi";
import FixedPoint from "../methods/non-linear/FixedPoint";
import NewtonRaphson from "../methods/non-linear/NewtonRaphson";
import Secant from "../methods/non-linear/Secant";
import MultipleRoots from "../methods/non-linear/MultipleRoots";
import Jacobi from "../methods/linear/Jacobi";
import GaussSeidel from "../methods/linear/GaussSeidel";
import SOR from "../methods/linear/SOR";
import Vandermonde from "../methods/interpolation/Vandermonde";
import Newton from "../methods/interpolation/Newton";
import Lagrange from "../methods/interpolation/Lagrange";
import Spline from "../methods/interpolation/Spline";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      method: "",
      linear: "",
      interpolate: "",
    };
  }

  /**
   * Get the current rem size in pixels
   * @returns {number}
   */
  static getRem = () => {
    const div = document.createElement("div");
    div.style.fontSize = "1rem";
    document.body.appendChild(div);

    const size = window.getComputedStyle(div).fontSize;
    document.body.removeChild(div);

    return parseInt(size);
  };

  /**
   * Add a row of values to the result table where each vector is a column
   * @param {number[][]} table
   * @param  {...number} values
   */
  static addResult = (table, ...values) => {
    for (let i = 0; i < values.length; i++) table[i].push(values[i]);
  };

  componentDidMount = () => {
    document.title = "Salmon";
  };

  updateMethod = (method) => {
    this.setState({ method });
  };

  updateLinear = (linear) => {
    this.setState({ linear });
  };
  updateInterp = (interpolate) => {
    this.setState({ interpolate });
  };

  render = () => {
    const { method, linear, interpolate } = this.state;
    const methods = {
      "Incremental Search": <IncrementalSearch />,
      Bisection: <Bisection />,
      "Regula-Falsi": <RegulaFalsi />,
      "Fixed Point": <FixedPoint />,
      "Newton-Raphson": <NewtonRaphson />,
      Secant: <Secant />,
      "Multiple Roots": <MultipleRoots />,
    };
    const linears = {
      Jacobi: <Jacobi />,
      "Gauss-Seidel": <GaussSeidel />,
      SOR: <SOR />,
    };
    const interpolates = {
      Vandermonde: <Vandermonde />,
      Newton: <Newton />,
      Lagrange: <Lagrange />,
      Spline: <Spline />,
    };

    return (
      <main>
        <Section id="methods" title="Chapter 1 - Root Finding Algorithms">
          <div className="method-options">
            <Section className="subsection" title="Methods">
              <ButtonPicker
                options={Object.keys(methods)}
                method={method}
                updateMethod={this.updateMethod}
              />
            </Section>
          </div>
          <div style={{ display: "flex", alignItems: "center", color: "#5f5f5f" }}>&#8811;</div>
          {methods[this.state.method] || <h3 className="method-wrapper">Select a method.</h3>}
        </Section>
        <Section id="linear" title="Chapter 2 - Linear Equations">
          <div className="method-options">
            <Section className="subsection" title="Methods">
              <ButtonPicker
                options={Object.keys(linears)}
                method={linear}
                updateMethod={this.updateLinear}
              />
            </Section>
          </div>
          <div style={{ display: "flex", alignItems: "center", color: "#5f5f5f" }}>&#8811;</div>
          {linears[linear] || <h3 className="method-wrapper">Select a method.</h3>}
        </Section>
        <Section id="interpolation" title="Chapter 3 - Interpolation Algorithms">
          <div className="method-options">
            <Section className="subsection" title="Methods">
              <ButtonPicker
                options={Object.keys(interpolates)}
                method={interpolate}
                updateMethod={this.updateInterp}
              />
            </Section>
          </div>
          <div style={{ display: "flex", alignItems: "center", color: "#5f5f5f" }}>&#8811;</div>
          {interpolates[interpolate] || <h3 className="method-wrapper">Select a method.</h3>}
        </Section>
      </main>
    );
  };
}

export default App;
