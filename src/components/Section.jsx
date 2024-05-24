import React from "react";

import "./Section.css";

function Section(props) {
  const { children, title, id, className } = props;
  const titleElement = title ? <h2 className="section-header">{title}</h2> : "";
  return (
    <section id={id} className={className}>
      {titleElement}
      <div className="section-content">{children}</div>
    </section>
  );
}

export default Section;
