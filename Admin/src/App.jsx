import { BrowserRouter, Routes, Route } from "react-router-dom";
import AllUsers from "./components/AllUsers";
import React from "react";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AllUsers />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
