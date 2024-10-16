import React from "react";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Predict from "./pages/Predict";
import PredictVideo from "./pages/PredictVideo";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/predict" element={<Predict />} />
          <Route path="/predict/video" element={<PredictVideo />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
