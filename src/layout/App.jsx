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
    };
  }

  componentDidMount = () => {
    document.title = "Salmon";
  };

  updateMethod = (method) => {
    this.setState({ method });
  };

  render = () => {
    const { method } = this.state;
    const methods = {
      "Incremental Search": <IncrementalSearch />,
      Bisection: <Bisection />,
      "Regula-Falsi": <RegulaFalsi />,
      "Fixed Point": <FixedPoint />,
      "Newton-Raphson": <NewtonRaphson />,
      Secant: <Secant />,
      "Multiple Roots": <MultipleRoots />,
      Jacobi: <Jacobi />,
      "Gauss-Seidel": <GaussSeidel />,
      SOR: <SOR />,
    };

    return (
      <main>
        <Section id="graphing" title="Function Graphing">
          <ParentGraph id="home-graph" withInput={true} />
        </Section>
        <Section id="methods" title="Solver Methods">
          <div className="method-options">
            <Section className="subsection" title="Non-Linear Equations">
              <ButtonPicker
                options={Object.keys(methods).slice(0, 7)}
                method={method}
                updateMethod={this.updateMethod}
              />
            </Section>
            <Section className="subsection" title="Linear Equations">
              <ButtonPicker
                options={Object.keys(methods).slice(7, 10)}
                method={method}
                updateMethod={this.updateMethod}
              />
            </Section>
          </div>
          <div style={{ display: "flex", alignItems: "center", color: "#5f5f5f" }}>&#8811;</div>
          {methods[this.state.method] || <h3 className="method-wrapper">Select a method.</h3>}
        </Section>
      </main>
    );
  };
}

export default App;
