import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import InterviewBatch from './pages/InterviewBatch';

function App() {
  return (
    <>
    {/* <Dashboard/> */}
    <HashRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/batch" element={<InterviewBatch />} />
        <Route path="/*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </HashRouter>
    </>
  );
}

export default App;
