import React from "react";

import "./App.css";
import Section from "../components/Section";
import ButtonPicker from "../components/ButtonPicker";
import Graph, { ParentGraph } from "../components/Graph";

class App extends React.Component {
  componentDidMount = () => {
    document.title = "Salmon";
  };

  render = () => {
    return (
      <main>
        <Section id="graphing" title="Function Graphing">
          <ParentGraph id="home-graph" withInput={true} />
        </Section>
        <Section id="methods" title="Solver Methods">
          <Section className="subsection" title="Non-Linear Equations">
            <ButtonPicker
              options={[
                "Incremental Search",
                "Bisection",
                "Regula-Falsi",
                "Fixed Point",
                "Newton-Raphson",
                "Secant",
                "Multiple Roots",
              ]}
            />
          </Section>
          <Section className="subsection" title="Linear Equations">
            <ButtonPicker options={["Jacobi", "Gauss-Seidel", "SOR"]} />
          </Section>
        </Section>
      </main>
    );
  };
}

export default App;
