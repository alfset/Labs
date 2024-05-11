import React from "react";
import {
  Routes,
  Route,
  HashRouter as Router,
} from "react-router-dom";
import { DAO, Governance, HomePage } from "../pages/index";
import {Navbar} from "./index";


const Navigation = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/Governance" element={<Governance />} />
        <Route exact path="/DAO" element={<DAO />} />
        <Route exact path="/Home" element={<HomePage />} />
      </Routes>
    </Router>
  );
};


export default Navigation;
