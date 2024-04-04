import React from "react";
import "./Header.css";

function Header() {
  return (
    <header>
      <div className="header-wrapper">
        <a className="brand-wrapper" href="/">
          <img className="header-logo" alt="Logo" />
          <h1 className="header-title">SALMON</h1>
        </a>
        <nav>
          <a className="nav-item" href="/#methods">
            Methods
          </a>
          <a className="nav-item" href="/about">
            About
          </a>
          <a className="nav-item" href="/help">
            Help
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
