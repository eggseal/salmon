import React from "react";

import "./Footer.css";

function Footer() {
  return (
    <footer>
      <div className="footer-wrapper">
        <div className="brand-wrapper" href="/">
          <img className="footer-logo" alt="Logo" />
          <h2 className="footer-title">SALMON</h2>
        </div>
        <div className="footer-links">
          <div className="footer-links-wrapper">
            <a className="section-link" href="/about">
              About
            </a>
            <a
              className="section-link"
              href="https://github.com/eggseal/salmon/issues"
              target="_blank"
              rel="noreferrer"
            >
              Report Issues
            </a>
            <a
              className="section-link"
              href="https://github.com/eggseal/salmon"
              target="_blank"
              rel="noreferrer"
            >
              Source Code
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
