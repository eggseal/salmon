import React from "react";
import "./App.css";

export class App extends React.Component {
  componentDidMount = () => {
    document.title = "Salmon";
  };

  render = () => {
    return (
      <main>
        <section id="graphing">
          <h2 className="section-header">Function Graphing</h2>
        </section>
        <section id="methods">
          <h2 className="section-header">Solver Methods</h2>
        </section>
      </main>
    );
  };
}

export default App;
