import React, { useState, FC } from "react";
import logo from "./logo.svg";
import "./App.css";
import { observer } from "mobx-react";
import { DragList } from "./components/DragList";
import { IssueStore } from "./components/IssueStore";

const App: FC = () => {
  return (
    <div className="container">
      <DragList issueStore={IssueStore} />
    </div>
  );
};

export default App;
