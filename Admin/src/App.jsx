import { BrowserRouter, Routes, Route } from "react-router-dom";
import AllUsers from "./components/AllUsers";
import React from "react";
import UserDetails from "./components/UserDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AllUsers />} />
        <Route path="/users/:id" element={<UserDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
