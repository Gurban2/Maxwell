import React from "react";
import Example from "./Example";

function App() {
  return (
    <div style={{ width: "100%", height: "400px" }}>
      <h2>График с выделением аномальных участков (модуль z-score больше 1)</h2>
      <Example />
    </div>
  );
}

export default App;
