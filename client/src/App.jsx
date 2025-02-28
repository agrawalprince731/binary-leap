import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Batch from "./pages/Batch";
import BatchAnalyses from "./pages/BatchAnalyses";
import Candidate from "./pages/Candidate";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/batch/:id" element={<Batch/>} />
        <Route path="/batch/:id/overall-analyses" element={<BatchAnalyses />} />
        <Route path="/candidate/:id" element={<Candidate />} />
        <Route path="/*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
