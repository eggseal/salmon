import React from "react";

import "./App.css";
import Section from "../components/Section";
import ButtonPicker from "../components/ButtonPicker";
import { ParentGraph } from "../components/Graph";
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

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      method: "",
      linear: "",
      interpolate: "",
    };
  }

  static getRem = () => {
    const div = document.createElement("div");
    div.style.fontSize = "1rem";
    document.body.appendChild(div);

    const size = window.getComputedStyle(div).fontSize;
    document.body.removeChild(div);

    return parseInt(size);
  }

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
      Vandermonde: <div>Vandermonde</div>,
      Newton: <div>Newton</div>,
    };

    return (
      <main>
        {/* <Section id="graphing" title="Function Graphing">
          <ParentGraph id="home-graph" withInput={true} />
        </Section> */}
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
