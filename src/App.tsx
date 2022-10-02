import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [searchUrl, setSearchUrl] = useState<string>("");
  const updateSearch = (e: any) => {
    setSearchUrl(e.target.value);
  };

  let user = "";
  let repo = "";

  const processSearchUrl = () => {
    const result = searchUrl.split("/");
    user = result[3];
    repo = result[4];
    fetch(`https://api.github.com/repos/${user}/${repo}/issues`)
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  return (
    <div className="container">
      <input type="text" className="text" onChange={(e) => updateSearch(e)} />
      <button onClick={processSearchUrl}>Load issues</button>
    </div>
  );
}

export default App;
